import { Article, WithContext, Organization, FAQPage, BreadcrumbList } from 'schema-dts';

export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://axiorablogs.com', // Change to padumainduwara.me if needed
  name: 'Axiora Blogs',
  description: 'World-class articles on Science, Technology, Engineering, AI, and Mathematics.',
  author: 'Paduma Induwara',
  twitterHandle: '@axiorablogs',
  ogImage: '/axiora-og-image.png'
};

// 1. Organization Schema (Knowledge Graph සඳහා - E-E-A-T)
export function getOrganizationSchema(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/axiora-logo.png`,
    sameAs: [
      'https://twitter.com/axiorablogs',
      'https://facebook.com/axiorablogs',
      'https://linkedin.com/company/axiora-labs'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'contact@axiorablogs.com'
    }
  };
}

// 2. Article Schema (Google SGE & News සඳහා - Advanced)
export function getArticleSchema(post: any, url: string): WithContext<Article> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: post.title,
    image: [
       post.image_url || `${siteConfig.url}${siteConfig.ogImage}`
    ],
    datePublished: new Date(post.created_at).toISOString(),
    dateModified: new Date(post.created_at).toISOString(), // Update if you have updated_at
    author: {
      '@type': 'Person',
      name: post.profiles?.full_name || siteConfig.author,
      url: `${siteConfig.url}/author/${post.user_id}`
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/axiora-logo.png`
      }
    },
    description: post.content?.substring(0, 160).replace(/[#*`_]/g, '') + '...',
    articleBody: post.content, // For AI analysis
    keywords: post.tags?.map((t: any) => t.name).join(', '),
    articleSection: post.categories?.name || 'Technology',
    inLanguage: 'en-US',
    isAccessibleForFree: true,
  };
}