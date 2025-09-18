'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SortDropdown } from './SortDropdown';

export function NewsFilterControls() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sortBy') || 'publishedAt';

    const handleSortChange = (newSortBy: string) => { // <-- මෙතන වෙනස් වෙනවා
        const params = new URLSearchParams(searchParams);
        params.set('sortBy', newSortBy);
        params.set('page', '1');
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <SortDropdown
            value={currentSort}
            onValueChange={handleSortChange} // <-- මෙතන වෙනස් වෙනවා
            options={[
                { value: 'publishedAt', label: 'Sort by: Latest' },
                { value: 'popularity', label: 'Sort by: Popularity' },
                { value: 'relevancy', label: 'Sort by: Relevancy' },
            ]}
        />
    );
}