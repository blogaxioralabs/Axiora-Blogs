import Image from 'next/image';
import Link from 'next/link';
import { Share2, UserCircle, Eye } from 'lucide-react';
import type { Post } from '@/lib/types';

// Function to format the date
function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

// Function to get real text from the post content (Removes markdown)
function getPostExcerpt(content: string, length = 100): string {
    if (!content) return '';
    
    const strippedContent = content
        // 1. Remove HTML tags (TipTap එකෙන් එන අලුත් දේවල් මකන්න)
        .replace(/<[^>]*>?/gm, '') 
        // 2. Remove Markdown formatting symbols (පරණ පෝස්ට් වල දේවල් මකන්න)
        .replace(/(\*\*|__)(.*?)\1/g, '$2') 
        .replace(/(\*|_)(.*?)\1/g, '$2')    
        .replace(/~~(.*?)~~/g, '$1')        
        .replace(/!\[(.*?)\]\(.*?\)/g, '')  
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') 
        .replace(/`{1,3}(.*?)`{1,3}/g, '$1') 
        // 3. Remove block level elements
        .replace(/^\s{0,3}(\d+\.\s|[-*+]\s)/gm, '') 
        .replace(/^#+\s+/gm, '')            
        .replace(/>/g, '')                  
        // 4. Clean up whitespace
        .replace(/(\r\n|\n|\r)/gm, " ")     
        .replace(/\s+/g, ' ')               
        .trim();

    if (strippedContent.length <= length) return strippedContent;
    return strippedContent.substring(0, strippedContent.lastIndexOf(' ', length)) + '...';
}
export default function FeaturedPost({ post }: { post: Post }) {
    if (!post) return null;

    const authorName = post.author_name || post.profiles?.full_name || 'Axiora Team';
    const authorAvatarUrl = post.profiles?.avatar_url;
    const excerpt = getPostExcerpt(post.content || '');

    // Dynamically collect tags from sub_categories, categories, or tags array
    const tagsToDisplay: string[] = [];
    if (post.sub_categories?.name) tagsToDisplay.push(post.sub_categories.name);
    if (post.categories?.name) tagsToDisplay.push(post.categories.name);
    if (Array.isArray(post.tags)) {
        tagsToDisplay.push(...post.tags.map((tag: any) => tag.name || tag));
    } else if (typeof post.tags === 'string') {
        tagsToDisplay.push(...(post.tags as string).split(',').map(t => t.trim()));
    }
    
    // Get unique tags and limit to 3
    const uniqueTags = Array.from(new Set(tagsToDisplay)).slice(0, 3);

    return (
        <article className="relative w-full flex flex-col lg:flex-row items-center lg:h-[550px] group">
            
            {/* === MOBILE ONLY CARD VIEW (Default Stacked) === */}
            <div className="w-full lg:hidden rounded-3xl overflow-hidden shadow-lg bg-card border mb-4">
               <div className="relative h-64 w-full">
                   {post.image_url && (
                        <Image src={post.image_url} alt={post.title} fill className="object-cover" />
                    )}
               </div>
               <div className="p-6">
                    <h2 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full overflow-hidden relative">
                               {authorAvatarUrl ? <Image src={authorAvatarUrl} alt={authorName} fill className="object-cover" /> : <UserCircle className="h-full w-full" />}
                            </div>
                            <span className="text-sm font-medium">{authorName}</span>
                        </div>
                        {/* View Count for Mobile */}
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                            <Eye className="w-4 h-4" />
                            {post.view_count || 0}
                        </div>
                    </div>
               </div>
               <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-20" aria-label={post.title} />
            </div>

            {/* === DESKTOP OVERLAPPING VIEW === */}
            <div className="hidden lg:block relative w-full h-full">
                
                {/* Right Side Image Container */}
                <div className="absolute right-0 top-0 h-full w-[85%] rounded-[2rem] overflow-hidden shadow-xl">
                    {post.image_url && (
                        <Image
                            src={post.image_url}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 80vw"
                            priority
                        />
                    )}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

                    {/* Top Right Tags (Dynamic: Up to 3 items) */}
                    <div className="absolute top-6 right-6 flex flex-wrap justify-end gap-2 z-30 max-w-[50%]">
                        {uniqueTags.map((tag, idx) => (
                            <span key={idx} className="bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-bold px-4 py-1.5 rounded-full shadow-sm">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Bottom Right View Count */}
                    <div className="absolute bottom-6 right-6 z-30">
                        <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                            <Eye className="w-4 h-4" />
                            {post.view_count || 0}
                        </span>
                    </div>
                </div>

                {/* Left Side White Overlapping Card */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[45%] bg-white dark:bg-slate-900 p-10 rounded-[2rem] shadow-2xl z-40 border border-slate-100 dark:border-slate-800">
                    <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-20" aria-label={post.title} />

                    <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.3] mb-6 underline decoration-slate-200 dark:decoration-slate-700 underline-offset-8">
                        {post.title}
                    </h2>

                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-10 line-clamp-4">
                        {excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-4">
                            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-slate-100">
                                {authorAvatarUrl ? (
                                    <Image src={authorAvatarUrl} alt={authorName} fill className="object-cover" />
                                ) : (
                                    <UserCircle className="h-full w-full text-slate-400" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{authorName}</span>
                                <span className="text-xs text-slate-500 font-medium">
                                    {formatDate(post.created_at)} • 5 min read
                                </span>
                            </div>
                        </div>

                        {/* Share Button */}
                        <button className="relative z-30 h-12 w-12 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors shadow-sm">
                            <Share2 className="h-5 w-5" />
                        </button>
                    </div>
                </div>

            </div>
        </article>
    );
}