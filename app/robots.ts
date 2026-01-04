import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = 'https://axiora-blogs.vercel.app/sitemap.xml'; 

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/secure-auth-f5a4/'],
    },
    sitemap: sitemapUrl,
  };
}