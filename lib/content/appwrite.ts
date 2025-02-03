'use server';

import { ID } from "appwrite";

const APPWRITE_PROJECT_ID = '679a3be3000b571ae49b'; // Replace with your Appwrite Project ID
const APPWRITE_ENDPOINT = 'https://appwrite.appunik-team.com/v1';// Update if self-hosted
const APPWRITE_DATABASE_ID = '679d05d40027f6fec541';
const APPWRITE_COLLECTION_ID = '679d05dd0028c7b34c31';
const API_SECRET_KEY = 'standard_dd6984979c50faf8f62ad09a407f8662350b6c047eb69ad12f9ddf51b994aeedd431e23dd7b0e66eeb8e3a30036b297a0bd989c9421726dcecb99ffebfdee918e89a450c92c09d31266d2aa8ca6abf61b9eb331401fef7b129c539e5c0e760a3ca7b1c7c976eaf903516651b15d53f3b27bfefd91452b20d3693f454af4c7e04'

const storeContent = async (content: string, analysis: string, mode: string, userId: string) => {
    try {
      const response = await fetch(`${APPWRITE_ENDPOINT}/databases/${APPWRITE_DATABASE_ID}/collections/${APPWRITE_COLLECTION_ID}/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": APPWRITE_PROJECT_ID,
          "X-Appwrite-Key": API_SECRET_KEY, // Replace with your Appwrite API Key
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
  