// app/category/[slug]/page.tsx
import { supabase } from '../../../lib/supabaseClient';
import { notFound } from 'next/navigation';
import CategoryPageClient from './CategoryPageClient'; 
import type { Metadata } from 'next';
import type { Post, Category, SubCategory } from '@/lib/types'; 

type CategoryPageProps = {
  params: { slug: string };
};

// --- Define Profile type ---
type ProfileInfo = {
    avatar_url: string | null;
    full_name: string | null;
} | null;
// -------------------------

// --- New function to fetch profile data ---
async function getProfileData(userId: string | null | undefined): Promise<ProfileInfo> {
    if (!userId) return null;
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
// ----------------------------------------

// Server එකේදි data fetch කරන function එක (Modified for Two-Step Fetch)
async function getCategoryData(slug: string) {
    // 1. Category එක ගන්නවා
    const { data: category, error: catError } = await supabase
        .from('categories')
        .select('id, name, slug') 
        .eq('slug', slug)
        .single();

    if (catError || !category) {
        console.error("Category fetch error:", catError);
        return { category: null, posts: [], allSubCategories: [] };
    }

    // 2. Posts ගන්නවා (profile join එක නැතුව)
    const { data: postsData, error: postError } = await supabase
        .from('posts')
        // REMOVED: profiles join. Added user_id.
        .select('*, user_id, like_count, categories(name), sub_categories(id, name, slug)') 
        .eq('category_id', category.id)
        .order('created_at', { ascending: false });

    // 3. **සියලුම** Sub-categories ගන්නවා
    const { data: allSubCategories, error: subCatError } = await supabase
        .from('sub_categories')
        .select('id, name, parent_category_id');


    if (postError) console.error("Posts fetch error:", postError);
    if (subCatError) console.error("SubCategories fetch error:", subCatError);

    let initialPosts: Post[] = (postsData || []) as Post[];
    let finalPosts: Post[] = initialPosts;

    // 4. Profiles වෙනම Fetch කරලා Merge කිරීම
     if (initialPosts.length > 0) {
        const userIds = [...new Set(initialPosts.map(p => p.user_id).filter(id => id != null))] as string[];

        if (userIds.length > 0) {
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('id, avatar_url, full_name')
                .in('id', userIds);

            if (profilesError) {
                console.error('Error fetching profiles for category page:', profilesError);
            } else if (profiles) {
                // Cast the initial empty object to the correct Record type (fixing the TS build error)
                const profilesMap: Record<string, ProfileInfo> = profiles.reduce((acc, profile) => {
                    acc[profile.id] = { avatar_url: profile.avatar_url, full_name: profile.full_name };
                    return acc;
                }, {} as Record<string, ProfileInfo>);

                // Merge profiles back into posts
                finalPosts = initialPosts.map(post => ({
                    ...post,
                    profiles: post.user_id ? profilesMap[post.user_id] : null,
                })) as Post[];
            }
        }
    }


    // Data return කරනවා
    return {
        category,
        posts: finalPosts,
        allSubCategories: (allSubCategories || []) as SubCategory[]
    };
}

// ප්‍රධාන Page Component එක
export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category, posts, allSubCategories } = await getCategoryData(params.slug);

    if (!category) {
        notFound();
    }

    return (
      <CategoryPageClient
        category={category as Category}
        initialPosts={posts}
        allSubCategories={allSubCategories}
      />
    );
}

// Metadata generate කරන function එක (Remains the same)
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { category } = await getCategoryData(params.slug); 

    if (!category) {
      return {
        title: 'Category Not Found',
      };
    }

    return {
      title: `${category.name} Category`,
      description: `Browse articles under the ${category.name} category on Axiora Blogs.`,
       alternates: { 
           canonical: `/category/${category.slug}`,
       },
    };
}