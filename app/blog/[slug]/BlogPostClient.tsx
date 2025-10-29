// app/blog/[slug]/BlogPostClient.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import ReactMarkdown from 'react-markdown';
import rehypePrism from 'rehype-prism-plus';
import 'prismjs/themes/prism-tomorrow.css';
import { ShareButtons } from '@/components/ShareButtons';
import { ViewCounter } from '@/components/ViewCounter';
import { LikeButton } from '@/components/LikeButton';
import { CommentSection } from '@/components/CommentSection';
import { CitationGenerator } from '@/components/CitationGenerator';
import { AIQueryButtons } from '@/components/AskAIButtons';
import QuizGenerator from "@/components/QuizGenerator";
import { LanguageSelector } from '@/components/LanguageSelector';
import { Button } from '@/components/ui/button';
import { Eye, UserCircle, LoaderCircle } from 'lucide-react'; // <-- UserCircle තියන්න fallback එකට
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // <-- Avatar components import කරන්න
import { toast, Toaster } from 'sonner';
import type { Post } from '@/lib/types';

const supabase = createClient();

// Helper function to get initials from name
const getInitials = (name: string | null | undefined): string => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

const MarkdownImage = ({ src, alt }: { src?: string; alt?: string; }) => {
    if (!src) return null;
    return (
        <figure className="content-image my-6">
            <Image
                src={src}
                alt={alt || 'Blog content image'}
                width={800}
                height={450}
                className="w-full h-auto object-cover rounded-lg shadow-md"
                sizes="(max-width: 768px) 100vw, 800px"
            />
            {alt && <figcaption className="text-center text-sm text-muted-foreground mt-2">{alt}</figcaption>}
        </figure>
    );
};

export default function BlogPostClient({ initialPost }: { initialPost: Post }) {
    const [post, setPost] = useState<Post>(initialPost);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [translatedContent, setTranslatedContent] = useState<string | null>(null);
    const [translatedTitle, setTranslatedTitle] = useState<string | null>(null);
    const [isTranslating, setIsTranslating] = useState(false);

     useEffect(() => {
        if (selectedLanguage === 'en' || !post?.content || !post?.title) {
            setTranslatedContent(null);
            setTranslatedTitle(null);
            return;
        }
        const translatePostContent = async () => {
             /* ... (translation logic - no change) ... */
             setIsTranslating(true);
             setTranslatedContent(null);
             setTranslatedTitle(null);
             try {
                 const response = await fetch('/api/translate', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ title: post.title, content: post.content, targetLanguage: selectedLanguage, }),
                 });
                 if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || `Translation API Error: ${response.status}`); }
                 const data = await response.json();
                 if (data.translatedTitle && data.translatedContent) { setTranslatedTitle(data.translatedTitle); setTranslatedContent(data.translatedContent); }
                 else if (data.translatedContent) { console.warn("Translation API returned content but not title."); setTranslatedContent(data.translatedContent); setTranslatedTitle(post.title); }
                 else { throw new Error("API returned invalid translation data structure."); }
             } catch (error: any) {
                 console.error("Translation failed:", error);
                 toast.error(`Translation failed: ${error.message}. Reverting to English.`);
                 setSelectedLanguage('en'); setTranslatedTitle(null); setTranslatedContent(null);
             } finally { setIsTranslating(false); }
        };
        const timer = setTimeout(translatePostContent, 100);
        return () => clearTimeout(timer);
    }, [selectedLanguage, post?.content, post?.title]);

    const displayTitle = selectedLanguage === 'en' ? post.title : (translatedTitle ?? post.title);
    const displayContent = selectedLanguage === 'en' ? post.content : (translatedContent ?? post.content);
    // --- Get avatar URL and fallback name ---
    const authorAvatarUrl = post.profiles?.avatar_url;
    const authorDisplayName = post.author_name || post.profiles?.full_name || 'Axiora Team'; // Default to Axiora Team if no name
    // ----------------------------------------

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://axiora-blogs.vercel.app';
    const url = `${siteUrl}/blog/${post.slug}`;

    return (
        <>
            <Toaster richColors position="top-center" />
            <div className="container max-w-4xl py-12">
                <ViewCounter postId={post.id} />
                <article>
                    <header className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            {post.categories && (<p className="text-primary font-semibold">{post.categories.name}</p>)}
                            <div className="print:hidden"><LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} disabled={isTranslating} /></div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mt-1">{displayTitle}</h1>
                        {/* --- Metadata (Author, Date, Views) - UPDATE HERE --- */}
                        <div className="flex flex-wrap items-center text-muted-foreground mt-4 text-sm gap-x-4 gap-y-2">
                           {/* Author Avatar and Name */}
                            <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5 border">
                                    <AvatarImage src={authorAvatarUrl || undefined} alt={authorDisplayName} />
                                    <AvatarFallback className="text-[9px] font-semibold">
                                        {getInitials(authorDisplayName) || <UserCircle className="h-3 w-3" />}
                                    </AvatarFallback>
                                </Avatar>
                                <span>{authorDisplayName}</span>
                            </div>
                            {/* Date */}
                            <span>Posted on {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', })}</span>
                            {/* Views */}
                            <div className="flex items-center gap-1.5">
                                <Eye className="h-4 w-4" />
                                <span>{post.view_count || 0} views</span>
                            </div>
                        </div>
                        {/* --- END UPDATE --- */}
                    </header>

                    {/* Featured Image */}
                    {post.image_url && (
                        <Image
                            src={post.image_url}
                            alt={`${displayTitle} - Main image`}
                            width={1200}
                            height={675}
                            className="w-full h-auto rounded-lg shadow-lg mb-8"
                            priority
                            sizes="(max-width: 1024px) 100vw, 1200px"
                        />
                    )}

                    {/* Main Content Area */}
                    <div className="prose dark:prose-invert max-w-none relative min-h-[300px]">
                        {isTranslating && (
                            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-md">
                                <LoaderCircle className="h-8 w-8 animate-spin text-primary" /><span className="ml-2 text-muted-foreground">Translating...</span>
                            </div>
                        )}
                        <ReactMarkdown rehypePlugins={[rehypePrism]} components={{ img: MarkdownImage }}>{displayContent || ''}</ReactMarkdown>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-6 pt-6 border-t flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold mr-2">Tags:</span>
                            {post.tags.map((tag) => (<Link key={tag.id} href={`/tag/${tag.slug}`} className="text-xs bg-secondary text-secondary-foreground py-1 px-2.5 rounded-full hover:bg-secondary/80 transition-colors">#{tag.name}</Link>))}
                        </div>
                    )}

                    {/* Other components */}
                    <AIQueryButtons title={post.title} url={url} content={post.content || ''} />
                    <ShareButtons title={post.title} />
                    <QuizGenerator postContent={post.content || ''} postTitle={post.title} />
                    <LikeButton postId={post.id} initialLikes={post.like_count || 0} />
                    <CommentSection postId={post.id} />
                    <CitationGenerator post={{ title: post.title, author_name: post.author_name ?? undefined, created_at: post.created_at, slug: post.slug }} />
                </article>
            </div>
        </>
    );
}