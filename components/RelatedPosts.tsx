// components/RelatedPosts.tsx
import { supabase } from '@/lib/supabaseClient';
import { AnimatedPostCard } from './AnimatedPostCard';


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

interface RelatedPostsProps {
    currentPostId: number;
}

export async function RelatedPosts({ currentPostId }: RelatedPostsProps) {
    // Corrected the generic signature for the rpc call
    const { data: posts, error } = await supabase.rpc('get_random_posts', {
        limit_count: 3, 
        exclude_id: currentPostId
    });

    if (error || !posts || posts.length === 0) {
        return null;
    }

    return (
        <section className="container py-16 border-t">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-8 text-center">
                You Might Also Like
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {(posts as Post[]).map((post, index) => (
                    <AnimatedPostCard key={post.id} post={post} index={index} />
                ))}
            </div>
        </section>
    );
}