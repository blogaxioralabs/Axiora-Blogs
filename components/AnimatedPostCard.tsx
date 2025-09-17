'use client';

import { motion, Variants } from 'framer-motion';
import PostCard from './PostCard'; 

// Define the Post type again for this component
interface Post {
    id: number;
    title: string;
    slug: string;
    image_url?: string;
    created_at: string;
    categories?: { name: string };
    sub_categories?: { name: string, slug: string };
    content?: string;
}

// Define the animation properties
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export function AnimatedPostCard({ post, index }: { post: Post, index: number }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }} 
    >
      <PostCard post={post} />
    </motion.div>
  );
}