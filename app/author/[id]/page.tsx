import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, User, Newspaper } from 'lucide-react';
import type { Post } from '@/lib/types';
import { Metadata } from 'next';

// 1. Generate Metadata for SEO (Browser Tab Name)
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', params.id)
    .single();

  return {
    title: profile?.full_name ? `${profile.full_name} - Author Profile` : 'Author Profile',
    description: `Read all articles written by ${profile?.full_name || 'this author'} on Axiora Blogs.`,
  };
}

// 2. Main Page Component
export default async function AuthorPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const authorId = params.id;

  // --- Step A: Fetch Author Profile ---
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authorId)
    .single();

  if (profileError || !profile) {
    notFound(); // 404 page ekata yawanawa author natham
  }

  // --- Step B: Fetch Posts by this Author ---
  // Methana join use karanne na, kelinma author ID eken posts filter karanawa (Safe & Fast)
  const { data: postsData, error: postsError } = await supabase
    .from('posts')
    .select('*, categories(name), sub_categories(name)')
    .eq('user_id', authorId)
    .order('created_at', { ascending: false });

  if (postsError) {
    console.error("Error fetching author posts:", postsError);
    return <div className="container py-20 text-center">Error loading posts.</div>;
  }

  // Posts walata author profile eka manually set karanawa (PostCard eka wada karanna)
  const postsWithAuthor = (postsData as any[])?.map((post) => ({
    ...post,
    profiles: profile, // Me author ge details ma thama
  })) as Post[];

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Author Hero Section (Lassana Header eka) */}
      <div className="relative bg-muted/30 border-b border-border/50">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="container relative py-16 md:py-24 flex flex-col items-center text-center space-y-6">
            
            {/* Back Button */}
            <div className="absolute top-6 left-6 md:top-10 md:left-10">
                <Button variant="ghost" asChild className="gap-2 text-muted-foreground hover:text-primary">
                    <Link href="/"><ArrowLeft className="w-4 h-4" /> Back to Home</Link>
                </Button>
            </div>

            {/* Avatar with Ring Animation */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-background overflow-hidden shadow-xl">
                    {profile.avatar_url ? (
                        <Image 
                            src={profile.avatar_url} 
                            alt={profile.full_name || 'Author'} 
                            fill 
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                            <User className="h-16 w-16 text-muted-foreground" />
                        </div>
                    )}
                </div>
            </div>

            {/* Author Info */}
            <div className="space-y-2 max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    {profile.full_name || 'Unknown Author'}
                </h1>
                <p className="text-muted-foreground text-lg">
                   Content Creator at Axiora Blogs
                </p>
                
                {/* Stats (Optional) */}
                <div className="flex items-center justify-center gap-6 pt-4 text-sm font-medium">
                    <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full border">
                        <Newspaper className="w-4 h-4 text-primary" />
                        <span>{postsWithAuthor.length} Articles Published</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 2. Posts Grid Section (Updated for 3-Column Layout) */}
      <div className="container py-12 md:py-16">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            Latest from {profile.full_name?.split(' ')[0]}
            <span className="text-muted-foreground text-base font-normal">
                ({postsWithAuthor.length} posts)
            </span>
        </h2>

        {postsWithAuthor.length > 0 ? (
          // --- UPDATED GRID CLASS ---
          // grid-cols-1: Mobile (1 column)
          // md:grid-cols-2: Tablet (2 columns)
          // lg:grid-cols-3: Desktop (3 columns) -> Matches Home/Blog pages
          // gap-8: Matches Home/Blog pages spacing
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {postsWithAuthor.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          // ---------------------------
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border">
            <h3 className="text-lg font-medium text-muted-foreground">No posts found</h3>
            <p className="text-sm text-muted-foreground/80 mt-1">
                This author hasn't published any articles yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}