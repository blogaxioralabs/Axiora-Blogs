'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from './ui/button';
import { HeroSearchbar } from './HeroSearchbar';
import { AnimatedTitle } from './AnimatedTitle';
import { AnimatedSubtitle } from './AnimatedSubtitle';
import { ArrowDown, FlaskConical, Cpu, HardHat, Sigma } from 'lucide-react';

export function HeroSection() {
  const scrollToPosts = () => {
    const postsSection = document.getElementById('latest-posts');
    if (postsSection) {
      postsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* Themed Background with Grid and Center Blur */}
      <div className="absolute inset-0 bg-background -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.4)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_50%,hsl(var(--secondary)),transparent)] opacity-50 dark:opacity-30"></div>
        
        {/* This div creates a smooth fade from the hero background to the page background */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
        
      </div>
      
      <div className="container text-center flex flex-col items-center px-4 z-10">
        
        <AnimatedTitle />
        <AnimatedSubtitle />
        
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 1.2 }}
          className="mt-8 w-full max-w-xl mx-auto"
        >
          <HeroSearchbar />
        </motion.div>

        {/* Category Buttons */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 1.4 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3 md:gap-4"
        >
            <Link href="/category/science" className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors backdrop-blur-sm border-border bg-card/50 hover:bg-accent hover:text-accent-foreground shadow-sm">
                <FlaskConical className="h-4 w-4 text-muted-foreground" />
                Science
            </Link>
            <Link href="/category/technology" className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors backdrop-blur-sm border-border bg-card/50 hover:bg-accent hover:text-accent-foreground shadow-sm">
                <Cpu className="h-4 w-4 text-muted-foreground" />
                Technology
            </Link>
            <Link href="/category/engineering" className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors backdrop-blur-sm border-border bg-card/50 hover:bg-accent hover:text-accent-foreground shadow-sm">
                <HardHat className="h-4 w-4 text-muted-foreground" />
                Engineering
            </Link>
            <Link href="/category/mathematics" className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors backdrop-blur-sm border-border bg-card/50 hover:bg-accent hover:text-accent-foreground shadow-sm">
                <Sigma className="h-4 w-4 text-muted-foreground" />
                Mathematics
            </Link>
        </motion.div>

        {/* Explore Articles Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 1.6 }}
          className="mt-8"
        >
          <Button size="lg" onClick={scrollToPosts} className="bg-foreground text-background shadow-lg hover:bg-foreground/90 dark:bg-background dark:text-foreground dark:hover:bg-background/90">
            Explore Articles
            <ArrowDown className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

      </div>
    </section>
  );
}