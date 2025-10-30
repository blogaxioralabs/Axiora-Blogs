// Axiora-Blogs/app/blog/BlogPageClient.tsx
'use client';

// --- 1. Import all necessary components and hooks ---
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input'; // For the new search bar
import { Search } from 'lucide-react'; // Icon for the search bar
import { AnimatedPostCard } from '@/components/AnimatedPostCard';
import { Pagination } from '@/components/Pagination';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SortDropdown } from '@/components/SortDropdown';
import { AdBanner } from '@/components/AdBanner';
import type { Post, Category, SubCategory } from '@/lib/types';
import { cn } from '@/lib/utils'; // Import cn for conditional styling
// ---------------------------------------------------

const POSTS_PER_PAGE = 9;

export default function BlogPageClient() {
  const supabase = createClient(); 
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  // --- 2. All state variables ---
  const [posts, setPosts] = useState<Post[]>([]);
  const [profilesData, setProfilesData] = useState<Record<string, { avatar_url: string | null; full_name: string | null }>>({});
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedValue, setSelectedValue] = useState<string>('all'); // For CategoryFilter
  const [sortBy, setSortBy] = useState('created_at,desc'); // For SortDropdown
  const [searchQuery, setSearchQuery] = useState(''); // For live search (debounced)
  const [inputValue, setInputValue] = useState(''); // For live search (instant)
  // ------------------------------

  // Fetch categories and subcategories (runs once)
  useEffect(() => {
    async function fetchCatsAndSubCats() {
        const [catRes, subCatRes] = await Promise.all([
          supabase.from('categories').select('id, name'),
          supabase.from('sub_categories').select('id, name, parent_category_id')
        ]);
        setCategories(catRes.data || []);
        setSubCategories(subCatRes.data || []);
    }
    fetchCatsAndSubCats();
  }, [supabase]); 

  // Debounced function to update the search query state after 500ms
  const debouncedSetSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
  }, 500);

  // --- 3. Main data fetching logic ---
  // This effect runs when page, category, sort, or search query changes
  useEffect(() => {
    async function getPaginatedPostsAndProfiles() { 
        setLoading(true);
        setPosts([]); 
        setProfilesData({}); 

        // --- Build Count Query ---
        let countQuery = supabase.from('posts').select('*', { count: 'exact', head: true }); 

        // Apply Category/SubCategory filter to count
        if (selectedValue.startsWith('cat-')) {
            countQuery = countQuery.eq('category_id', parseInt(selectedValue.split('-')[1]));
        } else if (selectedValue.startsWith('sub-')) {
            countQuery = countQuery.eq('sub_category_id', parseInt(selectedValue.split('-')[1]));
        }
        
        // Apply Search filter to count
        if (searchQuery.length > 0) {
            countQuery = countQuery.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
        }

        const { count, error: countError } = await countQuery;

        if (countError) {
            console.error('Error counting posts:', countError);
            setLoading(false);
            return;
        }

        // --- Pagination Logic ---
        const calculatedTotalPages = Math.ceil((count || 0) / POSTS_PER_PAGE);
        setTotalPages(calculatedTotalPages);
        const validCurrentPage = Math.max(1, Math.min(currentPage, calculatedTotalPages || 1));
        const from = (validCurrentPage - 1) * POSTS_PER_PAGE;
        const to = from + POSTS_PER_PAGE - 1;
        const [sortColumn, sortDirection] = sortBy.split(',');

        // --- Build Data Query ---
        let dataQuery = supabase
            .from('posts')
            .select('*, user_id, like_count, categories(name), sub_categories(name, slug)') 
            .order(sortColumn, { ascending: sortDirection === 'asc' })
            .range(from, to);

        // Apply Category/SubCategory filter to data
        if (selectedValue.startsWith('cat-')) {
            dataQuery = dataQuery.eq('category_id', parseInt(selectedValue.split('-')[1]));
        } else if (selectedValue.startsWith('sub-')) {
            dataQuery = dataQuery.eq('sub_category_id', parseInt(selectedValue.split('-')[1]));
        }

        // Apply Search filter to data
        if (searchQuery.length > 0) {
            dataQuery = dataQuery.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
        }

        const { data: postData, error: postsError } = await dataQuery;

        // --- Process Fetched Data ---
        if (postsError) {
            console.error('Error fetching posts:', postsError);
            setPosts([]);
        } else {
            const fetchedPosts = postData || [];
            setPosts(fetchedPosts);

            // --- Two-Step Fetch for Profiles ---
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
            // --- End Two-Step Fetch ---
        }
        setLoading(false);
    }
    
    getPaginatedPostsAndProfiles(); 
  }, [currentPage, selectedValue, sortBy, supabase, searchQuery]); // All filters trigger this effect
  // ------------------------------------

  // --- 4. JSX Layout (Corrected for Responsive) ---
  return (
    <div className="container py-12">
      
      {/* --- Row 1: Title and Search Bar --- */}
      {/* On Mobile (default): flex-col, items-center (center aligns title and search)
        On Desktop (md:):   flex-row, justify-between (title left, search right)
      */}
      <div className="mb-8 flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
        
        {/* Title: Centered on mobile, left-aligned on desktop */}
        <h1 className="text-4xl font-bold text-center md:text-left">
          All Articles
        </h1>

        {/* --- SEARCH BAR WIDTH CHANGE ---
          - Mobile width changed from `w-full` to `w-72` (288px)
          - Desktop width changed from `md:w-64` to `md:w-96` (384px)
        */}
        <div className="relative w-72 md:w-96">
          <Input
            type="text"
            placeholder="Search articles on this page..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              debouncedSetSearchQuery(e.target.value);
            }}
            // --- Modern Styling Added ---
            className={cn(
              "pl-10 rounded-full h-10", // Base style for padding, shape, height
              "bg-secondary/50 dark:bg-input/50", // Visible background color
              "shadow-sm", // Modern shadow/outline
              "focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary/50" // Focus style
            )}
          />
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
      {/* --- END ROW 1 --- */}

      {/* --- Row 2: Category Filter and Sort Dropdown (Original Layout) --- */}
      {/* On Mobile (default): flex-col-reverse, items-center (stacks them centered)
        On Desktop (md:):   flex-row, justify-between (category left, sort right)
      */}
      <div className="mb-8 flex w-full flex-col-reverse items-center gap-4 md:flex-row md:justify-between">
        
        {/* Left Side: Category Filter (Original Position) */}
        <CategoryFilter
            categories={categories}
            subCategories={subCategories}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
        />
        
        {/* Right Side: Sort Dropdown (Original Position) */}
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
      {/* --- END ROW 2 --- */}


      {/* --- 5. Content Display (Loading, Posts, or No Results) --- */}
      {loading ? (
        <p className="text-center text-muted-foreground pt-10">Loading articles...</p>
      ) : posts.length > 0 ? (
          <>
            {/* Post Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => {
                  const profileInfo = post.user_id ? profilesData[post.user_id] : null;
                  const postWithProfile: Post = {
                      ...post,
                      profiles: profileInfo ? { avatar_url: profileInfo.avatar_url, full_name: profileInfo.full_name } : null
                  };
                  return (
                      <AnimatedPostCard key={post.id} post={postWithProfile} index={index} />
                  );
               })}
            </div>
            
            {/* Pagination */}
            <Pagination totalPages={totalPages} />

            {/* Ad Banners */}
            <div className="mt-16 pt-12 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <AdBanner />
                  <AdBanner />
              </div>
            </div>
          </>
      ) : (
          // No Results Message
          <p className="text-center text-muted-foreground pt-10">
            {searchQuery.length > 0
              ? `No articles found matching "${searchQuery}".`
              : 'No articles found. Try a different category or check back later!'
            }
          </p>
      )}
      {/* -------------------------------------------------------- */}
    </div>
  );
}