'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin,
  Copy,
  Check,
  Zap, 
  UserCircle 
} from 'lucide-react';
import type { Post, NewsPost } from '@/lib/types';
import { getOptimizedImageUrl } from '@/lib/utils';
import { cn } from '@/lib/utils';

// Custom TikTok Icon
function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

interface HeroSectionProps {
  latestPosts?: Post[];
  latestNews?: NewsPost[];
}

export function HeroSection({ latestPosts = [], latestNews = [] }: HeroSectionProps) {
  const [isCopied, setIsCopied] = useState(false);

  // 1: Center Large, 2: Left Top, 3: Left Bottom
  const mainPost = latestPosts[0];
  const sidePost1 = latestPosts[1];
  const sidePost2 = latestPosts[2];
  const newsPost = latestNews[0];

  // Main post author details
  const mainAuthorName = mainPost?.author_name || mainPost?.profiles?.full_name || 'Axiora Team';
  const mainAuthorAvatar = mainPost?.profiles?.avatar_url;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("https://www.axiorablogs.com");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section className="relative container mx-auto py-8 lg:py-16 max-w-[1400px]">
      
      {/* Subtle Ambient Background Glow for World-Class Feel - ADDED GPU ACCELERATION HERE */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/20 blur-[100px] md:blur-[120px] rounded-full pointer-events-none -z-10 opacity-50 dark:opacity-20 transition-opacity duration-500 transform-gpu will-change-transform" />

      {/* Grid Layout Re-engineered for Mobile Ordering 
        Mobile: 1 Column -> Text, Main Post, Post 2, Post 3, News
        Desktop: 4 Columns, 2 Rows
      */}
      <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 gap-6 h-auto lg:h-[620px]">

        {/* 1. Discover More Text (Mobile: 1st | Desktop: Col 4, Row 1) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="order-1 lg:order-none lg:col-start-4 lg:row-start-1 flex flex-col justify-center px-2 will-change-transform transform-gpu"
        >
          <h3 className="text-xl lg:text-2xl font-bold mb-3 text-foreground dark:text-white">Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">More.</span></h3>
          <p className="text-muted-foreground dark:text-white/70 text-sm leading-relaxed mb-5 font-medium">
            Welcome to Axiora's Blog: A realm of reflection, inspiration, and discovery. Dive into world-class articles covering technology, lifestyle, and everything in between. Stay updated, stay curious.
          </p>
          
          {/* Glassmorphic Social Buttons */}
          <div className="flex flex-wrap gap-2.5">
            <SocialButton icon={<Facebook className="w-4 h-4" />} href="#" />
            <SocialButton icon={<Instagram className="w-4 h-4" />} href="#" />
            <SocialButton icon={<TiktokIcon className="w-4 h-4" />} href="#" />
            <SocialButton icon={<Twitter className="w-4 h-4" />} href="#" />
            <SocialButton icon={<Linkedin className="w-4 h-4" />} href="#" />
            <SocialButton 
              icon={isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />} 
              onClick={handleCopyLink} 
            />
          </div>
        </motion.div>

        {/* 2. Main Center Post (Mobile: 2nd | Desktop: Col 2 & 3, Span 2 Rows) */}
        <div className="order-2 lg:order-none lg:col-start-2 lg:col-span-2 lg:row-start-1 lg:row-span-2 flex flex-col gap-3 h-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 relative min-h-[250px] lg:min-h-0 rounded-[2.5rem] overflow-hidden bg-muted group block shadow-xl hover:shadow-2xl shadow-primary/10 border border-border/40 dark:border-white/10 after:absolute after:inset-0 after:rounded-[2.5rem] after:ring-1 after:ring-inset after:ring-white/10 transition-all duration-500 transform-gpu will-change-transform"
          >
            <Link href={mainPost ? `/blog/${mainPost.slug}` : '#'} className="absolute inset-0 z-20" aria-label={mainPost?.title} />
            
            {mainPost?.image_url ? (
              <>
                <Image
                  src={getOptimizedImageUrl(mainPost.image_url)}
                  alt={mainPost.title || 'Latest Post'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105 transform-gpu will-change-transform"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              </>
            ) : (
               <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground font-medium">Axiora Blogs</div>
            )}

            {mainPost?.categories?.name && (
  <div className="absolute top-5 left-5 md:top-6 md:left-6 z-10 transform-gpu">
    <span className="px-4 py-1.5 rounded-full border border-border/40 bg-background/80 text-foreground text-[11px] md:text-xs font-bold uppercase tracking-widest shadow backdrop-blur-sm">
      {mainPost.categories.name}
    </span>
  </div>
)}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="px-2 md:pr-4 flex flex-col justify-between transform-gpu will-change-transform"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
               <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary fill-primary/20" />
                  <span className="text-sm font-semibold text-primary uppercase tracking-wider">Latest Story</span>
               </div>
               
              <div className="flex items-center gap-2 bg-background/80 text-foreground px-3 py-1.5 rounded-full border border-border/40 backdrop-blur-sm shadow transform-gpu">
  {mainAuthorAvatar ? (
    <Image src={mainAuthorAvatar} alt={mainAuthorName} width={20} height={20} className="rounded-full object-cover w-5 h-5 ring-1 ring-border/50" />
  ) : (
    <UserCircle className="w-5 h-5 text-muted-foreground" />
  )}
  <span className="text-xs font-medium">{mainAuthorName}</span>
</div>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-bold tracking-normal leading-relaxed pb-1 text-foreground/90 dark:text-white/95 line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {mainPost?.title || "Journey Through Life's Spectrum"}
            </h2>

            {/* Read More Button (Replaced Pill Image) */}
            <div className="mt-4">
              <Link href={mainPost ? `/blog/${mainPost.slug}` : '#'}>
                <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-300 shadow-[0_0_15px_rgba(var(--primary),0.2)] hover:shadow-[0_0_25px_rgba(var(--primary),0.4)]">
                  Read More <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* 3. Left Top Post (Mobile: 3rd | Desktop: Col 1, Row 1) */}
        <div className="order-3 lg:order-none lg:col-start-1 lg:row-start-1 h-full">
          <BentoCard post={sidePost1} delay={0.1} />
        </div>

        {/* 4. Left Bottom Post (Mobile: 4th | Desktop: Col 1, Row 2) */}
        <div className="order-4 lg:order-none lg:col-start-1 lg:row-start-2 h-full">
          <BentoCard post={sidePost2} delay={0.2} />
        </div>

        <div className="order-5 lg:order-none lg:col-start-4 lg:row-start-2 h-full mt-4 lg:mt-0 flex flex-col lg:relative">
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    className="flex items-center gap-2 mb-3 pl-2 lg:absolute lg:-top-7 lg:left-0 lg:mb-0"
  >
    <Zap className="w-4 h-4 text-primary fill-primary/20" />
    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Latest News</h3>
  </motion.div>
  
  <div className="flex-1 w-full h-full relative">
    <BentoCard post={newsPost} isNews delay={0.4} />
  </div>
</div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// Reusable Bento Card Component 
// ----------------------------------------------------------------------
function BentoCard({ post, isNews = false, delay = 0 }: { post: any, isNews?: boolean, delay?: number }) {
  if (!post) {
    return <div className="w-full h-full min-h-[250px] rounded-[2rem] bg-muted/30 animate-pulse border border-border/40 transform-gpu" />;
  }

  const link = isNews ? `/news/${post.slug}` : `/blog/${post.slug}`;
  const category = isNews ? post.news_categories?.name : post.categories?.name;
  
  const dateObj = post.published_at || post.created_at;
  const date = dateObj ? new Date(dateObj).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  const authorName = post.author_name || post.profiles?.full_name || 'Axiora Team';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="w-full h-full min-h-[250px] relative rounded-[2.2rem] overflow-hidden group block shadow-lg hover:shadow-xl hover:shadow-primary/10 border border-border/40 dark:border-white/10 bg-card transition-all duration-500 hover:-translate-y-1 after:absolute after:inset-0 after:rounded-[2.2rem] after:ring-1 after:ring-inset after:ring-white/10 transform-gpu will-change-transform"
    >
      <Link href={link} className="absolute inset-0 z-20" aria-label={post.title} />

      {post.image_url ? (
        <Image
          src={getOptimizedImageUrl(post.image_url)}
          alt={post.title}
          fill
          sizes="(max-width: 1024px) 100vw, 25vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110 transform-gpu will-change-transform"
          /* REMOVED priority here to prevent network bottleneck and improve time-to-interactive */
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium">No Image</div>
      )}

      {/* Smooth Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 transition-opacity duration-500 group-hover:opacity-90 transform-gpu" />

      {/* Top Badges */}
      <div className="absolute top-5 left-5 right-5 flex justify-between z-10 pointer-events-none transform-gpu">
  <span className="px-3 py-1.5 rounded-full border border-border/40 bg-background/80 text-foreground text-[10px] font-bold uppercase tracking-wider shadow backdrop-blur-sm">
    {category || (isNews ? 'News' : 'Article')}
  </span>
  <span className="px-3 py-1.5 rounded-full border border-border/40 bg-background/80 text-foreground text-[10px] font-bold tracking-wider shadow backdrop-blur-sm">
    {date}
  </span>
</div>

      {/* Bottom Content (Title & Author) */}
      <div className="absolute bottom-6 left-5 pr-[4.5rem] z-10 pointer-events-none transition-transform duration-500 group-hover:translate-y-[-4px] transform-gpu will-change-transform">
        <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest block mb-1.5">{authorName}</span>
        <h3 className="text-white font-medium text-lg leading-snug line-clamp-3 drop-shadow-lg">{post.title}</h3>
      </div>

      {/* PERFECT SVG Cutout Arrow Button */}
      <div className="absolute bottom-0 right-0 bg-background rounded-tl-[1.8rem] p-2 z-30 transition-transform duration-500 transform-gpu">
        <div className="bg-foreground text-background w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground transform-gpu">
          {/* Arrow rotating effect from / to -> */}
          <ArrowUpRight className="w-5 h-5 transition-transform duration-500 ease-in-out group-hover:rotate-45 transform-gpu" />
        </div>

        {/* Top SVG Corner */}
        <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-full right-0 text-background transition-colors duration-300">
          <path d="M20 20V0C20 11.0457 11.0457 20 0 20H20Z" fill="currentColor" />
        </svg>

        {/* Left SVG Corner */}
        <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 right-full text-background transition-colors duration-300">
          <path d="M20 20V0C20 11.0457 11.0457 20 0 20H20Z" fill="currentColor" />
        </svg>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// Premium Glassmorphic Social Button
// ----------------------------------------------------------------------
interface SocialButtonProps {
  icon: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}

function SocialButton({ icon, href, onClick }: SocialButtonProps) {
  const isButton = onClick !== undefined;
  
  const content = (
    <>
      <span className="relative z-10 transition-colors duration-300 group-hover:text-primary transform-gpu">
        {icon}
      </span>
      <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out transform-gpu will-change-transform" />
    </>
  );

  const className = "relative w-10 h-10 md:w-10 md:h-10 rounded-full border border-border/50 dark:border-white/10 bg-background/50 dark:bg-white/5 backdrop-blur-md flex items-center justify-center text-foreground dark:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 group overflow-hidden transform-gpu will-change-transform";

  if (isButton) {
    return (
      <button onClick={onClick} className={className} aria-label="Copy link">
        {content}
      </button>
    );
  }

  return (
    <Link href={href || '#'} className={className}>
      {content}
    </Link>
  );
}