import axios from "axios";
import { NextResponse } from "next/server";

// Function to call OpenAI API
const callGPT = async (messages: any) => {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  return response.data.choices[0].message.content;
};

// Main API Route
export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    // **Step 1: Ask GPT to determine an expert for the given topic**
    const expertResponse = await callGPT([
      {
        role: "system",
        content:
          "You are an AI assistant with knowledge of industry leaders, researchers, and experts across different fields.",
      },
      {
        role: "user",
        content: `Based on the topic "${title}", who is the most credible expert, researcher, or authority on this subject? Provide only the person's name and a brief description of their expertise. Give me only the name and description. format should be: name: "Name", description: "Description"`,
      },
    ]);

    console.log("Identified Expert:", expertResponse);

    // **Step 2: Use the identified expert in the next GPT call to generate content**
    const contentResponse = await callGPT([
      {
        role: "system",
        content: `You are generating content with insights from ${expertResponse}. Use their expertise to craft a detailed, structured, and insightful response.`,
      },
      {
        role: "user",
        content: `Generate detailed, well-structured content for the following title: "${title}". Include appropriate headings, paragraphs, and relevant information.`,
      },
    ]);

    return NextResponse.json({ content: contentResponse, expert: expertResponse });
  } catch (error) {
    console.error("Error in AI content generation:", error);
    return NextResponse.json(
      { error: "Error generating content" },
      { status: 500 }
    );
  }
}
