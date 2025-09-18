import { supabase } from '@/lib/supabaseClient'; // <-- This line is now corrected

const URL = 'https://axiora-blogs.vercel.app'; // Make sure this is your final website URL

export default async function sitemap() {
    // Get URLs for blog posts
    const { data: posts } = await supabase.from('posts').select('slug, created_at').order('created_at', { ascending: false });
    const postUrls = posts?.map(({ slug, created_at }) => ({
        url: `${URL}/blog/${slug}`,
        lastModified: new Date(created_at).toISOString(),
    })) ?? [];

    // Other main pages
    const staticUrls = [
        { url: URL, lastModified: new Date().toISOString() },
        { url: `${URL}/blog`, lastModified: new Date().toISOString() },
        { url: `${URL}/news`, lastModified: new Date().toISOString() },
        { url: `${URL}/about`, lastModified: new Date().toISOString() },
    ];

    return [...staticUrls, ...postUrls];
}