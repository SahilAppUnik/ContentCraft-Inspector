'use server';

const storeContent = async (content: string, analysis: string, mode: string, userId: string) => {
    try {
      const response = await fetch(`${process.env.APPWRITE_ENDPOINT}/databases/${process.env.APPWRITE_DATABASE_ID}/collections/${process.env.APPWRITE_CONTENT_COLLECTION_ID}/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": process.env.APPWRITE_PROJECT_ID ?? "",
          "X-Appwrite-Key": process.env.APPWRITE_API_KEY ?? "", // Replace with your Appwrite API Key
        },
        body: JSON.stringify({
          data: {
            userId,
            content,
            analysis,
            mode
          }
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save content");
      }
  
      const result = await response.json();
      console.log("Content stored successfully:", result);
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };
  