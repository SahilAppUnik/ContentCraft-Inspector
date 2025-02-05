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
            content: `You are a content analyzer and humanizer expert. Evaluate the provided content and return a detailed report in JSON format with the following keys:
        
            * aiScore: a score from 0 to 100 indicating the likelihood of AI-generated content
            * humanScore: a score from 0 to 100 indicating the likelihood of human-written content
            * analysis: a detailed breakdown of the content's AI and human characteristics, including language patterns, tone, and style
            * humanizedVersion: a rewritten version of the content that:
        
              - Maintains a similar word count (±10% tolerance) to the original content
              - Preserves the core message, key points, and tone
              - Incorporates natural, conversational language and human elements, such as:
                + Personal insights and anecdotes
                + Casual transitions and connections between ideas
                + Varied sentence structures and lengths
              - Enhances readability and engagement
        
            Please ensure the humanized version is approximately ${wordCount} words long.`
          },
          {
            role: "user",
            content: `Please analyze the following content and provide a detailed report, including a humanized version: ${content}`
          },
        ]
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