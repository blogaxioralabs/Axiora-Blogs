// app/api/cite/route.ts
import { NextResponse } from 'next/server';
const Cite = require('citation-js'); 

export async function POST(request: Request) {
  try {
    const post = await request.json();

    if (!post || !post.title || !post.created_at || !post.slug) {
      return NextResponse.json({ error: 'Missing post data' }, { status: 400 });
    }

    const publicationDate = new Date(post.created_at);
    if (isNaN(publicationDate.getTime())) {
      throw new Error('Invalid date format for post.created_at');
    }

    const siteUrl = 'https://axiora-blogs.vercel.app';
    const postUrl = `${siteUrl}/blog/${post.slug}`;

    const citationData = {
      id: post.slug,
      type: 'webpage',
      title: post.title,
      author: [{ literal: post.author_name || 'Axiora Labs' }],
      issued: { 'date-parts': [[publicationDate.getFullYear(), publicationDate.getMonth() + 1, publicationDate.getDate()]] },
      URL: postUrl,
      'container-title': 'Axiora Blogs',
      retrieved: { 'date-parts': [[new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()]] }
    };

    const cite = new Cite(citationData);
    
    const citations = {
      apa: cite.format('bibliography', { format: 'text', template: 'apa', lang: 'en-US' }),
      harvard1: cite.format('bibliography', { format: 'text', template: 'harvard1', lang: 'en-US' }),
      mla: cite.format('bibliography', { format: 'text', template: 'mla', lang: 'en-US' }),
    };

    return NextResponse.json(citations);

  } catch (error) {
    console.error('API Error generating citation:', error);
    return NextResponse.json({ error: 'Failed to generate citations' }, { status: 500 });
  }
}