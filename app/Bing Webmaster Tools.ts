import { supabase } from '@/lib/supabaseClient';

const URL = 'https://axiorablogs.com';

export const revalidate = 3600;

export default async function sitemap() {
    // 1. Blog posts (High Priority)
    const { data: posts } = await supabase.from('posts').select('slug, created_at');
    const postUrls = posts?.map(({ slug, created_at }) => ({
        url: `${URL}/blog/${slug}`,
        lastModified: new Date(created_at).toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8,
    })) ?? [];

    // 2. Categories
    const { data: categories } = await supabase.from('categories').select('slug');
    const categoryUrls = categories?.map(({ slug }) => ({
        url: `${URL}/category/${slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.6,
    })) ?? [];

    // 3. Tags
    const { data: tags } = await supabase.from('tags').select('slug');
    const tagUrls = tags?.map(({ slug }) => ({
        url: `${URL}/tag/${slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.5,
    })) ?? [];

    // 4. Main Pages (Highest Priority)
    const staticUrls = [
        { url: URL, lastModified: new Date().toISOString(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${URL}/blog`, lastModified: new Date().toISOString(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${URL}/news`, lastModified: new Date().toISOString(), changeFrequency: 'hourly', priority: 0.7 },
        { url: `${URL}/about`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.5 },
    ];

    // @ts-ignore
    return [...staticUrls, ...postUrls, ...categoryUrls, ...tagUrls];
}