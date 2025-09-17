'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

export function Pagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center space-x-4 mt-12">
            <Link href={createPageURL(currentPage - 1)} passHref>
                <Button variant="outline" size="icon" disabled={currentPage <= 1}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            </Link>
            <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
            </span>
            <Link href={createPageURL(currentPage + 1)} passHref>
                <Button variant="outline" size="icon" disabled={currentPage >= totalPages}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </Link>
        </div>
    );
}