// app/blog/page.tsx
import { Suspense } from 'react';
import BlogPageClient from './BlogPageClient';
import { BlogHero } from '@/components/BlogHero';
import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

export const revalidate = 300; // ISR: re-generate every 5 minutes

function BlogLoadingFallback() {
  return <div className="container py-12 text-center">Loading...</div>;
}

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Explore all articles about Science, Technology, Engineering, and Mathematics on Axiora Blogs.',
};

export default async function BlogIndexPage() {
  const supabase = await createClient();

  // 1. Hero post fetch (1 post only)
  const { data: latestPosts } = await supabase
    .from('posts')
    .select('*, categories(name), sub_categories(name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(1);

  let heroPost = latestPosts?.[0] || null;

  // 2. Hero post author profile fetch
  if (heroPost && heroPost.user_id) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('avatar_url, full_name')
      .eq('id', heroPost.user_id)
      .single();
    
    if (profileData) {
      heroPost = { ...heroPost, profiles: profileData };
    }
  }

  // 3. Pre-fetch first page of posts for SEO + faster initial load
  const heroId = heroPost?.id;
  let countQuery = supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published');
  if (heroId) countQuery = countQuery.neq('id', heroId);
  const { count } = await countQuery;
  const totalPages = Math.ceil((count || 0) / 9);

  let dataQuery = supabase
    .from('posts')
    .select('*, user_id, like_count, categories(name), sub_categories(name, slug)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(0, 8);
  if (heroId) dataQuery = dataQuery.neq('id', heroId);
  const { data: initialPosts } = await dataQuery;

  // 4. Fetch profiles for initial posts
  let profilesData: Record<string, { avatar_url: string | null; full_name: string | null }> = {};
  if (initialPosts && initialPosts.length > 0) {
    const userIds = [...new Set(initialPosts.map(p => p.user_id).filter(id => id != null))] as string[];
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, avatar_url, full_name')
        .in('id', userIds);
      if (profiles) {
        profilesData = profiles.reduce((acc, p) => {
          acc[p.id] = { avatar_url: p.avatar_url, full_name: p.full_name };
          return acc;
        }, {} as Record<string, { avatar_url: string | null; full_name: string | null }>);
      }
    }
  }

  // 5. Fetch categories/sub-categories for filters
  const [catRes, subCatRes] = await Promise.all([
    supabase.from('categories').select('id, name'),
    supabase.from('sub_categories').select('id, name, parent_category_id')
  ]);

  return (
    <>
      {heroPost && (
        <div className="container mx-auto pt-10">
          <BlogHero post={heroPost} />
        </div>
      )}

      <Suspense fallback={<BlogLoadingFallback />}>
        <BlogPageClient 
          excludePostId={heroPost?.id}
          initialPosts={initialPosts || []}
          initialTotalPages={totalPages}
          initialProfilesData={profilesData}
          initialCategories={catRes.data || []}
          initialSubCategories={subCatRes.data || []}
        />
      </Suspense>
    </>
  );
}
