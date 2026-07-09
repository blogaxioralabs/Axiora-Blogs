'use client';

import { useState } from 'react';
import { AnimatedPostCard } from '@/components/AnimatedPostCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { CategoryFilter } from '@/components/CategoryFilter';
import { FeaturedPostSlider } from '@/components/FeaturedPostSlider';
import { HeroSection } from '@/components/HeroSection';
import { StemHighlights } from '@/components/StemHighlights';
import ModernNewsCard from '@/components/ModernNewsCard';
import { NewsletterSection } from '@/components/NewsletterSection';
import { LatestNewsSection } from '@/components/LatestNewsSection';
import { AdBanner } from '@/components/AdBanner';
import type { Post, Category, SubCategory, NewsPost } from '@/lib/types';
import { TopTrendingTopics, type TrendingTopic } from '@/components/TopTrendingTopics';
import { SocialCommunitySection } from '@/components/SocialCommunitySection';
import { TopPicksAndAuthors, type AuthorInfo } from '@/components/TopPicksAndAuthors';

interface HomePageClientProps {
  initialPosts: Post[];
  initialCategories: Category[];
  initialSubCategories: SubCategory[];
  trendingNews: NewsPost[];
  trendingTopics: TrendingTopic[];
  topViewedPosts: Post[];
  authors?: AuthorInfo[];
}

export default function HomePageClient({
  initialPosts,
  initialCategories,
  initialSubCategories,
  trendingNews,
  trendingTopics,
  topViewedPosts,
  authors
}: HomePageClientProps) {
  const [selectedValue, setSelectedValue] = useState<string>('all');

  const featuredPosts = initialPosts.filter(p => p.is_featured);
  if (featuredPosts.length === 0 && initialPosts.length > 0) {
      featuredPosts.push(...initialPosts.slice(0, 3));
  }

  // Filter for the main blog grid
  const latestPosts = initialPosts
    .filter(p => {
        if (selectedValue === 'all') return true;
        if (selectedValue.startsWith('cat-')) {
            return p.category_id === parseInt(selectedValue.split('-')[1]);
        }
        if (selectedValue.startsWith('sub-')) {
            return p.sub_category_id === parseInt(selectedValue.split('-')[1]);
        }
        return true;
    })
    .slice(0, 6);

  return (
    <>
      <HeroSection latestPosts={initialPosts.slice(0, 3)} latestNews={trendingNews} />
      <StemHighlights />
      
      <main className="container pb-12 space-y-16 md:space-y-24 mt-20 md:mt-24">
        
        {/* === FEATURED POSTS SLIDER (Full Width, Sidebar Removed) === */}
        <section>
          <div className="w-full">
            <div className="space-y-1 mb-8">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">Featured Posts</h2>
              <p className="text-muted-foreground text-sm md:text-base">
                Discover our most popular and highly recommended articles curated just for you.
              </p>
            </div>
            {featuredPosts.length > 0 && <FeaturedPostSlider posts={featuredPosts} />}
          </div>
        </section>

        {/* === LATEST NEWS GRID SECTION === */}
        {trendingNews && trendingNews.length > 0 && (
          <LatestNewsSection news={trendingNews} />
        )}

        {/* === TOP TRENDING TOPICS (Latest Posts එකට කලින් දැම්මා) === */}
        {trendingTopics && trendingTopics.length > 0 && (
          <TopTrendingTopics topics={trendingTopics} />
        )}

        {/* === LATEST POSTS GRID === */}
        <section id="latest-posts">
          <div className="flex flex-col items-start gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Latest Posts</h2>
            <CategoryFilter 
                categories={initialCategories} 
                subCategories={initialSubCategories} 
                selectedValue={selectedValue} 
                setSelectedValue={setSelectedValue} 
            />
          </div>

          {latestPosts.length > 0 ? (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {latestPosts.map((post, index) => (
                  <AnimatedPostCard key={post.id} post={post} index={index} />
                ))}
              </div>
              <div className="text-center mt-12">
                  <Link href="/blog">
                      <Button 
            variant="outline" 
            className="rounded-full px-8 h-10 border-2 border-primary/80 dark:border-input text-foreground font-bold shadow-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary"
          >
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

        <TopPicksAndAuthors 
            initialPosts={initialPosts} 
            trendingNews={trendingNews}
            topPosts={topViewedPosts}
            authors={authors || []}
        />

        {/* 5. Ad Banners */}
        <section className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AdBanner />
                <AdBanner />
            </div>
        </section>
        <SocialCommunitySection />
<NewsletterSection />
      </main>
    </>
  );
}