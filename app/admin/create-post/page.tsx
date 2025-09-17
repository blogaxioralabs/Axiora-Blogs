'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

type Category = { id: number; name: string; };
type SubCategory = { id: number; name: string; parent_category_id: number; };

function createSlug(title: string): string {
    return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

export default function CreatePostPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            const { data: catData } = await supabase.from('categories').select('id, name');
            const { data: subCatData } = await supabase.from('sub_categories').select('id, name, parent_category_id');
            setCategories(catData || []);
            setSubCategories(subCatData || []);
        }
        fetchData();
    }, []);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = parseInt(e.target.value);
        setSelectedCategory(e.target.value);
        if (categoryId) {
            setFilteredSubCategories(subCategories.filter(sc => sc.parent_category_id === categoryId));
        } else {
            setFilteredSubCategories([]);
        }
    };
    
    async function handleSubmit(formData: FormData) {
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const imageUrlFromUrl = formData.get('image_url') as string;
        const imageFile = formData.get('image_file') as File;
        const categoryId = formData.get('category_id') as string;
        const subCategoryId = formData.get('sub_category_id') as string;
        const isFeatured = formData.get('is_featured') === 'on';
        const tagsInput = formData.get('tags') as string;
        const authorName = formData.get('author_name') as string; // Get author name
        
        let finalImageUrl = imageUrlFromUrl;

        if (imageFile && imageFile.size > 0) {
            const fileName = `${Date.now()}-${imageFile.name}`;
            const { error: uploadError } = await supabase.storage.from('post_images').upload(fileName, imageFile);
            if (uploadError) { console.error('Error uploading image:', uploadError); return; }
            const { data: { publicUrl } } = supabase.storage.from('post_images').getPublicUrl(fileName);
            finalImageUrl = publicUrl;
        }

        const slug = createSlug(title);

        const { data: postData, error: postError } = await supabase.from('posts').insert({
            title, slug, content,
            image_url: finalImageUrl,
            category_id: categoryId ? parseInt(categoryId) : null,
            sub_category_id: subCategoryId ? parseInt(subCategoryId) : null,
            is_featured: isFeatured,
            author_name: authorName, // Save author name
        }).select('id').single();

        if (postError) { console.error('Error inserting post:', postError); return; }
        if (!postData) { console.error('Failed to get post ID'); return; }

        const postId = postData.id;

        if (tagsInput) {
            const tagNames = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
            for (const tagName of tagNames) {
                const tagSlug = createSlug(tagName);
                let { data: tag } = await supabase.from('tags').select('id').eq('slug', tagSlug).single();
                if (!tag) {
                    const { data: newTag } = await supabase.from('tags').insert({ name: tagName, slug: tagSlug }).select('id').single();
                    tag = newTag;
                }
                if (tag) {
                    await supabase.from('post_tags').insert({ post_id: postId, tag_id: tag.id });
                }
            }
        }
        
        router.push('/');
        router.refresh();
    }

    return (
        <div className="container max-w-4xl py-12">
            <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
            <form action={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium">Title</label>
                    <input type="text" name="title" id="title" required className="mt-1 p-2 block w-full rounded-md border"/>
                </div>
                
                <div>
                    <label htmlFor="author_name" className="block text-sm font-medium">Author Name</label>
                    <input type="text" name="author_name" id="author_name" placeholder="e.g., Jason Francis" required className="mt-1 p-2 block w-full rounded-md border" />
                </div>
                
                <div>
                    <label htmlFor="content" className="block text-sm font-medium">Content (Markdown supported)</label>
                    <textarea name="content" id="content" rows={15} required className="mt-1 p-2 block w-full rounded-md border"></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="category_id" className="block text-sm font-medium">Category</label>
                        <select name="category_id" id="category_id" onChange={handleCategoryChange} value={selectedCategory} className="mt-1 p-2 block w-full rounded-md border">
                            <option value="">Select a category</option>
                            {categories.map(cat => ( <option key={cat.id} value={cat.id}>{cat.name}</option> ))}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="sub_category_id" className="block text-sm font-medium">Sub Category (Main Tag)</label>
                        <select name="sub_category_id" id="sub_category_id" disabled={!selectedCategory || filteredSubCategories.length === 0} className="mt-1 p-2 block w-full rounded-md border disabled:bg-gray-100">
                            <option value="">Select a sub-category</option>
                            {filteredSubCategories.map(sc => ( <option key={sc.id} value={sc.id}>{sc.name}</option> ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="tags" className="block text-sm font-medium">Additional Tags (comma separated)</label>
                    <input type="text" name="tags" id="tags" placeholder="e.g., React, Next.js, AI" className="mt-1 p-2 block w-full rounded-md border" />
                </div>
                
                 <div className="p-4 border-2 border-dashed rounded-md">
                    <p className="text-center font-medium mb-2">Add Image</p>
                    <input type="file" name="image_file" accept="image/*" className="mt-1 block w-full text-sm"/>
                    <div className="text-center my-2 text-xs">OR</div>
                    <input type="text" name="image_url" placeholder="Image URL (https://...)" className="mt-1 p-2 block w-full rounded-md border text-sm"/>
                </div>
                
                <div className="flex items-center">
                    <input id="is_featured" name="is_featured" type="checkbox" className="h-4 w-4 rounded border-gray-300"/>
                    <label htmlFor="is_featured" className="ml-2 block text-sm">Mark as Featured Post</label>
                </div>
                
                <button type="submit" className="px-4 py-2 rounded-md text-white bg-primary hover:bg-primary/90">
                    Publish Post
                </button>
            </form>
        </div>
    );
}