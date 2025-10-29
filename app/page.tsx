import { supabase } from '../lib/supabaseClient';
import HomePageClient from './HomePageClient';
import { Suspense } from 'react';
import type { Post, Category, SubCategory, NewsArticle } from '@/lib/types';

// Function to fetch a small list of trending news
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

async function getPageData() {
  const [postsRes, catRes, subCatRes, trendingNews] = await Promise.all([
    supabase
      .from('posts')
      .select('*, categories(name), sub_categories(name, slug), profiles(avatar_url, full_name)')
      .order('created_at', { ascending: false }),
    supabase.from('categories').select('id, name'),
    supabase.from('sub_categories').select('id, name, parent_category_id'), 
    getTrendingNews()
  ]);

  return {
    posts: (postsRes.data as Post[]) || [],
    categories: (catRes.data as Category[]) || [],
    subCategories: (subCatRes.data as SubCategory[]) || [],
    trendingNews: (trendingNews as NewsArticle[]) || [],
  };
}

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