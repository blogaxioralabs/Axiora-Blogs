'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from './ui/button';
import { Heart, LoaderCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  postId: number;
  initialLikes: number;
}

export function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  
  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem('liked-posts') || '{}');
    if (likedPosts[postId]) {
      setIsLiked(true);
    }
  }, [postId]);

  const handleLike = async () => {
    if (isLiked || isLiking) return;

    setIsLiking(true);
    setLikes((prevLikes) => prevLikes + 1);
    setIsLiked(true);

    
    const likedPosts = JSON.parse(localStorage.getItem('liked-posts') || '{}');
    likedPosts[postId] = true;
    localStorage.setItem('liked-posts', JSON.stringify(likedPosts));

    
    const { error } = await supabase.rpc('increment_likes', {
      post_id_to_inc: postId,
    });

    if (error) {
      console.error('Error incrementing likes:', error);
     
      setLikes((prevLikes) => prevLikes - 1);
      setIsLiked(false);
      delete likedPosts[postId];
      localStorage.setItem('liked-posts', JSON.stringify(likedPosts));
    }
    
    setIsLiking(false);
  };

  return (
    <div className="mt-10 pt-8 border-t text-center">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Did you enjoy this article?
      </h3>
      <p className="text-muted-foreground text-sm mb-5">
        Show your appreciation by giving it a like!
      </p>
      
      <Button
        onClick={handleLike}
        disabled={isLiked || isLiking}
        size="lg"
        className={cn(
          "group rounded-full px-6 py-3 transition-all duration-300 ease-in-out",
          isLiked 
            ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" 
            : "bg-primary/10 text-primary hover:bg-primary/20",
          "disabled:opacity-80 disabled:cursor-not-allowed"
        )}
      >
        <div className="relative flex items-center">
          <AnimatePresence>
            {isLiking && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 45 }}
                className="absolute -left-5"
              >
                <LoaderCircle className="h-5 w-5 animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.span
            whileTap={isLiked || isLiking ? {} : { scale: 0.9 }}
            className="flex items-center"
          >
            <Heart className={cn(
              "h-5 w-5 mr-2 transition-all duration-300", 
              isLiked ? "fill-current text-green-500" : "group-hover:fill-current text-primary"
            )} />
            {isLiked ? 'Thank you!' : 'Like this article'}
          </motion.span>
          <span className="ml-3 bg-card/80 text-foreground py-1 px-3 rounded-full text-sm font-bold">
            {likes}
          </span>
        </div>
      </Button>
    </div>
  );
}