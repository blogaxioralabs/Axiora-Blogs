import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://axiorablogs.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  
  // Fetch ALL content types in parallel
  const [
    postsRes,
    categoriesRes,
    subCategoriesRes,
    tagsRes,
    authorsRes,
    newsRes,
    newsCategoriesRes,
  ] = await Promise.all([
    supabase.from('posts').select('slug, created_at').eq('status', 'published').limit(5000).order('created_at', { ascending: false }),
    supabase.from('categories').select('slug, name'),
    supabase.from('sub_categories').select('slug, name'),
    supabase.from('tags').select('slug, name'),
    supabase.from('profiles').select('id, full_name').not('full_name', 'is', null),
    supabase.from('news_posts').select('slug, published_at').eq('status', 'published').limit(5000).order('published_at', { ascending: false }),
    supabase.from('news_categories').select('slug, name'),
  ]);

  const posts = postsRes.data || [];
  const categories = categoriesRes.data || [];
  const subCategories = subCategoriesRes.data || [];
  const tags = tagsRes.data || [];
  const authors = authorsRes.data || [];
  const news = newsRes.data || [];
  const newsCategories = newsCategoriesRes.data || [];

  const now = new Date();

  // --- Static Pages ---
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/news`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/search`, lastModified: now, changeFrequency: 'weekly', priority: 0.3 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/terms-and-conditions`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  // --- Blog Posts ---
  const postEntries: MetadataRoute.Sitemap = posts.map((post: any) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // --- News Posts (Google News priority) ---
  const newsEntries: MetadataRoute.Sitemap = news.map((n: any) => ({
    url: `${BASE_URL}/news/${n.slug}`,
    lastModified: new Date(n.published_at || n.created_at),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }));

  // --- Categories ---
  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat: any) => ({
    url: `${BASE_URL}/category/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // --- Sub-Categories ---
  const subCategoryEntries: MetadataRoute.Sitemap = subCategories.map((sub: any) => ({
    url: `${BASE_URL}/sub-category/${sub.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // --- Tags ---
  const tagEntries: MetadataRoute.Sitemap = tags.map((tag: any) => ({
    url: `${BASE_URL}/tag/${tag.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  // --- Author Pages (E-E-A-T signal) ---
  const authorEntries: MetadataRoute.Sitemap = authors.map((author: any) => ({
    url: `${BASE_URL}/author/${author.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  // --- News Categories ---
  const newsCategoryEntries: MetadataRoute.Sitemap = newsCategories.map((nc: any) => ({
    url: `${BASE_URL}/news?category=${nc.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...postEntries,
    ...newsEntries,
    ...categoryEntries,
    ...subCategoryEntries,
    ...tagEntries,
    ...authorEntries,
    ...newsCategoryEntries,
  ];
}
