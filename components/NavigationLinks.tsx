// components/NavigationLinks.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function NavigationLinks() {
    const pathname = usePathname();

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Blog', href: '/blog' },
        { name: 'News', href: '/news' },
        { name: 'About', href: '/about' },
    ];

    return (
        <nav className="flex items-center gap-2 sm:gap-3 w-full justify-between">
            {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full transition-all duration-300 relative whitespace-nowrap",
                            isActive
                                ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_12px_rgba(255,255,255,0.12)] scale-105"
                                : "text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
                        )}
                    >
                        {link.name}
                    </Link>
                );
            })}
        </nav>
    );
}