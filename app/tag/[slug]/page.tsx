import { supabase } from '../../../lib/supabaseClient';
import { AnimatedPostCard } from '@/components/AnimatedPostCard';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/BackButton';

type TagPageProps = {
  params: { slug: string };
};

async function getTagData(slug: string) {

    const { data: tag, error: tagError } = await supabase
        .from('tags')
        .select('id, name')
        .eq('slug', slug)
        .single();

    if (tagError || !tag) return { tag: null, posts: [] };

    const { data: postTags, error: postTagsError } = await supabase
        .from('post_tags')
        .select('post_id')
        .eq('tag_id', tag.id);

    if (postTagsError || !postTags) return { tag, posts: [] };

    const postIds = postTags.map(pt => pt.post_id);

    const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*, categories(name), sub_categories(name, slug), profiles(avatar_url, full_name)')
        .in('id', postIds)
        .order('created_at', { ascending: false });

    return { tag, posts: postsError ? [] : posts };
}

export default async function TagPage({ params }: TagPageProps) {
    const { tag, posts } = await getTagData(params.slug);

    if (!tag) notFound();

    return (
        
        <div className="container py-8 md:py-12">
            <div className="mb-4">
    <BackButton />
</div>
            <h1 className="text-4xl font-bold mb-8">
                Posts tagged: <span className="text-primary">#{tag.name}</span>
            </h1>

            {posts && posts.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post, index) => (
                        <AnimatedPostCard key={post.id} post={post} index={index} />
                    ))}
                </div>
            ) : (
                <p>No posts found with this tag yet.</p>
            )}
        </div>
    );
}