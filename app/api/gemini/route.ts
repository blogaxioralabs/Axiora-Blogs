// app/api/gemini/route.ts

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

function GoogleGenerativeAIStream(stream: AsyncGenerator<any>) {
  return new ReadableStream({
    async start(controller) {
      const textEncoder = new TextEncoder();
      for await (const chunk of stream) {
        const text = chunk.text();
        if (text) {
          controller.enqueue(textEncoder.encode(text));
        }
      }
      controller.close();
    },
  });
}

export async function POST(req: Request) {
  try {
    const { history, message, context } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.length < 30) { 
      return NextResponse.json({ error: "API key is missing or invalid. Please check your .env.local file." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
      systemInstruction: `You are 'Axiora AI', a specialized AI assistant for the Axiora Blogs platform, which focuses on Science, Technology, Engineering, and Mathematics (STEM).
      Your primary function is to help users deeply understand the blog post they are currently reading.
      You will be provided with the full content of the blog post as context.
      - Your tone should be knowledgeable, encouraging, and slightly enthusiastic about STEM topics.
      - When a user asks a question, answer it based *only* on the provided blog post context.
      - If the user's question cannot be answered from the context, politely state that the information is outside the scope of the article and gently guide them back.
      - Use markdown (like lists, bolding, italics) to structure your answers for better readability.
      - You are 'Axiora AI'. Never mention that you are a language model.
      Here is the article content for your reference:\n\n---\n\n${context}\n\n---`,
    });

    const chat = model.startChat({
      history: history || [],
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ],
    });

    const result = await chat.sendMessageStream(message);
    const stream = GoogleGenerativeAIStream(result.stream);

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error: any) {
    console.error("[GEMINI_API_ERROR]", error);
    // දෝෂය කුමක්දැයි client එකට යවනවා
    return NextResponse.json({ error: `An internal server error occurred: ${error.message}` }, { status: 500 });
  }
}