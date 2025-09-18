import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import type { Post } from '@/lib/types';

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function FeaturedPost({ post }: { post: Post }) {
    if (!post) return null;

    return (
        <Link href={`/blog/${post.slug}`} className="block w-full h-full">
            <article className="relative rounded-xl overflow-hidden group aspect-[4/3] sm:aspect-[2/1] md:aspect-[3/1] bg-card h-full flex flex-col justify-end">
                {/* Background Image */}
                {post.image_url && (
                    <Image
                        src={post.image_url}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority 
                    />
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

                {/* Text Content Box */}
                <div className="relative p-4 sm:p-6 md:p-8 text-white">
                    {post.categories && (
                        <p className="text-sm font-bold uppercase tracking-wider mb-2 text-white/90">
                            {post.categories.name}
                        </p>
                    )}
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                        {post.title}
                    </h2>
                    <div className="flex items-center justify-between text-sm text-white/80 mt-4">
                        <span>{formatDate(post.created_at)}</span>
                        <div className="flex items-center group/readmore">
                           <span className="group-hover/readmore:underline">Read More</span>
                           <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover/readmore:translate-x-1" />
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}