// app/news-sitemap.xml/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOptimizedImageUrl } from "@/lib/utils"; 

export const revalidate = 60;

function escapeXml(unsafe: string): string {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}

export async function GET() {
    const supabase = await createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://axiorablogs.com';

    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    const { data: posts, error } = await supabase
        .from('posts')
        .select('slug, title, created_at, image_url')
        .gte('created_at', twoDaysAgo) 
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Master SEO Error - Failed to fetch news for sitemap:', error);

        return new NextResponse(`Error generating news sitemap: ${error.message}`, { status: 500 }); 
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    ${(posts || []).map(post => {
        // Prepare precise dates and images
        const pubDate = new Date(post.created_at).toISOString();
        const modDate = pubDate;
        const imageUrl = post.image_url ? getOptimizedImageUrl(post.image_url) : `${siteUrl}/axiora-og-image.png`;

        return `
    <url>
        <loc>${siteUrl}/blog/${post.slug}</loc>
        <lastmod>${modDate}</lastmod>
        <news:news>
            <news:publication>
                <news:name>Axiora Blogs</news:name>
                <news:language>en</news:language>
            </news:publication>
            <news:publication_date>${pubDate}</news:publication_date>
            <news:title>${escapeXml(post.title)}</news:title>
        </news:news>
        <image:image>
            <image:loc>${escapeXml(imageUrl)}</image:loc>
            <image:title>${escapeXml(post.title)}</image:title>
        </image:image>
    </url>`;
    }).join('')}
</urlset>`;

    return new NextResponse(xml.trim(), {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'X-Robots-Tag': 'noindex, follow', 
            'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=120',
        },
    });
}