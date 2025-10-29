// app/blog/BlogPageClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient'; //
import { AnimatedPostCard } from '@/components/AnimatedPostCard'; //
import { Pagination } from '@/components/Pagination'; //
import { CategoryFilter } from '@/components/CategoryFilter'; //
import { SortDropdown } from '@/components/SortDropdown'; //
import { AdBanner } from '@/components/AdBanner'; //
import type { Post, Category, SubCategory } from '@/lib/types'; //

const POSTS_PER_PAGE = 9;

export default function BlogPageClient() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('created_at,desc');

  useEffect(() => {
    async function fetchCatsAndSubCats() {
        const [catRes, subCatRes] = await Promise.all([
          supabase.from('categories').select('id, name'), //
          supabase.from('sub_categories').select('id, name, parent_category_id') //
        ]);
        setCategories(catRes.data || []);
        setSubCategories(subCatRes.data || []);
    }
    fetchCatsAndSubCats();
  }, []); // Removed supabase from dependency array as it's stable

  useEffect(() => {
    async function getPaginatedPosts() {
        setLoading(true);
        let query = supabase.from('posts').select('*', { count: 'exact' }); //
        // Filter logic based on selectedValue
        if (selectedValue.startsWith('cat-')) {
            query = query.eq('category_id', parseInt(selectedValue.split('-')[1])); //
        } else if (selectedValue.startsWith('sub-')) {
            query = query.eq('sub_category_id', parseInt(selectedValue.split('-')[1])); //
        }

        const { count, error: countError } = await query;
        if (countError) {
            console.error('Error counting posts:', countError);
            setLoading(false);
            return;
        }

        const calculatedTotalPages = Math.ceil((count || 0) / POSTS_PER_PAGE);
        setTotalPages(calculatedTotalPages);
        // Ensure currentPage is valid
        const validCurrentPage = Math.max(1, Math.min(currentPage, calculatedTotalPages || 1));
        const from = (validCurrentPage - 1) * POSTS_PER_PAGE;
        const to = from + POSTS_PER_PAGE - 1;
        const [sortColumn, sortDirection] = sortBy.split(','); //

        // Fetch the actual post data with filters and sorting
        let dataQuery = supabase
            .from('posts')
            .select('*, like_count, categories(name), sub_categories(name, slug)') //
            .order(sortColumn, { ascending: sortDirection === 'asc' }) //
            .range(from, to); //

        // Re-apply filters
        if (selectedValue.startsWith('cat-')) {
            dataQuery = dataQuery.eq('category_id', parseInt(selectedValue.split('-')[1])); //
        } else if (selectedValue.startsWith('sub-')) {
            dataQuery = dataQuery.eq('sub_category_id', parseInt(selectedValue.split('-')[1])); //
        }

        const { data, error } = await dataQuery;
        if (error) console.error('Error fetching posts:', error);
        setPosts(data || []);
        setLoading(false);
    }
    getPaginatedPosts();
  }, [currentPage, selectedValue, sortBy]); // Added supabase back if client-side actions might change it, though likely stable

  return (
  <div className="container py-12"> {/* */}

    {/* Pradhāna wrapper eka: Mobile valadi center (items-center), Desktop valadi vamaṭa (md:items-start) */}
    <div className="mb-8 flex flex-col items-center gap-4 md:items-start"> {/* */}

      {/* 1. Title eka */}
      <h1 className="text-4xl font-bold">All Articles</h1> {/* */}

      {/* 2. Filter sadaha aluth row eka:
            - Mobile (default): uda yaṭa mārū karala center karayi (`flex-col-reverse items-center`).
            - Desktop (md:): depæththaṭa dāyi (`md:flex-row md:justify-between`).
         */}
      <div className="flex w-full flex-col-reverse items-center gap-4 md:flex-row md:justify-between mt-4"> {/* <-- MĒ PELIYA VENAS KALE */}

        {/* Category Filter eka Vam Pæththē (Desktop), YATA (Mobile) */}
        <CategoryFilter //
            categories={categories} //
            subCategories={subCategories} //
            selectedValue={selectedValue} //
            setSelectedValue={setSelectedValue} //
        />

        {/* Sort Dropdown eka Dakuṇu Pæththē (Desktop), UDA (Mobile) */}
        <SortDropdown //
            value={sortBy} //
            onValueChange={setSortBy} //
            options={[ //
                { value: 'created_at,desc', label: 'Sort by: Latest' }, //
                { value: 'created_at,asc', label: 'Sort by: Oldest' }, //
                { value: 'like_count,desc', label: 'Sort by: Most Liked' } //
            ]}
        />
      </div>
    </div>
    {/* ================================= */}


    {/* ... (Ithiri Kōḍa Koṭas Mē Pahaḷin Thiyēvi - ēvā venas karanna epā) ... */}
    {loading ? ( //
      <p className="text-center text-muted-foreground pt-10">Loading articles...</p> //
    ) : posts.length > 0 ? ( //
        <>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"> {/* */}
            {posts.map((post, index) => ( //
                <AnimatedPostCard key={post.id} post={post} index={index} /> //
            ))}
          </div>
          <Pagination totalPages={totalPages} /> {/* */}

          {/* Ad Banners */}
          <div className="mt-16 pt-12 border-t"> {/* */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* */}
                <AdBanner /> {/* */}
                <AdBanner /> {/* */}
            </div>
          </div>
        </>
    ) : (
        <p className="text-center text-muted-foreground pt-10"> {/* */}
          No articles found. Try a different category or check back later! {/* */}
        </p>
    )}
  </div>
  );
}
