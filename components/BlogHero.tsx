// components/BlogHero.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Eye, Heart, CalendarDays, ArrowRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getOptimizedImageUrl } from '@/lib/utils';
import type { Post } from '@/lib/types';

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

export function BlogHero({ post }: { post: Post }) {
    if (!post) return null;

    const excerpt = getPostExcerpt(post.content || '');
    const authorAvatarUrl = post.profiles?.avatar_url;
    const authorDisplayName = post.author_name || post.profiles?.full_name || 'Axiora Team';

    // Tags array එකෙන් හරියටම tags 3ක් වෙන් කර ගැනීම
    const allTags: string[] = [];
    
    if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag: any) => {
            if (typeof tag === 'string') allTags.push(tag);
            else if (tag.name) allTags.push(tag.name);
        });
    } else if (typeof post.tags === 'string') {
        allTags.push(...(post.tags as string).split(',').map(t => t.trim()));
    }

    // Duplicate tags අයින් කරලා හරියටම මුල් 3 විතරක් ගන්නවා
    const displayTags = Array.from(new Set(allTags)).slice(0, 3);
    
    return (
        <section className="mb-8 md:mb-12">
            <Link 
                href={`/blog/${post.slug}`} 
                className="relative block w-full h-[450px] sm:h-[500px] lg:h-[550px] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden group shadow-xl border border-border/20 transition-all duration-500 hover:shadow-primary/20 hover:shadow-2xl"
            >
                
                {/* Background Image */}
                {post.image_url ? (
                    <Image
                        src={getOptimizedImageUrl(post.image_url)}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 100vw"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                        No Image
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/95 via-[#09090b]/40 to-transparent z-10" />

                {/* Top Left - Main Category & Sub Category */}
                <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-wrap items-center gap-2 md:gap-3 z-20">
                    {post.categories?.name && (
                        <span className="bg-white text-black px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-md">
                            {post.categories.name}
                        </span>
                    )}
                    {post.sub_categories?.name && (
                        <span className="bg-white/90 text-black px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-md">
                            {post.sub_categories.name}
                        </span>
                    )}
                </div>

                {/* Main Content Area - Bottom */}
                <div className="absolute bottom-0 left-0 w-full p-5 md:p-8 lg:p-10 z-20 flex flex-col justify-end">
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        
                        {/* Left Side: Title, Content Box, Meta */}
                        <div className="w-full md:w-3/4 lg:w-4/5 flex flex-col">
                            
                            {/* Title */}
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[1.2] mb-4 drop-shadow-lg line-clamp-3">
                                {post.title}
                            </h2>

                            {/* Solid White Content Box */}
                            <div className="bg-white p-3 md:p-4 rounded-xl mb-5 shadow-xl w-full max-w-3xl transform transition-transform duration-300 group-hover:-translate-y-1">
                                <p className="text-xs md:text-sm text-slate-800 line-clamp-1 font-semibold mb-1.5">
                                    {excerpt}
                                </p>
                                <div className="flex items-center text-primary font-bold text-[10px] md:text-xs uppercase tracking-wider">
                                    Read Full Article <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>

                            {/* Meta Info: Author, Date, Likes & Views */}
                            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-white/90 text-xs md:text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6 md:h-8 md:w-8 border border-white/30 shadow-sm">
                                        <AvatarImage src={authorAvatarUrl || undefined} alt={authorDisplayName} />
                                        <AvatarFallback className="text-[10px] text-black">
                                            {getInitials(authorDisplayName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="uppercase tracking-wider font-bold text-[10px] md:text-xs">
                                        {authorDisplayName}
                                    </span>
                                </div>
                                
                                <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white/40" />
                                
                                <div className="flex items-center gap-1.5 text-white/80">
                                    <CalendarDays className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    <span className="uppercase tracking-wider text-[10px] md:text-xs">
                                        {formatDate(post.created_at)}
                                    </span>
                                </div>

                                <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white/40" />

                                <div className="flex items-center gap-1.5 text-rose-300">
                                    <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 fill-rose-300/20" />
                                    <span className="uppercase tracking-wider text-[10px] md:text-xs font-bold">
                                        {post.like_count || 0} Likes
                                    </span>
                                </div>

                                <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white/40" />

                                <div className="flex items-center gap-1.5 text-white/80">
                                    <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    <span className="uppercase tracking-wider text-[10px] md:text-xs font-bold">
                                        {post.view_count || 0} Views
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Tags (දකුණු පැත්තේ යටින්ම 3ක් විතරක් පෙන්වයි) */}
                        {displayTags.length > 0 && (
                            <div className="hidden sm:flex flex-row md:flex-col items-end gap-2 shrink-0 pb-1">
                                {displayTags.map((tag, idx) => (
                                    <span 
                                        key={idx} 
                                        className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1 md:py-1.5 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-right whitespace-nowrap"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    
                </div>
            </Link>
        </section>
    );
}