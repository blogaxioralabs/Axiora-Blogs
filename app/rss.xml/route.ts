// app/rss.xml/route.ts
// RSS 2.0 Feed for Axiora Blogs
// Accessible at: https://www.axiorablogs.com/rss.xml

import { createClient } from '@/lib/supabase/server';

export const revalidate = 3600; // Cache for 1 hour

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.axiorablogs.com';

  const { data: posts } = await supabase
    .from('posts')
    .select('title, slug, content, created_at, image_url')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(50);

  const items = (posts || []).map((post: any) => {
    const pubDate = new Date(post.created_at).toUTCString();
    const excerpt = post.content
      ? post.content.replace(/<[^>]*>?/gm, '').substring(0, 300).trim() + '...'
      : post.title;

    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(excerpt)}</description>
      ${post.image_url ? `<enclosure url="${escapeXml(post.image_url)}" type="image/jpeg"/>` : ''}
    </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Axiora Blogs</title>
    <link>${siteUrl}</link>
    <description>Future of STEM, AI &amp; Technology — Premium tech insights, tutorials, and news.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
