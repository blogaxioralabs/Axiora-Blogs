// Axiora-Blogs/app/search/page.tsx

import { createClient } from '@/lib/supabase/server'; 
import PostCard from '@/components/PostCard';
import type { Post } from '@/lib/types'; 
import { BackButton } from '@/components/BackButton'; // <-- 1. Import the BackButton component

type SearchPageProps = {
    searchParams: {
        q: string;
    }
}

// 3. searchPosts function (no profiles join)
async function searchPosts(query: string) {
    if (!query) return [];

    const supabase = createClient();

    const { data, error } = await supabase
        .from('posts')
        // Select user_id, remove profiles join
        .select('*, user_id, categories(name), sub_categories(name, slug)') 
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`) 
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Search error:", error);
        return [];
    }
    // Return post data without profiles
    return data; 
}
// ----------------------------------------------------------------

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const query = searchParams.q;
    // 4. Get initial posts
    const initialPosts = await searchPosts(query);

    // --- 5. NEW: Fetch Profiles and merge (like on homepage) ---
    let finalPosts: Post[] = initialPosts as Post[]; // Cast to Post[]

    if (initialPosts && initialPosts.length > 0) {
        const supabase = createClient(); // Create client again
        
        // Create a list of user IDs
        const userIds = [...new Set(initialPosts.map(p => p.user_id).filter(id => id != null))] as string[];

        if (userIds.length > 0) {
            // Fetch profiles separately
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('id, avatar_url, full_name')
                .in('id', userIds);

            if (profilesError) {
                console.error('Search page profile fetch error:', profilesError.message);
                // Continue without profiles if error
            } else if (profiles) {
                // Create a map (ID to profile)
                const profilesMap = profiles.reduce((acc, profile) => {
                    acc[profile.id] = { avatar_url: profile.avatar_url, full_name: profile.full_name };
                    return acc;
                }, {} as Record<string, { avatar_url: string | null; full_name: string | null }>);

                // Merge posts and profiles
                finalPosts = initialPosts.map(post => ({
                    ...post,
                    profiles: post.user_id ? profilesMap[post.user_id] : null,
                }));
            }
        }
    }
    // --- ------------------------------------------------------------- ---

    return (
        // Adjusted padding to py-8 md:py-12
        <div className="container py-8 md:py-12"> 

            {/* --- START: ADDED BACK BUTTON --- */}
            {/* 2. Add the BackButton component here, just like in tag/category pages */}
            <div className="mb-4">
                <BackButton />
            </div>
            {/* --- END: ADDED BACK BUTTON --- */}

            <h1 className="text-4xl font-bold mb-8">
                Search Results for: <span className="text-primary">{query}</span>
            </h1>
            
            {/* 6. Use 'finalPosts' (the merged data) here */}
            {finalPosts && finalPosts.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {finalPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted-foreground mt-12">
                    No articles found for "{query}". Try another keyword.
                </p>
            )}
        </div>
    );
}