"use server";

import { ID } from "appwrite";

export async function saveContent  (
  title: string,
  content: string,
  mode: string,
  userId: string
) {
  try {    
    const response = await fetch(
      `${process.env.APPWRITE_ENDPOINT}/databases/${process.env.APPWRITE_DATABASE_ID}/collections/${process.env.APPWRITE_CONTENT_COLLECTION_ID}/documents`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": process.env.APPWRITE_PROJECT_ID ?? "",
          "X-Appwrite-Key": process.env.API_SECRET_KEY ?? "", // Replace with your Appwrite API Key
        },
        body: JSON.stringify({
          documentId: ID.unique(),
          data: {
            userId,
            content: title,
            analysis: content,
            mode,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save content");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving content:", error);
  }
};

export async function fetchHistory(userId: string, page: number, limit: number) {
  try {
    const offset = (page - 1) * limit;
    
    const queryParams = {
      queries: JSON.stringify([`equal("userId", "${userId}")`]),
      orderAttributes: JSON.stringify(["createdAt"]),
      orderTypes: JSON.stringify(["DESC"]),
      limit: limit.toString(),
      offset: offset.toString()
    }

    const response = await fetch(
      `${process.env.APPWRITE_ENDPOINT}/databases/${process.env.APPWRITE_DATABASE_ID}/collections/${process.env.APPWRITE_CONTENT_COLLECTION_ID}/documents?${queryParams}`,
      {
        method: "GET",
        headers: {
          "X-Appwrite-Project": process.env.APPWRITE_PROJECT_ID ?? "",
          "X-Appwrite-Key": process.env.API_SECRET_KEY ?? "",
        }
      }
    );
    
    if (!response.ok) throw new Error("Failed to fetch history");
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching history:", error);
    throw error;
  }
}


export async function deleteHistoryItem(documentId: string) {
  try {
    const response = await fetch(
      `${process.env.APPWRITE_ENDPOINT}/databases/${process.env.APPWRITE_DATABASE_ID}/collections/${process.env.APPWRITE_CONTENT_COLLECTION_ID}/documents/${documentId}`,
      {
        method: "DELETE",
        headers: {
          "X-Appwrite-Project": process.env.APPWRITE_PROJECT_ID ?? "",
          "X-Appwrite-Key": process.env.API_SECRET_KEY ?? "",
        }
      }
    );

    if (!response.ok) throw new Error("Failed to delete item");
    return true;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
}