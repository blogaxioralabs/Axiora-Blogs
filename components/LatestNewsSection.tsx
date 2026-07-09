'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, User, Eye, ArrowRight } from 'lucide-react';
import type { NewsPost } from '@/lib/types';
import { getOptimizedImageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface LatestNewsSectionProps {
  news: NewsPost[];
}

export function LatestNewsSection({ news }: LatestNewsSectionProps) {
  if (!news || news.length === 0) return null;

  // Box 1 for the first news, Box 2, 3, 4 for the remaining ones
  const mainNews = news[0];
  const sideNews = news.slice(1, 4);

  // Safely extract the author's name for the main post (TS Any cast applied to both fields)
  const mainAuthor = (mainNews as any).author_name || (mainNews as any).profiles?.full_name || 'Axiora Team';

  return (
    <section className="container mx-auto pb-8 lg:pb-6 max-w-[1400px]">
      <div className="flex flex-col items-start gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">Latest News</h2>
          <p className="text-muted-foreground text-sm">Stay updated with the latest stories and breakthroughs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* LEFT COLUMN: Main News Card (Number 1) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 xl:col-span-8 flex flex-col"
        >
          <Link href={`/news/${mainNews.slug}`} className="group relative flex-1 w-full min-h-[400px] md:min-h-[500px] rounded-2xl overflow-hidden block shadow-sm border border-border/50">
            {/* Background Image */}
            {mainNews.image_url ? (
              <Image
                src={getOptimizedImageUrl(mainNews.image_url)}
                alt={mainNews.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 65vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-secondary" />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

            {/* Top Badges */}
            <div className="absolute top-5 right-5 flex items-center gap-2 z-10">
              {mainNews.news_categories?.name && (
                <span className="px-4 py-1.5 rounded-full bg-white text-black text-xs font-bold tracking-wide shadow-md">
                  {mainNews.news_categories.name}
                </span>
              )}
              <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> {(mainNews as any).views || 0}
              </span>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-snug mb-4 group-hover:underline decoration-white/70 underline-offset-4 decoration-2">
                {mainNews.title}
              </h3>
              
              <div className="flex flex-wrap items-center gap-4 text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" /> {mainAuthor}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> 
                  {new Date(mainNews.published_at || mainNews.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* RIGHT COLUMN: Side News List (Numbers 2, 3, 4) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5 justify-between">
          {sideNews.map((newsItem, index) => {
            // Safely extract the author's name for each sidebar post (TS Any cast applied to both fields)
            const itemAuthor = (newsItem as any).author_name || (newsItem as any).profiles?.full_name || 'Axiora Team';

            return (
              <motion.div 
                key={newsItem.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="h-full"
              >
                <Link 
                  href={`/news/${newsItem.slug}`}
                  className="group flex flex-row items-center justify-between p-4 bg-card hover:bg-muted/50 border border-border/60 rounded-2xl transition-all duration-300 h-full gap-4 shadow-sm hover:shadow-md animate-in fade-in"
                >
                  {/* Content (Left Side) */}
                  <div className="flex-1 flex flex-col justify-between py-1 h-full min-w-0">
                    <div>
                      <h4 className="text-[15px] md:text-base font-bold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2 text-foreground">
                        {newsItem.title}
                      </h4>
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-3">
                        {newsItem.news_categories?.name || 'News'} • 5 min read
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-semibold uppercase tracking-wide">
                      <span className="truncate text-primary">BY {itemAuthor}</span>
                      <span>•</span>
                      <span className="truncate">
                        {new Date(newsItem.published_at || newsItem.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Image (Right Side) */}
                  <div className="relative w-28 h-28 md:w-32 md:h-32 shrink-0 rounded-xl overflow-hidden shadow-sm">
                    {newsItem.image_url ? (
                      <Image
                        src={getOptimizedImageUrl(newsItem.image_url)}
                        alt={newsItem.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 112px, 128px"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center text-[10px] text-muted-foreground">No Image</div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
        
      </div>
      
      {/* High Visibility View All News Button with Solid Border Theme Matching */}
      <div className="text-center mt-12">
        <Link href="/news">
          <Button 
            variant="outline" 
            className="rounded-full px-8 h-10 border-2 border-primary/80 dark:border-input text-foreground font-bold shadow-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary"
          >
            View All News <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}