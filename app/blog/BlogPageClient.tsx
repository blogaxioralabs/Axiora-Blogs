// app/blog/BlogPageClient.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { AnimatedPostCard } from '@/components/AnimatedPostCard';
import { Pagination } from '@/components/Pagination';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SortDropdown } from '@/components/SortDropdown';
import { AdBanner } from '@/components/AdBanner';
import type { Post, Category, SubCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

const POSTS_PER_PAGE = 9;

interface BlogPageClientProps {
  excludePostId?: string | number;
  // ✅ Server-side preloaded data for SEO + instant first paint
  initialPosts?: Post[];
  initialTotalPages?: number;
  initialProfilesData?: Record<string, { avatar_url: string | null; full_name: string | null }>;
  initialCategories?: Category[];
  initialSubCategories?: SubCategory[];
}

export default function BlogPageClient({ 
  excludePostId,
  initialPosts = [],
  initialTotalPages = 0,
  initialProfilesData = {},
  initialCategories = [],
  initialSubCategories = [],
}: BlogPageClientProps) {
  const supabase = createClient(); 
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  // Track if this is the first render with default settings (no filters/sort/search)
  const isDefaultView = useRef(true);
  const hasHydrated = useRef(false);

  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [profilesData, setProfilesData] = useState<Record<string, { avatar_url: string | null; full_name: string | null }>>(initialProfilesData);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [subCategories, setSubCategories] = useState<SubCategory[]>(initialSubCategories);
  const [loading, setLoading] = useState(false); // Start not loading if we have initial data

  const [selectedValue, setSelectedValue] = useState<string>('all'); 
  const [sortBy, setSortBy] = useState('created_at,desc'); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [inputValue, setInputValue] = useState(''); 

  // Fetch categories (only if not provided by server)
  useEffect(() => {
    if (initialCategories.length > 0 && initialSubCategories.length > 0) return;
    async function fetchCatsAndSubCats() {
        const [catRes, subCatRes] = await Promise.all([
          supabase.from('categories').select('id, name'),
          supabase.from('sub_categories').select('id, name, parent_category_id')
        ]);
        if (initialCategories.length === 0) setCategories(catRes.data || []);
        if (initialSubCategories.length === 0) setSubCategories(subCatRes.data || []);
    }
    fetchCatsAndSubCats();
  }, [supabase, initialCategories.length, initialSubCategories.length]); 

  const debouncedSetSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    isDefaultView.current = false;
  }, 500);

  // Track when filters change away from defaults
  useEffect(() => {
    if (hasHydrated.current) {
      if (selectedValue !== 'all' || sortBy !== 'created_at,desc' || searchQuery !== '') {
        isDefaultView.current = false;
      }
    }
  }, [selectedValue, sortBy, searchQuery]);

  // Main data fetching logic
  useEffect(() => {
    hasHydrated.current = true;

    // ✅ Skip fetch on first page with default settings if we already have server data
    if (isDefaultView.current && currentPage === 1 && initialPosts.length > 0) {
      // Use the preloaded server data - no fetch needed
      setPosts(initialPosts);
      setProfilesData(initialProfilesData);
      setTotalPages(initialTotalPages);
      setLoading(false);
      return;
    }

    async function getPaginatedPostsAndProfiles() { 
        setLoading(true);
        setPosts([]); 
        setProfilesData({}); 

        let countQuery = supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published');

        if (excludePostId) {
            countQuery = countQuery.neq('id', excludePostId);
        }

        if (selectedValue.startsWith('cat-')) {
            countQuery = countQuery.eq('category_id', parseInt(selectedValue.split('-')[1]));
        } else if (selectedValue.startsWith('sub-')) {
            countQuery = countQuery.eq('sub_category_id', parseInt(selectedValue.split('-')[1]));
        }
        
        if (searchQuery.length > 0) {
            countQuery = countQuery.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
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

        let dataQuery = supabase
            .from('posts')
            .select('*, user_id, like_count, categories(name), sub_categories(name, slug)')
            .eq('status', 'published')
            .order(sortColumn, { ascending: sortDirection === 'asc' })
            .range(from, to);

        if (excludePostId) {
            dataQuery = dataQuery.neq('id', excludePostId);
        }

        if (selectedValue.startsWith('cat-')) {
            dataQuery = dataQuery.eq('category_id', parseInt(selectedValue.split('-')[1]));
        } else if (selectedValue.startsWith('sub-')) {
            dataQuery = dataQuery.eq('sub_category_id', parseInt(selectedValue.split('-')[1]));
        }

        if (searchQuery.length > 0) {
            dataQuery = dataQuery.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
        }

        const { data: postData, error: postsError } = await dataQuery;

        if (postsError) {
            console.error('Error fetching posts:', postsError);
            setPosts([]);
        } else {
            const fetchedPosts = postData || [];
            setPosts(fetchedPosts);

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
        }
        setLoading(false);
    }
    
    getPaginatedPostsAndProfiles(); 
  }, [currentPage, selectedValue, sortBy, supabase, searchQuery, excludePostId, initialPosts, initialProfilesData, initialTotalPages]); 

  return (
    <div className="container py-12">
      
      <div className="mb-8 flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-4xl font-bold text-center md:text-left">
          All Articles
        </h1>

        <div className="relative w-72 md:w-96">
          <Input
            type="text"
            placeholder="Search articles on this page..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              debouncedSetSearchQuery(e.target.value);
            }}
            className={cn(
              "pl-10 rounded-full h-10", 
              "bg-secondary/50 dark:bg-input/50", 
              "shadow-sm", 
              "focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary/50" 
            )}
          />
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div className="mb-8 flex w-full flex-col-reverse items-center gap-4 md:flex-row md:justify-between">
        <CategoryFilter
            categories={categories}
            subCategories={subCategories}
            selectedValue={selectedValue}
            setSelectedValue={(v) => { setSelectedValue(v); isDefaultView.current = false; }}
        />
        <SortDropdown
            value={sortBy}
            onValueChange={(v) => { setSortBy(v); isDefaultView.current = false; }}
            options={[
                { value: 'created_at,desc', label: 'Sort by: Latest' },
                { value: 'created_at,asc', label: 'Sort by: Oldest' },
                { value: 'like_count,desc', label: 'Sort by: Most Liked' }
            ]}
        />
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground pt-10">Loading articles...</p>
      ) : posts.length > 0 ? (
          <>
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
            {searchQuery.length > 0
              ? `No articles found matching "${searchQuery}".`
              : 'No articles found. Try a different category or check back later!'
            }
          </p>
      )}
    </div>
  );
}
