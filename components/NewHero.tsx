'use client';

import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, Cpu, Globe, Rocket } from 'lucide-react';
import Link from 'next/link';
import { TargetAndTransition } from "framer-motion";

const floatingAnimation = (delay: number): TargetAndTransition => ({
  y: ["-10px", "10px"],
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
    delay: delay
  }
});

export default function NewHero() {
  return (
    <section className="relative w-full min-h-[85vh] py-20 lg:py-32 flex flex-col items-center justify-center text-center overflow-hidden">
      
      {/* ================= EXACT BACKGROUND FROM OLD HERO ================= */}
      {/* ඔයාගේ පරණ Hero එකේ තිබ්බ ලස්සන Glow එක විතරක් මෙතනට ගත්තා (No boxes) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/20 blur-[100px] md:blur-[120px] rounded-full pointer-events-none -z-10 opacity-50 dark:opacity-20 transition-opacity duration-500 transform-gpu will-change-transform" />

      {/* ================= FLOATING GLASS BADGES ================= */}
      <motion.div animate={floatingAnimation(0)} className="hidden lg:flex absolute top-[20%] left-[10%] items-center gap-2 px-4 py-2 rounded-2xl bg-background/40 backdrop-blur-md border border-border/50 shadow-xl z-20">
        <div className="bg-primary/20 p-2 rounded-full"><Cpu className="w-4 h-4 text-primary" /></div>
        <span className="text-sm font-bold text-foreground">AI Engineering</span>
      </motion.div>

      <motion.div animate={floatingAnimation(1.5)} className="hidden lg:flex absolute bottom-[25%] left-[15%] items-center gap-2 px-4 py-2 rounded-2xl bg-background/40 backdrop-blur-md border border-border/50 shadow-xl z-20">
        <div className="bg-blue-500/20 p-2 rounded-full"><Globe className="w-4 h-4 text-blue-500" /></div>
        <span className="text-sm font-bold text-foreground">Spatial Computing</span>
      </motion.div>

      <motion.div animate={floatingAnimation(0.8)} className="hidden lg:flex absolute top-[30%] right-[12%] items-center gap-2 px-4 py-2 rounded-2xl bg-background/40 backdrop-blur-md border border-border/50 shadow-xl z-20">
        <div className="bg-cyan-500/20 p-2 rounded-full"><Rocket className="w-4 h-4 text-cyan-500" /></div>
        <span className="text-sm font-bold text-foreground">Quantum Systems</span>
      </motion.div>


      {/* ================= MAIN CONTENT ================= */}
      <div className="container px-4 md:px-6 flex flex-col items-center relative z-30">
        
        {/* Glowing Top Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="group relative inline-flex items-center rounded-full p-[1px] mb-8 overflow-hidden"
        >
          {/* Animated Border (Blue/Primary Gradient - Pink අයින් කළා) */}
          <span className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 animate-[spin_3s_linear_infinite]" />
          <div className="relative flex items-center gap-2 rounded-full bg-background/90 backdrop-blur-xl px-5 py-2 text-xs md:text-sm font-bold uppercase tracking-widest">
            <span className="text-foreground">AXIORA STEM IS HERE</span>
          </div>
        </motion.div>

        {/* Ultra-Modern Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="max-w-5xl"
        >
          <h1 className="text-[3.5rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter text-foreground mb-6 leading-[1.1]">
            Learn the Future.<br />
            {/* Pink අයින් කරලා Blue/Primary Theme එකට හැදුවා */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 drop-shadow-sm">
              Master Tomorrow.
            </span>
          </h1>
        </motion.div>

        {/* Sophisticated Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="max-w-2xl text-base md:text-xl text-muted-foreground mt-2 mb-12 font-medium leading-relaxed"
        >
          An elite technology academy engineered for visionaries. Deep dive
          into AI Engineering, Quantum Systems, and Spatial Computing with
          dynamic real-time synthesis.
        </motion.p>

        {/* Next-Gen Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto relative z-40"
        >
          {/* Primary Button with Deep Glow */}
          <Link href="/explore" className="w-full sm:w-auto group relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-blue-500 opacity-40 blur-lg group-hover:opacity-75 transition duration-500"></div>
            <button className="relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-bold text-sm md:text-base hover:scale-[1.02] transition-transform duration-300 z-50">
              Explore STEM
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>

          {/* Secondary Glassmorphic Button */}
          <Link href="/tutorial" className="w-full sm:w-auto group relative z-40">
            <button className="relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-background/50 backdrop-blur-md border border-border/60 text-foreground font-bold text-sm md:text-base hover:bg-muted/50 hover:scale-[1.02] transition-all duration-300 shadow-sm z-50">
              <PlayCircle className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
              Watch tutorial
            </button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}