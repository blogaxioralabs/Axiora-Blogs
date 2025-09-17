'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function ViewCounter({ postId }: { postId: number }) {
  useEffect(() => {
    const incrementView = async () => {
      const storageKey = `viewed_${postId}`;
      const hasViewed = sessionStorage.getItem(storageKey);

      if (!hasViewed) {
        const { error } = await supabase.rpc('increment_views', {
          post_id_to_inc: postId,
        });

        if (error) {
          console.error('Error incrementing view count:', error);
        } else {
          // Mark as viewed in this session
          sessionStorage.setItem(storageKey, 'true');
        }
      }
    };

    incrementView();
  }, [postId]);

  return null; // This component does not render anything
}