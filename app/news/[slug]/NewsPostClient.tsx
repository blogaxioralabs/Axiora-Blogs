'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import ReactMarkdown from 'react-markdown';
import rehypePrism from 'rehype-prism-plus';
import 'prismjs/themes/prism-tomorrow.css';
import { ShareButtons } from '@/components/ShareButtons';
import { CitationGenerator } from '@/components/CitationGenerator';
import { AIQueryButtons } from '@/components/AskAIButtons';
import QuizGenerator from "@/components/QuizGenerator";
import { LanguageSelector } from '@/components/LanguageSelector';
import { LikeButton } from '@/components/LikeButton';
import { CommentSection } from '@/components/CommentSection';
import { Eye, UserCircle, Clock, LoaderCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast, Toaster } from 'sonner';
import readingTime from 'reading-time';
import rehypeRaw from 'rehype-raw';

const supabase = createClient();

const getInitials = (name: string | null | undefined): string => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

const MarkdownImage = ({ src, alt }: { src?: string; alt?: string; }) => {
    if (!src) return null;
    return (
        <figure className="content-image my-6 md:my-8">
            <Image 
                src={src} 
                alt={alt || 'News content image'} 
                width={800} 
                height={450} 
                className="w-full h-auto object-cover rounded-xl shadow-md" 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px" 
            />
            {alt && <figcaption className="text-center text-xs md:text-sm text-muted-foreground mt-3 px-4">{alt}</figcaption>}
        </figure>
    );
};

