// app/dashboard/page.tsx
'use client';

import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { LoaderCircle, Plus, Edit, Trash, ExternalLink, Eye, Heart, LayoutDashboard, ImageIcon, AlertTriangle, Newspaper } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Types
type UserPost = {
    id: number;
    title: string;
    slug: string;
    created_at: string;
    view_count?: number;
    like_count?: number;
    image_url?: string | null;
};

type NewsPost = {
    id: number;
    title: string;
    slug: string;
    created_at: string;
    views?: number;
    likes?: number;
    image_url?: string | null;
};

function formatStat(count: number | null | undefined): string {
    if (count === null || count === undefined) return '0';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
    return count.toString();
}

export default function DashboardPage() {
    const supabase = createClient();
    const router = useRouter();
    
    const [blogs, setBlogs] = useState<UserPost[]>([]);
    const [news, setNews] = useState<NewsPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Stats
    const [stats, setStats] = useState({
        totalBlogs: 0, totalNews: 0,
        totalBlogViews: 0, totalNewsViews: 0,
        totalBlogLikes: 0, totalNewsLikes: 0,
    });

    // Delete Dialog State
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<{ id: number; title: string; type: 'blog' | 'news' } | null>(null);

    const fetchUserData = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push('/login?message=Please log in to access your dashboard.'); return; }

        // Fetch Blogs (පරණ Logic එක කිසිම වෙනසක් නෑ)
        const { data: blogData, count: blogCount } = await supabase
            .from('posts')
            .select('id, title, slug, created_at, view_count, like_count, image_url', { count: 'exact' })
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        // Fetch News (අලුත් Logic එක)
        const { data: newsData, count: newsCount } = await supabase
            .from('news_posts')
            .select('id, title, slug, created_at, views, likes, image_url', { count: 'exact' })
            .eq('author_id', user.id)
            .order('created_at', { ascending: false });

        setBlogs(blogData || []);
        setNews(newsData || []);

        // Calculate Stats
        const bViews = blogData?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0;
        const bLikes = blogData?.reduce((sum, p) => sum + (p.like_count || 0), 0) || 0;
        const nViews = newsData?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;
        const nLikes = newsData?.reduce((sum, p) => sum + (p.likes || 0), 0) || 0;

        setStats({
            totalBlogs: blogCount || 0,
            totalNews: newsCount || 0,
            totalBlogViews: bViews,
            totalNewsViews: nViews,
            totalBlogLikes: bLikes,
            totalNewsLikes: nLikes,
        });

        setLoading(false);
    };

    useEffect(() => {
         fetchUserData();
    }, [supabase, router]);

    const handleDeleteClick = (postId: number, postTitle: string, type: 'blog' | 'news') => {
        setPostToDelete({ id: postId, title: postTitle, type });
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!postToDelete) return;
        setDeletingId(postToDelete.id);
        setIsDeleteDialogOpen(false);

        const table = postToDelete.type === 'blog' ? 'posts' : 'news_posts';
        const { error } = await supabase.from(table).delete().eq('id', postToDelete.id);

        setDeletingId(null);
        if (error) {
            toast.error(`Error deleting: ${error.message}`);
        } else {
            toast.success(`"${postToDelete.title}" deleted successfully.`);
            fetchUserData(); // Refresh data
        }
        setPostToDelete(null);
    };

    const renderPostCard = (post: any, type: 'blog' | 'news') => (
        <Card key={post.id} className="transition-shadow hover:shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
                <div className="p-1 md:p-2 w-full md:w-48 flex-shrink-0">
                    <div className="aspect-video md:aspect-[4/3] relative bg-muted rounded-md overflow-hidden">
                        {post.image_url ? (
                            <Image src={post.image_url} alt={post.title} fill sizes="(max-width: 768px) 100vw, 192px" className="object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground"><ImageIcon className="h-8 w-8" /></div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col flex-grow">
                     <CardHeader className="pb-3 pt-4 md:pt-4 px-4 md:px-6">
                         <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                             <CardTitle className="text-lg md:text-xl leading-tight hover:text-primary transition-colors flex-grow mr-2">
                                 <Link href={type === 'blog' ? `/blog/${post.slug}` : `/news/${post.slug}`} target="_blank" className="line-clamp-2">{post.title}</Link>
                             </CardTitle>
                             <div className="flex gap-1.5 flex-shrink-0 mt-2 sm:mt-0 self-start sm:self-center">
                                 <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
                                     <Link href={type === 'blog' ? `/blog/${post.slug}` : `/news/${post.slug}`} target="_blank"><ExternalLink className="h-3.5 w-3.5 mr-1" /> View</Link>
                                 </Button>
                                 {/* Edit routes: News editing can be added later if needed. For now going to standard edit pages. */}
                                 <Button variant="outline" size="icon" asChild className="h-7 w-7">
                                     <Link href={type === 'blog' ? `/dashboard/edit/${post.slug}` : `/dashboard/news/edit/${post.slug}`}><Edit className="h-4 w-4" /></Link>
                                 </Button>
                                 <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(post.id, post.title, type)} disabled={deletingId === post.id} className="h-7 w-7">
                                     {deletingId === post.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                                 </Button>
                             </div>
                         </div>
                         <CardDescription className="text-xs pt-1">Published on {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</CardDescription>
                     </CardHeader>
                     <CardFooter className="flex items-center gap-4 text-xs text-muted-foreground border-t mt-auto py-3 px-4 md:px-6">
                         <div className="flex items-center gap-1" title="Views"><Eye className="h-3.5 w-3.5" /><span>{formatStat(type === 'blog' ? post.view_count : post.views)}</span></div>
                         <div className="flex items-center gap-1" title="Likes"><Heart className="h-3.5 w-3.5" /><span>{formatStat(type === 'blog' ? post.like_count : post.likes)}</span></div>
                     </CardFooter>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="container max-w-6xl py-12 md:py-16">
            <Toaster richColors position="top-center" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                 <div>
                      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Your Dashboard</h1>
                      <p className="text-muted-foreground mt-1">Manage your published articles and news.</p>
                 </div>
                 <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                     <Button asChild variant="outline" className="w-full sm:w-auto"><Link href="/dashboard/news/create"><Newspaper className="mr-2 h-4 w-4" /> Publish News Post</Link></Button>
                     <Button asChild className="w-full sm:w-auto"><Link href="/dashboard/create-post"><Plus className="mr-2 h-4 w-4" /> Publish Blog Post</Link></Button>
                 </div>
            </div>

            {/* Quick Stats Section */}
            {loading ? ( <div className="flex justify-center py-8"><LoaderCircle className="h-8 w-8 animate-spin text-primary" /></div> )
             : ( 
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                  <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle><LayoutDashboard className="h-5 w-5 text-muted-foreground" /></CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{stats.totalBlogs + stats.totalNews}</div>
                          <p className="text-xs text-muted-foreground mt-1 font-medium">Blogs: {stats.totalBlogs} | News: {stats.totalNews}</p>
                      </CardContent>
                  </Card>
                   <Card>
                       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle><Eye className="h-5 w-5 text-muted-foreground" /></CardHeader>
                       <CardContent>
                           <div className="text-2xl font-bold">{formatStat(stats.totalBlogViews + stats.totalNewsViews)}</div>
                           <p className="text-xs text-muted-foreground mt-1 font-medium">Blogs: {formatStat(stats.totalBlogViews)} | News: {formatStat(stats.totalNewsViews)}</p>
                       </CardContent>
                   </Card>
                   <Card>
                       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Likes</CardTitle><Heart className="h-5 w-5 text-muted-foreground" /></CardHeader>
                       <CardContent>
                           <div className="text-2xl font-bold">{formatStat(stats.totalBlogLikes + stats.totalNewsLikes)}</div>
                           <p className="text-xs text-muted-foreground mt-1 font-medium">Blogs: {formatStat(stats.totalBlogLikes)} | News: {formatStat(stats.totalNewsLikes)}</p>
                       </CardContent>
                   </Card>
             </div> 
             )}

            {/* Content Tabs (Blogs vs News) */}
            <Tabs defaultValue="blogs" className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-2xl font-semibold">Your Content</h2>
                    <TabsList className="grid w-full sm:w-[300px] grid-cols-2">
                        <TabsTrigger value="blogs">Blog Posts</TabsTrigger>
                        <TabsTrigger value="news">News Articles</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="blogs" className="mt-0">
                    {!loading && blogs.length === 0 ? (
                        <div className="text-center py-16 px-6 bg-card border border-dashed rounded-lg"><p className="text-muted-foreground mb-4">You haven't published any blogs yet.</p></div>
                    ) : (
                        <div className="space-y-6">{blogs.map(post => renderPostCard(post, 'blog'))}</div>
                    )}
                </TabsContent>

                <TabsContent value="news" className="mt-0">
                    {!loading && news.length === 0 ? (
                        <div className="text-center py-16 px-6 bg-card border border-dashed rounded-lg"><p className="text-muted-foreground mb-4">You haven't published any news yet.</p></div>
                    ) : (
                        <div className="space-y-6">{news.map(post => renderPostCard(post, 'news'))}</div>
                    )}
                </TabsContent>
            </Tabs>

             {/* Delete Confirmation Dialog */}
             <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                 <AlertDialogContent>
                     <AlertDialogHeader>
                         <AlertDialogTitle className="flex items-center gap-2">
                             <AlertTriangle className="h-5 w-5 text-destructive" /> Are you absolutely sure?
                         </AlertDialogTitle>
                         <AlertDialogDescription>
                             This action cannot be undone. This will permanently delete the <strong className="capitalize">{postToDelete?.type}</strong> titled:
                             <br />
                             <strong className="mt-2 block break-words text-foreground">"{postToDelete?.title}"</strong>
                         </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                         <AlertDialogCancel onClick={() => setPostToDelete(null)}>Cancel</AlertDialogCancel>
                         <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                             Yes, Delete
                         </AlertDialogAction>
                     </AlertDialogFooter>
                 </AlertDialogContent>
             </AlertDialog>
        </div>
    );
}