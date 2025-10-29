// app/blog/BlogPageClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
// Use the client instance created in lib/supabase/client
import { createClient } from '@/lib/supabase/client';
import { AnimatedPostCard } from '@/components/AnimatedPostCard';
import { Pagination } from '@/components/Pagination';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SortDropdown } from '@/components/SortDropdown';
import { AdBanner } from '@/components/AdBanner';
import type { Post, Category, SubCategory } from '@/lib/types';

const POSTS_PER_PAGE = 9;

export default function BlogPageClient() {
  const supabase = createClient(); // Use the client-side Supabase instance
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const [posts, setPosts] = useState<Post[]>([]);
  // State to hold profile data keyed by user ID
  const [profilesData, setProfilesData] = useState<Record<string, { avatar_url: string | null; full_name: string | null }>>({});
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('created_at,desc');

  // Fetch categories and subcategories (runs once)
  useEffect(() => {
    async function fetchCatsAndSubCats() {
        // Use the client instance here as well
        const [catRes, subCatRes] = await Promise.all([
          supabase.from('categories').select('id, name'),
          supabase.from('sub_categories').select('id, name, parent_category_id')
        ]);
        setCategories(catRes.data || []);
        setSubCategories(subCatRes.data || []);
    }
    fetchCatsAndSubCats();
  }, [supabase]); // Depend on the supabase client instance

  // Fetch posts and then profiles based on dependencies
  useEffect(() => {
    async function getPaginatedPostsAndProfiles() { // Function name changed
        setLoading(true);
        setPosts([]); // Clear previous posts
        setProfilesData({}); // Clear previous profiles

        let countQuery = supabase.from('posts').select('*', { count: 'exact', head: true }); // Use head: true for count only

        // Apply filters to count query
        if (selectedValue.startsWith('cat-')) {
            countQuery = countQuery.eq('category_id', parseInt(selectedValue.split('-')[1]));
        } else if (selectedValue.startsWith('sub-')) {
            countQuery = countQuery.eq('sub_category_id', parseInt(selectedValue.split('-')[1]));
        }

        const { count, error: countError } = await countQuery;

        if (countError) {
            console.error('Error counting posts:', countError);
            setLoading(false);
            return;
        }

        const calculatedTotalPages = Math.ceil((count || 0) / POSTS_PER_PAGE);
        setTotalPages(calculatedTotalPages);
        const validCurrentPage = Math.max(1, Math.min(currentPage, calculatedTotalPages || 1));
        const from = (validCurrentPage - 1) * POSTS_PER_PAGE;
        const to = from + POSTS_PER_PAGE - 1;
        const [sortColumn, sortDirection] = sortBy.split(',');

        // --- Fetch Posts WITHOUT the profiles join ---
        let dataQuery = supabase
            .from('posts')
            .select('*, user_id, like_count, categories(name), sub_categories(name, slug)') // Ensure user_id is selected
            .order(sortColumn, { ascending: sortDirection === 'asc' })
            .range(from, to);

        // Re-apply filters
        if (selectedValue.startsWith('cat-')) {
            dataQuery = dataQuery.eq('category_id', parseInt(selectedValue.split('-')[1]));
        } else if (selectedValue.startsWith('sub-')) {
            dataQuery = dataQuery.eq('sub_category_id', parseInt(selectedValue.split('-')[1]));
        }

        const { data: postData, error: postsError } = await dataQuery;

        if (postsError) {
            console.error('Error fetching posts:', postsError);
            setPosts([]);
        } else {
            const fetchedPosts = postData || [];
            setPosts(fetchedPosts);

            // --- NEW: Fetch Profiles Separately ---
            if (fetchedPosts.length > 0) {
                const userIds = [...new Set(fetchedPosts.map(p => p.user_id).filter(id => id != null))] as string[];

                if (userIds.length > 0) {
                    const { data: profiles, error: profilesError } = await supabase
                        .from('profiles')
                        .select('id, avatar_url, full_name')
                        .in('id', userIds);

                    if (profilesError) {
                        console.error('Error fetching profiles:', profilesError);
                    } else if (profiles) {
                        const profilesMap = profiles.reduce((acc, profile) => {
                            acc[profile.id] = { avatar_url: profile.avatar_url, full_name: profile.full_name };
                            return acc;
                        }, {} as Record<string, { avatar_url: string | null; full_name: string | null }>);
                        setProfilesData(profilesMap);
                    }
                }
            }
            // --- End NEW ---
        }
        setLoading(false);
    }
    getPaginatedPostsAndProfiles(); // Call the updated function
  }, [currentPage, selectedValue, sortBy, supabase]); // Add supabase to dependency array

  return (
    <div className="container py-12">
      <div className="mb-8 flex flex-col items-center gap-4 md:items-start">
        <h1 className="text-4xl font-bold">All Articles</h1>
        <div className="flex w-full flex-col-reverse items-center gap-4 md:flex-row md:justify-between mt-4">
          <CategoryFilter
              categories={categories}
              subCategories={subCategories}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
          />
          <SortDropdown
              value={sortBy}
              onValueChange={setSortBy}
              options={[
                  { value: 'created_at,desc', label: 'Sort by: Latest' },
                  { value: 'created_at,asc', label: 'Sort by: Oldest' },
                  { value: 'like_count,desc', label: 'Sort by: Most Liked' }
              ]}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground pt-10">Loading articles...</p>
      ) : posts.length > 0 ? (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* --- Map posts and pass profile data --- */}
              {posts.map((post, index) => {
                  const profileInfo = post.user_id ? profilesData[post.user_id] : null;
                  const postWithProfile: Post = {
                      ...post,
                      // Ensure profiles property is added, even if null
                      profiles: profileInfo ? { avatar_url: profileInfo.avatar_url, full_name: profileInfo.full_name } : null
                  };
                  return (
                      <AnimatedPostCard key={post.id} post={postWithProfile} index={index} />
                  );
               })}
               {/* ------------------------------------- */}
            </div>
            <Pagination totalPages={totalPages} />

            <div className="mt-16 pt-12 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <AdBanner />
                  <AdBanner />
              </div>
            </div>
          </>
      ) : (
          <p className="text-center text-muted-foreground pt-10">
            No articles found. Try a different category or check back later!
          </p>
      )}
    </div>
  );
}
