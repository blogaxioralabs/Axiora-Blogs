// app/api/cite/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Helper function to parse the Gemini response
function parseCitations(responseText: string): { apa: string; mla: string; harvard1: string; } {
    const citations: { [key: string]: string } = {
        apa: "Could not generate APA citation.",
        mla: "Could not generate MLA citation.",
        harvard1: "Could not generate Harvard citation."
    };

    try {
        // Find the JSON block within the response text
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
            const parsedJson = JSON.parse(jsonMatch[1]);
            if (parsedJson.apa) citations.apa = parsedJson.apa;
            if (parsedJson.mla) citations.mla = parsedJson.mla;
            if (parsedJson.harvard) citations.harvard1 = parsedJson.harvard;
        } else {
             // Fallback if JSON block is not found
            const apaMatch = responseText.match(/APA:\s*(.*)/i);
            const mlaMatch = responseText.match(/MLA:\s*(.*)/i);
            const harvardMatch = responseText.match(/Harvard:\s*(.*)/i);

            if (apaMatch) citations.apa = apaMatch[1].trim();
            if (mlaMatch) citations.mla = mlaMatch[1].trim();
            if (harvardMatch) citations.harvard1 = harvardMatch[1].trim();
        }
    } catch (e) {
        console.error("Failed to parse Gemini citation response:", e);
    }
    
    return citations as { apa: string; mla: string; harvard1: string; };
}


export async function POST(request: Request) {
  try {
    const post = await request.json();

    if (!post || !post.title || !post.created_at || !post.slug) {
      return NextResponse.json({ error: 'Missing post data' }, { status: 400 });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const publicationDate = new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const siteUrl = 'https://axiorablogs.com';
    const postUrl = `${siteUrl}/blog/${post.slug}`;
    const author = post.author_name || 'Axiora Labs';
    const retrievedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const prompt = `
      Please generate academic citations for the following webpage article in APA 7, MLA 9, and Harvard styles.
      Provide the output ONLY in a single JSON code block.

      Article Details:
      - Title: "${post.title}"
      - Author: ${author}
      - Publication Date: ${publicationDate}
      - Website Name: Axiora Blogs
      - URL: ${postUrl}
      - Retrieved Date: ${retrievedDate}

      Format the response as a JSON object with the keys "apa", "mla", and "harvard".
      Example format:
      \`\`\`json
      {
        "apa": "Generated APA citation here.",
        "mla": "Generated MLA citation here.",
        "harvard": "Generated Harvard citation here."
      }
      \`\`\`
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const citations = parseCitations(responseText);

    return NextResponse.json(citations);

  } catch (error) {
    console.error('API Error generating citation via Gemini:', error);
    return NextResponse.json({ 
        apa: "Could not generate citation.",
        mla: "Could not generate citation.",
        harvard1: "Could not generate citation.",
     }, { status: 500 });
  }
}