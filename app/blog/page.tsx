// app/blog/page.tsx
import { Suspense } from 'react';
import BlogPageClient from './BlogPageClient';
import type { Metadata } from 'next';

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

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Explore all articles about Science, Technology, Engineering, and Mathematics on Axiora Blogs.',
};