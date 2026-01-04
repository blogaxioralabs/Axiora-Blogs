'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Twitter, Facebook, Linkedin, Check, Copy, Share2, MessageCircle } from 'lucide-react'; // <-- MessageCircle import kara
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function ShareButtons({ title }: { title: string }) {
    const pathname = usePathname();
    const [isCopied, setIsCopied] = useState(false);

    const siteUrl = "axiorablogs.com";
    const url = `${siteUrl}${pathname}`;
    
    // Custom share text for a better user experience
    const shareText = `Check out this article from Axiora Blogs: "${title}"`;

    const socialLinks = [
        { 
            name: 'WhatsApp', 
            icon: <MessageCircle className="h-4 w-4" />, // <-- Me widihata anith ewa wage icon ekak demma
            href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n\nRead more here: ${url}`)}`
        },
        { 
            name: 'Twitter', 
            icon: <Twitter className="h-4 w-4" />, 
            href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`
        },
        { 
            name: 'Facebook', 
            icon: <Facebook className="h-4 w-4" />, 
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        },
        { 
            name: 'LinkedIn', 
            icon: <Linkedin className="h-4 w-4" />, 
            href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
        }
    ];

    const copyLink = () => {
        navigator.clipboard.writeText(url).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500); // Reset after 2.5 seconds
        });
    };

    return (
        <div className="mt-8 pt-8 border-t">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-base font-semibold text-foreground">
                    <Share2 className="h-5 w-5 text-primary" />
                    <span>Share This Article</span>
                </div>
                <div className="flex items-center gap-2">
                    {socialLinks.map((social) => (
                        <a href={social.href} target="_blank" rel="noopener noreferrer" key={social.name} aria-label={`Share on ${social.name}`}>
                            <Button variant="outline" size="icon" className="rounded-full transition-transform hover:scale-110">
                                {social.icon}
                            </Button>
                        </a>
                    ))}
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={copyLink} 
                        className="rounded-full relative overflow-hidden transition-transform hover:scale-110"
                        aria-label="Copy link"
                    >
                        <AnimatePresence>
                            {isCopied ? (
                                <motion.div
                                    key="check"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    className="text-green-500 absolute"
                                >
                                    <Check className="h-4 w-4" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="copy"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    className="absolute"
                                >
                                    <Copy className="h-4 w-4" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Button>
                </div>
            </div>
        </div>
    );
}