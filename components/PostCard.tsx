'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import Image from 'next/image';
import { ArrowRight, UserCircle, CalendarDays, Heart } from 'lucide-react';

interface Post {
    id: number;
    title: string;
    slug: string;
    image_url?: string;
    created_at: string;
    categories?: { name: string };
    sub_categories?: { name: string, slug: string };
    content?: string;
    author_name?: string;
    like_count?: number;
    
}

function getPostExcerpt(content: string, length = 100): string {
    if (!content) return '';
    const strippedContent = content.replace(/(\r\n|\n|\r|#|`|---|\|)/gm, " ").replace(/\s+/g, ' ').trim();
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

export default function PostCard({ post }: { post: Post }) {
    const excerpt = getPostExcerpt(post.content || '');

    return (
        <motion.article
            className="bg-card rounded-xl border shadow-sm overflow-hidden h-full flex flex-col group"
            whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.08)" }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <div className="relative">
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
                {post.author_name && (
                    <div className="absolute top-3 right-3">
                        <span className="flex items-center gap-1.5 bg-background/80 text-foreground text-xs font-semibold py-1 px-2.5 rounded-full backdrop-blur-sm">
                            <UserCircle className="h-4 w-4" />
                            {post.author_name}
                        </span>
                    </div>
                )}
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
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

                <h2 className="text-xl font-bold tracking-tight text-foreground flex-grow mb-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">{post.title}</Link>
                </h2>
                <p className="text-muted-foreground text-sm mt-auto">
                    {excerpt}
                </p>
                
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