import { supabase } from '../../lib/supabaseClient';
import PostCard from '@/components/PostCard';

type SearchPageProps = {
    searchParams: {
        q: string;
    }
}

async function searchPosts(query: string) {
    if (!query) return [];

    const { data, error } = await supabase
        .from('posts')
        .select('*, like_count, categories(name), sub_categories(name, slug)')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`) 
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Search error:", error);
        return [];
    }
    return data;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const query = searchParams.q;
    const posts = await searchPosts(query);

    return (
        <div className="container py-12">
            <h1 className="text-4xl font-bold mb-8">
                Search Results for: <span className="text-primary">{query}</span>
            </h1>
            
            {posts && posts.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted-foreground mt-12">
                    No articles found for "{query}". Try another keyword.
                </p>
            )}
        </div>
    );
}