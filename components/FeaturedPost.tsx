import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

// Define the Post type to match the data structure
interface Post {
    id: number;
    title: string;
    slug: string;
    image_url?: string;
    created_at: string;
    categories?: { name: string };
    content?: string;
}

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
        <Link href={`/blog/${post.slug}`} className="block w-full">
            <article className="relative rounded-xl overflow-hidden group aspect-[2/1] md:aspect-[3/1] bg-card">
                {/* Background Image */}
                {post.image_url && (
                    <img
                        src={post.image_url}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 md:p-8">
                    <div className="bg-card/90 dark:bg-card/80 backdrop-blur-sm p-6 rounded-lg max-w-lg">
                        {post.categories && (
                            <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
                                {post.categories.name}
                            </p>
                        )}
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
                            {post.title}
                        </h2>
                        {/* THIS IS THE FIX: Added a flex container for the date and the new button */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                            <span>{formatDate(post.created_at)}</span>
                            <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent">
                                Read More <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}