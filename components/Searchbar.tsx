'use client';

import { useRouter } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { useEffect, useState } from 'react';

export default function Searchbar() {
    const router = useRouter();
    const [query, setQuery] = useState('');

    // Debounce function eka hadagamu
    // Meken wenne user type karala 300ms giyata passe search karana eka
    const handleSearch = useDebouncedCallback((term: string) => {
        if (term) {
            router.push(`/search?q=${term}`);
        } else {
            // Search eka clear kaloth Home ekata yanna
            router.push('/');
        }
    }, 300);

    // Initial load eke query eka ganna (optional, but good for UX)
    useEffect(() => {
        // This part can be enhanced to get query from URL if starting on a search page
    }, []);

    return (
        <div className="relative w-full max-w-xs">
            <input 
                type="text"
                name="q"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 border rounded-full text-sm bg-background"
                onChange={(e) => {
                    setQuery(e.target.value);
                    handleSearch(e.target.value);
                }}
                defaultValue={query} // You can sync this with URL params for advanced UX
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
    );
}