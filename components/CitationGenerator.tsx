// components/CitationGenerator.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Copy, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // <-- 1. මෙතන import කරන්න

interface PostDetails {
    title: string;
    author_name?: string;
    created_at: string;
    slug: string;
}

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
        if (!post?.title) {
            setIsLoading(false);
            return;
        }

        const fetchCitations = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/cite', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(post),
                });

                if (!response.ok) {
                    throw new Error(`API Error: ${response.statusText}`);
                }

                const data = await response.json();
                setCitations(data);
            } catch (error) {
                console.error("Citation fetch failed:", error);
                const errorCitations: Record<string, string> = {};
                citationStyles.forEach(style => {
                    errorCitations[style.id] = "Could not generate citation for this article.";
                });
                setCitations(errorCitations);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCitations();

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
                            {/* --- 2. මෙතන <p> එක වෙනුවට <ReactMarkdown> යොදන්න --- */}
                            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:m-0">
                                <ReactMarkdown>
                                    {isLoading ? 'Generating...' : (citations[style.id] || '').trim()}
                                </ReactMarkdown>
                            </div>
                            {/* ---------------------------------------------------- */}
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