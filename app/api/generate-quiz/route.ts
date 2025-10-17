import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Ensure the API key is available in your environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // A more robust prompt to ensure JSON output
    const prompt = `
      Based on the following article content, generate a multiple-choice quiz.
      The quiz should consist of exactly 5 questions.
      Each question must have 4 options.
      You MUST return the output as a valid JSON array of objects. Do not include any text or markdown formatting before or after the JSON.
      The JSON structure for each object in the array should be:
      {
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "The correct option text from the options array"
      }

      Here is the article content:
      ---
      ${content}
      ---
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean the response to ensure it's valid JSON
    // Gemini might sometimes wrap the JSON in ```json ... ```
    if (text.startsWith("```json")) {
        text = text.slice(7, -3).trim();
    }

    // Parse the cleaned text to JSON
    const quizData = JSON.parse(text);

    return NextResponse.json(quizData);
    
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz. Please try again later." },
      { status: 500 }
    );
  }
}