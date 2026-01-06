// app/api/cite/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Data Validation Logic
    const post = body.post || body;

    if (!post || !post.title) {
      return NextResponse.json(
        { error: 'Post data or Title is missing.' },
        { status: 400 }
      );
    }


    const title = post.title || 'Untitled Article';
    const author = post.author_name || 'Axiora Labs';
    
    // --- Domain Handling Logic ---
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.axiorablogs.com';
    const slug = post.slug || '';
    

    const url = `${siteUrl}/blog/${slug}`;
    

    const pubDateObj = post.created_at ? new Date(post.created_at) : new Date();
    const accessDateObj = new Date(); 

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    const pubYear = pubDateObj.getFullYear();
    const pubMonth = months[pubDateObj.getMonth()];
    const pubDay = pubDateObj.getDate();

    const accessYear = accessDateObj.getFullYear();
    const accessMonth = months[accessDateObj.getMonth()];
    const accessDay = accessDateObj.getDate();

    // --- CITATION GENERATION STANDARDS (Manual Logic) ---

    // 1. APA 7 Standard Formatting
    // Structure: Author. (Year, Month Day). Title. Site Name. URL
    const apaDate = `${pubYear}, ${pubMonth} ${pubDay}`;
    const apa = `${author}. (${apaDate}). ${title}. Axiora Blogs. ${url}`;

    // 2. MLA 9 Standard Formatting
    // Structure: Author. "Title." Site Name, Day Mon. Year, URL. Accessed Day Mon. Year.
    const mlaPubDate = `${pubDay} ${pubMonth} ${pubYear}`;
    const mlaAccessDate = `${accessDay} ${accessMonth} ${accessYear}`;
    const mla = `${author}. "${title}." Axiora Blogs, ${mlaPubDate}, ${url}. Accessed ${mlaAccessDate}.`;

    // 3. Harvard Standard Formatting
    // Structure: Author, (Year). Title. [online] Site Name. Available at: URL [Accessed Day Mon. Year].
    const harvardAccessDate = `${accessDay} ${accessMonth} ${accessYear}`;
    const harvard = `${author}, (${pubYear}). ${title}. [online] Axiora Blogs. Available at: ${url} [Accessed ${harvardAccessDate}].`;


    return NextResponse.json({
      apa: apa,
      mla: mla,
      harvard1: harvard
    });

  } catch (error) {
    console.error('Error in citation generator:', error);
    return NextResponse.json(
      { 
        apa: "Could not generate APA citation.", 
        mla: "Could not generate MLA citation.", 
        harvard1: "Could not generate Harvard citation." 
      },
      { status: 500 }
    );
  }
}