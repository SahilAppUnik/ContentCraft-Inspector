import axios from "axios";

export async function POST(req: Request) {
  const { content } = await req.json();

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
            You are a powerful AI assistant that analyzes content and provides detailed insights and scores. 
            Your task is to evaluate the given content and returnF the following results in JSON format:
            {
              "contentScore": number, // Overall vibe of the content (0-100, with 100 being the best). Calculate this score based on these factors:
                - Readability (weight: 30%)
                - Structure and organization (weight: 30%)
                - Tone appropriateness (weight: 20%)
                - Use of engaging and concise language (weight: 20%)
              "wordCount": number, // Total word count of the content
              "readingTime": number, // Estimated reading time in minutes F(assume 150 words per minute)
              "readability": number, // Readability score (0-100, with 100 being the easiest to read)
              "tone": string, // The tone of the content (e.g., "formal", "casual", "persuasive", etc.)
              "keyInsights": string[], // Key insights from the content (up to 5 points)
              "improvements": string[] // Suggested improvements to make the content stronger (up to 5 points)
            }
            Provide clear and concise results based on your analysis.
          `,
        },
        {
          role: "user",
          content: `Analyze the following content and provide scores and insights: ${content}`,
        },
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
