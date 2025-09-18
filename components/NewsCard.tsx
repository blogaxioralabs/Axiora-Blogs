'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { CalendarDays, Newspaper, ArrowUpRight } from 'lucide-react';

// Define the type for a single news article
interface NewsArticle {
    source: {
        id: string | null;
        name: string;
    };
    author: string | null;
    title: string;
    description: string;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string;
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export function NewsCard({ article }: { article: NewsArticle }) {
    const fallbackImage = `https://source.unsplash.com/random/800x600?tech,science&${article.title}`;

    return (
        <motion.a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card rounded-xl border shadow-sm overflow-hidden h-full flex flex-col group"
            whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.08)" }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <div className="relative aspect-video overflow-hidden">
                <Image
    src={article.urlToImage || fallbackImage}
    alt={article.title}
    fill
    className="object-cover transition-transform duration-300 group-hover:scale-105"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-primary uppercase tracking-wider">
                    <Newspaper className="h-4 w-4" />
                    <span>{article.source.name}</span>
                </div>

                <h2 className="text-lg font-bold tracking-tight text-foreground flex-grow mb-2">
                    {article.title}
                </h2>

                <p className="text-muted-foreground text-sm mt-auto flex-grow">
                    {article.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-4 border-t">
                    <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3 w-3" />
                        <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary group-hover:underline">
                        Read Full Story
                        <ArrowUpRight className="h-4 w-4" />
                    </div>
                </div>
            </div>
        </motion.a>
    );
}