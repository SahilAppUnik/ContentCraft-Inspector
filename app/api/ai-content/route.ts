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
    const { title, keywords, tone } = await req.json();

    // **Step 1: Ask GPT to determine an expert for the given topic**
    // const expertResponse = await callGPT([
    //   {
    //     role: "system",
    //     content:
    //       "You are an expert finder. Your task is to identify a credible expert, researcher, or authority on a specific topic. Provide the expert's name and a brief description of their expertise in the format: name: 'Name', description: 'Description'.",
    //   },
    //   {
    //     role: "user",
    //     content: `Who is a leading expert in the field of "${title}"? Please provide their name and a brief description of their research focus and accomplishments.`,
    //   },
    // ]);

    // **Step 2: Use the identified expert in the next GPT call to generate content**
    let keywordPrompt = "";
    if (keywords && keywords.trim().length > 0) {
      keywordPrompt = `Ensure that the article focuses on the following key terms and concepts: ${keywords}. Use these keywords naturally throughout the text.`;
    }

    let tonePrompt = "";
    if (tone && tone.trim().length > 0) {
      tonePrompt = `Write the content in a ${tone} tone to match the expected audience style.`;
    }

    const contentResponse = await callGPT([
      {
        role: "system",
        content: `You are a knowledgeable assistant. Your task is to generate a well-structured article on the topic "${title}". The article should include headings, subheadings, bullet points, and structured sections. ${keywordPrompt} ${tonePrompt}`,
      },
      {
        role: "user",
        content: `Generate a detailed, informative article in more than 1000 words. The article should have a clear introduction, main sections, and a conclusion. Use bullet points and short paragraphs to make the content easy to read.`,
      },
    ]);

    return NextResponse.json({ content: contentResponse });
  } catch (error) {
    console.error("Error in AI content generation:", error);
    return NextResponse.json(
      { error: "Error generating content" },
      { status: 500 }
    );
  }
}
