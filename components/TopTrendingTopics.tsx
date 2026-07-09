'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { getOptimizedImageUrl } from '@/lib/utils';

// Supabase එකෙන් එන Data format එක හඳුන්වා දීම
export interface TrendingTopic {
  id: number;
  name: string;
  slug: string;
  post_count: number;
  image_url: string | null;
}

interface TopTrendingTopicsProps {
  topics: TrendingTopic[];
}

export function TopTrendingTopics({ topics }: TopTrendingTopicsProps) {
  if (!topics || topics.length === 0) return null;

  return (
    <section className="container mx-auto py-10 max-w-[1400px]">
      <Carousel
        opts={{
          align: 'start',
          loop: false,
        }}
        className="w-full"
      >
        {/* Header and Controls */}
        <div className="flex items-end justify-between mb-8">
          <div>
            {/* Title Size Updated Here */}
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-1">
              Top Trending Topics
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Discover the most discussed sub-categories
            </p>
          </div>
          
          {/* Slider Arrows */}
          <div className="hidden md:flex gap-3 relative">
            <CarouselPrevious className="relative inset-auto translate-y-0 h-11 w-11 border-border/60 bg-background hover:bg-muted shadow-sm" />
            <CarouselNext className="relative inset-auto translate-y-0 h-11 w-11 border-border/60 bg-background hover:bg-muted shadow-sm" />
          </div>
        </div>

        {/* Carousel Items */}
        <CarouselContent className="-ml-4 md:-ml-6">
          {topics.map((topic) => (
            <CarouselItem key={topic.id} className="pl-4 md:pl-6 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
              {/* Dynamic URL: /sub-category/[slug] */}
              <Link href={`/sub-category/${topic.slug}`} className="group flex flex-col items-center text-center">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-sm border border-border/40 bg-secondary">
                  
                  {/* Dynamic Image with Fallback */}
                  {topic.image_url ? (
                    <Image
                      src={getOptimizedImageUrl(topic.image_url)}
                      alt={topic.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-bold uppercase tracking-widest">
                      Axiora
                    </div>
                  )}

                  {/* Subtle dark overlay for better look */}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                
                {/* Dynamic Content */}
                <h3 className="text-[13px] md:text-sm font-extrabold text-foreground group-hover:text-primary transition-colors tracking-wide uppercase line-clamp-1">
                  {topic.name}
                </h3>
                <p className="text-[11px] md:text-xs text-muted-foreground mt-1.5 font-medium">
                  {topic.post_count} Article{topic.post_count > 1 ? 's' : ''}
                </p>

              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}