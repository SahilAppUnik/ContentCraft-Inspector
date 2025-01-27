import axios from "axios";

export async function POST(req: Request) {
  const { content } = await req.json();

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that analyzes content and provides an outline with suggestions for improvement. Provide your analysis in JSON format with the following structure: {"outline": [{"level": number, "text": string}], "suggestions": string[], "contentGaps": string[]}'
        },
        {
          role: 'user',
          content: `Analyze the following content and provide an outline with suggestions for improvement: ${content}`
        }
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  const data = response.data.choices[0].message.content;
    const analysis = JSON.parse(data); // Parse the JSON string into a JS object

    return new Response(JSON.stringify(analysis), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
}
