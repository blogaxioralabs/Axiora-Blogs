// app/api/indexnow/route.ts
import { NextResponse } from 'next/server';

async function fetchWithRetry(url: string, options: RequestInit, retries = 2) {
    for (let i = 0; i < retries; i++) {
        const response = await fetch(url, options);
        if (response.ok) return response;
        if (i === retries - 1) return response;
        await new Promise(res => setTimeout(res, 1000 * (i + 1))); 
    }
    throw new Error("Fetch failed after retries");
}

export async function POST(req: Request) {
    try {
        
        const authHeader = req.headers.get('authorization');
        const expectedSecret = process.env.INDEXNOW_SECRET;

        if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
            console.warn("IndexNow [WARN]: Unauthorized attempt blocked. Invalid Secret.");
            return new NextResponse('Unauthorized - Invalid Secret', { status: 401 });
        }

        
        const body = await req.json();
        const slug = body.record?.slug || body.slug;

        if (!slug) {
            console.error("IndexNow [ERROR]: Post slug is missing in the payload.");
            return new NextResponse('Post slug is required', { status: 400 });
        }

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://axiorablogs.com';
        const indexNowKey = process.env.INDEXNOW_KEY;

        if (!indexNowKey) {
            console.error("IndexNow [ERROR]: INDEXNOW_KEY is missing in environment variables.");
            return new NextResponse('Server Configuration Error', { status: 500 });
        }

        const cleanHost = siteUrl.replace(/^https?:\/\//, '');
        const urlList = [
            `${siteUrl}/blog/${slug}`, 
            `${siteUrl}/`,             
            `${siteUrl}/blog`         
        ];

        const payload = {
            host: cleanHost,
            key: indexNowKey,
            keyLocation: `${siteUrl}/${indexNowKey}.txt`, 
            urlList: urlList 
        };

        const response = await fetchWithRetry('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'charset': 'utf-8'
            },
            body: JSON.stringify(payload),
        }, 2); 

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`IndexNow [FAILED]: ${response.status} - ${errorText}`);
            return new NextResponse(`IndexNow Ping Failed`, { status: 502 });
        }

        console.log(`[SUCCESS] Master SEO: Instantly indexed nodes ->`, urlList);
        return NextResponse.json({ 
            success: true, 
            message: 'Real-Time Indexing Successful! Multiple nodes pinged.',
            urls: urlList 
        });

    } catch (error) {
        console.error('Master SEO Error - IndexNow API Trigger:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}