import { supabase } from '../../../lib/supabaseClient';
import PostCard from '@/components/PostCard';
import { notFound } from 'next/navigation';

type SubCategoryPageProps = {
  params: { slug: string };
};

async function getSubCategoryData(slug: string) {
    const { data: subCategory, error: subCatError } = await supabase
        .from('sub_categories')
        .select('id, name')
        .eq('slug', slug)
        .single();

    if (subCatError || !subCategory) return { subCategory: null, posts: [] };

    const { data: posts, error: postError } = await supabase
        .from('posts')
        .select('*, like_count, categories(name), sub_categories(name, slug)')
        .eq('sub_category_id', subCategory.id)
        .order('created_at', { ascending: false });

    return { subCategory, posts: postError ? [] : posts };
}

export default async function SubCategoryPage({ params }: SubCategoryPageProps) {
    const { subCategory, posts } = await getSubCategoryData(params.slug);

    if (!subCategory) notFound();

    return (
        <div className="container py-12">
            <h1 className="text-4xl font-bold mb-8">
                Tag: <span className="text-primary">#{subCategory.name}</span>
            </h1>

            {posts && posts.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <p>No posts found with this tag yet.</p>
            )}
        </div>
    );
}