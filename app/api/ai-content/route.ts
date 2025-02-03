import axios from "axios";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
            {
              role: "system",
              content: "You are a helpful content generator that creates detailed, well-structured content based on given titles or topics."
            },
            {
              role: "user",
              content: `Generate detailed, well-structured content for the following title: "${title}". Include appropriate headings, paragraphs, and relevant information.`
            }
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
    
    // const analysis = JSON.parse(data);// Parse the JSON string into a JS object

    // console.log('analysis', analysis);

    return NextResponse.json({content: data});
  } catch (error) {
    console.error('Error in AI score analysis:', error);
    return NextResponse.json(
      { error: 'Error analyzing content' },
      { status: 500 }
    );
  }
}