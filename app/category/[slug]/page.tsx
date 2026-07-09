// app/category/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server';
export const revalidate = 300;
import { notFound } from 'next/navigation';
import CategoryPageClient from './CategoryPageClient'; 
import type { Metadata } from 'next';
import type { Post, Category, SubCategory } from '@/lib/types'; 

type CategoryPageProps = {
  params: { slug: string };
};

type ProfileInfo = {
    avatar_url: string | null;
    full_name: string | null;
} | null;

async function getProfileData(userId: string | null | undefined): Promise<ProfileInfo> {
    if (!userId) return null;
    const supabase = createClient();
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

async function getCategoryData(slug: string) {
    const supabase = createClient();
    
    const { data: category, error: catError } = await supabase
        .from('categories')
        .select('id, name, slug') 
        .eq('slug', slug)
        .single();

    if (catError || !category) {
        console.error("Category fetch error:", catError);
        return { category: null, posts: [], allSubCategories: [] };
    }

    // Fetch posts with limit + status filter
    const { data: postsData, error: postError } = await supabase
        .from('posts')
        .select('*, user_id, like_count, categories(name), sub_categories(id, name, slug)') 
        .eq('category_id', category.id)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(50); // ✅ Performance: limit to 50 posts

    const { data: allSubCategories, error: subCatError } = await supabase
        .from('sub_categories')
        .select('id, name, parent_category_id');

    if (postError) console.error("Posts fetch error:", postError);
    if (subCatError) console.error("SubCategories fetch error:", subCatError);

    let initialPosts: Post[] = (postsData || []) as Post[];
    let finalPosts: Post[] = initialPosts;

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
                const profilesMap: Record<string, ProfileInfo> = profiles.reduce((acc, profile) => {
                    acc[profile.id] = { avatar_url: profile.avatar_url, full_name: profile.full_name };
                    return acc;
                }, {} as Record<string, ProfileInfo>);

                finalPosts = initialPosts.map(post => ({
                    ...post,
                    profiles: post.user_id ? profilesMap[post.user_id] : null,
                })) as Post[];
            }
        }
    }

    return {
        category,
        posts: finalPosts,
        allSubCategories: (allSubCategories || []) as SubCategory[]
    };
}

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
