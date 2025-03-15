import { ID, Query } from "appwrite";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { database } from "./appwrite";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string) => {
  const dateObject = new Date(date);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - dateObject.getTime();

  const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);

  if (months > 12)
    return years === 1 ? `${years} year ago` : `${years} years ago`;
  if (months > 0)
    return months === 1 ? `${months} month ago` : `${months} months ago`;
  if (days > 0) return days === 1 ? `${days} day ago` : `${days} days ago`;
  if (hours > 0)
    return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
  if (minutes > 0)
    return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;

  return "few seconds ago";
};

export const getBlogVotes = async (): Promise<
  { slug: string; count: number }[]
> => {
  const blogCollection = await database.listDocuments(
    "main", // databaseId
    "blogs", // collectionId
    [Query.limit(100)],
  );

  const blogVotes = blogCollection.documents.map((document) => ({
    slug: document.slug,
    count: document.anonymousIds.length,
  }));

  return blogVotes;
};

export const getBlogVotesBySlug = async (slug: string): Promise<number> => {
  const blogCollection = await database.listDocuments(
    "main", // databaseId
    "blogs", // collectionId
  );

  const blogVotes = blogCollection.documents.find(
    (document) => document.slug === slug,
  );

  return blogVotes?.anonymousIds.length || 0;
};

export const upvoteBlog = async (slug: string): Promise<boolean> => {
  let anonymouseId = localStorage.getItem("anonymousId");
  if (!anonymouseId) {
    anonymouseId = ID.unique();
    localStorage.setItem("anonymousId", anonymouseId);
  }

  const blogCollection = await database.listDocuments(
    "main", // databaseId
    "blogs", // collectionId
    [Query.equal("slug", slug)],
  );

  if (blogCollection.total > 0) {
    if (blogCollection.documents[0].anonymousIds.includes(anonymouseId)) {
      return false;
    }

    await database.updateDocument(
      "main", // databaseId
      "blogs", // collectionId
      blogCollection.documents[0].$id,
      {
        anonymousIds: [
          ...blogCollection.documents[0].anonymousIds,
          anonymouseId,
        ],
      },
    );
  } else {
    await database.createDocument(
      "main", // databaseId
      "blogs", // collectionId
      ID.unique(), // documentId
      {
        slug: slug,
        anonymousIds: [anonymouseId],
      },
    );
  }

  return true;
};
