// app/blog/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';
import { RelatedPosts } from '@/components/RelatedPosts';
import type { Post } from '@/lib/types';
import type { Metadata, ResolvingMetadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';

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
        .select(`*,
                 user_id,
                 like_count,
                 view_count,
                 categories ( name, slug ),
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

    const postForMeta: Post = { ...postBase, profiles: profile };

    function createExcerpt(content: string, length = 155): string {
      if (!content) return '';
      const strippedContent = content.replace(/!\[.*?\]\(.*?\)/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/<[^>]*>/g, '').replace(/(\r\n|\n|\r)/gm, " ").replace(/#+\s/g, '').replace(/[`*_\-~|]/g, '').replace(/\s+/g, ' ').trim();
      if (strippedContent.length <= length) return strippedContent;
      const trimmed = strippedContent.substring(0, length);
      return trimmed.substring(0, Math.min(trimmed.length, trimmed.lastIndexOf(' '))) + '...';
    }
    const description = createExcerpt(postForMeta.content || '');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://axiorablogs.com';
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

    // --- SEO ENHANCEMENT: Generate JSON-LD Schema (AEO/GEO Optimized) ---
    // This helps Google and AI understand your content deeply
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://axiorablogs.com';
    const cleanDescription = postWithProfile.content 
        ? postWithProfile.content.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...'
        : postWithProfile.title;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: postWithProfile.title,
        image: postWithProfile.image_url ? [postWithProfile.image_url] : [`${siteUrl}/axiora-og-image.png`],
        datePublished: postWithProfile.created_at,
        dateModified: postWithProfile.created_at, // Use updated_at if you add it to DB later
        author: [{
            '@type': 'Person',
            name: postWithProfile.author_name || postWithProfile.profiles?.full_name || 'Axiora Author',
            url: postWithProfile.user_id ? `${siteUrl}/author/${postWithProfile.user_id}` : siteUrl
        }],
        publisher: {
            '@type': 'Organization',
            name: 'Axiora Blogs',
            logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/axiora-logo.png`
            }
        },
        description: cleanDescription,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${siteUrl}/blog/${postWithProfile.slug}`
        },
        articleSection: postWithProfile.categories?.name || 'General',
        keywords: postWithProfile.tags?.map(t => t.name).join(', ') || ''
    };

    const breadcrumbJsonLd = {  
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteUrl
        },
        {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: `${siteUrl}/blog`
        },
        {
            '@type': 'ListItem',
            position: 3,
            name: postWithProfile.categories?.name || 'Category',
            item: `${siteUrl}/category/${postWithProfile.categories?.slug}`
        },
        {
            '@type': 'ListItem',
            position: 4,
            name: postWithProfile.title,
            item: `${siteUrl}/blog/${postWithProfile.slug}`
        }
    ]
};

    // 4. Pass the combined data to the client component and Inject JSON-LD
    return (
        <>
            {/* Add JSON-LD Script for Search Engines */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <div className="container py-6">
       <Breadcrumbs 
         items={[
           { label: 'Blog', href: '/blog' },
           { label: postWithProfile.categories?.name || 'Category', href: `/category/${postWithProfile.categories?.slug}` }, // Category එකට ලින්ක් එකක් තිබ්බොත් හොඳයි
           { label: postWithProfile.title, href: `/blog/${postWithProfile.slug}` }
         ]} 
       />
       
       <BlogPostClient initialPost={postWithProfile} />
       <RelatedPosts currentPostId={postWithProfile.id} />
    </div>
        </>
    );
}