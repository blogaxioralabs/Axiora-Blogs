'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { AnimatedPostCard } from '@/components/AnimatedPostCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { CategoryFilter } from '@/components/CategoryFilter';
import { FeaturedPostSlider } from '@/components/FeaturedPostSlider'; 

// Define types for better code quality
type Post = {
  id: number;
  title: string;
  slug: string;
  image_url?: string;
  created_at: string;
  category_id: number;
  sub_category_id?: number;
  categories?: { name: string };
  sub_categories?: { name: string, slug: string };
  content?: string;
  is_featured: boolean;
};

type Category = {
    id: number;
    name: string;
};

type SubCategory = {
    id: number;
    name: string;
    parent_category_id: number;
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState<string>('all');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [postsRes, catRes, subCatRes] = await Promise.all([
        supabase
          .from('posts')
          .select('*, like_count, categories(name), sub_categories(name, slug)')
          .order('created_at', { ascending: false }),
        supabase.from('categories').select('id, name'),
        supabase.from('sub_categories').select('id, name, parent_category_id')
      ]);

      if (postsRes.error) console.error('Error fetching posts:', postsRes.error);
      if (catRes.error) console.error('Error fetching categories:', catRes.error);
      if (subCatRes.error) console.error('Error fetching sub-categories:', subCatRes.error);

      setPosts(postsRes.data || []);
      setCategories(catRes.data || []);
      setSubCategories(subCatRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Get ALL featured posts for the slider
  const featuredPosts = posts.filter(p => p.is_featured);
  // If no posts are featured, use the 3 latest as a fallback
  if (featuredPosts.length === 0 && posts.length > 0) {
      featuredPosts.push(...posts.slice(0, 3));
  }


  // Filter latest posts, excluding ALL featured posts
  const latestPosts = posts
    .filter(p => !p.is_featured) 
    .filter(p => {
        if (selectedValue === 'all') return true;
        // THIS IS THE NEW LOGIC
        if (selectedValue.startsWith('cat-')) {
            return p.category_id === parseInt(selectedValue.split('-')[1]);
        }
        if (selectedValue.startsWith('sub-')) {
            return p.sub_category_id === parseInt(selectedValue.split('-')[1]);
        }
        return true;
    })
    .slice(0, 12);

  if (loading) {
    return <div className="container py-12 text-center">Loading posts...</div>;
  }

  return (
    <>
      <section className="container pt-12 pb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary-foreground py-2">
          Axiora Blogs
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
          Exploring the frontiers of Science, Technology, Engineering, and Mathematics. Your daily dose of innovation and discovery.
        </p>
      </section>

      <div className="container pb-12 space-y-16 md:space-y-24">
        {featuredPosts.length > 0 && (
          <section>
              <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">Featured Posts</h2>
              <div className="mx-auto"> 
                {/* Use the new slider component */}
                <FeaturedPostSlider posts={featuredPosts} />
              </div>
          </section>
        )}

        <section>
          <div className="flex flex-col items-start gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Latest Posts</h2>
            <CategoryFilter 
                categories={categories}
                subCategories={subCategories}
                selectedValue={selectedValue}
                setSelectedValue={setSelectedValue}
            />
          </div>
          
          {latestPosts.length > 0 ? (
  <>
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {latestPosts.map((post, index) => (
        // Use the new animated component and pass the index
        <AnimatedPostCard key={post.id} post={post} index={index} />
      ))}
                </div>
                 <div className="text-center mt-12">
                    <Link href="/blog">
                        <Button variant="outline">
                            View All Posts <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
              </>
          ) : (
              <p className="text-center text-muted-foreground pt-10">
                No posts found for this category. Try selecting another one!
              </p>
          )}
        </section>
      </div>
    </>
  );
}