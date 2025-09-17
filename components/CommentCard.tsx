// components/CommentCard.tsx
import { UserCircle, CalendarDays } from 'lucide-react';
import { CommentLikeButton } from './CommentLikeButton';

interface Comment {
    id: number;
    author_name?: string;
    content: string;
    created_at: string;
    like_count: number;
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export function CommentCard({ comment }: { comment: Comment }) {
    return (
        <div className="flex items-start gap-4">
             <div className="bg-primary text-primary-foreground rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center">
                <UserCircle className="h-6 w-6" />
            </div>
            <div className="flex-1">
                <div className="bg-secondary/50 dark:bg-secondary/20 p-4 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-foreground text-sm">
                            {comment.author_name || 'Anonymous'}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarDays className="h-3 w-3" />
                            <span>{formatDate(comment.created_at)}</span>
                        </div>
                    </div>
                    <p className="text-foreground/90 text-base leading-relaxed break-words">
                        {comment.content}
                    </p>
                </div>
                <div className="pl-2 mt-1.5">
                    <CommentLikeButton commentId={comment.id} initialLikes={comment.like_count || 0} />
                </div>
            </div>
        </div>
    );
}