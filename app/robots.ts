import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = 'https://axiora-blogs.vercel.app/sitemap.xml'; // ඔබගේ වෙබ් අඩවියේ আসল URL එක මෙතනට දාන්න

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Admin page එක search results වල පෙන්වීම නැවැත්වීම
    },
    sitemap: sitemapUrl,
  };
}