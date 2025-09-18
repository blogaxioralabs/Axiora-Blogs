'use client';

import { motion, Variants } from 'framer-motion'; 

const title = "Axiora Blogs";

const containerVariants: Variants = { 
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: i * 0.04 },
  }),
};

const childVariants: Variants = { 
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
  hidden: {
    opacity: 0,
    x: -20,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

export function AnimatedTitle() {
  return (
    <motion.h1
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-5xl md:text-7xl font-extrabold tracking-tight md:tracking-normal leading-tight mb-4 text-foreground flex flex-wrap justify-center"
    >
      {title.split("").map((char, index) => (
        <motion.span 
            key={index} 
            variants={childVariants}
            // This handles the space between words
            className={char === " " ? "w-3 md:w-5" : ""}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  );
}