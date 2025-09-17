// app/blog/page.tsx
import { Suspense } from 'react';
import BlogPageClient from './BlogPageClient';

function BlogLoadingFallback() {
  return <div className="container py-12 text-center">Loading...</div>;
}

export default function BlogIndexPage() {
  return (
    <Suspense fallback={<BlogLoadingFallback />}>
      <BlogPageClient />
    </Suspense>
  );
}