// app/category/[slug]/page.tsx
import { supabase } from '../../../lib/supabaseClient';
import { notFound } from 'next/navigation';
import CategoryPageClient from './CategoryPageClient'; // අලුතින් හදපු client component එක import කරන්න
import type { Metadata } from 'next';
import type { Post, Category, SubCategory } from '@/lib/types'; // Types import කරන්න

type CategoryPageProps = {
  params: { slug: string };
};

// Server එකේදි data fetch කරන function එක
async function getCategoryData(slug: string) {
    // 1. Category එක ගන්නවා
    const { data: category, error: catError } = await supabase
        .from('categories')
        .select('id, name, slug') // Slug එකත් ගන්නවා metadata වලට
        .eq('slug', slug)
        .single();

    // Category එක නැත්නම් හෝ error එකක් ආවොත් null return කරනවා
    if (catError || !category) {
        console.error("Category fetch error:", catError);
        return { category: null, posts: [], allSubCategories: [] };
    }

    // 2. අදාළ category එකේ posts ටික ගන්නවා
    const { data: posts, error: postError } = await supabase
        .from('posts')
        .select('*, like_count, categories(name), sub_categories(id, name, slug)') // sub_categories වල id එකත් ගන්නවා filtering වලට
        .eq('category_id', category.id)
        .order('created_at', { ascending: false });

    // 3. **සියලුම** Sub-categories ගන්නවා (Client එකේදි filter කරන්න)
    const { data: allSubCategories, error: subCatError } = await supabase
        .from('sub_categories')
        .select('id, name, parent_category_id');

    // Error handling
    if (postError) console.error("Posts fetch error:", postError);
    if (subCatError) console.error("SubCategories fetch error:", subCatError);

    // Data return කරනවා
    return {
        category,
        posts: (posts || []) as Post[],
        allSubCategories: (allSubCategories || []) as SubCategory[]
    };
}

// ප්‍රධාන Page Component එක
export default async function CategoryPage({ params }: CategoryPageProps) {
    // Server එකේදි data fetch කරගන්නවා
    const { category, posts, allSubCategories } = await getCategoryData(params.slug);

    // Category එක හම්බුනේ නැත්නම් 404 page එක පෙන්නනවා
    if (!category) {
        notFound();
    }

    // Client component එක render කරලා, fetch කරගත්ත data ටික props විදිහට දෙනවා
    return (
      <CategoryPageClient
        category={category as Category} // Type එක හරියට දානවා
        initialPosts={posts}
        allSubCategories={allSubCategories}
      />
    );
}

// Metadata generate කරන function එක
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { category } = await getCategoryData(params.slug); // Slug එකත් fetch වෙන නිසා category එකේ නම ගන්න පුලුවන්

    if (!category) {
      return {
        title: 'Category Not Found',
      };
    }

    return {
      title: `${category.name} Category`,
      description: `Browse articles under the ${category.name} category on Axiora Blogs.`,
       alternates: { // Canonical URL එක එකතු කරනවා SEO වලට
           canonical: `/category/${category.slug}`,
       },
    };
}