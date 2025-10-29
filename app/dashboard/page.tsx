// app/dashboard/page.tsx
'use client';

import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { LoaderCircle, Plus, Edit, Trash, ExternalLink, Eye, Heart, MessageSquare, LayoutDashboard, ImageIcon, AlertTriangle } from 'lucide-react'; // Added AlertTriangle
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
// --- Import AlertDialog components ---
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger, // We might trigger manually, but import anyway
} from "@/components/ui/alert-dialog";
// ------------------------------------

// UserPost type (remains same)
type UserPost = { /* ... definition ... */
    id: number;
    title: string;
    slug: string;
    created_at: string;
    view_count?: number;
    like_count?: number;
    image_url?: string | null;
};

// formatStat function (remains same)
function formatStat(count: number | null | undefined): string { /* ... definition ... */
    if (count === null || count === undefined) return '0';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
    return count.toString();
}

export default function DashboardPage() {
    const supabase = createClient();
    const [posts, setPosts] = useState<UserPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const router = useRouter();

    const [totalPosts, setTotalPosts] = useState(0);
    const [totalViews, setTotalViews] = useState(0);
    const [totalLikes, setTotalLikes] = useState(0);

    // --- State for Delete Confirmation Dialog ---
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<{ id: number; title: string } | null>(null);
    // -----------------------------------------

    useEffect(() => {
        // ... (fetchUserData remains the same)
        async function fetchUserData() {
             setLoading(true);
             const { data: { user } } = await supabase.auth.getUser();
             if (!user) { router.push('/login?message=Please log in to access your dashboard.'); return; }
             const { data, error, count } = await supabase.from('posts').select('id, title, slug, created_at, view_count, like_count, image_url', { count: 'exact' }).eq('user_id', user.id).order('created_at', { ascending: false });
             if (error) { toast.error(`Failed to load posts: ${error.message}`); }
             else {
                 setPosts(data || []);
                 setTotalPosts(count || 0);
                 const views = data?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;
                 const likes = data?.reduce((sum, post) => sum + (post.like_count || 0), 0) || 0;
                 setTotalViews(views);
                 setTotalLikes(likes);
             }
             setLoading(false);
         }
         fetchUserData();
    }, [supabase, router]);

    // --- Modified handleDelete to open the dialog ---
    const handleDeleteClick = (postId: number, postTitle: string) => {
        setPostToDelete({ id: postId, title: postTitle });
        setIsDeleteDialogOpen(true);
    };
    // -----------------------------------------------

    // --- New function to perform the actual delete ---
    const confirmDelete = async () => {
        if (!postToDelete) return;

        setDeletingId(postToDelete.id); // Show spinner on the specific row's button
        setIsDeleteDialogOpen(false); // Close dialog

        const { error } = await supabase.from('posts').delete().eq('id', postToDelete.id);

        setDeletingId(null); // Stop spinner
        setPostToDelete(null); // Clear post to delete

        if (error) {
            toast.error(`Error deleting post: ${error.message}`);
        } else {
            toast.success(`"${postToDelete.title}" deleted successfully.`);
            // Refetch data after successful delete
            const { data: { user } } = await supabase.auth.getUser();
             if (user) {
                 const { data, error, count } = await supabase.from('posts').select('id, title, slug, created_at, view_count, like_count, image_url', { count: 'exact' }).eq('user_id', user.id).order('created_at', { ascending: false });
                 if (!error) {
                     setPosts(data || []);
                     setTotalPosts(count || 0);
                     const views = data?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;
                     const likes = data?.reduce((sum, post) => sum + (post.like_count || 0), 0) || 0;
                     setTotalViews(views);
                     setTotalLikes(likes);
                 }
             }
        }
    };
    // ------------------------------------------------

    return (
        <div className="container max-w-6xl py-12 md:py-16">
            <Toaster richColors position="top-center" />

            {/* Header Section (remains the same) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                 <div>
                      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Your Dashboard</h1>
                      <p className="text-muted-foreground mt-1">Manage your published articles.</p>
                 </div>
                 <Button asChild className="w-full sm:w-auto"><Link href="/dashboard/create-post"><Plus className="mr-2 h-4 w-4" /> Publish New Post</Link></Button>
            </div>

            {/* Quick Stats Section (remains the same) */}
            {loading ? ( <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"> {/* Skeleton */} {/* ... */} </div> )
             : ( <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"> {/* Stats */} {/* ... */}
                  <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle><LayoutDashboard className="h-5 w-5 text-muted-foreground" /></CardHeader>
                      <CardContent><div className="text-2xl font-bold">{totalPosts}</div></CardContent>
                  </Card>
                   <Card>
                       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle><Eye className="h-5 w-5 text-muted-foreground" /></CardHeader>
                       <CardContent><div className="text-2xl font-bold">{formatStat(totalViews)}</div></CardContent>
                   </Card>
                   <Card>
                       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Likes</CardTitle><Heart className="h-5 w-5 text-muted-foreground" /></CardHeader>
                       <CardContent><div className="text-2xl font-bold">{formatStat(totalLikes)}</div></CardContent>
                   </Card>
             </div> )}

            {/* Posts List Section */}
            <h2 className="text-2xl font-semibold mb-6">Your Articles</h2>
            {loading ? (
                <div className="flex justify-center items-center py-16"><LoaderCircle className="h-8 w-8 animate-spin text-primary" /></div>
            ) : posts.length === 0 ? (
                <div className="text-center py-16 px-6 bg-card border border-dashed rounded-lg"> {/* Empty State */} {/* ... */} </div>
            ) : (
                <div className="space-y-6">
                    {posts.map(post => (
                        <Card key={post.id} className="transition-shadow hover:shadow-lg overflow-hidden">
                            {/* --- Adjusted flex container and added padding for image --- */}
                            <div className="flex flex-col md:flex-row">
                                {/* Image Preview Section with Padding */}
                                <div className="p-1 md:p-2 w-full md:w-48 flex-shrink-0"> {/* Added padding here */}
                                    <div className="aspect-video md:aspect-[4/3] relative bg-muted rounded-md overflow-hidden"> {/* Container with rounded corners */}
                                        {post.image_url ? (
                                            <Image
                                                src={post.image_url}
                                                alt={`Preview for ${post.title}`}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 192px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                                <ImageIcon className="h-8 w-8" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* --- End Image Preview Section --- */}

                                {/* Content and Actions Section */}
                                <div className="flex flex-col flex-grow">
                                     <CardHeader className="pb-3 pt-4 md:pt-4 px-4 md:px-6"> {/* Adjusted top padding */}
                                         <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                                             <CardTitle className="text-lg md:text-xl leading-tight hover:text-primary transition-colors flex-grow mr-2">
                                                 <Link href={`/blog/${post.slug}`} target="_blank" title={post.title} className="line-clamp-2">{post.title}</Link>
                                             </CardTitle>
                                             {/* Action Buttons */}
                                             <div className="flex gap-1.5 flex-shrink-0 mt-2 sm:mt-0 self-start sm:self-center">
                                                 {/* View Button */}
                                                 <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs"><Link href={`/blog/${post.slug}`} target="_blank" aria-label="View post"><ExternalLink className="h-3.5 w-3.5 mr-1" /> View</Link></Button>
                                                 {/* Edit Button */}
                                                 <Button variant="outline" size="icon" asChild className="h-7 w-7"><Link href={`/dashboard/edit/${post.slug}`} aria-label="Edit post"><Edit className="h-4 w-4" /></Link></Button>
                                                 {/* --- Delete Button: Triggers dialog --- */}
                                                 <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(post.id, post.title)} disabled={deletingId === post.id} className="h-7 w-7" aria-label="Delete post">{deletingId === post.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}</Button>
                                                 {/* ------------------------------------ */}
                                             </div>
                                         </div>
                                         <CardDescription className="text-xs pt-1">Published on {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</CardDescription>
                                     </CardHeader>
                                     <CardFooter className="flex items-center gap-4 text-xs text-muted-foreground border-t mt-auto py-3 px-4 md:px-6">
                                         {/* Stats */}
                                         <div className="flex items-center gap-1" title="Views"><Eye className="h-3.5 w-3.5" /><span>{formatStat(post.view_count)}</span></div>
                                         <div className="flex items-center gap-1" title="Likes"><Heart className="h-3.5 w-3.5" /><span>{formatStat(post.like_count)}</span></div>
                                     </CardFooter>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

             {/* --- Delete Confirmation Dialog --- */}
             <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                 <AlertDialogContent>
                     <AlertDialogHeader>
                         <AlertDialogTitle className="flex items-center gap-2">
                             <AlertTriangle className="h-5 w-5 text-destructive" /> Are you absolutely sure?
                         </AlertDialogTitle>
                         <AlertDialogDescription>
                             This action cannot be undone. This will permanently delete the post titled:
                             <br />
                             <strong className="mt-2 block break-words">"{postToDelete?.title}"</strong>
                             <br />
                             Are you sure you want to proceed?
                         </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                         <AlertDialogCancel onClick={() => setPostToDelete(null)}>Cancel</AlertDialogCancel>
                         <AlertDialogAction
                             onClick={confirmDelete}
                             className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                         >
                             Yes, Delete Post
                         </AlertDialogAction>
                     </AlertDialogFooter>
                 </AlertDialogContent>
             </AlertDialog>
             {/* --------------------------------- */}

        </div>
    );
}