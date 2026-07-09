import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server'; 
import SecretTrigger from './SecretTrigger';

type Category = {
    id: number;
    name: string;
    slug: string;
};

export default async function Footer() {
    const supabase = createClient();
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name', { ascending: true });

    return (
        <footer className="border-t bg-card">
            {/* Top Main Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 text-left">
                    
                    {/* Brand & About Section */}
                    {/* lg:pr-8 added to give the text some breathing room from the next column on desktop */}
                    <div className="space-y-4 flex flex-col items-start lg:pr-8">
                        <Link href="/" className="inline-block">
                             <div className="relative w-32 h-10"> 
                                <Image 
                                    src="/axiora-logo.png" 
                                    alt="Axiora Labs Logo" 
                                    fill
                                    style={{ objectFit: 'contain', objectPosition: 'left' }}
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </div>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                            Exploring the frontiers of Science, Technology, Engineering, and Mathematics. Developed by Axiora Labs.
                        </p>
                    </div>

                    {/* Quick Links */}
                    {/* lg:pl-16 pushes this section to the right on desktop to balance the space */}
                    <div className="flex flex-col items-start lg:pl-16">
                        <h3 className="font-semibold mb-5 text-foreground uppercase tracking-wider text-sm">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-[#2b76b1] transition-colors">Home</Link></li>
                            <li><Link href="/blogs" className="hover:text-[#2b76b1] transition-colors">Blogs</Link></li>
                            <li><Link href="/news" className="hover:text-[#2b76b1] transition-colors">News</Link></li>
                            <li><Link href="/about" className="hover:text-[#2b76b1] transition-colors">About</Link></li>
                        </ul>
                    </div>
                    
                    {/* Categories Section */}
                    {/* lg:pl-8 visually balances this between Quick Links and Legal */}
                    <div className="flex flex-col items-start lg:pl-8">
                        <h3 className="font-semibold mb-5 text-foreground uppercase tracking-wider text-sm">Categories</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            {categories && categories.length > 0 ? (
                                categories.map((category: Category) => (
                                    <li key={category.id}>
                                        <Link href={`/category/${category.slug}`} className="hover:text-[#2b76b1] transition-colors">
                                            {category.name}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <>
                                    {/* Fallback if DB takes time or is empty */}
                                    <li><Link href="/category/engineering" className="hover:text-[#2b76b1] transition-colors">Engineering</Link></li>
                                    <li><Link href="/category/mathematics" className="hover:text-[#2b76b1] transition-colors">Mathematics</Link></li>
                                    <li><Link href="/category/science" className="hover:text-[#2b76b1] transition-colors">Science</Link></li>
                                    <li><Link href="/category/technology" className="hover:text-[#2b76b1] transition-colors">Technology</Link></li>
                                </>
                            )}
                        </ul>
                    </div>
                    
                    {/* Legal & Help Desk Section */}
                    <div className="flex flex-col items-start lg:pl-4">
                        <h3 className="font-semibold mb-5 text-foreground uppercase tracking-wider text-sm">Legal</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground mb-8">
                            <li><Link href="/privacy-policy" className="hover:text-[#2b76b1] transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms-and-conditions" className="hover:text-[#2b76b1] transition-colors">Terms & Conditions</Link></li>
                        </ul>

                        <h3 className="font-semibold mb-3 text-foreground uppercase tracking-wider text-sm">Help Desk</h3>
                        <a 
                            href="mailto:contact@axiorablogs.com" 
                            className="text-sm text-muted-foreground hover:text-[#2b76b1] transition-colors font-medium"
                        >
                            contact@axiorablogs.com
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Blue Bar */}
            <div className="bg-[#2b76b1] py-4 w-full">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 text-white/90 text-sm">
                        
                        {/* Left Side: Secret Trigger + Copyright */}
                        <div className="flex items-center gap-1 text-center sm:text-left">
                            <SecretTrigger /> 
                            <span>All Rights Reserved.</span>
                        </div>
                        
                        {/* Right Side: Credits */}
                        <div className="text-center sm:text-right font-medium">
                            Designed and Developed by{' '}
                            <a 
                                href="https://www.axioralabs.com" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-white hover:text-white/70 hover:underline underline-offset-4 transition-all"
                            >
                                www.axioralabs.com
                            </a>
                        </div>
                        
                    </div>
                </div>
            </div>
        </footer>
    );
}