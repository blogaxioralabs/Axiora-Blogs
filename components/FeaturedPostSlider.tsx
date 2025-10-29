'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import FeaturedPost from './FeaturedPost';
import type { Post } from '@/lib/types';

export function FeaturedPostSlider({ posts }: { posts: Post[] }) {
  // Setup the autoplay plugin
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true }) // 5-second delay per slide
  );

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {posts.map((post) => (
          <CarouselItem key={post.id}>
            <FeaturedPost post={post} />
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* We can add Prev/Next buttons here later if you want */}
    </Carousel>
  );
}