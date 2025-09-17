// components/CommentSection.tsx
'use client';

import { useState, useEffect, useTransition } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CommentCard } from './CommentCard';
import { Send, LoaderCircle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
    id: number;
    author_name?: string;
    content: string;
    created_at: string;
    like_count: number;
}

interface CommentSectionProps {
    postId: number;
}

export function CommentSection({ postId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        async function fetchComments() {
            setLoading(true);
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .eq('post_id', postId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching comments:', error);
            } else {
                setComments(data);
            }
            setLoading(false);
        }
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim().length === 0) return;

        startTransition(async () => {
            const { data, error } = await supabase
                .from('comments')
                .insert({
                    post_id: postId,
                    author_name: author.trim() || null,
                    content: content.trim(),
                })
                .select()
                .single();

            if (error) {
                console.error('Error adding comment:', error);
            } else if (data) {
                setComments([data, ...comments]);
                setContent('');
                setAuthor('');
            }
        });
    };

    return (
        <div className="mt-12 pt-10 border-t">
            <div className="flex items-center gap-3 mb-8">
                 <MessageSquare className="h-8 w-8 text-primary" />
                 <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                    Conversation ({comments.length})
                </h2>
            </div>
            
            {/* Comments List එක දැන් උඩින් */}
            <div className="space-y-6 mb-10">
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <LoaderCircle className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : comments.length > 0 ? (
                    <AnimatePresence>
                        {comments.map((comment, index) => (
                            <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                            >
                                <CommentCard comment={comment} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="text-center py-10 px-6 bg-secondary/30 rounded-lg">
                        <h3 className="font-semibold text-lg">No comments yet.</h3>
                        <p className="text-muted-foreground mt-1">Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>

            {/* Comment Form එක දැන් යටින් */}
            <motion.form 
                onSubmit={handleSubmit} 
                className="p-6 bg-card border rounded-lg shadow-sm sticky bottom-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                 <h3 className="text-lg font-semibold text-foreground mb-4">Leave a Reply</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-1">
                         <label htmlFor="author_name" className="block text-sm font-medium text-muted-foreground mb-1.5">Name (Optional)</label>
                        <Input
                            id="author_name"
                            type="text"
                            placeholder="e.g., Alex Rider"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            disabled={isPending}
                        />
                    </div>
                </div>
                <div>
                     <label htmlFor="content" className="block text-sm font-medium text-muted-foreground mb-1.5">Your Comment</label>
                    <Textarea
                        id="content"
                        placeholder="Share your thoughts..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={4}
                        disabled={isPending}
                    />
                </div>
                <div className="flex justify-end mt-4">
                    <Button type="submit" disabled={isPending || content.trim().length === 0}>
                        {isPending ? (
                            <>
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                Posting...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Post Comment
                            </>
                        )}
                    </Button>
                </div>
            </motion.form>
        </div>
    );
}