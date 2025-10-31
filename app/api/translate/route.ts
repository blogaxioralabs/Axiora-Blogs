// app/api/translate/route.ts
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextResponse, NextRequest } from 'next/server';

export const maxDuration = 60; // Optional: Use edge runtime

const genAI = new GoogleGenerativeAI(process.env.GEMINI_TRANSLATION_API_KEY!);

function getLanguageName(code: string): string {
    const languages: { [key: string]: string } = {
        en: 'English', si: 'Sinhala', ta: 'Tamil', hi: 'Hindi',
        es: 'Spanish', fr: 'French', de: 'German', zh: 'Chinese',
        ja: 'Japanese', ar: 'Arabic',
    };
    return languages[code] || code;
}

export async function POST(req: NextRequest) {
  try {

    const { title, content, targetLanguage } = await req.json();

    if (!title || !content || !targetLanguage) {
      return NextResponse.json({ error: 'Title, content, and target language are required' }, { status: 400 });
    }
    // ==========================================================

    if (!process.env.GEMINI_TRANSLATION_API_KEY) {
       return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash", // Using gemini-1.5-flash
         safetySettings: [
             { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
             
         ],
    });

    const targetLanguageName = getLanguageName(targetLanguage);

    const prompt = `Translate the following title and content into formal ${targetLanguageName}.
Return the result ONLY as a valid JSON object with the keys "translatedTitle" and "translatedContent".
Do not add any extra explanations, introductions, or markdown formatting around the JSON object.

Input:
{
  "title": "${title}",
  "content": """
${content}
"""
}

Output JSON:`;
    // ===============================================================

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

   
    try {
       
        const cleanedText = responseText.replace(/^```json\s*|```$/g, '').trim();
        const translatedData = JSON.parse(cleanedText);

        // Validate the structure
        if (typeof translatedData.translatedTitle === 'string' && typeof translatedData.translatedContent === 'string') {
            return NextResponse.json(translatedData);
        } else {
            throw new Error('Invalid JSON structure received from translation API');
        }
    } catch (parseError) {
        console.error('Failed to parse translation JSON:', parseError, 'Raw response:', responseText);
        return NextResponse.json({ translatedTitle: title, translatedContent: responseText });
    }
    // ==============================================================

  } catch (error: any) {
    console.error('[TRANSLATE_API_ERROR]', error);
    return NextResponse.json({ error: `Translation failed: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}