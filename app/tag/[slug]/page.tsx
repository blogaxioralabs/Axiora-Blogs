// app/tag/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server';
export const revalidate = 300;
import { AnimatedPostCard } from '@/components/AnimatedPostCard';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/BackButton';
import type { Post } from '@/lib/types';
import type { Metadata } from 'next';

type TagPageProps = {
  params: { slug: string };
};

// --- Define Profile type (if not already globally defined) ---
type ProfileInfo = {
    avatar_url: string | null;
    full_name: string | null;
} | null;
// -----------------------------------------------------------

// --- Updated getTagData function using two-step fetch ---
async function getTagData(slug: string) {
    const supabase = createClient();
    // 1. Fetch Tag Info
    const { data: tag, error: tagError } = await supabase
        .from('tags')
        .select('id, name')
        .eq('slug', slug)
        .single();

    // If tag not found, return early
    if (tagError || !tag) {
        console.error("Tag fetch error:", tagError);
        return { tag: null, posts: [] };
    }

    // 2. Fetch Post IDs associated with the tag
    const { data: postTags, error: postTagsError } = await supabase
        .from('post_tags')
        .select('post_id')
        .eq('tag_id', tag.id);

    // If no posts associated or error fetching associations, return tag info only
    if (postTagsError || !postTags || postTags.length === 0) {
        console.error("Post tags fetch error:", postTagsError);
        return { tag, posts: [] };
    }

    const postIds = postTags.map(pt => pt.post_id);

    // 3. Fetch Posts based on IDs (WITHOUT profiles join)
    const { data: postsData, error: postsError } = await supabase
        .from('posts')
        // Select user_id instead of joining profiles directly
        .select('*, user_id, categories(name), sub_categories(name, slug)')
        .in('id', postIds)
        .order('created_at', { ascending: false });

    if (postsError) {
        console.error("Posts fetch error for tag:", postsError);
        return { tag, posts: [] }; // Return tag info even if posts fail
    }

    let initialPosts = (postsData || []) as Post[]; // Cast initial data
    let finalPosts: Post[] = initialPosts;

    // 4. Fetch Profiles Separately and Merge
    if (initialPosts.length > 0) {
        const userIds = [...new Set(initialPosts.map(p => p.user_id).filter(id => id != null))] as string[];

        if (userIds.length > 0) {
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('id, avatar_url, full_name')
                .in('id', userIds);

            if (profilesError) {
                console.error('Error fetching profiles for tag page:', profilesError);
                // Continue without profile data if fetching fails
            } else if (profiles) {
                const profilesMap: Record<string, ProfileInfo> = profiles.reduce((acc, profile) => {
                    acc[profile.id] = { avatar_url: profile.avatar_url, full_name: profile.full_name };
                    return acc;
                }, {} as Record<string, ProfileInfo>);

                // Merge profiles back into posts
                finalPosts = initialPosts.map(post => ({
                    ...post,
                    profiles: post.user_id ? profilesMap[post.user_id] : null,
                }));
            }
        }
    }

    return { tag, posts: finalPosts };
}
// --- End of updated getTagData function ---

// Default export component (no changes needed here)
export default async function TagPage({ params }: TagPageProps) {
    const { tag, posts } = await getTagData(params.slug);

    if (!tag) {
        notFound();
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://axiorablogs.com';

    const collectionJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `#${tag.name} — Tag | Axiora Blogs`,
      description: `Explore all articles tagged with #${tag.name} on Axiora Blogs.`,
      url: `${siteUrl}/tag/${params.slug}`,
      isPartOf: {
        '@type': 'WebSite',
        name: 'Axiora Blogs',
        url: siteUrl,
      },
    };

    return (
        <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
        />
        <div className="container py-8 md:py-12">
            <div className="mb-4">
                <BackButton />
            </div>
            <h1 className="text-4xl font-bold mb-8">
                Posts tagged: <span className="text-primary">#{tag.name}</span>
            </h1>

            {posts && posts.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Use finalPosts which includes merged profile data */}
                    {posts.map((post, index) => (
                        <AnimatedPostCard key={post.id} post={post} index={index} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted-foreground mt-12">No posts found with this tag yet.</p>
            )}
        </div>
        </>
    );
}

// --- SEO: generateMetadata for Tag pages ---
export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
    const { tag } = await getTagData(params.slug);
    if (!tag) return { title: 'Tag Not Found' };
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://axiorablogs.com';
    return {
        title: `#${tag.name} - Articles & Insights | Axiora Blogs`,
        description: `Explore all articles tagged with #${tag.name} on Axiora Blogs. Discover the latest insights, tutorials, and deep dives about ${tag.name}.`,
        alternates: { canonical: `${siteUrl}/tag/${params.slug}` },
        openGraph: {
            title: `#${tag.name} — Tag | Axiora Blogs`,
            description: `Browse articles tagged #${tag.name} on Axiora Blogs.`,
            url: `${siteUrl}/tag/${params.slug}`,
        },
    };
}