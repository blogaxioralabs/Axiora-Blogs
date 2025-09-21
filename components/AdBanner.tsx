// components/AdBanner.tsx
'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface AdBannerProps {
    ctaText?: string;
    ctaLink?: string;
}

export function AdBanner({
    ctaText = "Contact Us",
    ctaLink = "/contact" 
}: AdBannerProps) {
    return (
        <motion.div
            className="relative w-full aspect-video border rounded-xl overflow-hidden group p-4 flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {/* Animated Aurora Background */}
            <div
                className="absolute -inset-2.5 bg-gradient-to-r from-primary via-blue-500 to-green-400 opacity-15 blur-3xl animate-aurora"
                style={{
                    backgroundImage: `
                        radial-gradient(at 21% 33%, hsl(var(--primary)) 0px, transparent 50%),
                        radial-gradient(at 79% 30%, hsl(280, 80%, 60%) 0px, transparent 50%),
                        radial-gradient(at 26% 83%, hsl(180, 80%, 50%) 0px, transparent 50%)
                    `,
                }}
            ></div>

             {/* Main Background */}
             <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>


            {/* Content */}
            <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center border-2 border-dashed border-white/10 rounded-lg">
                <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-wider uppercase">
                    Your Advertisement Here
                </h3>
                <p className="text-xs text-muted-foreground mt-1">16:9 Aspect Ratio</p>
                <Link href={ctaLink} passHref className="mt-4">
                    <Button variant="default" className="shadow-lg transition-transform group-hover:scale-105">
                        {ctaText}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </motion.div>
    );
}