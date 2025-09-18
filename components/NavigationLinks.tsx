'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/news', label: 'News' }, 
    { href: '/about', label: 'About' },
];

export function NavigationLinks() {
    const pathname = usePathname();

    return (
        <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "transition-colors hover:text-primary",
                        pathname === link.href
                            ? "text-primary font-semibold"
                            : "text-foreground/70"
                    )}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}