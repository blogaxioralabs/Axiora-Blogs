// app/news/page.tsx
import { Suspense } from 'react';
import NewsPageClient from './NewsPageClient';
import { NewsHero } from '@/components/NewsHero';
import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

export const revalidate = 300; // ISR: re-generate every 5 minutes

function NewsLoadingFallback() {
  return <div className="container py-12 text-center text-muted-foreground">Loading news...</div>;
}

export const metadata: Metadata = {
  title: 'News | Axiora Blogs',
  description: 'Stay updated with breaking stories and deep dives from around the world of Science, Technology, Engineering, and Mathematics.',
};

export default async function NewsIndexPage() {
  const supabase = await createClient();

  // 1. Hero news fetch (1 news only)
  const { data: latestNews } = await supabase
    .from('news_posts')
    .select('*, news_categories(name, slug)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(1);

  let heroNews = latestNews?.[0] || null;

  if (heroNews && heroNews.author_id) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('avatar_url, full_name')
      .eq('id', heroNews.author_id)
      .single();
    if (profileData) {
      heroNews = { ...heroNews, profiles: profileData };
    }
  }

  // 2. Pre-fetch first page of news for SEO + faster initial load
  const heroId = heroNews?.id;
  let countQuery = supabase.from('news_posts').select('*', { count: 'exact', head: true }).eq('status', 'published');
  if (heroId) countQuery = countQuery.neq('id', heroId);
  const { count } = await countQuery;
  const totalPages = Math.ceil((count || 0) / 9);

  let dataQuery = supabase
    .from('news_posts')
    .select('*, news_categories(name, slug)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(0, 8);
  if (heroId) dataQuery = dataQuery.neq('id', heroId);
  const { data: initialNews } = await dataQuery;

  // 3. Fetch profiles for initial news
  let profilesData: Record<string, any> = {};
  if (initialNews && initialNews.length > 0) {
    const userIds = [...new Set(initialNews.map(n => n.author_id).filter(Boolean))] as string[];
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, avatar_url, full_name')
        .in('id', userIds);
      if (profiles) {
        profilesData = profiles.reduce((acc, p) => {
          acc[p.id] = { avatar_url: p.avatar_url, full_name: p.full_name };
          return acc;
        }, {} as Record<string, any>);
      }
    }
  }

  // 4. Fetch news categories
  const { data: categories } = await supabase.from('news_categories').select('id, name').order('name');

  return (
    <div className="min-h-screen bg-background pb-12 md:pb-20">
      {heroNews && (
        <div className="container mx-auto pt-10">
          <NewsHero news={heroNews} />
        </div>
      )}

      <Suspense fallback={<NewsLoadingFallback />}>
        <NewsPageClient 
          excludeNewsId={heroNews?.id}
          initialNews={initialNews || []}
          initialTotalPages={totalPages}
          initialProfilesData={profilesData}
          initialCategories={categories || []}
        />
      </Suspense>
    </div>
  );
}
