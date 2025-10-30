'use client';

import { useState } from 'react';
import { AnimatedPostCard } from '@/components/AnimatedPostCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { CategoryFilter } from '@/components/CategoryFilter';
import { FeaturedPostSlider } from '@/components/FeaturedPostSlider';
import { HeroSection } from '@/components/HeroSection';
import { TrendingNews } from '@/components/TrendingNews';
import { NewsCard } from '@/components/NewsCard'; // NewsCard component එක import කරගන්න
import { AdBanner } from '@/components/AdBanner';
import type { Post, Category, SubCategory, NewsArticle } from '@/lib/types';

interface HomePageClientProps {
  initialPosts: Post[];
  initialCategories: Category[];
  initialSubCategories: SubCategory[];
  trendingNews: NewsArticle[];
}

export default function HomePageClient({
    initialPosts,
    initialCategories,
    initialSubCategories,
    trendingNews
}: HomePageClientProps) {
  const [selectedValue, setSelectedValue] = useState<string>('all');

  const featuredPosts = initialPosts.filter(p => p.is_featured);
  if (featuredPosts.length === 0 && initialPosts.length > 0) {
      featuredPosts.push(...initialPosts.slice(0, 3));
  }

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
    .slice(0, 9);

  return (
    <>
      <HeroSection />

      <main className="container pb-12 space-y-16 md:space-y-24">
        
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold tracking-tight mb-8">Featured Posts</h2>
              {featuredPosts.length > 0 && <FeaturedPostSlider posts={featuredPosts} />}
            </div>
            <div className="lg:col-span-1">
              <TrendingNews articles={trendingNews} />
            </div>
          </div>
        </section>

        <section id="latest-posts">
          <div className="flex flex-col items-start gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Latest Posts</h2>
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

        {/* === LATEST NEWS SECTION (අලුතින් එකතු කළ කොටස) === */}
        {trendingNews && trendingNews.length > 0 && (
            <section id="latest-news">
                <div className="flex flex-col items-center gap-2 mb-8 text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Latest News</h2>
                    <p className="text-muted-foreground max-w-xl">
                        Stay updated with the latest stories and breakthroughs from the world of STEM.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {trendingNews.slice(0, 3).map((article, index) => (
                        <NewsCard key={`${article.url}-${index}`} article={article} />
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link href="/news">
                        <Button variant="outline">
                            View All News <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </section>
        )}
        {/* ======================================================= */}

        <section className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AdBanner />
                <AdBanner />
            </div>
        </section>
      </main>
    </>
  );
}