package handler

import (
	"os"

	"github.com/appwrite/sdk-for-go/appwrite"
	"github.com/appwrite/sdk-for-go/id"
	"github.com/appwrite/sdk-for-go/models"
	"github.com/appwrite/sdk-for-go/query"
	"github.com/open-runtimes/types-for-go/v4/openruntimes"
)

type CustomBody struct {
	BlogID string `json:"blogId"`
	Value  int    `json:"value"`
}

type AppwriteBlogVoteList struct {
	*models.DocumentList
	Documents []AppwriteBlogVote `json:"documents"`
}

type AppwriteBlogVote struct {
	*models.Document
	BlogID string `json:"blogId"`
	Score  int    `json:"score"`
}

func Main(Context openruntimes.Context) openruntimes.Response {
	var body CustomBody
	err := Context.Req.BodyJson(&body)
	if err != nil {
		return Context.Res.Text("Invalid body.", Context.Res.WithStatusCode(400))
	}

	// Validate the vote value (can only be 1 or -1)
	if body.Value != 1 && body.Value != -1 {
		return Context.Res.Text("Invalid value.", Context.Res.WithStatusCode(400))
	}

	// Validate blog ID exists
	if body.BlogID == "" {
		return Context.Res.Text("Blog ID is required.", Context.Res.WithStatusCode(400))
	}

	client := appwrite.NewClient(
		appwrite.WithEndpoint(os.Getenv("APPWRITE_FUNCTION_API_ENDPOINT")),
		appwrite.WithProject(os.Getenv("APPWRITE_FUNCTION_PROJECT_ID")),
		appwrite.WithKey(Context.Req.Headers["x-appwrite-key"]),
	)

	databases := appwrite.NewDatabases(client)

	// Query for existing vote record for this blog
	responseVotes, err := databases.ListDocuments("main", "blog_votes", databases.WithListDocumentsQueries([]string{
		query.Limit(1),
		query.Equal("blogId", body.BlogID),
	}))
	if err != nil {
		Context.Error(err)
		return Context.Res.Text("Internal error.", Context.Res.WithStatusCode(500))
	}

	var listVotes AppwriteBlogVoteList
	err = responseVotes.Decode(&listVotes)
	if err != nil {
		Context.Error(err)
		return Context.Res.Text("Internal error.", Context.Res.WithStatusCode(500))
	}

	// If no votes exist for this blog yet, create a new vote record
	if listVotes.Total == 0 {
		_, err = databases.CreateDocument("main", "blog_votes", id.Unique(), map[string]interface{}{
			"blogId": body.BlogID,
			"score":  body.Value,
		})
		if err != nil {
			Context.Error(err)
			return Context.Res.Text("Internal error.", Context.Res.WithStatusCode(500))
		}
	} else {
		// If votes already exist, update the existing vote record
		voteId := listVotes.Documents[0].Id
		scoreValue := listVotes.Documents[0].Score
		_, err = databases.UpdateDocument("main", "blog_votes", voteId, databases.WithUpdateDocumentData(map[string]interface{}{
			"score": scoreValue + body.Value,
		}))
		if err != nil {
			Context.Error(err)
			return Context.Res.Text("Internal error.", Context.Res.WithStatusCode(500))
		}
	}

	return Context.Res.Empty()
}