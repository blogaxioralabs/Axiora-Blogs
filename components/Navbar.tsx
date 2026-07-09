// components/Navbar.tsx
import Link from 'next/link';
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
        // Added pb-6 globally so it pushes page content down perfectly on all pages
        <header className="sticky top-0 z-50 w-full pt-4 pb-6 px-4 sm:px-6 lg:px-8 transition-all duration-500 pointer-events-none">
            {/* Main Floating Island - Re-enabled pointer events for internal items */}
            <div className="mx-auto max-w-screen-2xl rounded-full border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/70 backdrop-blur-xl shadow-[0_12px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_35px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_16px_35px_rgba(0,0,0,0.45)] transition-all duration-500 flex h-16 items-center px-4 sm:px-6 pointer-events-auto">
                
                {/* ================= DESKTOP VIEW ================= */}
                <div className="hidden md:flex w-full items-center justify-between">
                    
                    {/* Left: Clean, Premium Logo */}
                    <div className="flex-1 flex justify-start">
                        <Link href="/" className="group relative flex items-center space-x-2 outline-none">
                            <span className="relative font-bold text-xl tracking-tight text-neutral-900 dark:text-neutral-50 transition-transform duration-300 group-hover:scale-[1.01] group-active:scale-95">
                                Axiora Blogs
                            </span>
                        </Link>
                    </div>

                    {/* Center: Stretched Navigation Pill */}
                    <div className="flex-1 flex justify-center">
                        <div className="rounded-full bg-neutral-50/60 dark:bg-neutral-900/40 px-8 py-1.5 border border-neutral-200/40 dark:border-neutral-800/40 shadow-inner backdrop-blur-md min-w-[360px] flex justify-center">
                            <NavigationLinks />
                        </div>
                    </div>

                    {/* Right: Actions & Auth */}
                    <div className="flex flex-1 items-center justify-end gap-3 lg:gap-4">
                        {user ? (
                            <>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    asChild 
                                    className="hidden lg:flex text-sm font-semibold rounded-full border-black/10 dark:border-white/10 bg-transparent text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
                                >
                                    <Link href="/dashboard">
                                        <LayoutDashboard className="h-4 w-4 mr-2" /> 
                                        Dashboard
                                    </Link>
                                </Button>
                                
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    asChild 
                                    className="lg:hidden rounded-full text-muted-foreground hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white transition-all duration-300 hover:scale-105"
                                >
                                    <Link href="/dashboard"><LayoutDashboard className="h-5 w-5" /></Link>
                                </Button>

                                <Link 
                                    href="/dashboard/profile" 
                                    className="group relative flex items-center justify-center rounded-full outline-none"
                                >
                                    <Avatar className="h-10 w-10 border-2 border-transparent ring-2 ring-black/5 dark:ring-white/5 ring-offset-2 ring-offset-background group-hover:ring-black dark:group-hover:ring-white group-hover:ring-offset-4 group-hover:scale-105 transition-all duration-300 shadow-sm cursor-pointer">
                                        <AvatarImage src={userAvatarUrl || undefined} alt={userFullName || 'User Avatar'} className="object-cover" />
                                        <AvatarFallback className="text-sm font-bold bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white">
                                            {getInitials(userFullName) || <UserCircle className="h-5 w-5" />}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                                
                                <div className="h-8 w-px bg-gradient-to-b from-transparent via-neutral-200 dark:via-neutral-800 to-transparent mx-1"></div>
                                
                                <div className="hover:scale-105 transition-transform duration-300">
                                    <LogoutButton />
                                </div>
                            </>
                        ) : null}
                        
                        <div className="pl-1 flex items-center hover:scale-105 transition-transform duration-300">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>

                {/* ================= MOBILE VIEW ================= */}
                <div className="md:hidden flex w-full items-center justify-between">
                    
                    {/* Left: Hamburger Menu Trigger Container */}
                    <div className="flex-1 flex justify-start">
                        <div className="hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-full p-2 transition-all duration-300 active:scale-90 border border-transparent active:border-neutral-200 dark:active:border-neutral-800">
                            <MobileNav />
                        </div>
                    </div>
                    
                    {/* Center: Full Brand Name "Axiora Blogs" auto-scaled */}
                    <div className="flex-[2] flex justify-center">
                         <Link href="/" className="flex items-center active:scale-98 transition-transform duration-300 group">
                            <span className="font-bold text-base sm:text-lg tracking-tight text-black dark:text-white whitespace-nowrap">
                                Axiora Blogs
                            </span>
                        </Link>
                    </div>
                    
                    {/* Right: Actions & Auth */}
                    <div className="flex-1 flex items-center justify-end gap-1.5 sm:gap-2">
                        {user ? (
                             <>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    asChild 
                                    className="rounded-full h-9 w-9 text-muted-foreground hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-300"
                                >
                                    <Link href="/dashboard" aria-label="Dashboard">
                                        <LayoutDashboard className="h-4 w-4" />
                                    </Link>
                                </Button>
                                
                                <Link 
                                    href="/dashboard/profile" 
                                    aria-label="Profile Settings"
                                    className="active:scale-95 transition-transform duration-300"
                                >
                                     <Avatar className="h-8 w-8 border-2 border-background ring-1 ring-black/10 dark:ring-white/10 shadow-sm">
                                         <AvatarImage src={userAvatarUrl || undefined} alt={userFullName || 'User Avatar'} />
                                         <AvatarFallback className="text-[10px] font-bold bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white">
                                             {getInitials(userFullName) || <UserCircle className="h-4 w-4" />}
                                         </AvatarFallback>
                                     </Avatar>
                                 </Link>
                             </>
                        ) : null}
                        
                        <div className="active:scale-95 transition-transform duration-300 scale-90 sm:scale-100">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>

            </div>
        </header>
    );
}