'use client';

import { motion } from 'framer-motion';
import { Share2, Facebook, Instagram, Linkedin, ArrowUpRight, Twitter } from 'lucide-react';
import Link from 'next/link';

// TikTok සඳහා Custom SVG Icon එකක්
function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'TikTok', icon: TiktokIcon, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
];

export function SocialCommunitySection() {
    return (
        <section className="w-full py-12 md:py-16 bg-background relative overflow-hidden">
            {/* Subtle Background Pattern */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} 
            />

            <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
                
                {/* Header Section */}
                <div className="flex flex-col items-center mb-8 sm:mb-12 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-card shadow-sm mb-4"
                    >
                        <Share2 className="w-3.5 h-3.5 text-[#2b76b1]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/80">
                            Connect with us
                        </span>
                    </motion.div>

                    <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl md:text-4xl font-extrabold tracking-tight"
                    >
                        Join Our <span className="text-[#2b76b1]">Community</span>
                    </motion.h2>
                </div>

                {/* Cute & Compact Cards Container */}
                {/* md:flex-nowrap මගින් Desktop වලදී එකම පේළියකට ගෙන එයි */}
                <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-3 sm:gap-4 w-full">
                    {socialLinks.map((social, index) => (
                        <motion.div
                            key={social.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05, ease: "easeOut" }}
                            /* Mobile වල 47% නිසා 2-2-1 විදියට එයි. Desktop වල md:flex-1 නිසා එකම පේළියේ සමානව බෙදී යයි */
                            className="w-[47%] md:w-full md:flex-1 max-w-[200px]"
                        >
                            <Link 
                                href={social.href}
                                className="group relative w-full h-14 sm:h-16 flex items-center justify-start px-2 sm:px-3 bg-card border border-border/60 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#2b76b1]/40 transition-all duration-300 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[#2b76b1]"
                            >
                                {/* Brand Color Left Edge Accent */}
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#2b76b1] opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                {/* Content Wrapper */}
                                <div className="relative z-10 flex items-center gap-2 sm:gap-3 w-full ml-1.5">
                                    
                                    {/* Icon Circle */}
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2b76b1]/10 flex items-center justify-center shrink-0 group-hover:bg-[#2b76b1]/20 group-hover:scale-110 transition-all duration-300">
                                        <social.icon className="w-4 h-4 text-[#2b76b1]" />
                                    </div>

                                    {/* Platform Name & Arrow */}
                                    <div className="flex-1 flex items-center justify-between">
                                        <span className="font-bold text-[13px] sm:text-[14px] lg:text-[15px] text-foreground leading-none group-hover:text-[#2b76b1] transition-colors whitespace-nowrap">
                                            {social.name}
                                        </span>
                                        
                                        {/* Animated Arrow on Hover */}
                                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-[#2b76b1] shrink-0" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}