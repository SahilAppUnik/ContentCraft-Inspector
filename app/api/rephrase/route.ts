import axios from "axios";

export async function POST(req: Request) {
  const { content } = await req.json();
  console.log('input', content);
  

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a professional rephrasing assistant. Rephrase the user's whole input with a more structured format, using unique, descriptive, and powerful words. Aim for maximum clarity and attractiveness while ensuring it scores high in readability and effectiveness tests.",
        },
        {
          role: "user",
          content: `Rephrase the following: ${content}`,
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

  const rephrased = response.data.choices[0].message.content;

  return new Response(JSON.stringify(rephrased), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
