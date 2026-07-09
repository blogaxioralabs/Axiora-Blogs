// app/news/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import NewsPostClient from './NewsPostClient';
import Breadcrumbs from '@/components/Breadcrumbs';

export const revalidate = 60;

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

    return (
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
    );
}