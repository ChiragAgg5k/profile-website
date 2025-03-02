# upvote-blog

An Appwrite function for handling upvotes and downvotes on blog posts.

## 🧰 Usage

This function is triggered whenever a vote is made on a blog post. It creates or updates vote records in the database.

### POST /

Handles blog post voting.

**Request Body**

```json
{
  "blogId": "unique-blog-id",
  "value": 1
}
```

| Parameter | Type    | Description                                |
| --------- | ------- | ------------------------------------------ |
| `blogId`  | String  | Unique identifier for the blog post        |
| `value`   | Integer | Vote value (1 for upvote, -1 for downvote) |

**Response**

- `200` - Success (empty response)
- `400` - Invalid request body or parameters
- `500` - Internal server error

### GET /ping

- Returns a "Pong" message.

**Response**

Sample `200` Response:

```text
Pong
```

### GET, POST, PUT, PATCH, DELETE /

- Returns a "Learn More" JSON response when no specific action is requested.

**Response**

Sample `200` Response:

```json
{
  "motto": "Build like a team of hundreds_",
  "learn": "https://appwrite.io/docs",
  "connect": "https://appwrite.io/discord",
  "getInspired": "https://builtwith.appwrite.io"
}
```

## ⚙️ Configuration

| Setting           | Value     |
| ----------------- | --------- |
| Runtime           | Go (1.23) |
| Entrypoint        | `main.go` |
| Permissions       | `any`     |
| Timeout (Seconds) | 15        |

## 🔒 Environment Variables

| Variable                       | Description           |
| ------------------------------ | --------------------- |
| APPWRITE_FUNCTION_API_ENDPOINT | Appwrite API endpoint |
| APPWRITE_FUNCTION_PROJECT_ID   | Appwrite project ID   |

## 📚 Database Schema

This function requires a database named `main` with a collection named `blog_votes` containing the following attributes:

| Attribute | Type    | Description                                       |
| --------- | ------- | ------------------------------------------------- |
| `blogId`  | String  | Unique identifier of the blog post                |
| `score`   | Integer | Current vote score (sum of upvotes and downvotes) |

## 🔄 Example Workflow

1. User clicks upvote/downvote button on a blog post
2. Frontend sends request to this function with `blogId` and `value`
3. Function checks if a vote record exists for the blog post
4. If no record exists, a new one is created with the initial vote value
5. If a record exists, the score is updated by adding the vote value to the current score
