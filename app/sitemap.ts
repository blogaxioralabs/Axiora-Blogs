// app/sitemap.ts

import { supabase } from '@/lib/supabaseClient';

const URL = 'https://axiorablogs.com';

export default async function sitemap() {
    // 1. Get URLs for blog posts
    const { data: posts } = await supabase.from('posts').select('slug, created_at');
    const postUrls = posts?.map(({ slug, created_at }) => ({
        url: `${URL}/blog/${slug}`,
        lastModified: new Date(created_at).toISOString(),
    })) ?? [];

    // 2. Get URLs for categories
    const { data: categories } = await supabase.from('categories').select('slug');
    const categoryUrls = categories?.map(({ slug }) => ({
        url: `${URL}/category/${slug}`,
        lastModified: new Date().toISOString(),
    })) ?? [];

    // 3. Get URLs for tags
    const { data: tags } = await supabase.from('tags').select('slug');
    const tagUrls = tags?.map(({ slug }) => ({
        url: `${URL}/tag/${slug}`,
        lastModified: new Date().toISOString(),
    })) ?? [];

    // 4. Other main pages
    const staticUrls = [
        { url: URL, lastModified: new Date().toISOString() },
        { url: `${URL}/blog`, lastModified: new Date().toISOString() },
        { url: `${URL}/news`, lastModified: new Date().toISOString() },
        { url: `${URL}/about`, lastModified: new Date().toISOString() },
    ];

    return [...staticUrls, ...postUrls, ...categoryUrls, ...tagUrls];
}