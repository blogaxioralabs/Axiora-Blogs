'use client';

import { usePathname } from 'next/navigation';
import { Twitter, Facebook, Linkedin, Link as LinkIcon } from 'lucide-react';
import { Button } from './ui/button';

export function ShareButtons({ title }: { title: string }) {
    const pathname = usePathname();
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${pathname}`;

    const copyLink = () => {
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        });
    };

    return (
        <div className="flex items-center gap-2 mt-6 pt-6 border-t">
            <span className="text-sm font-semibold mr-2">Share this post:</span>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon"><Twitter className="h-4 w-4" /></Button>
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon"><Facebook className="h-4 w-4" /></Button>
            </a>
            <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon"><Linkedin className="h-4 w-4" /></Button>
            </a>
            <Button variant="outline" size="icon" onClick={copyLink}>
                <LinkIcon className="h-4 w-4" />
            </Button>
        </div>
    );
}