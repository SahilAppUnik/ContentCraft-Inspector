import axios from "axios";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    const wordCount = content.trim().split(/\s+/).length;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an expert AI content detector and humanizer. Analyze the given content and provide:
              1. A score indicating how likely the content was AI-generated (0-100)
              2. A detailed analysis of AI vs human characteristics
              4. A humanized version of the content that:
                 - Maintains approximately ${wordCount} words
                 - Preserves the core message and key points
                 - Uses more natural, conversational language
                 - Includes human elements like personal insights, casual transitions, and varied sentence structures
                 - Matches the original content's tone and purpose
              
              Return the response in JSON format with these keys:
              {
                "aiScore": number,
                "humanScore": number,
                "analysis": string,
                "humanizedVersion": string
              }
              
              IMPORTANT: The humanized version MUST be approximately ${wordCount} words long (±10% tolerance).`
          },
          {
            role: "user",
            content: `Analyze this content for AI characteristics and provide a humanized version: ${content}`
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const data = response.data.choices[0].message.content;
    const analysis = JSON.parse(data); // Parse the JSON string into a JS object

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in AI score analysis:', error);
    return NextResponse.json(
      { error: 'Error analyzing content' },
      { status: 500 }
    );
  }
}