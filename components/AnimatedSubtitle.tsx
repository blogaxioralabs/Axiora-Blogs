'use client';

import { motion } from 'framer-motion';

const sentence = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5,
      staggerChildren: 0.08,
    },
  },
};

const letter = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const line1 = "Exploring the frontiers of";
const line2 = "Science, Technology, Engineering, and Mathematics.";

export function AnimatedSubtitle() {
  return (
    <motion.p
      variants={sentence}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground"
    >
      {line1.split(" ").map((word, index) => (
        <motion.span key={index} variants={letter} style={{ display: 'inline-block', marginRight: '0.4rem' }}>
          {word}
        </motion.span>
      ))}
      <br />
      {line2.split(" ").map((word, index) => (
         <motion.span key={index} variants={letter} className="font-semibold text-foreground" style={{ display: 'inline-block', marginRight: '0.4rem' }}>
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
}