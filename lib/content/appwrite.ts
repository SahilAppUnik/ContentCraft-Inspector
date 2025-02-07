"use server";

import { ID } from "appwrite";

export async function saveContent  (
  content: string,
  userId: string,
  analysis?: string,
  mode?: string,
  contentScore?: number,
  readability?: number,
  tone?: string,
  keyInsights?: string[],
  improvements?: string[],
  wordCount?: number,
  readingTime?: number,
  aiScore?: number,
  humanScore?: number,
  humanizedVersion?: string,
  outline?: { level: number; text: string }[], 
  suggestions?: string[],
  contentGaps?: string[],
  summary?: string,
  relatedLinks?: { title: string; url: string; description: string }[],
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
          content,
          analysis,
          mode,
          contentScore: contentScore ?? null, // Ensure null instead of undefined
          readability: readability ?? null,
          tone: tone ?? null,
          keyInsights: keyInsights ?? [],
          improvements: improvements ?? [],
          wordCount: wordCount ?? null,
          readingTime: readingTime ?? null,
          aiScore: aiScore ?? null,
          humanScore: humanScore ?? null,
          humanizedVersion: humanizedVersion ?? null,
          outline: outline ? JSON.stringify(outline) : null,
          suggestions: suggestions ?? [],
          contentGaps: contentGaps ?? [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          },
        }),
      }
    );

    if (!response.ok) {    
      console.log(await response.json());
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

export async function updateContent (
  documentId: string,
  {
    input,
    analysis,
    contentScore,
    readability,
    tone,
    keyInsights,
    improvements,
    wordCount,
    readingTime,
    aiScore,
    humanScore,
    humanizedVersion,
    outline,
    suggestions,
    contentGaps,
    summary,
    relatedLinks
  }: {
    input?: string;
    analysis?: string;
    contentScore?: number;
    readability?: string;
    tone?: string;
    keyInsights?: string[];
    improvements?: string[];
    wordCount?: number;
    readingTime?: number;
    aiScore?: number;
    humanScore?: number;
    humanizedVersion?: string;
    outline?: { level: number; text: string }[];
    suggestions?: string[];
    contentGaps?: string[];
    summary?: string,
    relatedLinks?: { url: string; title: string; content: string; score: number; raw_content: string | null }[]
  }
) {
  try {
    const response = await fetch(
      `${process.env.APPWRITE_ENDPOINT}/databases/${process.env.APPWRITE_DATABASE_ID}/collections/${process.env.APPWRITE_CONTENT_COLLECTION_ID}/documents/${documentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": process.env.APPWRITE_PROJECT_ID ?? "",
          "X-Appwrite-Key": process.env.API_SECRET_KEY ?? "", // Replace with your Appwrite API Key
        },
        body: JSON.stringify({
          data: {
            ...(input && { content: input }),
            ...(analysis && { analysis }),
            ...(contentScore !== undefined && { contentScore: Math.round(contentScore) }),
            ...(readability && { readability }),
            ...(tone && { tone }),
            ...(keyInsights && { keyInsights }),
            ...(improvements && { improvements }),
            ...(wordCount !== undefined && { wordCount }),
            ...(readingTime !== undefined && { readingTime }),
            ...(aiScore !== undefined && { aiScore }),
            ...(humanScore !== undefined && { humanScore }),
            ...(humanizedVersion && { humanizedVersion }),
            ...(outline && {
              outline: outline.map((item) => `Level ${item.level}: ${item.text}`),
            }),
            ...(suggestions && { suggestions }),
            ...(contentGaps && { contentGaps }),
            ...(summary && { summary }),
            relatedLinks: relatedLinks ? relatedLinks.map(link => JSON.stringify(link)) : [], // Convert objects to strings
            updatedAt: new Date().toISOString(),
          },
        }),
      }
    );

    if (!response.ok) {
      console.log(await response.json());
      throw new Error("Failed to save content");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving content:", error);
  }
}