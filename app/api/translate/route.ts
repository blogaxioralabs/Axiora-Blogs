import translate from 'google-translate-api-x';
import { NextResponse, NextRequest } from 'next/server';

export const maxDuration = 60; 

// ලොකු Article එකක් ආරක්‍ෂිතව කෑලි වලට කැඩීම (Chunking)
function chunkText(text: string, maxLength: number): string[] {
  const chunks: string[] = [];
  let currentChunk = '';
  
  const lines = text.split('\n');
  
  for (const line of lines) {
    if ((currentChunk.length + line.length) > maxLength) {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = line + '\n';
    } else {
      currentChunk += line + '\n';
    }
  }
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
}

export async function POST(req: NextRequest) {
  try {
    const { title, content, targetLanguage } = await req.json();

    if (!title || !content || !targetLanguage) {
      return NextResponse.json(
        { error: 'Title, content, and target language are required' },
        { status: 400 }
      );
    }

    const translateOptions = {
      to: targetLanguage,
      autoCorrect: true,
    };

    // ආරක්ෂිතව Translate කරන Function එක (Fail වුණොත් Original Text එක දෙනවා)
    const safeTranslate = async (text: string, retries = 2) => {
        if (!text.trim()) return text;
        
        for (let i = 0; i < retries; i++) {
            try {
                const res = await translate(text, translateOptions);
                // Null check එක - Result එකක් ඇවිත් නම් විතරක් return කරනවා
                if (res && res.text) return res.text;
            } catch (error) {
                if (i === retries - 1) {
                    console.error("[TRANSLATE_CHUNK_ERROR]", error);
                    // Error ආවොත් මුලින් තිබ්බ භාෂාවෙන්ම හරි පෙන්නනවා (Page එක Crash වෙන්නෙ නෑ)
                    return text; 
                }
                // තත්පර භාගයක් ඉඳලා ආයෙත් Try කරනවා (Retry mechanism)
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        return text;
    };

    // 1. Title එක Translate කිරීම
    const translatedTitle = await safeTranslate(title);

    // 2. Content එක Translate කිරීම (අකුරු 3000 කෑලි වලට කඩලා)
    const textChunks = chunkText(content, 3000);
    let translatedContent = '';

    for (const chunk of textChunks) {
         const translatedChunk = await safeTranslate(chunk);
         translatedContent += translatedChunk;
         
         // Google එකෙන් Block කරන එක නවත්වන්න පොඩි වෙලාවක් (Delay එකක්) තියනවා
         await new Promise(resolve => setTimeout(resolve, 300)); 
    }

    return NextResponse.json({
      translatedTitle,
      translatedContent,
    });

  } catch (error: any) {
    console.error('[TRANSLATE_API_ERROR]', error);
    return NextResponse.json(
      { error: `Translation failed: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}