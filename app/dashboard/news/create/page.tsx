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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { UploadCloud, LoaderCircle, Image as ImageIcon, X, AlertCircle, Info, ArrowLeft, PlusCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';

import type { SupabaseClient, User } from '@supabase/supabase-js';

const TipTapEditor = dynamic(() => import('@/components/TipTapEditor'), { ssr: false });

const CLOUD_NAME = "dnlkjlzzx"; 
const UPLOAD_PRESET = "my_blog_uploads";

type NewsCategory = { id: number; name: string; slug: string; };

const createUniqueSlug = async (title: string, supabase: SupabaseClient): Promise<string> => {
    const baseSlug = slugify(title, { lower: true, strict: true });
    let finalSlug = baseSlug;
    let counter = 2;

    while (true) {
        const { data, error } = await supabase.from('news_posts').select('slug').eq('slug', finalSlug).maybeSingle();
        if (error && error.code !== 'PGRST116') throw new Error(`Error checking slug: ${error.message}`);
        if (!data) return finalSlug;
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
    }
};

export default function CreateNewsPage() {
    const supabase = createClient();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [newCategoryInput, setNewCategoryInput] = useState(''); 
    
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    // Tag Input State
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    
    // Data from Supabase
    const [categories, setCategories] = useState<NewsCategory[]>([]);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setCurrentUser(user);
                if (!authorName && user.user_metadata?.full_name) {
                    setAuthorName(user.user_metadata.full_name);
                }
            } else {
                 router.push('/login?message=Please log in.');
            }
        };
        getUser();

        const fetchCategories = async () => {
            const { data } = await supabase.from('news_categories').select('id, name, slug');
            setCategories(data || []);
        };
        fetchCategories();
    }, [supabase, router, authorName]);

    // === අලුත් Category එකක් Database එකට දාන Function එක ===
    const handleAddNewCategory = async () => {
        const newName = newCategoryInput.trim();
        if (!newName) { 
            toast.error("Please enter a category name."); 
            return; 
        }

        const slug = slugify(newName, { lower: true, strict: true });
        
        // බලනවා මේ නමින් එකක් දැනටමත් තියෙනවද කියලා
        const existing = categories.find(c => c.slug === slug);
        if (existing) {
            toast.error("This category already exists!");
            setSelectedCategory(String(existing.id));
            setNewCategoryInput('');
            return;
        }

        const { data, error } = await supabase
            .from('news_categories')
            .insert({ name: newName, slug: slug })
            .select()
            .single();

        if (error) {
            toast.error(`Failed to add category: ${error.message}`);
        } else {
            toast.success(`Category "${newName}" added successfully!`);
            setCategories([...categories, data]);
            setSelectedCategory(String(data.id));
            setNewCategoryInput('');
        }
    };

    const uploadImageToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
        if (!response.ok) throw new Error("Image upload failed.");
        const data = await response.json();
        return data.secure_url;
    };

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { toast.error("Image size should be less than 10MB."); return; }
            setImageFile(file); 
            setImageUrl('');
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        } else { 
            setImageFile(null); 
            setImagePreview(null); 
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

    const validateForm = () => {
        const errors: { [key: string]: string } = {};
        if (!title.trim()) errors.title = "Headline is required.";
        if (!content.trim()) errors.content = "Content cannot be empty.";
        if (!authorName.trim()) errors.authorName = "Reporter name is required.";
        if (!selectedCategory) errors.category = "Please select a category.";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) { toast.error("Authentication error. Please log in again."); return; }
        if (!validateForm()) { toast.error("Please fill all required fields correctly."); return; }

        startTransition(async () => {
            try {
                const slug = await createUniqueSlug(title, supabase);
                let finalImageUrl = imageUrl;
                
                if (imageFile) {
                    try {
                        finalImageUrl = await uploadImageToCloudinary(imageFile);
                    } catch (uploadError: any) {
                         throw new Error(`Image Upload Failed: ${uploadError.message}`);
                    }
                }

                const { error: postError } = await supabase.from('news_posts').insert({
                    author_id: currentUser.id,
                    author_name: authorName.trim(),
                    title: title.trim(),
                    slug: slug,
                    content: content,
                    image_url: finalImageUrl || null,
                    category_id: parseInt(selectedCategory),
                    tags: tags,
                    status: 'published'
                });

                if (postError) throw new Error(postError.message);

                toast.success("News published successfully!");
                router.push(`/news/${slug}`);
                router.refresh();
            } catch (error: any) {
                console.error("Error during news submission:", error);
                toast.error(error.message || "An unexpected error occurred.");
            }
        });
    };

    return (
        <div className="container max-w-6xl py-12">
            <Toaster richColors position="top-right" />
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                 <Link href="/dashboard" className="flex items-center text-sm font-medium text-black mb-4">
                     <ArrowLeft className="mr-2 h-4 w-4" />
                     Back to Dashboard
                 </Link>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">Create New News</h1>
                <p className="text-muted-foreground mb-8">Fill out the details below to publish a new news article.</p>
            </motion.div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                            <Card className="border-t-4 border-t-primary shadow-lg"><CardContent className="p-6 space-y-6">
                                {/* Title */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="title" className="text-lg font-semibold">News Headline</Label>
                                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Global Tech Innovations Reach New Heights" required disabled={isPending} className="text-lg h-12" />
                                    {formErrors.title && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle size={14}/>{formErrors.title}</p>}
                                </div>
                                
                                {/* Content - The Enhanced Editor */}
                                <div className="space-y-2">
                                    <Label htmlFor="content" className="text-lg font-semibold">Article Content</Label>
                                    <div className="prose-editor-wrapper mt-2">
    <TipTapEditor 
        content={content} 
        onChange={setContent} 
        onImageUpload={uploadImageToCloudinary} // දැන් මේක Error එකක් නැතුව වැඩ කරයි!
    />
</div>
                                    {formErrors.content && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle size={14}/>{formErrors.content}</p>}
                                    
                                    {/* Pro Tip from Blog */}
                                    <div className="mt-4 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-foreground/80">
    <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
    <p>
        <strong>Pro Tip:</strong> You can resize images by dragging their bottom-right corner. Click inside a table or an image to reveal advanced formatting controls!
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
                                {/* Reporter Name */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="author_name">Reporter Name</Label>
                                    <Input id="author_name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Your display name" required disabled={isPending} />
                                    {formErrors.authorName && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle size={14}/>{formErrors.authorName}</p>}
                                </div>
                                
                                {/* Submit Button */}
                                <Button type="submit" className="w-full font-bold h-12 text-base shadow-lg hover:shadow-xl transition-all" disabled={isPending || !title || !content}>
                                    {isPending ? <><LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> Publishing...</> : 'Publish News'}
                                </Button>
                            </CardContent></Card>
                        </motion.div>

                        {/* Categorization */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                            <Card><CardHeader><CardTitle>Categorization</CardTitle></CardHeader><CardContent className="space-y-6">
                                {/* Category */}
                                <div className="space-y-1.5">
                                    <Label>Category</Label>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isPending}>
                                        <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                                        <SelectContent>{categories.map(cat => <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                    {formErrors.category && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle size={14}/>{formErrors.category}</p>}
                                    
                                    {/* Add New Category - Styled like Blog's Add Sub-category */}
                                    <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                                        <Input value={newCategoryInput} onChange={(e) => setNewCategoryInput(e.target.value)} placeholder="New category name" className="h-8 text-xs" disabled={isPending} />
                                        <Button type="button" variant="outline" size="icon" className="h-8 w-8 flex-shrink-0" onClick={handleAddNewCategory} disabled={isPending || !newCategoryInput.trim()} aria-label="Add new category">
                                            <PlusCircle size={16} />
                                        </Button>
                                    </div>
                                </div>

                                {/* Tags (Keywords) */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="tags">Keywords (Hashtags)</Label>
                                    <div className="flex flex-wrap items-center gap-2 rounded-md border p-2 mt-1 min-h-[42px]">
                                        {tags.map(tag => (
                                            <div key={tag} className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive"><X size={12} /></button>
                                            </div>
                                        ))}
                                        <Input id="tags" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} placeholder={tags.length === 0 ? "Type and press Enter..." : "Add more..."} className="flex-1 border-0 h-auto p-0 bg-transparent shadow-none focus-visible:ring-0 text-sm" disabled={isPending} />
                                    </div>
                                </div>
                            </CardContent></Card>
                        </motion.div>

                        {/* Featured Image */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                             <Card><CardHeader><CardTitle>Featured Image</CardTitle></CardHeader><CardContent className="space-y-4">
                                {/* Image Preview */}
                                <div className="aspect-video rounded-md border-2 border-dashed flex items-center justify-center bg-muted/50 overflow-hidden relative group">
                                     {imagePreview ? (
                                         <>
                                             <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-opacity group-hover:opacity-90" />
                                             <Button
                                                 variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                 onClick={() => {setImageUrl(''); setImageFile(null); setImagePreview(null);}}
                                                 type="button" aria-label="Remove image"
                                             >
                                                 <X size={14} />
                                             </Button>
                                         </>
                                      ) : (
                                          <div className="text-center text-muted-foreground"><ImageIcon className="mx-auto h-10 w-10 mb-2 opacity-50" /><p className="text-sm">No Image Selected</p></div>
                                      )}
                                 </div>
                                {/* Image URL */}
                                <Input value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setImageFile(null); setImagePreview(e.target.value || null); }} placeholder="Paste image URL..." disabled={isPending} />
                                {/* Separator */}
                                <div className="relative text-center"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">OR</span></div></div>
                                {/* Upload Button */}
                                <Button asChild variant="outline" className="w-full cursor-pointer border-dashed">
                                    <label htmlFor="image-file">
                                        <UploadCloud className="mr-2 h-4 w-4" /> Upload from Device
                                        <input id="image-file" type="file" className="sr-only" accept="image/*" onChange={handleImageFileChange} disabled={isPending} />
                                    </label>
                                </Button>
                            </CardContent></Card>
                        </motion.div>
                    </div>
                </div>
            </form>
        </div>
    );
}