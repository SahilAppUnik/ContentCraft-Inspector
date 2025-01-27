import axios from "axios";
import { NextResponse } from "next/server"

const TAVILY_API_KEY = process.env.TAVILY_API_KEY

async function getTavilyResults(query: string) {
  const url = "https://api.tavily.com/search"

  try {
    const response = await axios.post(url, {
      query: query,
      api_key: TAVILY_API_KEY,
      search_depth: "advanced",
      include_answer: true,
      max_results: 2,
      follow_up_questions: true
    });    

    return {
      answer: response.data.answer,
      results: response.data.results,
    }
  } catch (error) {
    console.error("Error fetching results:", error);
    return null;
  }
}


export async function POST(req: Request) {
  const { topic} = await req.json();
  try {
    const tavilyResults = await getTavilyResults(topic)

    if (!tavilyResults) {
      throw new Error("Failed to fetch Tavily results")
    }

    return NextResponse.json(tavilyResults)
  } catch (error) {
    console.error("Error in InfoGain:", error)
    return NextResponse.json({ error: "Error processing request" }, { status: 500 })
  }
}