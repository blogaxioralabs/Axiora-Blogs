'use client';

import { useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Autoplay from 'embla-carousel-autoplay';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserCircle, CalendarDays, Heart, Eye, ArrowUpRight, ArrowRight } from 'lucide-react';
import { getOptimizedImageUrl } from "@/lib/utils";
import type { Post, NewsPost } from '@/lib/types';

export interface AuthorInfo {
    id: string;
    name: string;
    avatar: string | null;
}

interface TopPicksAndAuthorsProps {
    initialPosts: Post[];
    trendingNews: NewsPost[];
    authors?: AuthorInfo[];
    topPosts?: Post[];  // pre-sorted by view_count from DB (real most popular)
}

// Helper function to get initials from name
const getInitials = (name: string | null | undefined): string => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

// --- IMPROVED EXCERPT FUNCTION (Fixes Markdown Issue) ---
function getPostExcerpt(content: string, length = 100): string {
    if (!content) return '';
    
    const strippedContent = content
        // 1. Remove HTML tags (TipTap එකෙන් එන අලුත් දේවල් මකන්න)
        .replace(/<[^>]*>?/gm, '') 
        // 2. Remove Markdown formatting symbols (පරණ පෝස්ට් වල දේවල් මකන්න)
        .replace(/(\*\*|__)(.*?)\1/g, '$2') 
        .replace(/(\*|_)(.*?)\1/g, '$2')    
        .replace(/~~(.*?)~~/g, '$1')        
        .replace(/!\[(.*?)\]\(.*?\)/g, '')  
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') 
        .replace(/`{1,3}(.*?)`{1,3}/g, '$1') 
        // 3. Remove block level elements
        .replace(/^\s{0,3}(\d+\.\s|[-*+]\s)/gm, '') 
        .replace(/^#+\s+/gm, '')            
        .replace(/>/g, '')                  
        // 4. Clean up whitespace
        .replace(/(\r\n|\n|\r)/gm, " ")     
        .replace(/\s+/g, ' ')               
        .trim();

    if (strippedContent.length <= length) return strippedContent;
    return strippedContent.substring(0, strippedContent.lastIndexOf(' ', length)) + '...';
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

// --- UNIFIED CARD COMPONENT FOR BOTH BLOG & NEWS ---
function TopArticleCard({ item, type }: { item: any, type: 'blog' | 'news' }) {
    const isBlog = type === 'blog';
    const basePath = isBlog ? 'blog' : 'news';
    
    // Extract common data safely
    const title = item.title;
    const slug = item.slug;
    const content = item.content || '';
    const imageUrl = item.image_url;
    const viewCount = isBlog ? (item.view_count || 0) : (item.views || 0);
    const likeCount = item.like_count || 0;
    const date = item.published_at || item.created_at;
    
    // Author Details
    const authorName = item.author_name || item.profiles?.full_name || (isBlog ? 'Author' : 'Axiora News');
    const authorAvatarUrl = item.profiles?.avatar_url;
    const authorId = isBlog ? item.user_id : item.author_id;

    // Categories
    const categoryName = isBlog ? item.categories?.name : item.news_categories?.name;
    const subCategoryName = isBlog ? item.sub_categories?.name : null;
    const subCategorySlug = isBlog ? item.sub_categories?.slug : null;
    const newsTag = !isBlog && item.tags && item.tags.length > 0 ? item.tags[0] : null;

    const excerpt = getPostExcerpt(content);

    return (
        <article className="bg-card rounded-xl border shadow-sm overflow-hidden h-full flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="relative">
                {/* Featured Image */}
                <Link href={`/${basePath}/${slug}`} className="block aspect-video overflow-hidden">
                    {imageUrl ? (
                        <Image
                            src={getOptimizedImageUrl(imageUrl) || imageUrl}
                            alt={`${title} - Featured image`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 20vw, 20vw"
                        />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium">No Image</div>
                    )}
                </Link>

                {/* View Count Badge (Top Left) */}
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-background/80 text-foreground text-[10px] sm:text-xs font-semibold py-1 px-2 rounded-full backdrop-blur-sm shadow pointer-events-none z-10">
                    <Eye className="h-3 w-3" />
                    <span>{viewCount}</span>
                </div>

                {/* Author Badge (Top Right) */}
                {(authorName || item.profiles) && (
                    <Link 
                        href={authorId ? `/author/${authorId}` : '#'}
                        onClick={(e) => e.stopPropagation()} 
                        className="absolute top-2 right-2 flex items-center gap-1.5 bg-background/80 text-foreground text-[10px] sm:text-xs font-semibold py-1 pl-1 pr-2 rounded-full backdrop-blur-sm shadow hover:bg-background hover:text-primary transition-all z-10"
                    >
                        <Avatar className="h-4 w-4 sm:h-5 sm:w-5 border">
                            <AvatarImage src={authorAvatarUrl || undefined} alt={authorName} />
                            <AvatarFallback className="text-[8px] font-semibold">
                                {getInitials(authorName) || <UserCircle className="h-3 w-3" />}
                            </AvatarFallback>
                        </Avatar>
                        <span className="truncate max-w-[60px] sm:max-w-[80px]">{authorName}</span>
                    </Link>
                )}
            </div>

            <div className="p-4 sm:p-5 flex flex-col flex-grow">
                {/* Categories & Tags */}
                <div className="flex items-start justify-between gap-2 mb-3 w-full">
                    <div className="flex-shrink-0">
                        {categoryName && (
                            <span className="text-[10px] sm:text-[11px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-1 rounded-md">
                                {categoryName}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-1.5 ml-auto">
                        {subCategoryName && (
                             <Link
                                href={`/sub-category/${subCategorySlug}`}
                                className="text-[10px] sm:text-[11px] font-medium bg-secondary text-secondary-foreground py-0.5 px-2.5 rounded-full hover:bg-secondary/80 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                             >
                                #{subCategoryName}
                            </Link>
                        )}
                        {newsTag && (
                            <Link
                                href={`/news?tag=${newsTag}`}
                                className="text-[10px] sm:text-[11px] font-medium bg-secondary text-secondary-foreground py-0.5 px-2.5 rounded-full hover:bg-secondary/80 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                             >
                                #{newsTag}
                            </Link>
                        )}
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-foreground mb-2 line-clamp-2 leading-snug">
                    <Link href={`/${basePath}/${slug}`} className="hover:text-primary transition-colors">
                        {title}
                    </Link>
                </h2>

                {/* Clean Excerpt */}
                <p className="text-muted-foreground text-[11px] sm:text-xs line-clamp-2 sm:line-clamp-3 leading-relaxed mb-4">
                    {excerpt}
                </p>

                {/* Footer: Date, Likes, Read More */}
                <div className="mt-auto pt-3 sm:pt-4 border-t border-border/50 flex items-center justify-between text-[11px] sm:text-xs text-muted-foreground w-full">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" />
                            <span className="font-medium whitespace-nowrap">{formatDate(date)}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="flex items-center gap-1.5 bg-muted/60 px-2 py-1 rounded-md font-medium">
                                <Heart className="h-3.5 w-3.5 text-rose-500" />
                                {likeCount}
                            </span>
                        </div>
                    </div>
                    <Link href={`/${basePath}/${slug}`} passHref>
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm shrink-0 group-hover:scale-110">
                            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                        </div>
                    </Link>
                </div>
            </div>
        </article>
    );
}

// --- MAIN SECTION EXPORT ---
export function TopPicksAndAuthors({ initialPosts, trendingNews, authors = [], topPosts }: TopPicksAndAuthorsProps) {
    
    // 1. Get Sorted Blogs — use DB-sorted topPosts if provided, else sort client-side
    const topBlogs = useMemo(() => {
        if (topPosts && topPosts.length > 0) return topPosts;
        if (!initialPosts || initialPosts.length === 0) return [];
        return [...initialPosts].sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    }, [initialPosts, topPosts]);

    // 2. Get Sorted News
    const topNews = useMemo(() => {
        if (!trendingNews || trendingNews.length === 0) return [];
        return [...trendingNews].sort((a, b) => (b.views || 0) - (a.views || 0));
    }, [trendingNews]);

    // 3. Prepare the 4 Cards (2 Blogs, 2 News) with Fallbacks
    const card1 = topBlogs[0] || null;
    const type1 = 'blog';

    const card2 = topBlogs[1] || null;
    const type2 = 'blog';

    // If news 1 exists, use it. Otherwise, fallback to 3rd blog
    const card3 = topNews[0] || topBlogs[2] || null;
    const type3 = topNews[0] ? 'news' : 'blog';

    // If news 2 exists, use it. Otherwise, fallback to 4th blog
    const card4 = topNews[1] || topBlogs[3] || null;
    const type4 = topNews[1] ? 'news' : 'blog';

    const renderItems = [
        { item: card1, type: type1 },
        { item: card2, type: type2 },
        { item: card3, type: type3 },
        { item: card4, type: type4 },
    ].filter(obj => obj.item !== null);

    // 4. Authors: use prop if provided, otherwise extract from posts (sub-ms on client)
    const displayAuthors = useMemo(() => {
        if (authors.length > 0) return authors;
        const uniqueAuthors = new Map();
        initialPosts.forEach(post => {
            if (post.user_id && post.profiles?.full_name) {
                if (!uniqueAuthors.has(post.user_id)) {
                    uniqueAuthors.set(post.user_id, {
                        id: post.user_id,
                        name: post.profiles.full_name,
                        avatar: post.profiles.avatar_url
                    });
                }
            }
        });
        return Array.from(uniqueAuthors.values());
    }, [initialPosts, authors]);

    const plugin = useRef(Autoplay({ delay: 3500, stopOnInteraction: true }));

    if (renderItems.length === 0) return null;

    // We store the buttons here so we can reuse them for both mobile and desktop locations easily
    const ActionButtons = (
        <>
            <Link href="/blog">
                <Button 
                    variant="outline" 
                    className="rounded-full px-8 h-10 border-2 border-primary/80 dark:border-input text-foreground font-bold shadow-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                >
                    View All Blogs <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
            <Link href="/news">
                <Button 
                    variant="outline" 
                    className="rounded-full px-8 h-10 border-2 border-primary/80 dark:border-input text-foreground font-bold shadow-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                >
                    View All News <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
        </>
    );

    return (
        <section className="w-full mt-12 mb-8">
            <div className="flex items-center gap-2 mb-6">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                    Top Articles
                </h2>
            </div>
            <p className="text-muted-foreground text-sm md:text-base mb-8">
                Discover The Most Outstanding Articles In All Topics Of Life.
            </p>

            {/* 5 COLUMNS GRID ON DESKTOP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 items-stretch">
                
                {/* Render the 4 Article Cards */}
                {renderItems.map((obj, idx) => (
                    <motion.div 
                        key={`${obj.type}-${obj.item.id}-${idx}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="h-full"
                    >
                        <TopArticleCard item={obj.item} type={obj.type as 'blog' | 'news'} />
                    </motion.div>
                ))}

                {/* MOBILE BUTTONS: Visible ONLY on smaller screens (placed between Articles and Authors card) */}
                <div className="col-span-full flex lg:hidden flex-wrap items-center justify-center gap-4 mt-6 mb-4 sm:mt-8 sm:mb-6">
                    {ActionButtons}
                </div>

                {/* Column 5: Authors Slide Show Card (New Sketch Design) */}
                {displayAuthors.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="h-full"
                    >
                        <div className="bg-card rounded-xl border shadow-sm overflow-hidden h-full flex flex-col relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                            
                            <Carousel
                                plugins={[plugin.current]}
                                className="w-full flex-grow flex flex-col"
                                onMouseEnter={plugin.current.stop}
                                onMouseLeave={plugin.current.reset}
                                opts={{ loop: true }}
                            >
                                <CarouselContent className="ml-0 flex-grow">
                                    {displayAuthors.map((author) => (
                                        <CarouselItem key={author.id} className="pl-0 basis-full flex flex-col items-center justify-start h-full">
                                            
                                            {/* Banner Area */}
                                            <div className="h-28 w-full bg-secondary/40 flex items-start justify-center pt-5 border-b border-border/50 shrink-0">
                                                <span className="text-xs font-extrabold uppercase tracking-widest text-foreground">
                                                    AUTHORS AT AXIORA
                                                </span>
                                            </div>

                                            {/* Profile Pic */}
                                            <div className="relative -mt-14 mb-4 z-10 flex justify-center w-full">
                                                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-background shadow-md bg-background">
                                                    <AvatarImage src={author.avatar || undefined} className="object-cover" />
                                                    <AvatarFallback className="text-xl font-bold">
                                                        {getInitials(author.name) || <UserCircle className="h-10 w-10" />}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            
                                            {/* Details */}
                                            <h3 className="text-base sm:text-lg font-bold text-foreground text-center line-clamp-1 px-4 mb-2">
                                                {author.name}
                                            </h3>
                                            
                                            <Link href={`/author/${author.id}`} className="mt-auto mb-6 flex justify-center w-full">
                                                <Button variant="default" className="w-auto px-8 rounded-full text-xs sm:text-sm h-9 bg-[#0f172a] text-white hover:bg-[#1e293b] shadow-sm transition-transform hover:scale-105">
                                                    View Profile
                                                </Button>
                                            </Link>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>

                                {/* Custom Navigation < . . . > */}
                                <div className="flex items-center justify-center gap-4 pb-4 pt-2 bg-card shrink-0">
                                    <CarouselPrevious className="relative inset-auto translate-y-0 h-8 w-8 border border-border/50 hover:bg-primary/10 hover:text-primary transition-colors bg-transparent shadow-none" />
                                    <div className="flex gap-1.5 items-center justify-center">
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary/30"></span>
                                        <span className="h-2 w-2 rounded-full bg-primary/80"></span>
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary/30"></span>
                                    </div>
                                    <CarouselNext className="relative inset-auto translate-y-0 h-8 w-8 border border-border/50 hover:bg-primary/10 hover:text-primary transition-colors bg-transparent shadow-none" />
                                </div>
                            </Carousel>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* DESKTOP BUTTONS: Hidden on mobile, visible on lg screens and up (placed below the grid) */}
            <div className="hidden lg:flex flex-wrap items-center justify-center gap-4 mt-12">
                {ActionButtons}
            </div>
        </section>
    );
}