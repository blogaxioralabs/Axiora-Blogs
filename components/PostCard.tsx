// components/PostCard.tsx
'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import Image from 'next/image';
import { ArrowRight, UserCircle, CalendarDays, Heart } from 'lucide-react';
import type { Post } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Helper function to get initials from name
const getInitials = (name: string | null | undefined): string => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

// --- IMPROVED EXCERPT FUNCTION (Fixes Markdown Issue) ---
function getPostExcerpt(content: string, length = 100): string {
    if (!content) return '';
    
    const strippedContent = content
        // 1. Remove Markdown formatting symbols
        .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold (**text**) -> text
        .replace(/(\*|_)(.*?)\1/g, '$2')    // Italic (*text*) -> text
        .replace(/~~(.*?)~~/g, '$1')        // Strikethrough (~~text~~) -> text
        .replace(/!\[(.*?)\]\(.*?\)/g, '')  // Remove Images completely
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links [text](url) -> text
        .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // Inline code `code` -> code
        // 2. Remove block level elements
        .replace(/^\s{0,3}(\d+\.\s|[-*+]\s)/gm, '') // List bullets/numbers
        .replace(/^#+\s+/gm, '')            // Headings (# Heading)
        .replace(/>/g, '')                  // Blockquotes (>)
        // 3. Clean up whitespace
        .replace(/(\r\n|\n|\r)/gm, " ")     // Newlines to spaces
        .replace(/\s+/g, ' ')               // Multiple spaces to single space
        .trim();

    if (strippedContent.length <= length) return strippedContent;
    return strippedContent.substring(0, strippedContent.lastIndexOf(' ', length)) + '...';
}
// ---------------------------------------------------------

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function PostCard({ post }: { post: Post }) {
    // Generate clean excerpt
    const excerpt = getPostExcerpt(post.content || '');
    
    // Get author details
    const authorAvatarUrl = post.profiles?.avatar_url;
    const authorDisplayName = post.author_name || post.profiles?.full_name || 'Author';
    const authorId = post.user_id; 
    return (
        <motion.article
            className="bg-card rounded-xl border shadow-sm overflow-hidden h-full flex flex-col group"
            whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.08)" }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <div className="relative">
                {/* Featured Image */}
                <Link href={`/blog/${post.slug}`} className="block aspect-video overflow-hidden">
                    {post.image_url && (
                        <Image
                            src={post.image_url}
                            alt={`${post.title} - Featured image`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    )}
                </Link>

                {/* Author Badge (Top Right) */}
                {(post.author_name || post.profiles) && (
                    <Link 
                        href={authorId ? `/author/${authorId}` : '#'}
                        onClick={(e) => e.stopPropagation()} // Click eka card eke wena than walata yana eka nawaththanawa
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
                {/* Categories & Tags */}
                <div className="flex justify-between items-center mb-2">
                    {post.categories && (
                        <p className="text-xs font-bold text-primary uppercase tracking-wider">
                            {post.categories.name}
                        </p>
                    )}
                    {post.sub_categories && (
                         <Link
                            href={`/sub-category/${post.sub_categories.slug}`}
                            className="text-xs bg-secondary text-secondary-foreground py-1 px-2.5 rounded-full hover:bg-secondary/80 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                         >
                            #{post.sub_categories.name}
                        </Link>
                    )}
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold tracking-tight text-foreground flex-grow mb-2 line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                        {post.title}
                    </Link>
                </h2>

                {/* Clean Excerpt */}
                <p className="text-muted-foreground text-sm mt-auto line-clamp-3">
                    {excerpt}
                </p>

                {/* Footer: Date, Likes, Read More */}
                <div className="flex items-end justify-between text-sm text-muted-foreground mt-4 pt-4 border-t">
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                            <CalendarDays className="h-4 w-4" />
                            <span>{formatDate(post.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Heart className="h-4 w-4" />
                            <span>{post.like_count || 0}</span>
                        </div>
                    </div>
                    <Link href={`/blog/${post.slug}`} passHref>
                        <Button variant="secondary" size="sm" className="h-8 text-xs font-semibold">
                           Read More
                           <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}