export default function NewsPostClient({ news, profile }: { news: any, profile: any }) {
    const [viewLogged, setViewLogged] = useState(false);
    
    // Translation States
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [translatedContent, setTranslatedContent] = useState<string | null>(null);
    const [translatedTitle, setTranslatedTitle] = useState<string | null>(null);
    const [isTranslating, setIsTranslating] = useState(false);

    // Related News State
    const [relatedNews, setRelatedNews] = useState<any[]>([]);

    useEffect(() => {
        const logView = async () => {
            if (!viewLogged) {
                await supabase.rpc('increment_news_views', { news_slug: news.slug });
                setViewLogged(true);
            }
        };
        logView();
    }, [news.slug, viewLogged]);

    // Translation Effect
    useEffect(() => {
        if (selectedLanguage === 'en' || !news?.content || !news?.title) {
            setTranslatedContent(null);
            setTranslatedTitle(null);
            return;
        }
        const translatePostContent = async () => {
             setIsTranslating(true);
             setTranslatedContent(null);
             setTranslatedTitle(null);
             try {
                 const response = await fetch('/api/translate', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ title: news.title, content: news.content, targetLanguage: selectedLanguage }),
                 });
                 if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || `Translation Error: ${response.status}`); }
                 const data = await response.json();
                 if (data.translatedTitle && data.translatedContent) { 
                     setTranslatedTitle(data.translatedTitle); 
                     setTranslatedContent(data.translatedContent); 
                 }
                 else if (data.translatedContent) { 
                     setTranslatedContent(data.translatedContent); 
                     setTranslatedTitle(news.title); 
                 }
                 else { throw new Error("API returned invalid translation data."); }
             } catch (error: any) {
                 toast.error(`Translation failed: ${error.message}. Reverting to English.`);
                 setSelectedLanguage('en'); 
                 setTranslatedTitle(null); 
                 setTranslatedContent(null);
             } finally { setIsTranslating(false); }
        };
        const timer = setTimeout(translatePostContent, 100);
        return () => clearTimeout(timer);
    }, [selectedLanguage, news?.content, news?.title]);

    // Fetch Related News
    useEffect(() => {
        const fetchRelated = async () => {
            if (news?.category_id) {
                const { data } = await supabase
                    .from('news_posts')
                    .select('id, title, slug, image_url, published_at')
                    .eq('category_id', news.category_id)
                    .neq('id', news.id)
                    .eq('status', 'published')
                    .limit(3);
                if (data) setRelatedNews(data);
            }
        };
        fetchRelated();
    }, [news.category_id, news.id]);

    const displayTitle = selectedLanguage === 'en' ? news.title : (translatedTitle ?? news.title);
    const displayContent = selectedLanguage === 'en' ? news.content : (translatedContent ?? news.content);

    const authorAvatarUrl = profile?.avatar_url;
    const authorDisplayName = news.author_name || profile?.full_name || 'Axiora News';
    const readingStats = readingTime(displayContent || '');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://axiorablogs.com';
    const url = `${siteUrl}/news/${news.slug}`;

    const isHTML = (text: string) => /<[a-z][\s\S]*>/i.test(text);
    
    return (
        <>
            <Toaster richColors position="top-center" />
            <div className="container max-w-4xl py-12">
                <article>
                    <header className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            {news.news_categories && (
                                <p className="text-primary font-semibold">{news.news_categories.name}</p>
                            )}
                            <div className="print:hidden">
                                <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} disabled={isTranslating} />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mt-1">
                            {displayTitle}
                        </h1>
                        
                        {/* --- Metadata (Author, Date, Views) --- */}
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
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                <span>{Math.ceil(readingStats.minutes)} min read</span>
                            </div>
                            <span>Posted on {new Date(news.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', })}</span>
                            {/* Views */}
                            <div className="flex items-center gap-1.5">
                                <Eye className="h-4 w-4" />
                                <span>{(news.views || 0) + (viewLogged ? 5 : 0)} views</span>
                            </div>
                        </div>
                    </header>

                {/* COVER IMAGE */}
                {news.image_url && (
                    <div className="relative w-full aspect-video rounded-xl md:rounded-2xl overflow-hidden mb-8 md:mb-10 shadow-lg border border-border">
                        <Image src={news.image_url} alt={`${displayTitle} - Main image`} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 1200px" />
                    </div>
                )}

                {/* Main Content Area */}
                <div className="prose md:prose-lg dark:prose-invert max-w-none prose-li:marker:text-primary prose-a:text-primary hover:prose-a:text-primary/80 prose-headings:font-bold relative min-h-[300px]">
                    {isTranslating && (
                        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-md">
                            <LoaderCircle className="h-8 w-8 animate-spin text-primary" /><span className="ml-2 text-muted-foreground font-semibold">Translating...</span>
                        </div>
                    )}
                    {isHTML(displayContent || '') ? (
                        <div 
                            className="custom-tiptap-styles" 
                            dangerouslySetInnerHTML={{ __html: displayContent || '' }} 
                        />
                    ) : (
                        <ReactMarkdown rehypePlugins={[rehypePrism, rehypeRaw]} components={{ img: MarkdownImage }}>
                            {displayContent || ''}
                        </ReactMarkdown>
                    )}

                </div>

                {/* Tags Section */}
                {news.tags && news.tags.length > 0 && (
                    <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-border flex flex-wrap items-center gap-2">
                        <span className="text-xs md:text-sm font-bold mr-2 text-foreground w-full md:w-auto mb-2 md:mb-0">Related Topics:</span>
                        {news.tags.map((tag: string, index: number) => (
                            <Link key={index} href={`/news?tag=${tag}`} className="text-[11px] md:text-xs bg-secondary text-secondary-foreground py-1.5 px-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold uppercase tracking-wide">
                                #{tag}
                            </Link>
                        ))}
                    </div>
                )}

                {/* --- FEATURES WIDGETS --- */}
                <div className="mt-12 space-y-8">
                    {/* Want to dive deeper? (AI) */}
                    <AIQueryButtons title={displayTitle} url={url} content={displayContent || ''} />
                    
                    {/* Share This Article */}
                    <ShareButtons title={displayTitle} />
                    
                    {/* Test Your Knowledge! (Quiz) */}
                    <QuizGenerator postContent={displayContent || ''} postTitle={displayTitle} />
                    
                    {/* Did you enjoy this article? (Likes) */}
                    <LikeButton postId={news.id} initialLikes={news.like_count || 0} postType="news" />
                    
                    {/* Conversation section (Comments) */}
                    <CommentSection postId={news.id} postType="news" />
                    
                    {/* Cite This Article */}
                    <CitationGenerator post={{ title: displayTitle, author_name: news.author_name ?? undefined, created_at: news.published_at, slug: news.slug }} />
                </div>

                {/* You might also like (Related News) */}
                {relatedNews.length > 0 && (
                    <div className="mt-16 pt-8 border-t border-border">
                        <h3 className="text-2xl font-bold mb-6">You might also like</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedNews.map((related) => (
                                <Link key={related.id} href={`/news/${related.slug}`} className="group block space-y-3">
                                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                                        <Image src={related.image_url || '/placeholder-image.jpg'} alt={related.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">{related.title}</h4>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </div>
    </>
    );
}