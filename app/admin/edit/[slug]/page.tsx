'use client';

import { useState, useEffect, useTransition, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import slugify from 'slugify';
import type { Post } from '@/lib/types';
import dynamic from 'next/dynamic';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { UploadCloud, LoaderCircle, Image as ImageIcon, X, AlertCircle, PlusCircle, ArrowLeft, Info } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import Link from 'next/link';

// Rich Text Editor (Markdown)
import "easymde/dist/easymde.min.css";
import type { Options } from 'easymde';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

type Category = { id: number; name: string; };
type SubCategory = { id: number; name: string; parent_category_id: number; };

type EditPostPageProps = {
    params: {
        slug: string;
    };
};

export default function EditPostPage({ params }: EditPostPageProps) {
    // === වෙනස් කළ තැන 2: මෙතන supabase client එක හදාගැනීම ===
    const supabase = createClient();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(true);

    // Form state
    const [post, setPost] = useState<Post | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    // Tag Input State
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    
    // New Sub-Category State
    const [newSubCategoryInput, setNewSubCategoryInput] = useState('');

    // Data from Supabase
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);

    const imageUploadFunction = (file: File, onSuccess: (url: string) => void, onError: (error: string) => void) => {
        const handleUpload = async () => {
            if (!file) return;
            const fileName = `${Date.now()}-${slugify(file.name, { lower: true })}`;
            const { error: uploadError } = await supabase.storage.from('post_images').upload(fileName, file);
            if (uploadError) { onError(`Image Upload Failed: ${uploadError.message}`); return; }
            const { data: { publicUrl } } = supabase.storage.from('post_images').getPublicUrl(fileName);
            onSuccess(publicUrl);
        };
        handleUpload();
    };

    const mdeOptions = useMemo((): Options => ({
        autofocus: true,
        spellChecker: false,
        uploadImage: true,
        imageUploadFunction: imageUploadFunction,
        imageAccept: "image/png, image/jpeg, image/gif, image/webp",
        imageMaxSize: 10 * 1024 * 1024,
        toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "image", "table", "|", "preview", "side-by-side", "fullscreen", "|", "guide"],
        imageTexts: { sbInit: "Drop an image here to upload it..." },
    }), [supabase]); // `supabase` client එක dependency එකක් විදිහට මෙතනට දාන්න.

    useEffect(() => {
        async function fetchPostAndCategories() {
            setIsLoading(true);
            const { data: postData } = await supabase
                .from('posts')
                .select('*, tags(name)')
                .eq('slug', params.slug)
                .single();

            if (postData) {
                setPost(postData);
                setTitle(postData.title);
                setContent(postData.content || '');
                setAuthorName(postData.author_name || '');
                setSelectedCategory(String(postData.category_id || ''));
                setSelectedSubCategory(String(postData.sub_category_id || ''));
                setIsFeatured(postData.is_featured || false);
                setImageUrl(postData.image_url || '');
                setImagePreview(postData.image_url || null);
                setTags(postData.tags?.map((t: { name: string }) => t.name) || []);
            }

            const { data: catData } = await supabase.from('categories').select('id, name');
            const { data: subCatData } = await supabase.from('sub_categories').select('id, name, parent_category_id');
            setCategories(catData || []);
            setSubCategories(subCatData || []);
            setIsLoading(false);
        }
        fetchPostAndCategories();
    }, [params.slug, supabase]); // `supabase` client එක dependency එකක් විදිහට මෙතනටත් දාන්න.

    useEffect(() => {
        const categoryId = parseInt(selectedCategory);
        if (categoryId) {
            setFilteredSubCategories(subCategories.filter(sc => sc.parent_category_id === categoryId));
        } else {
            setFilteredSubCategories([]);
        }
    }, [selectedCategory, subCategories]);

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { toast.error("Image size should be less than 10MB."); return; }
            setImageFile(file);
            setImageUrl('');
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ',' || e.key === 'Enter') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !tags.includes(newTag)) setTags([...tags, newTag]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => setTags(tags.filter(tag => tag !== tagToRemove));

    const handleAddNewSubCategory = async () => { /* Logic is correct, no changes needed */ };
    
    const validateForm = () => {
        const errors: { [key: string]: string } = {};
        if (!title.trim()) errors.title = "Title is required.";
        if (!content.trim()) errors.content = "Content cannot be empty.";
        if (!authorName.trim()) errors.authorName = "Author name is required.";
        if (!selectedCategory) errors.category = "Please select a category.";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || !post) { toast.error("Please fill all required fields correctly."); return; }
        
        startTransition(async () => {
            try {
                let finalImageUrl = imageUrl;
                if (imageFile) {
                    const fileName = `${Date.now()}-${slugify(imageFile.name, { lower: true })}`;
                    const { error: uploadError } = await supabase.storage.from('post_images').upload(fileName, imageFile);
                    if (uploadError) throw new Error(`Image Upload Failed: ${uploadError.message}`);
                    const { data: { publicUrl } } = supabase.storage.from('post_images').getPublicUrl(fileName);
                    finalImageUrl = publicUrl;
                }

                const slug = slugify(title, { lower: true, strict: true });
                const { error: postError } = await supabase.from('posts').update({
                    title, slug, content, author_name: authorName,
                    image_url: finalImageUrl || null,
                    category_id: parseInt(selectedCategory),
                    sub_category_id: selectedSubCategory ? parseInt(selectedSubCategory) : null,
                    is_featured: isFeatured,
                }).eq('id', post.id);

                if (postError) throw new Error(`Post Update Failed: ${postError.message}`);
                
                await supabase.from('post_tags').delete().eq('post_id', post.id);
                if (tags.length > 0) {
                    for (const tagName of tags) {
                        const tagSlug = slugify(tagName, { lower: true, strict: true });
                        let { data: tag } = await supabase.from('tags').select('id').eq('slug', tagSlug).single();
                        if (!tag) {
                            const { data: newTag } = await supabase.from('tags').insert({ name: tagName, slug: tagSlug }).select('id').single();
                            tag = newTag;
                        }
                        if (tag) await supabase.from('post_tags').insert({ post_id: post.id, tag_id: tag.id });
                    }
                }
                
                toast.success("Post updated successfully!");
                router.push(`/blog/${slug}`);
                router.refresh();
            } catch (error: any) {
                toast.error(error.message);
            }
        });
    };

    // The rest of the return statement (UI) remains the same.
    // ... (ඔයාගේ පරණ UI code එක මෙතනට දාන්න)
    if (isLoading) {
        return <div className="container flex justify-center items-center h-screen"><LoaderCircle className="h-8 w-8 animate-spin" /></div>
    }

    if (!post) {
         return <div className="container text-center py-20">
            <h1 className="text-2xl font-bold">Post not found</h1>
            <p className="text-muted-foreground">The post you are trying to edit does not exist.</p>
            <Button asChild className="mt-4"><Link href="/blog">Go to Blog</Link></Button>
        </div>
    }

    return (
        <div className="container max-w-6xl py-12">
            <Toaster richColors position="top-right" />
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <Link href={`/blog/${post.slug}`} className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Post
                </Link>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">Edit Post</h1>
                <p className="text-muted-foreground mb-8">Make changes to your article below.</p>
            </motion.div>
            
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                            <Card><CardContent className="p-6 space-y-6">
                                <div className="space-y-1.5">
                                    <Label htmlFor="title" className={formErrors.title ? 'text-destructive' : ''}>Post Title</Label>
                                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isPending} />
                                    {formErrors.title && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle size={14}/>{formErrors.title}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="content" className={formErrors.content ? 'text-destructive' : ''}>Content</Label>
                                    <div className="mt-1 prose dark:prose-invert max-w-none [&_.cm-s-easymde]:border [&_.cm-s-easymde]:rounded-md [&_.editor-toolbar]:rounded-t-md"><SimpleMDE options={mdeOptions} value={content} onChange={setContent} /></div>
                                    {formErrors.content && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle size={14}/>{formErrors.content}</p>}
                                    <div className="mt-4 flex items-start gap-3 rounded-lg border border-sky-200 bg-sky-50 p-3 text-xs text-sky-800 dark:border-sky-800/50 dark:bg-sky-950 dark:text-sky-300">
                                        <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <p>
                                            <strong>Pro Tip:</strong> To add an image to your content, simply drag and drop an image file directly into the text editor above. It will be displayed full-width in the post.
                                        </p>
                                    </div>
                                </div>
                            </CardContent></Card>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                            <Card><CardHeader><CardTitle>Update Details</CardTitle></CardHeader><CardContent className="space-y-6">
                                <div className="space-y-1.5">
                                    <Label htmlFor="author_name" className={formErrors.authorName ? 'text-destructive' : ''}>Author Name</Label>
                                    <Input id="author_name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} required disabled={isPending} />
                                    {formErrors.authorName && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle size={14}/>{formErrors.authorName}</p>}
                                </div>
                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox id="is_featured" checked={isFeatured} onCheckedChange={(checked) => setIsFeatured(!!checked)} disabled={isPending} /><Label htmlFor="is_featured" className="font-medium">Mark as a Featured Post</Label>
                                </div>
                                <Button type="submit" className="w-full font-bold" disabled={isPending || !title || !content}>{isPending ? <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Saving Changes...</> : 'Save Changes'}</Button>
                            </CardContent></Card>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                            <Card><CardHeader><CardTitle>Organization</CardTitle></CardHeader><CardContent className="space-y-6">
                                <div className="space-y-1.5">
                                    <Label className={formErrors.category ? 'text-destructive' : ''}>Category</Label>
                                    <Select 
                                        value={selectedCategory} 
                                        onValueChange={(value) => {
                                            setSelectedCategory(value);
                                            setSelectedSubCategory('');
                                        }} 
                                        disabled={isPending}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                                        <SelectContent>{categories.map(cat => <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                    {formErrors.category && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle size={14}/>{formErrors.category}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Sub-category</Label>
                                    <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory} disabled={isPending || !selectedCategory}>
                                        <SelectTrigger><SelectValue placeholder="Select a sub-category (Optional)" /></SelectTrigger>
                                        <SelectContent>{filteredSubCategories.map(sc => <SelectItem key={sc.id} value={String(sc.id)}>{sc.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Input value={newSubCategoryInput} onChange={(e) => setNewSubCategoryInput(e.target.value)} placeholder="Or create new sub-category" className="h-8 text-xs" disabled={isPending || !selectedCategory} />
                                        <Button type="button" variant="outline" size="icon" className="h-8 w-8 flex-shrink-0" onClick={handleAddNewSubCategory} disabled={isPending || !selectedCategory || !newSubCategoryInput}><PlusCircle size={16} /></Button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="tags">Additional Tags</Label>
                                    <div className="flex flex-wrap items-center gap-2 rounded-md border p-2 mt-1">
                                        {tags.map(tag => (<div key={tag} className="flex items-center gap-1 bg-secondary text-secondary-foreground text-xs font-semibold px-2 py-1 rounded-md">{tag}<button type="button" onClick={() => removeTag(tag)} className="text-muted-foreground hover:text-foreground"><X size={12} /></button></div>))}
                                        <Input id="tags" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} placeholder={tags.length === 0 ? "react, nextjs..." : "Add more..."} className="flex-1 border-0 h-auto p-0 bg-transparent shadow-none focus-visible:ring-0" disabled={isPending} />
                                    </div><p className="text-xs text-muted-foreground mt-1">Separate with a comma or Enter.</p>
                                </div>
                            </CardContent></Card>
                        </motion.div>
                        
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                             <Card><CardHeader><CardTitle>Featured Image</CardTitle></CardHeader><CardContent className="space-y-4">
                                <div className="aspect-video rounded-md border-2 border-dashed flex items-center justify-center bg-muted/50 overflow-hidden">{imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> : <div className="text-center text-muted-foreground"><ImageIcon className="mx-auto h-10 w-10 mb-2" /><p className="text-sm">Image Preview</p></div>}</div>
                                <Input value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setImageFile(null); setImagePreview(e.target.value); }} placeholder="Or paste image URL" disabled={isPending} />
                                <div className="relative text-center"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">OR</span></div></div>
                                <Button asChild variant="outline" className="w-full cursor-pointer"><label htmlFor="image-file"><UploadCloud className="mr-2 h-4 w-4" /> Upload from computer<input id="image-file" type="file" className="sr-only" accept="image/*" onChange={handleImageFileChange} disabled={isPending} /></label></Button>
                            </CardContent></Card>
                        </motion.div>
                    </div>
                </div>
            </form>
        </div>
    );
}