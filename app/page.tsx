import { supabase } from '../lib/supabaseClient';
import HomePageClient from './HomePageClient';
import { Suspense } from 'react';

// Define the type for a single news article for type safety
interface NewsArticle {
    title: string;
    url: string;
    source: { name: string };
    publishedAt: string;
}

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
      .select('*, like_count, categories(name), sub_categories(name, slug)')
      .order('created_at', { ascending: false }),
    supabase.from('categories').select('id, name'),
    supabase.from('sub_categories').select('id, name, parent_category_id'),
    getTrendingNews() // Fetch trending news concurrently
  ]);

  return {
    posts: postsRes.data || [],
    categories: catRes.data || [],
    subCategories: subCatRes.data || [],
    trendingNews: trendingNews || [],
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