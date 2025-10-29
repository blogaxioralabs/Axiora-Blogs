// app/sub-category/[slug]/page.tsx
import { supabase } from '../../../lib/supabaseClient';
import PostCard from '@/components/PostCard';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/BackButton';
import { Post } from '@/lib/types'; // Import Post type

type SubCategoryPageProps = {
  params: { slug: string };
};

// --- Define Profile type ---
type ProfileInfo = {
    avatar_url: string | null;
    full_name: string | null;
} | null;
// -------------------------

async function getProfileData(userId: string | null | undefined): Promise<ProfileInfo> {
    if (!userId) return null;
    // Client-side supabase instance is OK here as this is a Server Component running in a non-request context
    const { data: profileData, error } = await supabase
        .from('profiles')
        .select('avatar_url, full_name')
        .eq('id', userId)
        .single();
    if (error && error.code !== 'PGRST116') {
        console.error("Error fetching profile:", error);
    }
    return profileData || null;
}

async function getSubCategoryData(slug: string) {
    const { data: subCategory, error: subCatError } = await supabase
        .from('sub_categories')
        .select('id, name')
        .eq('slug', slug)
        .single();

    if (subCatError || !subCategory) return { subCategory: null, posts: [] };

    // 1. Fetch Posts WITHOUT the profiles join (Fixing the load error)
    const { data: postsData, error: postError } = await supabase
        .from('posts')
        // REMOVED: profiles(avatar_url, full_name) join
        .select('*, user_id, categories(name), sub_categories(name, slug)')
        .eq('sub_category_id', subCategory.id)
        .order('created_at', { ascending: false });

    if (postError) {
        console.error("SubCategory posts fetch error:", postError);
        return { subCategory, posts: [] };
    }
    
    let initialPosts = postsData || [];
    let finalPosts: Post[] = initialPosts;

    // 2. Fetch Profiles Separately and Merge
    if (initialPosts.length > 0) {
        const userIds = [...new Set(initialPosts.map(p => p.user_id).filter(id => id != null))] as string[];

        if (userIds.length > 0) {
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('id, avatar_url, full_name')
                .in('id', userIds);

            if (profilesError) {
                console.error('Error fetching profiles for sub-category page:', profilesError);
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
                })) as Post[];
            }
        }
    }

    return { subCategory, posts: finalPosts };
}

export default async function SubCategoryPage({ params }: SubCategoryPageProps) {
    const { subCategory, posts } = await getSubCategoryData(params.slug);

    if (!subCategory) notFound();

    return (
        <div className="container py-8 md:py-12">
            <div className="mb-4">
                 <BackButton />
             </div>
            <h1 className="text-4xl font-bold mb-8">
                Tag: <span className="text-primary">#{subCategory.name}</span>
            </h1>

            {posts && posts.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post, index) => (
                        // Use AnimatedPostCard for consistency with other pages
                        <PostCard key={post.id} post={post} /> 
                    ))}
                </div>
            ) : (
                <p>No posts found with this tag yet.</p>
            )}
        </div>
    );
}