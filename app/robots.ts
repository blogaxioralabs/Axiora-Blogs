import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = 'https://axiora-blogs.vercel.app/sitemap.xml'; 

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/dashboard/', 
    },
    sitemap: sitemapUrl,
  };
}