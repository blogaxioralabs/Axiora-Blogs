'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpRight, UserCircle, CalendarDays, Heart, Eye } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Cloudinary URL Optimization (From your utils)
const CLOUD_NAME = "dnlkjlzzx";
export function getOptimizedImageUrl(url: string | null | undefined): string {
    if (!url) return "/placeholder-image.jpg";
    if (url.includes("res.cloudinary.com")) {
        if (url.includes("f_auto,q_auto")) return url;
        return url.replace("/upload/", "/upload/f_auto,q_auto/");
    }
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/f_auto,q_auto/${url}`;
}

const getInitials = (name: string | null | undefined): string => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

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

export default function NewsCard({ news }: { news: any }) {
    const excerpt = getPostExcerpt(news.content || '');
    
    // Get author details (News uses author_id)
    const authorAvatarUrl = news.profiles?.avatar_url;
    const authorDisplayName = news.author_name || news.profiles?.full_name || 'Axiora News';
    const authorId = news.author_id; 

    return (
        <motion.article
            className="bg-card rounded-xl border shadow-sm overflow-hidden h-full flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.08)" }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <div className="relative">
                {/* Featured Image */}
                <Link href={`/news/${news.slug}`} className="block aspect-video overflow-hidden">
                    {news.image_url && (
                        <Image
                            src={getOptimizedImageUrl(news.image_url)}
                            alt={`${news.title} - Featured image`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    )}
                </Link>

                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-background/80 text-foreground text-xs font-semibold py-1 px-2.5 rounded-full backdrop-blur-sm shadow pointer-events-none z-10">
                    <Eye className="h-3.5 w-3.5" />
                    <span>{news.views || 0}</span>
                </div>

                {/* Author Badge (Top Right) */}
                {(news.author_name || news.profiles) && (
                    <Link 
                        href={authorId ? `/author/${authorId}` : '#'}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-3 right-3 flex items-center gap-2 bg-background/80 text-foreground text-xs font-semibold py-1 pl-1 pr-2.5 rounded-full backdrop-blur-sm shadow hover:bg-background hover:text-primary transition-all z-10"
                    >
                        <Avatar className="h-5 w-5 border">
                            <AvatarImage src={authorAvatarUrl || undefined} alt={authorDisplayName} />
                            <AvatarFallback className="text-[8px] font-semibold">
                                {getInitials(authorDisplayName) || <UserCircle className="h-3 w-3" />}
                            </AvatarFallback>
                        </Avatar>
                        <span className="truncate max-w-[100px]">{authorDisplayName}</span>
                    </Link>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
                {/* Categories */}
                <div className="flex justify-between items-center mb-2">
                    {news.news_categories && (
                        <p className="text-xs font-bold text-primary uppercase tracking-wider">
                            {news.news_categories.name}
                        </p>
                    )}
                    {news.tags && news.tags.length > 0 && (
                         <Link
                            href={`/news?tag=${news.tags[0]}`}
                            className="text-xs bg-secondary text-secondary-foreground py-1 px-2.5 rounded-full hover:bg-secondary/80 transition-colors"
                            onClick={(e) => e.stopPropagation()} 
                         >
                            #{news.tags[0]}
                        </Link>
                    )}
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold tracking-tight text-foreground flex-grow mb-2 line-clamp-2">
                    <Link href={`/news/${news.slug}`} className="hover:text-primary transition-colors">
                        {news.title}
                    </Link>
                </h2>

                {/* Clean Excerpt */}
                <p className="text-muted-foreground text-sm mt-auto line-clamp-3">
                    {excerpt}
                </p>

                {/* Footer: Date, Likes, Read More */}
                <div className="flex items-end justify-between text-sm text-muted-foreground mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                            <CalendarDays className="h-4 w-4" />
                            <span>{formatDate(news.published_at || news.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-md">
                                <Heart className="h-3.5 w-3.5 text-rose-500" />
                                {news.like_count || 0}
                            </span>
                        </div>
                    </div>
                    <Link href={`/news/${news.slug}`} passHref>
                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-300 shadow-sm">
                            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                        </div>
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}