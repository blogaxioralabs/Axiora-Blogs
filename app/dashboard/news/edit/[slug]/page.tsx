// app/dashboard/news/edit/[slug]/page.tsx
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
import { UploadCloud, LoaderCircle, Image as ImageIcon, X, AlertCircle, ArrowLeft, Info } from 'lucide-react';
import { Toaster, toast } from 'sonner';

import type { User } from '@supabase/supabase-js';

const TipTapEditor = dynamic(() => import('@/components/TipTapEditor'), { ssr: false });

const CLOUD_NAME = "dnlkjlzzx"; 
const UPLOAD_PRESET = "my_blog_uploads";

type NewsCategory = { id: number; name: string; };

export default function EditNewsPage({ params }: { params: { slug: string } }) {
    const supabase = createClient();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const [post, setPost] = useState<any>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [categories, setCategories] = useState<NewsCategory[]>([]);

    useEffect(() => {
        async function fetchPostAndCategories() {
            setIsLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            if (!user) {
                router.push('/login?message=Please log in to edit news.');
                return;
            }

            const { data: postData, error } = await supabase
                .from('news_posts')
                .select('*')
                .eq('slug', params.slug)
                .single();

             if (error || !postData) {
                 toast.error("News post not found.");
                 router.push('/dashboard');
                 return;
             }

            // Check Ownership (RLS will also block it, but good for UI)
            if (postData.author_id !== user.id) {
                toast.error("Unauthorized to edit this news.");
                router.push('/dashboard');
                return;
            }

            setPost(postData);
            setTitle(postData.title);
            setContent(postData.content || '');
            setAuthorName(postData.author_name || '');
            setSelectedCategory(String(postData.category_id || ''));
            setImageUrl(postData.image_url || '');
            setImagePreview(postData.image_url || null);
            setTags(postData.tags || []);

            const { data: catData } = await supabase.from('news_categories').select('id, name');
            setCategories(catData || []);

            setIsLoading(false);
        }
        fetchPostAndCategories();
    }, [params.slug, supabase, router]);

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
            setImageFile(file); setImageUrl('');
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
             setImageFile(null); setImagePreview(imageUrl || null);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim() || !selectedCategory) { toast.error("Please fill required fields."); return; }

        startTransition(async () => {
            try {
                let finalImageUrl = imageUrl;
                
                if (imageFile) finalImageUrl = await uploadImageToCloudinary(imageFile);
                else if (!imageUrl && post.image_url) finalImageUrl = '';

                let finalSlug = post.slug;
                if (title.trim() !== post.title) {
                     const baseSlug = slugify(title, { lower: true, strict: true });
                     let potentialSlug = baseSlug;
                     let counter = 2;
                     while (true) {
                         const { data } = await supabase.from('news_posts').select('slug').eq('slug', potentialSlug).not('id', 'eq', post.id).maybeSingle();
                         if (!data) { finalSlug = potentialSlug; break; }
                         potentialSlug = `${baseSlug}-${counter}`;
                         counter++;
                     }
                }

                const { error } = await supabase.from('news_posts').update({
                    title: title.trim(),
                    slug: finalSlug,
                    content: content,
                    author_name: authorName.trim(),
                    image_url: finalImageUrl || null,
                    category_id: parseInt(selectedCategory),
                    tags: tags,
                }).eq('id', post.id);

                if (error) throw new Error(error.message);

                toast.success("News updated successfully!");
                router.push(`/news/${finalSlug}`);
                router.refresh();
            } catch (error: any) {
                toast.error(error.message || "An error occurred while saving.");
            }
        });
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen"><LoaderCircle className="h-8 w-8 animate-spin text-primary" /></div>;

    return (
        <div className="container max-w-6xl py-12">
            <Toaster richColors position="top-right" />
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                 <Link href="/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">Edit News</h1>
            </motion.div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-t-4 border-t-primary shadow-lg"><CardContent className="p-6 space-y-6">
                            <div className="space-y-1.5">
                                <Label htmlFor="title" className="text-lg font-semibold">News Headline</Label>
                                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isPending} className="text-lg h-12" />
                            </div>
                            <div className="prose-editor-wrapper mt-2">
    <TipTapEditor 
        content={content} 
        onChange={setContent} 
        onImageUpload={uploadImageToCloudinary} 
    />
</div>
                        </CardContent></Card>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <Card><CardHeader><CardTitle>Publishing Details</CardTitle></CardHeader><CardContent className="space-y-6">
                            <div className="space-y-1.5">
                                <Label htmlFor="author_name">Reporter Name</Label>
                                <Input id="author_name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} required disabled={isPending} />
                            </div>
                            <Button type="submit" className="w-full font-bold h-12" disabled={isPending}>
                                {isPending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : 'Save Changes'}
                            </Button>
                        </CardContent></Card>

                        <Card><CardHeader><CardTitle>Categorization</CardTitle></CardHeader><CardContent className="space-y-6">
                            <div className="space-y-1.5">
                                <Label>Category</Label>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isPending}>
                                    <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                                    <SelectContent>{categories.map(cat => <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Tags</Label>
                                <div className="flex flex-wrap items-center gap-2 rounded-md border p-2 mt-1 min-h-[42px]">
                                    {tags.map(tag => (<div key={tag} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">{tag}<button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive"><X size={12} /></button></div>))}
                                    <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} placeholder="Add keywords..." className="flex-1 border-0 h-auto p-0 bg-transparent shadow-none text-sm" disabled={isPending} />
                                </div>
                            </div>
                        </CardContent></Card>

                        <Card><CardHeader><CardTitle>Cover Image</CardTitle></CardHeader><CardContent className="space-y-4">
                            <div className="aspect-video rounded-md border-2 border-dashed flex items-center justify-center bg-muted/50 overflow-hidden relative group">
                                 {imagePreview ? (
                                     <><img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /><Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100" onClick={() => {setImageUrl(''); setImageFile(null); setImagePreview(null);}} type="button"><X size={14} /></Button></>
                                  ) : <div className="text-center text-muted-foreground"><ImageIcon className="mx-auto h-10 w-10 mb-2 opacity-50" /></div>}
                             </div>
                            <Input value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setImageFile(null); setImagePreview(e.target.value || null); }} placeholder="Paste URL..." disabled={isPending} />
                            <div className="relative text-center"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs"><span className="bg-card px-2">OR</span></div></div>
                            <Button asChild variant="outline" className="w-full cursor-pointer border-dashed"><label><UploadCloud className="mr-2 h-4 w-4" /> Upload<input type="file" className="sr-only" accept="image/*" onChange={handleImageFileChange} disabled={isPending} /></label></Button>
                        </CardContent></Card>
                    </div>
                </div>
            </form>
        </div>
    );
}