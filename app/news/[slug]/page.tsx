// app/news/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import NewsPostClient from './NewsPostClient';
import Breadcrumbs from '@/components/Breadcrumbs';
import type { Metadata } from 'next';

export const revalidate = 60;

// --- SEO: Dynamic Metadata for News Articles ---
export async function generateMetadata(
    { params }: { params: { slug: string } }
): Promise<Metadata> {
    const supabase = createClient();
    const { data: news } = await supabase
        .from('news_posts')
        .select('title, content, image_url, published_at, news_categories(name, slug)')
        .eq('slug', params.slug)
        .eq('status', 'published')
        .single();

    if (!news) {
        return { title: 'News Not Found | Axiora Blogs', description: 'The news article you are looking for could not be found.' };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://axiorablogs.com';
    const url = `${siteUrl}/news/${params.slug}`;
    const description = news.content
        ? news.content.replace(/<[^>]*>?/gm, '').substring(0, 155).trim() + '...'
        : news.title;
    const imageUrl = news.image_url || `${siteUrl}/axiora-og-image.png`;

    return {
        title: `${news.title} | Axiora Blogs News`,
        description: description,
        alternates: {
            canonical: url,
            languages: {
                'en-US': url,
                'en': url,
                'x-default': url,
            }
        },
        openGraph: {
            title: `${news.title} — News | Axiora Blogs`,
            description: description,
            url: url,
            siteName: 'Axiora Blogs',
            type: 'article',
            publishedTime: news.published_at,
            images: [{ url: imageUrl, width: 1200, height: 630, alt: news.title }],
            ...((news.news_categories as any)?.name && { section: (news.news_categories as any).name }),
        },
        twitter: {
            card: 'summary_large_image',
            title: `${news.title} | Axiora Blogs`,
            description: description,
            images: [imageUrl],
        },
    };
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
    const supabase = createClient();

    // Fetch News Data
    const { data: news, error } = await supabase
        .from('news_posts')
        .select('*, news_categories(name, slug)')
        .eq('slug', params.slug)
        .eq('status', 'published')
        .single();

    if (error || !news) {
        notFound();
    }

    // Fetch Profile Data for Avatar
    let profile = null;
    if (news.author_id) {
        const { data } = await supabase
            .from('profiles')
            .select('avatar_url, full_name')
            .eq('id', news.author_id)
            .single();
        profile = data;
    }

    // JSON-LD Structured Data for NewsArticle
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://axiorablogs.com';
    const newsJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: news.title,
        image: news.image_url || `${siteUrl}/axiora-og-image.png`,
        datePublished: news.published_at || news.created_at,
        dateModified: news.published_at || news.created_at,
        author: {
            '@type': 'Person',
            name: profile?.full_name || news.author_name || 'Axiora Blogs',
            url: news.author_id ? `${siteUrl}/author/${news.author_id}` : siteUrl,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Axiora Blogs',
            logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/axiora-logo.png`,
                width: 112,
                height: 112,
            },
        },
        description: news.content ? news.content.replace(/<[^>]*>?/gm, '').substring(0, 160) : '',
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${siteUrl}/news/${news.slug}`,
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }}
            />
            <div className="container py-6">
                <Breadcrumbs 
                    items={[
                        { label: 'News', href: '/news' },
                        { label: news.news_categories?.name || 'Category', href: `/news?category=${news.news_categories?.slug}` },
                        { label: news.title, href: `/news/${news.slug}` }
                    ]} 
                />
                
                <NewsPostClient news={news} profile={profile} />
            </div>
        </>
    );
}
