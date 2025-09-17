'use client';

import { useEffect, useState } from 'react';
import slugify from 'slugify';

interface Heading {
    level: number;
    text: string;
    slug: string;
}

export function TableOfContents({ content }: { content: string }) {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        const headingLines = content.match(/^##(#)?\s(.+)/gm) || [];
        const headingsData = headingLines.map(line => {
            const level = line.match(/^##(#)?/)?.[0].length || 2;
            const text = line.replace(/^##(#)?\s/, '').trim();
            const slug = slugify(text, { lower: true, strict: true });
            return { level, text, slug };
        });
        setHeadings(headingsData);
    }, [content]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '0% 0% -80% 0%' }
        );

        headings.forEach(({ slug }) => {
            const element = document.getElementById(slug);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <nav className="sticky top-24">
            <h2 className="font-bold mb-2">On This Page</h2>
            <ul className="space-y-2 text-sm">
                {headings.map(({ level, text, slug }) => (
                    <li key={slug} style={{ marginLeft: `${(level - 2) * 1}rem` }}>
                        <a 
                            href={`#${slug}`}
                            className={`transition-colors ${activeId === slug ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}