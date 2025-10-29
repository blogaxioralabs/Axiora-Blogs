import { supabase } from '../lib/supabaseClient';
import HomePageClient from './HomePageClient';
import { Suspense } from 'react';
import type { Post, Category, SubCategory, NewsArticle } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';

// Type definitions (for merging data)
type ProfileInfo = {
    avatar_url: string | null;
    full_name: string | null;
} | null;

// Function to fetch a small list of trending news (Remains the same)
async function getTrendingNews() {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) return [];
    
    const query = '(science OR technology OR AI OR space) NOT (celebrity OR politics)';
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=popularity&language=en&pageSize=5&apiKey=${apiKey}`;

    try {
        const response = await fetch(url, { next: { revalidate: 3600 } }); // Revalidate every hour
        if (!response.ok) return [];
        const data = await response.json();
        return data.articles.filter((article: NewsArticle) => article.title);
    } catch (error) {
        console.error("Failed to fetch trending news:", error);
        return [];
    }
}

// --- MODIFIED FUNCTION: Two-step fetching logic ---
async function getPageData() {
  const serverSupabase = createClient();
  
  // 1. Fetch Posts WITHOUT the profiles join
  const [postsRes, catRes, subCatRes, trendingNews] = await Promise.all([
    serverSupabase
      .from('posts')
      // Removed profiles join to prevent the 400/server error
      .select('*, user_id, like_count, view_count, categories(name), sub_categories(name, slug)') 
      .order('created_at', { ascending: false }),
    serverSupabase.from('categories').select('id, name'),
    serverSupabase.from('sub_categories').select('id, name, parent_category_id'), 
    getTrendingNews()
  ]);

  const initialPosts = (postsRes.data as Post[]) || [];
  const categories = (catRes.data as Category[]) || [];
  const subCategories = (subCatRes.data as SubCategory[]) || [];

  let finalPosts: Post[] = initialPosts;

  // 2. Fetch Profiles Separately and Merge (if posts exist)
  if (initialPosts.length > 0) {
    const userIds = [...new Set(initialPosts.map(p => p.user_id).filter(id => id != null))] as string[];

    if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await serverSupabase
            .from('profiles')
            .select('id, avatar_url, full_name')
            .in('id', userIds);

        if (profilesError) {
            console.error('Error fetching profiles on homepage:', profilesError);
            // Continue without profile data if fetching fails
        } else if (profiles) {
            
            // --- FIX: Cast the initial empty object to the correct Record type ---
            const profilesMap: Record<string, ProfileInfo> = profiles.reduce((acc, profile) => {
                acc[profile.id] = { avatar_url: profile.avatar_url, full_name: profile.full_name };
                return acc;
            }, {} as Record<string, ProfileInfo>);
            // --------------------------------------------------------------------

            // Merge profiles back into posts
            finalPosts = initialPosts.map(post => ({
                ...post,
                profiles: post.user_id ? profilesMap[post.user_id] : null,
            }));
        }
    }
  }

  return {
    posts: finalPosts,
    categories: categories,
    subCategories: subCategories,
    trendingNews: (trendingNews as NewsArticle[]) || [],
  };
}
// --- END MODIFIED FUNCTION ---

export default async function HomePage() {
  const { posts, categories, subCategories, trendingNews } = await getPageData();

  return (
    <Suspense fallback={<div className="container py-12 text-center">Loading...</div>}>
      <HomePageClient 
        initialPosts={posts} 
        initialCategories={categories} 
        initialSubCategories={subCategories} 
        trendingNews={trendingNews}
      />
    </Suspense>
  );
}