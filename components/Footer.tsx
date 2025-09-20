import Link from 'next/link';
import Image from 'next/image';
import { NewsletterForm } from './NewsletterForm';
import { Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient'; 


type Category = {
    id: number;
    name: string;
    slug: string;
};


export default async function Footer() {
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name', { ascending: true });

    return (
        <footer className="border-t bg-card">
            <div className="container mx-auto px-4 py-12">
                {/* Top section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 text-center md:text-left border-b pb-10 mb-8">
                    
                    {/* About Section */}
                    <div className="space-y-4 col-span-1 md:col-span-3 flex flex-col items-center md:items-start">
                        <Link href="/" className="inline-block">
                             <div className="relative w-32 h-10"> 
                                <Image 
                                    src="/axiora-logo.png" 
                                    alt="Axiora Labs Logo" 
                                    fill
                                    style={{ objectFit: 'contain', objectPosition: 'center md:left' }}
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </div>
                        </Link>
                        <p className="text-sm text-muted-foreground px-4 md:px-0 md:pr-4">
                            Exploring the frontiers of Science, Technology, Engineering, and Mathematics. Developed by Axiora Labs.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="/news" className="hover:text-primary transition-colors">News</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
                            <li><a href="https://axioralabs.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Axiora Labs</a></li>
                        </ul>
                    </div>
                    
                    {/* Categories Section */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="font-semibold mb-4 text-foreground">Categories</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            {categories?.map((category: Category) => (
                                <li key={category.id}>
                                    <Link href={`/category/${category.slug}`} className="hover:text-primary transition-colors">
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Newsletter */}
                    <div className="col-span-1 md:col-span-5 flex flex-col items-center md:items-start">
                         <h3 className="font-semibold mb-4 text-foreground">Subscribe to our Newsletter</h3>
                         <p className="text-sm text-muted-foreground mb-4 px-4 md:px-0">
                            Get the latest articles and updates delivered straight to your inbox.
                         </p>
                         <NewsletterForm />
                    </div>
                </div>

                {/* Bottom section */}
                <div className="flex flex-col-reverse items-center justify-between gap-6 sm:flex-row">
                    <p className="text-sm text-muted-foreground text-center sm:text-left">
                        &copy; {new Date().getFullYear()} Axiora Labs. All Rights Reserved.
                    </p>
                    
                    <div className="flex items-center gap-5">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            <Twitter className="h-5 w-5" />
                            <span className="sr-only">Twitter</span>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            <Linkedin className="h-5 w-5" />
                            <span className="sr-only">LinkedIn</span>
                        </a>
                         <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            <Instagram className="h-5 w-5" />
                            <span className="sr-only">Instagram</span>
                        </a>
                         <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            <Facebook className="h-5 w-5" />
                            <span className="sr-only">Facebook</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}