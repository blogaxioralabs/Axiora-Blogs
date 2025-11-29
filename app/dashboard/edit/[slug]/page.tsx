// app/dashboard/edit/[slug]/page.tsx
'use client';

import { useState, useEffect, useTransition, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import slugify from 'slugify';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { UploadCloud, LoaderCircle, Image as ImageIcon, X, AlertCircle, PlusCircle, ArrowLeft, Info } from 'lucide-react';
import { Toaster, toast } from 'sonner';

// Rich Text Editor (Markdown)
import "easymde/dist/easymde.min.css";
import type { Options } from 'easymde';
import type { User } from '@supabase/supabase-js';
import type { Post } from '@/lib/types';

// Dynamically import SimpleMDE to avoid SSR issues
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

type Category = { id: number; name: string; };
type SubCategory = { id: number; name: string; parent_category_id: number; };

type EditPostPageProps = {
    params: {
        slug: string;
    };
};

interface EditablePost extends Post {
    user_id?: string;
}

export default function EditPostPage({ params }: EditPostPageProps) {
    const supabase = createClient();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Form state
    const [post, setPost] = useState<EditablePost | null>(null);
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
            if (!file || !currentUser) return;
            const fileName = `${currentUser.id}/${Date.now()}-${slugify(file.name, { lower: true })}`;
            const { error: uploadError } = await supabase.storage.from('post_images').upload(fileName, file);
            
            if (uploadError) { 
                onError(`Image Upload Failed: ${uploadError.message}`); 
                return; 
            }
            
            const { data: { publicUrl } } = supabase.storage.from('post_images').getPublicUrl(fileName);
            onSuccess(publicUrl);
        };
        handleUpload();
    };

    // --- ENHANCED EDITOR OPTIONS (Word-like Features) ---
    const mdeOptions = useMemo((): Options => ({
        autofocus: false,
        spellChecker: false,
        uploadImage: true,
        imageUploadFunction: imageUploadFunction,
        imageAccept: "image/png, image/jpeg, image/gif, image/webp",
        imageMaxSize: 10 * 1024 * 1024,
        placeholder: "Edit your article content...",
        minHeight: "400px", // Professional height
        // Full Toolbar Configuration
        toolbar: [
            "bold", "italic", "strikethrough", "heading", "|", 
            "quote", "code", "unordered-list", "ordered-list", "clean-block", "|", 
            "link", "image", "table", "horizontal-rule", "|", 
            "preview", "side-by-side", "fullscreen", "|", 
            "guide"
        ],
        status: ["autosave", "lines", "words", "cursor"],
        imageTexts: { sbInit: "Drop an image here to upload it..." },
    }), [supabase, currentUser]);

    // Fetch Post Data
    useEffect(() => {
        async function fetchPostAndCategories() {
            setIsLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            if (!user) {
                router.push('/login?message=Please log in to edit posts.');
                setIsLoading(false);
                return;
            }

            // Fetch Post Data
            const { data: postData, error: postError } = await supabase
                .from('posts')
                .select('*, tags(name), user_id')
                .eq('slug', params.slug)
                .single();

             if (postError || !postData) {
                 toast.error("Post not found.");
                 router.push('/dashboard');
                 setIsLoading(false);
                 return;
             }

            // Check Ownership
            if (postData.user_id !== user.id) {
                toast.error("Unauthorized to edit this post.");
                router.push('/dashboard');
                setIsLoading(false);
                return;
            }

            // Populate state
            setPost(postData as EditablePost);
            setTitle(postData.title);
            setContent(postData.content || '');
            setAuthorName(postData.author_name || '');
            setSelectedCategory(String(postData.category_id || ''));
            setSelectedSubCategory(postData.sub_category_id ? String(postData.sub_category_id) : 'none');
            setIsFeatured(postData.is_featured || false);
            setImageUrl(postData.image_url || '');
            setImagePreview(postData.image_url || null);
            setTags(postData.tags?.map((t: { name: string }) => t.name) || []);

            // Fetch categories and sub-categories
            const { data: catData } = await supabase.from('categories').select('id, name');
            const { data: subCatData } = await supabase.from('sub_categories').select('id, name, parent_category_id');
            setCategories(catData || []);
            setSubCategories(subCatData || []);

            setIsLoading(false);
        }
        fetchPostAndCategories();
    }, [params.slug, supabase, router]);

    // Filter subcategories when category changes
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
             if (file.size > 10 * 1024 * 1024) { 
                 toast.error("Image size should be less than 10MB."); 
                 return; 
             }
             setImageFile(file);
             setImageUrl('');
             const reader = new FileReader();
             reader.onloadend = () => setImagePreview(reader.result as string);
             reader.readAsDataURL(file);
         } else {
             setImageFile(null);
             setImagePreview(imageUrl || null);
         }
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ',' || e.key === 'Enter') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => setTags(tags.filter(tag => tag !== tagToRemove));

    const handleAddNewSubCategory = async () => {
         const newName = newSubCategoryInput.trim();
         const parentId = parseInt(selectedCategory);
         
         if (!newName || !parentId) { 
             toast.error("Please select a main category and enter a name."); 
             return; 
         }
         
         const parentCategoryName = categories.find(c => c.id === parentId)?.name || 'cat';
         const uniqueSlugString = `${parentCategoryName} ${newName}`;
         const newSlug = slugify(uniqueSlugString, { lower: true, strict: true });
         
         // Check if already exists in loaded data
         const existingSub = subCategories.find(sc => sc.name.toLowerCase() === newName.toLowerCase() && sc.parent_category_id === parentId);
         if (existingSub) { 
             toast.error(`"${newName}" already exists under "${parentCategoryName}".`); 
             setSelectedSubCategory(String(existingSub.id)); 
             setNewSubCategoryInput(''); 
             return; 
         }
         
         const { data, error } = await supabase.from('sub_categories').insert({ name: newName, slug: newSlug, parent_category_id: parentId }).select().single();
         
         if (error) { 
             if (error.code === '23505') { 
                 toast.error(`Slug conflict. Try a slightly different name.`); 
             } else {
                 toast.error(`Failed to add sub-category: ${error.message}`); 
             }
         } else {
             toast.success(`Sub-category "${newName}" added successfully!`);
             const newSubCats = [...subCategories, data];
             setSubCategories(newSubCats);
             setFilteredSubCategories(newSubCats.filter(sc => sc.parent_category_id === parentId));
             setSelectedSubCategory(String(data.id));
             setNewSubCategoryInput('');
         }
    };

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
        if (!validateForm() || !post || !currentUser) { 
            toast.error("Cannot save. Check fields and login status."); 
            return; 
        }

        startTransition(async () => {
            try {
                let finalImageUrl = imageUrl;
                
                // Image Logic: If new file, upload it. If cleared, set to null.
                if (imageFile) {
                    const fileName = `${currentUser.id}/${Date.now()}-${slugify(imageFile.name, { lower: true })}`;
                    const { error: uploadError } = await supabase.storage.from('post_images').upload(fileName, imageFile);
                    
                    if (uploadError) throw new Error(`Upload Failed: ${uploadError.message}`);
                    
                    const { data: urlData } = supabase.storage.from('post_images').getPublicUrl(fileName);
                    finalImageUrl = urlData.publicUrl;
                } else if (!imageUrl && post.image_url) {
                    finalImageUrl = ''; // Image explicitly removed by user clearing URL/File
                }

                // Slug Check: Only change slug if title changed
                let finalSlug = post.slug;
                if (title.trim() !== post.title) {
                     const baseSlug = slugify(title, { lower: true, strict: true });
                     let potentialSlug = baseSlug;
                     let counter = 2;
                     
                     while (true) {
                         // Check uniqueness excluding current post
                         const { data, error } = await supabase
                             .from('posts')
                             .select('slug')
                             .eq('slug', potentialSlug)
                             .not('id', 'eq', post.id)
                             .maybeSingle();
                             
                         if (error && error.code !== 'PGRST116') throw new Error(`Slug check error: ${error.message}`);
                         
                         if (!data) { 
                             finalSlug = potentialSlug; 
                             break; 
                         }
                         potentialSlug = `${baseSlug}-${counter}`;
                         counter++;
                     }
                }

                // Update Post Data
                const { error: postError } = await supabase.from('posts').update({
                    title: title.trim(),
                    slug: finalSlug,
                    content: content,
                    author_name: authorName.trim(),
                    image_url: finalImageUrl || null,
                    category_id: parseInt(selectedCategory),
                    sub_category_id: (selectedSubCategory && selectedSubCategory !== 'none') ? parseInt(selectedSubCategory) : null,
                    is_featured: isFeatured,
                }).eq('id', post.id);

                if (postError) throw new Error(postError.message);

                // Update Tags (Delete old -> Insert new)
                await supabase.from('post_tags').delete().eq('post_id', post.id);
                
                if (tags.length > 0) {
                     const tagUpsertPromises = tags.map(async (tagName) => {
                         const tagSlug = slugify(tagName, { lower: true, strict: true });
                         
                         // Get or Create tag
                         const { data: tag, error: tagError } = await supabase
                             .from('tags')
                             .upsert({ name: tagName, slug: tagSlug }, { onConflict: 'slug' })
                             .select('id')
                             .single();
                             
                         if (tagError) {
                             console.error(`Failed tag upsert: ${tagName}`, tagError);
                             return null;
                         }
                         return { post_id: post.id, tag_id: tag.id };
                     });
                     
                     const postTagLinks = (await Promise.all(tagUpsertPromises)).filter(link => link !== null);
                     
                     if (postTagLinks.length > 0) {
                         const { error: linkError } = await supabase.from('post_tags').insert(postTagLinks);
                         if (linkError) console.error("Error linking tags:", linkError);
                     }
                }

                toast.success("Post updated successfully!");
                router.push(`/blog/${finalSlug}`); // Redirect to updated post
                router.refresh();
            } catch (error: any) {
                console.error("Error saving post:", error);
                toast.error(error.message || "An unexpected error occurred while saving.");
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary" /> 
                <span className="ml-2">Loading post...</span>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold text-destructive">Post Not Found</h1>
                <p className="text-muted-foreground mt-2">You cannot edit this post, or it does not exist.</p>
                <Button asChild className="mt-4"><Link href="/dashboard">Go to Dashboard</Link></Button>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl py-12">
            <Toaster richColors position="top-right" />
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                 <Link href="/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                     <ArrowLeft className="mr-2 h-4 w-4" />
                     Back to Dashboard
                 </Link>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">Edit Post</h1>
                <p className="text-muted-foreground mb-8">Make changes to your article below.</p>
            </motion.div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                            <Card className="border-t-4 border-t-primary shadow-lg"><CardContent className="p-6 space-y-6">
                                {/* Title */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="title" className="text-lg font-semibold">Post Title</Label>
                                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isPending} className="text-lg h-12" />
                                    {formErrors.title && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle size={14}/>{formErrors.title}</p>}
                                </div>
                                {/* Content - Enhanced Editor */}
                                <div className="space-y-2">
                                    <Label htmlFor="content" className="text-lg font-semibold">Article Content</Label>
                                    <div className="prose-editor-wrapper">
                                        <SimpleMDE options={mdeOptions} value={content} onChange={setContent} />
                                    </div>
                                    {formErrors.content && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle size={14}/>{formErrors.content}</p>}
                                    {/* Pro Tip */}
                                    <div className="mt-4 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-foreground/80">
                                        <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
                                        <p>
                                            <strong>Pro Tip:</strong> Use <strong>"Side-by-Side" (F9)</strong> or <strong>"Fullscreen" (F11)</strong> buttons for a better writing experience.
                                        </p>
                                    </div>
                                </div>
                            </CardContent></Card>
                        </motion.div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Publishing Details */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                            <Card><CardHeader><CardTitle>Publishing Details</CardTitle></CardHeader><CardContent className="space-y-6">
                                <div className="space-y-1.5">
                                    <Label htmlFor="author_name">Author Name</Label>
                                    <Input id="author_name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} required disabled={isPending} />
                                    {formErrors.authorName && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle size={14}/>{formErrors.authorName}</p>}
                                </div>
                                <div className="flex items-center space-x-2 border p-3 rounded-md bg-secondary/20">
                                    <Checkbox id="is_featured" checked={isFeatured} onCheckedChange={(checked) => setIsFeatured(!!checked)} disabled={isPending} />
                                    <Label htmlFor="is_featured" className="font-medium cursor-pointer">Featured Post</Label>
                                </div>
                                <Button type="submit" className="w-full font-bold h-12" disabled={isPending}>
                                    {isPending ? <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
                                </Button>
                            </CardContent></Card>
                        </motion.div>

                        {/* Categorization */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                            <Card><CardHeader><CardTitle>Categorization</CardTitle></CardHeader><CardContent className="space-y-6">
                                <div className="space-y-1.5">
                                    <Label>Category</Label>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isPending}>
                                        <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                                        <SelectContent>{categories.map(cat => <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                    {formErrors.category && <p className="text-xs text-destructive mt-1"><AlertCircle size={14}/> {formErrors.category}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Tag (Sub-category)</Label>
                                    <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory} disabled={isPending || !selectedCategory}>
                                        <SelectTrigger><SelectValue placeholder="Select Tag" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            {filteredSubCategories.map(sc => <SelectItem key={sc.id} value={String(sc.id)}>{sc.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                                        <Input value={newSubCategoryInput} onChange={(e) => setNewSubCategoryInput(e.target.value)} placeholder="New tag name" className="h-8 text-xs" disabled={isPending || !selectedCategory} />
                                        <Button type="button" variant="outline" size="icon" className="h-8 w-8 flex-shrink-0" onClick={handleAddNewSubCategory} disabled={isPending || !selectedCategory || !newSubCategoryInput.trim()}><PlusCircle size={16} /></Button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Keywords</Label>
                                    <div className="flex flex-wrap items-center gap-2 rounded-md border p-2 mt-1 min-h-[42px]">
                                        {tags.map(tag => (<div key={tag} className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">{tag}<button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive"><X size={12} /></button></div>))}
                                        <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} placeholder="Add keywords..." className="flex-1 border-0 h-auto p-0 bg-transparent shadow-none focus-visible:ring-0 text-sm" disabled={isPending} />
                                    </div>
                                </div>
                            </CardContent></Card>
                        </motion.div>

                        {/* Featured Image */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                             <Card><CardHeader><CardTitle>Featured Image</CardTitle></CardHeader><CardContent className="space-y-4">
                                <div className="aspect-video rounded-md border-2 border-dashed flex items-center justify-center bg-muted/50 overflow-hidden relative group">
                                     {imagePreview ? (
                                         <>
                                             <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                             <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {setImageUrl(''); setImageFile(null); setImagePreview(null);}} type="button"><X size={14} /></Button>
                                         </>
                                      ) : <div className="text-center text-muted-foreground"><ImageIcon className="mx-auto h-10 w-10 mb-2 opacity-50" /><p className="text-sm">No Image</p></div>}
                                 </div>
                                <Input value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setImageFile(null); setImagePreview(e.target.value || null); }} placeholder="Paste image URL..." disabled={isPending} />
                                <div className="relative text-center"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">OR</span></div></div>
                                <Button asChild variant="outline" className="w-full cursor-pointer border-dashed"><label htmlFor="image-file"><UploadCloud className="mr-2 h-4 w-4" /> Upload from Device<input id="image-file" type="file" className="sr-only" accept="image/*" onChange={handleImageFileChange} disabled={isPending} /></label></Button>
                            </CardContent></Card>
                        </motion.div>
                    </div>
                </div>
            </form>
        </div>
    );
}