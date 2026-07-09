'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import FeaturedPost from './FeaturedPost';
import type { Post } from '@/lib/types';

export function FeaturedPostSlider({ posts }: { posts: Post[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  if (!posts || posts.length === 0) return null;

  return (
    <div className="relative w-full group/slider overflow-hidden pb-6">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          loop: true,
          align: "center", // Center the active slide
        }}
      >
        {/* Desktop wala 80% aran anith ewaye bagayak penna hadala thiyenne */}
        <CarouselContent className="-ml-4 md:-ml-8">
          {posts.map((post) => (
            <CarouselItem key={post.id} className="pl-4 md:pl-8 basis-full lg:basis-[80%] transition-all duration-500">
              <FeaturedPost post={post} />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Arrows positioned below the text card on desktop */}
        <div className="hidden lg:flex items-center gap-4 mt-8 ml-8">
          <CarouselPrevious className="relative inset-auto translate-y-0 bg-background hover:bg-muted border shadow-sm h-12 w-12" />
          <CarouselNext className="relative inset-auto translate-y-0 bg-background hover:bg-muted border shadow-sm h-12 w-12" />
        </div>
      </Carousel>
    </div>
  );
}