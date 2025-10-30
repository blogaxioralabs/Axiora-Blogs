// Axiora-Blogs/components/HeroSearchbar.tsx

'use client';

import { useRouter } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';

export function HeroSearchbar() {
    const router = useRouter();
    const [query, setQuery] = useState('');


    const handleSearch = useDebouncedCallback((term: string) => {
        if (term.length >= 3) {
            router.push(`/search?q=${term}`);
        }
    }, 500);

    return (
        <div className="relative group">
            <input 
                type="text"
                name="q"
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-3 border rounded-full text-base backdrop-blur-sm transition-all duration-300 shadow-lg 
                           bg-gray-100/50 border-gray-200/80 text-foreground placeholder:text-muted-foreground 
                           focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/80
                           dark:bg-gray-900/50 dark:border-white/20 dark:text-white dark:placeholder:text-gray-400
                           dark:focus:bg-black/50 dark:focus:ring-white/50"
                onChange={(e) => {
                    setQuery(e.target.value);
                    handleSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && query) {
                        router.push(`/search?q=${query}`);
                    }
                }}
                defaultValue={query}
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors duration-300" />
        </div>
    );
}