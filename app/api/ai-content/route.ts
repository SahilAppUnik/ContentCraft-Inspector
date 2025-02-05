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
          "You are an expert finder. Your task is to identify a credible expert, researcher, or authority on a specific topic. Provide the expert's name and a brief description of their expertise in the format: name: 'Name', description: 'Description'.",
      },
      {
        role: "user",
        content: `Who is a leading expert in the field of "${title}"? Please provide their name and a brief description of their research focus and accomplishments.`,
      },
    ]);

    // **Step 2: Use the identified expert in the next GPT call to generate content**
    const contentResponse = await callGPT([
      {
        role: "system",
        content: `You are a knowledgeable assistant. Your task is to generate a comprehensive, well-structured article on the topic "${title}".Include relevant headings, subheadings, paragraphs, and bullet points to make the content engaging and easy to understand.`,
      },
      {
        role: "user",
        content: `Generate a detailed, informative article with insights from "${expertResponse}". The article should have a clear structure, including an introduction, main sections, and a conclusion. Use bullet points and short paragraphs to make the content scannable and easy to read.`,
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
