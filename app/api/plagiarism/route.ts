import axios from 'axios';

export async function POST(req: Request) {
  const { content } = await req.json();

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `
            You are a powerful AI assistant specialized in detecting and fixing plagiarism.
            Analyze the given content and provide the following in JSON format:
            {
              "plagiarismScore": number, // 0-100, where 100 means plagiarized
              "uniquenessScore": number, // 0-100, where 100 means unique
              "analysis": string, // Detailed analysis of potential plagiarism issues
              "suggestions": string[], // List of suggestions to make the content more original
              "improvedVersion": string // A rewritten version that maintains the meaning but is more original
            }
          `,
        },
        {
          role: 'user',
          content: `Analyze this content for plagiarism and suggest improvements: ${content}`,
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
  const analysis = JSON.parse(data);

  return new Response(JSON.stringify(analysis), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}