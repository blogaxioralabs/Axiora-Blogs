// app/news/[slug]/loading.tsx
// Skeleton loader for individual news article pages
// Improves perceived LCP by showing layout immediately while content streams

import { Skeleton } from '@/components/ui/skeleton';

export default function NewsPostLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 animate-in fade-in duration-300">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-4 w-12 rounded" />
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-20 rounded" />
      </div>

      {/* Title skeleton */}
      <Skeleton className="mb-4 h-10 w-full rounded-lg" />
      <Skeleton className="mb-2 h-10 w-3/4 rounded-lg" />

      {/* Meta skeleton */}
      <div className="mb-8 flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
        </div>
      </div>

      {/* Hero image skeleton */}
      <Skeleton className="mb-8 aspect-video w-full rounded-xl" />

      {/* Content skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
        <div className="py-2" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
        <div className="py-2" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
      </div>
    </div>
  );
}
