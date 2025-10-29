// components/MobileNav.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, LayoutDashboard, UserCircle, LogOut, Home, Newspaper, Info, BookOpen } from 'lucide-react'; // Added more specific icons
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    // Fetch user session
    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };
        getUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, [supabase]);

    // Add icons to nav links
    const navLinks = [
        { name: 'Home', href: '/', icon: <Home className="mr-3 h-5 w-5 text-muted-foreground" /> },
        { name: 'Blog', href: '/blog', icon: <BookOpen className="mr-3 h-5 w-5 text-muted-foreground" /> },
        { name: 'News', href: '/news', icon: <Newspaper className="mr-3 h-5 w-5 text-muted-foreground" /> },
        { name: 'About', href: '/about', icon: <Info className="mr-3 h-5 w-5 text-muted-foreground" /> },
    ];

    // Logout function
    const handleSignOut = async () => {
         setIsOpen(false);
         await supabase.auth.signOut();
         router.push('/');
         router.refresh();
    };

    // Toggle body scroll based on menu state
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        // Cleanup on unmount
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <div className="md:hidden">
            {/* Hamburger/Close Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="p-2" aria-label={isOpen ? "Close menu" : "Open menu"}>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            {/* Mobile Menu Panel */}
            {isOpen && (
                <div
                    className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-4 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden bg-background/95 backdrop-blur-sm"
                >
                    <div
                        className="relative z-20 grid gap-6 rounded-md bg-card p-4 shadow-lg border"
                    >
                         
                        <nav className="grid grid-flow-row auto-rows-max text-sm">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex w-full items-center rounded-md p-3 text-base font-medium hover:bg-accent"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.icon} {/* Added Icon */}
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* User Specific Links */}
                        {!loading && user && (
                            <>
                                <hr className="border-border" />
                                <nav className="grid grid-flow-row auto-rows-max text-sm">
                                    <Link
                                        href="/dashboard"
                                        className="flex w-full items-center rounded-md p-3 text-base font-medium hover:bg-accent"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <LayoutDashboard className="mr-3 h-5 w-5 text-muted-foreground" />
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/dashboard/profile"
                                        className="flex w-full items-center rounded-md p-3 text-base font-medium hover:bg-accent"
                                        onClick={() => setIsOpen(false)}
                                    >
                                         <UserCircle className="mr-3 h-5 w-5 text-muted-foreground" />
                                         Profile Settings
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        className="flex w-full items-center justify-start rounded-md p-3 text-base font-medium hover:bg-destructive/10 text-destructive mt-2"
                                        onClick={handleSignOut}
                                    >
                                        <LogOut className="mr-3 h-5 w-5" />
                                        Sign Out
                                    </Button>
                                </nav>
                            </>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}