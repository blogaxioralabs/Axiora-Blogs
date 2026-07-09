// app/page.tsx
import HomePageClient from './HomePageClient';
import { Suspense } from 'react';
import type { Post, Category, SubCategory, NewsPost } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 300; // ISR: re-generate homepage every 5 minutes

// Type definitions (for merging data)
type ProfileInfo = {
    avatar_url: string | null;
    full_name: string | null;
} | null;

// --- Fetch top posts by view_count (real most popular, not just latest) ---
async function getTopViewedPosts() {
    const serverSupabase = createClient();
    const { data } = await serverSupabase
        .from('posts')
        .select('*, user_id, like_count, view_count, categories(name, slug), sub_categories(name, slug)')
        .eq('status', 'published')
        .order('view_count', { ascending: false })
        .limit(5);
    return (data || []) as Post[];
}

// --- Fetch ALL profiles ONCE — replaces sequential 2-step, feeds posts + authors ---
async function getAllProfiles() {
    const serverSupabase = createClient();
    const { data } = await serverSupabase
        .from('profiles')
        .select('id, avatar_url, full_name');
    return data || [];
}

// --- Fetch trending news from Supabase ---
async function getTrendingNews() {
    const serverSupabase = createClient();
    
    try {
        const { data, error } = await serverSupabase
            .from('news_posts')
            .select('*, news_categories(name, slug)')
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(5);

        if (error) {
            console.error("Failed to fetch trending news from Supabase:", error);
            return [];
        }
        return data || [];
    } catch (error) {
        console.error("Failed to fetch trending news:", error);
        return [];
    }
}

// --- SINGLE-ROUND fetching: all queries parallel, no sequential wait ---
async function getPageData() {
  const serverSupabase = createClient();
  
  // ALL queries run in parallel — zero sequential wait
  const [postsRes, catRes, subCatRes, trendingNews, trendingTopicsRes, topViewedPostsRes, allProfiles] = await Promise.all([
    serverSupabase
      .from('posts')
      .select('*, user_id, like_count, view_count,categories(name, slug), sub_categories(name, slug)') 
      .order('published_at', { ascending: false })
      .limit(30),
    serverSupabase.from('categories').select('id, name'),
    serverSupabase.from('sub_categories').select('id, name, parent_category_id'), 
    getTrendingNews(),
    serverSupabase.rpc('get_trending_topics', { limit_count: 10 }),
    getTopViewedPosts(),
    getAllProfiles()
  ]);

  const initialPosts = (postsRes.data as Post[]) || [];
  const categories = (catRes.data as Category[]) || [];
  const subCategories = (subCatRes.data as SubCategory[]) || [];
  const trendingTopics = (trendingTopicsRes.data as any[]) || [];
  const topViewedPostsRaw = (topViewedPostsRes as Post[]) || [];

  // Build profiles map + authors list from parallel fetch (replaces old sequential 2-step!)
  const profilesMap: Record<string, ProfileInfo> = {};
  const authorsList: { id: string; name: string; avatar: string | null }[] = [];
  if (allProfiles) {
    (allProfiles as any[]).forEach((profile: any) => {
      profilesMap[profile.id] = { avatar_url: profile.avatar_url, full_name: profile.full_name };
      // Only include profiles with names in the authors slideshow
      if (profile.full_name) {
        authorsList.push({
          id: profile.id,
          name: profile.full_name,
          avatar: profile.avatar_url
        });
      }
    });
  }

  // Merge profiles into latest posts
  const finalPosts: Post[] = initialPosts.map(post => ({
    ...post,
    profiles: post.user_id ? profilesMap[post.user_id] : null,
  }));

  // Merge profiles into topViewedPosts (fixes missing avatar bug!)
  const finalTopPosts: Post[] = topViewedPostsRaw.map(post => ({
    ...post,
    profiles: post.user_id ? profilesMap[post.user_id] : null,
  }));

  return {
    posts: finalPosts,
    categories: categories,
    subCategories: subCategories,
    trendingNews: (trendingNews as NewsPost[]) || [],
    trendingTopics: trendingTopics,
    topViewedPosts: finalTopPosts,
    authors: authorsList,
  };
}

export default async function HomePage() {
  const { posts, categories, subCategories, trendingNews, trendingTopics, topViewedPosts, authors } = await getPageData();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://axiorablogs.com';

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "Axiora Blogs",
        "description": "Your daily dose of Science, Technology, Engineering, and Mathematics.",
        "publisher": { "@id": `${siteUrl}/#organization` },
        "inLanguage": "en-US"
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "Axiora Blogs",
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/axiora-logo.png`,
          "width": 112,
          "height": 112
        },
        "sameAs": [
          "https://twitter.com/axiorablogs", 
          "https://facebook.com/axiorablogs"
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div className="container py-12 text-center">Loading...</div>}>
         <HomePageClient 
           initialPosts={posts} 
           initialCategories={categories} 
           initialSubCategories={subCategories} 
           trendingNews={trendingNews}
           trendingTopics={trendingTopics}
           topViewedPosts={topViewedPosts}
           authors={authors}
         />
      </Suspense>
    </>
  );
}
