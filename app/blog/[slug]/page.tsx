// app/blog/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';
import { RelatedPosts } from '@/components/RelatedPosts';
import type { Post } from '@/lib/types';
import type { Metadata, ResolvingMetadata } from 'next';

// --- Define Profile type ---
type ProfileInfo = {
    avatar_url: string | null;
    full_name: string | null;
} | null;

// --- Modified getPostData: Fetches only post data first ---
async function getPostData(slug: string): Promise<(Omit<Post, 'profiles'> & { user_id?: string | null }) | null> {
    const supabase = createClient();
    const { data: postData, error } = await supabase
        .from('posts')
        // --- Corrected select string (removed comment) ---
        .select(`*,
                 user_id,
                 like_count,
                 view_count,
                 categories ( name ),
                 sub_categories ( name, slug ),
                 tags ( id, name, slug )`)
        // ------------------------------------------------
        .eq('slug', slug)
        .single();

    if (error || !postData) {
        console.error("Server Error fetching post:", error?.message || "Post data is null");
        return null;
    }
    // Return post data without profile initially
    return postData as (Omit<Post, 'profiles'> & { user_id?: string | null });
}


// --- New function to fetch profile data ---
async function getProfileData(userId: string | null | undefined): Promise<ProfileInfo> {
    if (!userId) return null;
    const supabase = createClient();
    const { data: profileData, error } = await supabase
        .from('profiles')
        .select('avatar_url, full_name')
        .eq('id', userId)
        .single();

    if (error || !profileData) {
        // Log error but don't stop execution, just return null
        console.error("Server Error fetching profile for user", userId, ":", error?.message || "Profile data is null");
        return null;
    }
    return profileData;
}

// --- generateMetadata function (minor change to use the two-step fetch) ---
export async function generateMetadata(
    { params }: { params: { slug: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const postBase = await getPostData(params.slug); // Fetch base post data

    if (!postBase) {
      return { title: 'Post Not Found | Axiora Blogs', description: 'The blog post you are looking for could not be found.', };
    }

    const profile = await getProfileData(postBase.user_id); // Fetch profile data separately

    // Combine for metadata generation
    const postForMeta: Post = { ...postBase, profiles: profile };

    // --- (Metadata generation logic එකේ වෙනසක් නෑ) ---
    function createExcerpt(content: string, length = 155): string { /* ... excerpt logic ... */
      if (!content) return '';
      const strippedContent = content.replace(/!\[.*?\]\(.*?\)/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/<[^>]*>/g, '').replace(/(\r\n|\n|\r)/gm, " ").replace(/#+\s/g, '').replace(/[`*_\-~|]/g, '').replace(/\s+/g, ' ').trim();
      if (strippedContent.length <= length) return strippedContent;
      const trimmed = strippedContent.substring(0, length);
      return trimmed.substring(0, Math.min(trimmed.length, trimmed.lastIndexOf(' '))) + '...';
    }
    const description = createExcerpt(postForMeta.content || '');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'axiorablogs.com';
    const url = `${siteUrl}/blog/${postForMeta.slug}`;
    const imageUrl = postForMeta.image_url || `${siteUrl}/axiora-og-image.png`;
    const keywords = ['Axiora Blogs'];
    if (postForMeta.categories?.name) { keywords.push(postForMeta.categories.name); }
    keywords.push(...(postForMeta.tags?.map(tag => tag.name) || []));
    keywords.push(...postForMeta.title.split(' '));
    const authorNameForMeta = postForMeta.author_name || postForMeta.profiles?.full_name || 'Axiora Labs';

    return {
      title: postForMeta.title,
      description: description,
      openGraph: {
          title: `${postForMeta.title} | Axiora Blogs`, description: description, url: url, siteName: 'Axiora Blogs',
          images: [ { url: imageUrl, width: 1200, height: 630, alt: postForMeta.title, } ], locale: 'en_US', type: 'article',
          publishedTime: postForMeta.created_at, authors: [authorNameForMeta], tags: postForMeta.tags?.map(tag => tag.name),
          ...(postForMeta.categories?.name && { section: postForMeta.categories.name }),
      },
      twitter: { card: 'summary_large_image', title: `${postForMeta.title} | Axiora Blogs`, description: description, images: [imageUrl], },
      alternates: { canonical: url, }, keywords: keywords,
    }
}

// --- Modified Default export: Fetches post and profile separately ---
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const postBase = await getPostData(params.slug); // 1. Fetch post base data

    if (!postBase) {
        notFound(); // If post not found, trigger 404
    }

    const profile = await getProfileData(postBase.user_id); // 2. Fetch profile data using user_id

    // 3. Combine post data and profile data
    const postWithProfile: Post = {
        ...postBase,
        profiles: profile // Add the fetched profile data (can be null)
    };

    // 4. Pass the combined data to the client component
    return (
        <>
            <BlogPostClient initialPost={postWithProfile} />
            {/* RelatedPosts uses its own fetching, no change needed here */}
            <RelatedPosts currentPostId={postWithProfile.id} />
        </>
    );
}