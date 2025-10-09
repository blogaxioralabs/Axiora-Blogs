// components/CitationGenerator.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Copy, BookOpen } from 'lucide-react';

// Post දත්ත සඳහා type එක
interface PostDetails {
    title: string;
    author_name?: string;
    created_at: string;
    slug: string;
}

// උපුටා දැක්වීමේ ශෛලීන්
const citationStyles = [
    { id: 'apa', name: 'APA 7' },
    { id: 'harvard1', name: 'Harvard' },
    { id: 'mla', name: 'MLA 9' },
];

export function CitationGenerator({ post }: { post: PostDetails }) {
    const [citations, setCitations] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [copiedStyle, setCopiedStyle] = useState<string | null>(null);

    useEffect(() => {
        if (!post?.title || !post.created_at || !post.slug) {
            setIsLoading(false);
            return;
        }

        const generateCitations = async () => {
            setIsLoading(true);
            try {
                // 1. Library එක function එක ඇතුළේ dynamic විදියට import කිරීම
                const { default: Cite } = await import('citation-js');

                const publicationDate = new Date(post.created_at);
                if (isNaN(publicationDate.getTime())) {
                    throw new Error('Invalid date format for post.created_at');
                }

                const siteUrl = 'https://axiora-blogs.vercel.app';
                const postUrl = `${siteUrl}/blog/${post.slug}`;

                const citationData = {
                    id: post.slug,
                    type: 'webpage',
                    title: post.title,
                    author: [{ literal: post.author_name || 'Axiora Labs' }],
                    issued: {
                        'date-parts': [[publicationDate.getFullYear(), publicationDate.getMonth() + 1, publicationDate.getDate()]],
                    },
                    URL: postUrl,
                    'container-title': 'Axiora Blogs',
                    retrieved: {
                        'date-parts': [[new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()]],
                    }
                };
                
                // 2. Import කරගත් Cite එක භාවිත කිරීම
                const cite = new Cite(citationData);
                
                const generated: Record<string, string> = {};
                for (const style of citationStyles) {
                    generated[style.id] = cite.format('bibliography', {
                        format: 'text',
                        template: style.id,
                        lang: 'en-US',
                    });
                }
                setCitations(generated);

            } catch (error) {
                console.error("Citation generation failed:", error);
                const errorCitations: Record<string, string> = {};
                citationStyles.forEach(style => {
                    errorCitations[style.id] = "Could not generate citation for this article.";
                });
                setCitations(errorCitations);
            } finally {
                setIsLoading(false);
            }
        };

        generateCitations();

    }, [post]);

    const handleCopy = (styleId: string) => {
        const citationText = citations[styleId];
        if (!citationText || citationText.startsWith("Could not")) return;

        navigator.clipboard.writeText(citationText.trim());
        setCopiedStyle(styleId);
        setTimeout(() => setCopiedStyle(null), 2000);
    };

    return (
        <motion.div
            className="mt-12 pt-10 border-t"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
        >
            <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-7 w-7 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Cite This Article
                </h2>
            </div>

            <Tabs defaultValue="apa" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                    {citationStyles.map((style) => (
                        <TabsTrigger key={style.id} value={style.id}>{style.name}</TabsTrigger>
                    ))}
                </TabsList>
                {citationStyles.map((style) => (
                    <TabsContent key={style.id} value={style.id}>
                        <div className="relative mt-2 rounded-lg border bg-background p-4 pr-16 font-mono text-sm shadow-inner min-h-[80px]">
                            <p className="whitespace-pre-wrap break-words leading-relaxed">
                                {isLoading ? 'Generating...' : (citations[style.id] || '').trim()}
                            </p>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute top-2 right-2 h-8 w-8 rounded-md"
                                onClick={() => handleCopy(style.id)}
                                aria-label={`Copy ${style.name} citation`}
                                disabled={isLoading || !citations[style.id] || citations[style.id].startsWith("Could not")}
                            >
                                <AnimatePresence mode="wait">
                                    {copiedStyle === style.id ? (
                                        <motion.div key="check" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                                            <Check className="h-4 w-4 text-green-500" />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="copy" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                                            <Copy className="h-4 w-4" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Button>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </motion.div>
    );
}