'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { AnimatedPostCard } from '@/components/AnimatedPostCard';
import { Pagination } from '@/components/Pagination';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SortDropdown } from '@/components/SortDropdown';
import type { Post, Category, SubCategory } from '@/lib/types';

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

  // Sort කිරීම සඳහා අලුත් state එකක්
  const [sortBy, setSortBy] = useState('created_at,desc');

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
  }, []);

  useEffect(() => {
    async function getPaginatedPosts() {
        setLoading(true);

        let query = supabase.from('posts').select('*', { count: 'exact' });

        if (selectedValue.startsWith('cat-')) {
            query = query.eq('category_id', parseInt(selectedValue.split('-')[1]));
        } else if (selectedValue.startsWith('sub-')) {
            query = query.eq('sub_category_id', parseInt(selectedValue.split('-')[1]));
        }

        const { count, error: countError } = await query;
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

        // Sorting logic එක මෙතනට එකතු කරනවා
        const [sortColumn, sortDirection] = sortBy.split(',');

        let dataQuery = supabase
            .from('posts')
            .select('*, like_count, categories(name), sub_categories(name, slug)')
            .order(sortColumn, { ascending: sortDirection === 'asc' }) // Dynamic sorting
            .range(from, to);

        if (selectedValue.startsWith('cat-')) {
            dataQuery = dataQuery.eq('category_id', parseInt(selectedValue.split('-')[1]));
        } else if (selectedValue.startsWith('sub-')) {
            dataQuery = dataQuery.eq('sub_category_id', parseInt(selectedValue.split('-')[1]));
        }

        const { data, error } = await dataQuery;

        if (error) console.error('Error fetching posts:', error);

        setPosts(data || []);
        setLoading(false);
    }

    getPaginatedPosts();
  }, [currentPage, selectedValue, sortBy]);

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-4xl font-bold">All Articles</h1>

        <div className="flex flex-col sm:flex-row items-center gap-4">
            <SortDropdown
                value={sortBy}
                onValueChange={setSortBy}
                options={[
                    { value: 'created_at,desc', label: 'Sort by: Latest' },
                    { value: 'created_at,asc', label: 'Sort by: Oldest' },
                    { value: 'like_count,desc', label: 'Sort by: Most Liked' }
                ]}
            />
            <CategoryFilter
                categories={categories}
                subCategories={subCategories}
                selectedValue={selectedValue}
                setSelectedValue={setSelectedValue}
            />
        </div>
      </div>


      {loading ? (
        <p className="text-center text-muted-foreground pt-10">Loading articles...</p>
      ) : posts.length > 0 ? (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                  <AnimatedPostCard key={post.id} post={post} index={index} />
              ))}
            </div>
            <Pagination totalPages={totalPages} />
          </>
      ) : (
          <p className="text-center text-muted-foreground pt-10">
            No articles found. Try a different category or check back later!
          </p>
      )}
    </div>
  );
}