'use client';

import { useState } from 'react';
// මෙතනට Variants කියන එක එකතු කරලා තියෙනවා
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        
        setStatus('loading');
        
        fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        }).catch(() => {});
        
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 3500);
    };

    // Animation variants for staggered effect (Variants type එක මෙතනට දුන්නා)
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <section className="relative w-full py-16 md:py-24 overflow-hidden bg-background isolate">
            {/* Background Ambient Glows (Using the button color #2b76b1) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[800px] h-[300px] bg-[#2b76b1] opacity-[0.08] blur-[120px] rounded-full pointer-events-none -z-10" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#2b76b1] opacity-[0.04] blur-[100px] rounded-full pointer-events-none -z-10" />

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="container mx-auto px-4 max-w-4xl text-center flex flex-col items-center z-10"
            >
                {/* Heading */}
                <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4 max-w-2xl leading-tight">
                    Never Miss an <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2b76b1] to-[#5ba4de]">Update</span>
                </motion.h2>
                
                {/* Subtitle */}
                <motion.p variants={itemVariants} className="text-base md:text-lg text-muted-foreground mb-12 font-normal max-w-xl">
                    Join our newsletter and get the latest features, news, and exclusive updates delivered straight to your inbox.
                </motion.p>

                {/* Input Form */}
                <motion.form 
                    variants={itemVariants} 
                    onSubmit={handleSubmit} 
                    className="w-full max-w-xl relative flex items-center"
                >
                    <div className={`relative w-full transition-all duration-500 rounded-full ${isFocused ? 'shadow-[0_0_40px_-10px_rgba(43,118,177,0.3)] scale-[1.01]' : 'shadow-lg hover:shadow-xl'}`}>
                        
                        {/* Mail Icon */}
                        <Mail className={`absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 z-10 ${isFocused ? 'text-[#2b76b1]' : 'text-muted-foreground/50'}`} />
                        
                        <Input
                            type="email"
                            placeholder="Enter your email address..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            required
                            disabled={status !== 'idle'}
                            className="w-full h-16 md:h-[68px] pl-[60px] pr-[150px] md:pr-[170px] rounded-full bg-background/80 backdrop-blur-md border border-border/50 text-base focus-visible:ring-2 focus-visible:ring-[#2b76b1]/50 focus-visible:border-[#2b76b1] transition-all duration-300 placeholder:text-muted-foreground/40"
                        />
                        
                        {/* Inner Button */}
                        <div className="absolute right-2 top-2 bottom-2 z-10">
                            <AnimatePresence mode="wait">
                                <Button 
                                    key={status}
                                    type="submit" 
                                    disabled={status !== 'idle' || !email}
                                    className={`h-full rounded-full px-6 md:px-8 font-semibold shadow-sm transition-all duration-500 min-w-[130px] md:min-w-[150px]
                                        ${status === 'success' 
                                            ? 'bg-green-500 hover:bg-green-600 text-white' 
                                            : 'bg-[#2b76b1] hover:bg-[#2b76b1]/90 hover:scale-105 active:scale-95 text-white'
                                        }`}
                                >
                                    {status === 'loading' ? (
                                        <motion.span 
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                            className="flex items-center gap-2"
                                        >
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Sending...
                                        </motion.span>
                                    ) : status === 'success' ? (
                                        <motion.span 
                                            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                                            className="flex items-center gap-2"
                                        >
                                            <CheckCircle2 className="h-5 w-5" />
                                            Done!
                                        </motion.span>
                                    ) : (
                                        <motion.span 
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        >
                                            Subscribe
                                        </motion.span>
                                    )}
                                </Button>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.form>
                
                {/* Privacy text (Optional but adds a pro touch) */}
                <motion.p variants={itemVariants} className="mt-6 text-xs text-muted-foreground/60">
                    We care about your data. Read our <a href="#" className="underline hover:text-[#2b76b1] transition-colors">Privacy Policy</a>.
                </motion.p>

            </motion.div>
        </section>
    );
}