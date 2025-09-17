'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

// No longer need to pass categories here
export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    // Main navigation links
    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Blog', href: '/blog' },
        { name: 'About', href: '/about' },
    ];

    return (
        <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
                {isOpen ? <X /> : <Menu />}
                <span className="sr-only">Toggle Menu</span>
            </button>
            {isOpen && (
                <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden">
                    <div className="relative z-20 grid gap-6 rounded-md bg-background p-4 shadow-md">
                        <nav className="grid grid-flow-row auto-rows-max text-sm">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex w-full items-center rounded-md p-2 text-base font-medium hover:underline"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
}