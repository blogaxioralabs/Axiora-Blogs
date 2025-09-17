// components/CommentLikeButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from './ui/button';
import { ThumbsUp, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommentLikeButtonProps {
  commentId: number;
  initialLikes: number;
}

export function CommentLikeButton({ commentId, initialLikes }: CommentLikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    const likedComments = JSON.parse(localStorage.getItem('liked-comments') || '{}');
    if (likedComments[commentId]) {
      setIsLiked(true);
    }
  }, [commentId]);

  const handleLike = async () => {
    if (isLiked || isLiking) return;

    setIsLiking(true);
    setLikes((prevLikes) => prevLikes + 1);
    setIsLiked(true);

    const likedComments = JSON.parse(localStorage.getItem('liked-comments') || '{}');
    likedComments[commentId] = true;
    localStorage.setItem('liked-comments', JSON.stringify(likedComments));

    const { error } = await supabase.rpc('increment_comment_likes', {
      comment_id_to_inc: commentId,
    });

    if (error) {
      console.error('Error incrementing comment likes:', error);
      setLikes((prevLikes) => prevLikes - 1);
      setIsLiked(false);
      delete likedComments[commentId];
      localStorage.setItem('liked-comments', JSON.stringify(likedComments));
    }
    
    setIsLiking(false);
  };

  return (
    <Button
      onClick={handleLike}
      disabled={isLiked || isLiking}
      variant="ghost"
      size="sm"
      className={cn(
        "flex items-center gap-1.5 text-xs px-2 h-7 rounded-md",
        isLiked 
          ? "text-primary cursor-default" 
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        "disabled:opacity-80"
      )}
    >
      {isLiking ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        <ThumbsUp className={cn("h-4 w-4", isLiked && "fill-current")} />
      )}
      <span>{likes}</span>
    </Button>
  );
}