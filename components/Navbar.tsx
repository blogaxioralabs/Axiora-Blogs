// components/Navbar.tsx
import Link from 'next/link';
// import Image from 'next/image'; // <-- Image import එක අයින් කළා
import { ThemeToggle } from './ThemeToggle';
import { MobileNav } from './MobileNav';
import { NavigationLinks } from './NavigationLinks';
import { UserCircle, LayoutDashboard } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createClient } from '@/lib/supabase/server';
import LogoutButton from './LogoutButton';

export default async function Navbar() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let profileData: { full_name: string | null, avatar_url: string | null } | null = null;
    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', user.id)
            .single();
        profileData = data;
    }

    const userFullName = profileData?.full_name || user?.user_metadata?.full_name;
    const userAvatarUrl = profileData?.avatar_url || user?.user_metadata?.avatar_url;

    const getInitials = (name: string | null | undefined): string => {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                {/* Desktop Navigation */}
                <div className="hidden md:flex w-full items-center justify-between">
                    {/* Logo/Brand Text */}
                    <div className="flex-1 flex justify-start">
                        {/* --- Image එක අයින් කරලා Text එක විතරක් දැම්මා --- */}
                        <Link href="/" className="mr-6 flex items-center space-x-2">
                            <span className="font-bold text-lg">Axiora Blogs</span>
                        </Link>
                        {/* ------------------------------------------- */}
                    </div>

                    {/* Center Links */}
                    <div className="flex-1 flex justify-center">
                        <NavigationLinks />
                    </div>

                    {/* Right Side Actions (වෙනසක් නැහැ) */}
                    <div className="flex flex-1 items-center justify-end space-x-2">
                        {user ? (
                            <>
                                <Button variant="ghost" size="sm" asChild className="text-sm">
                                    <Link href="/dashboard"><LayoutDashboard className="h-4 w-4 mr-1.5" /> Dashboard</Link>
                                </Button>
                                <Link href="/dashboard/profile" className="flex items-center space-x-2 p-1 rounded-full hover:bg-accent">
                                    <Avatar className="h-8 w-8 border">
                                        <AvatarImage src={userAvatarUrl || undefined} alt={userFullName || 'User Avatar'} />
                                        <AvatarFallback className="text-xs font-semibold">{getInitials(userFullName) || <UserCircle className="h-4 w-4" />}</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <LogoutButton />
                            </>
                        ) : (
                            <Link href="/login" passHref>
                                <Button variant="ghost" size="icon" className="rounded-full" aria-label="Login"><UserCircle className="h-6 w-6" /></Button>
                            </Link>
                        )}
                        <ThemeToggle />
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex w-full items-center justify-between">
                    {/* Hamburger Menu */}
                    <div className="flex-1 flex justify-start">
                        <MobileNav />
                    </div>
                    {/* Centered Brand Text */}
                    <div className="flex-1 flex justify-center">
                         {/* --- Image එක අයින් කරලා Text එක විතරක් දැම්මා --- */}
                         <Link href="/" className="flex items-center">
                            <span className="font-bold text-lg">Axiora Blogs</span>
                        </Link>
                         {/* ------------------------------------------- */}
                    </div>
                    {/* Right Side Icons (වෙනසක් නැහැ) */}
                    <div className="flex flex-1 items-center justify-end space-x-1">
                        {user ? (
                             <>
                                <Button variant="ghost" size="icon" asChild className="rounded-full h-9 w-9"><Link href="/dashboard" aria-label="Dashboard"><LayoutDashboard className="h-5 w-5" /></Link></Button>
                                <Link href="/dashboard/profile" aria-label="Profile Settings">
                                     <Avatar className="h-9 w-9 border">
                                         <AvatarImage src={userAvatarUrl || undefined} alt={userFullName || 'User Avatar'} />
                                         <AvatarFallback className="text-xs">{getInitials(userFullName) || <UserCircle className="h-5 w-5" />}</AvatarFallback>
                                     </Avatar>
                                 </Link>
                             </>
                        ) : (
                            <Link href="/login" passHref>
                                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" aria-label="Login"><UserCircle className="h-6 w-6" /></Button>
                            </Link>
                        )}
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}