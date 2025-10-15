import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { MobileNav } from './MobileNav';
import { NavigationLinks } from './NavigationLinks';
import { UserCircle } from 'lucide-react';
import { Button } from './ui/button';
import { createClient } from '@/lib/supabase/server';
import LogoutButton from './LogoutButton';

export default async function Navbar() {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                {/* Desktop Navigation */}
                <div className="hidden md:flex w-full items-center justify-between">
                    <div className="flex-1 flex justify-start">
                        <Link href="/" className="mr-6 flex items-center space-x-2">
                            <span className="font-bold text-lg">Axiora Blogs</span>
                        </Link>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <NavigationLinks />
                    </div>
                    <div className="flex flex-1 items-center justify-end space-x-1">
                        {user ? (
                            <LogoutButton />
                        ) : (
                            <Link href="/login" passHref>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <UserCircle className="h-5 w-5" />
                                    <span className="sr-only">Login</span>
                                </Button>
                            </Link>
                        )}
                        <ThemeToggle />
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex w-full items-center justify-between">
                    <div className="flex-1 flex justify-start">
                        <MobileNav />
                    </div>
                    <div className="flex-1 flex justify-center">
                         <Link href="/" className="flex items-center">
                            <span className="font-bold text-lg">Axiora Blogs</span>
                        </Link>
                    </div>
                    
                    <div className="flex flex-1 items-center justify-end space-x-1">
                        {user ? (
                            <LogoutButton />
                        ) : (
                            <Link href="/login" passHref>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <UserCircle className="h-5 w-5" />
                                    <span className="sr-only">Login</span>
                                </Button>
                            </Link>
                        )}
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}