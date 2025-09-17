import { supabase } from '../../../lib/supabaseClient';
import PostCard from '@/components/PostCard';
import { notFound } from 'next/navigation';

type CategoryPageProps = {
  params: { slug: string };
};

async function getCategoryData(slug: string) {
    const { data: category, error: catError } = await supabase
        .from('categories')
        .select('id, name')
        .eq('slug', slug)
        .single();

    if (catError || !category) return { category: null, posts: [] };

    const { data: posts, error: postError } = await supabase
        .from('posts')
        .select('*, like_count, categories(name), sub_categories(name, slug)')
        .eq('category_id', category.id)
        .order('created_at', { ascending: false });

    return { category, posts: postError ? [] : posts };
}


export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category, posts } = await getCategoryData(params.slug);

    if (!category) {
        notFound();
    }

    return (
        <div className="container py-12">
            <h1 className="text-4xl font-bold mb-8">
                Category: <span className="text-primary">{category.name}</span>
            </h1>

            {posts && posts.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <p>No posts found in this category yet.</p>
            )}
        </div>
    );
}

export async function generateMetadata({ params }: CategoryPageProps) {
    const { category } = await getCategoryData(params.slug);
    return { title: category?.name || 'Category' };
}