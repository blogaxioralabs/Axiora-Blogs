// app/blog/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server'; 
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';
import { RelatedPosts } from '@/components/RelatedPosts'; 
import type { Post } from '@/lib/types'; 
import type { Metadata, ResolvingMetadata } from 'next'; 

async function getPostData(slug: string): Promise<Post | null> {
    const supabase = createClient(); 
    const { data: postData, error } = await supabase
        .from('posts')
        .select(`*,
                 like_count,
                 view_count,
                 categories ( name ),
                 sub_categories ( name, slug ),
                 tags ( id, name, slug )`)
        .eq('slug', slug)
        .single();

    if (error || !postData) {
        console.error("Server Error fetching post:", error?.message || "Post data is null");
        return null;
    }
    return postData as Post;
}


export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getPostData(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found | Axiora Blogs',
      description: 'The blog post you are looking for could not be found.',
    }
  }
  
  function createExcerpt(content: string, length = 155): string {
      if (!content) return '';

      const strippedContent = content
          .replace(/!\[.*?\]\(.*?\)/g, '') 
          .replace(/\[(.*?)\]\(.*?\)/g, '$1') 
          .replace(/<[^>]*>/g, '') 
          .replace(/(\r\n|\n|\r)/gm, " ")
          .replace(/#+\s/g, '') 
          .replace(/[`*_\-~|]/g, '') 
          .replace(/\s+/g, ' ').trim(); 
      if (strippedContent.length <= length) return strippedContent;
      const trimmed = strippedContent.substring(0, length);
      // Ensure trimming doesn't cut a word in half
      return trimmed.substring(0, Math.min(trimmed.length, trimmed.lastIndexOf(' '))) + '...';
  }

  const description = createExcerpt(post.content || '');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://axiora-blogs.vercel.app';
  const url = `${siteUrl}/blog/${post.slug}`;
  const imageUrl = post.image_url || `${siteUrl}/axiora-og-image.png`;

  // --- Keywords හදන තැන වෙනස් කළා ---
  const keywords = ['Axiora Blogs'];
  if (post.categories?.name) {
    keywords.push(post.categories.name); // category එකක් තියෙනවනම් විතරක් දානවා
  }
  keywords.push(...(post.tags?.map(tag => tag.name) || [])); // tags තියෙනවනම් විතරක් දානවා
  keywords.push(...post.title.split(' ')); // title එකේ වචන ටික දානවා
  // --- වෙනස මෙතනින් ඉවරයි ---

  return {
    title: post.title,
    description: description,
    openGraph: {
        title: `${post.title} | Axiora Blogs`,
        description: description,
        url: url,
        siteName: 'Axiora Blogs',
        images: [ { url: imageUrl, width: 1200, height: 630, alt: post.title, } ],
        locale: 'en_US',
        type: 'article',
        publishedTime: post.created_at,
        authors: [post.author_name || 'Axiora Labs'],
        tags: post.tags?.map(tag => tag.name),
        ...(post.categories?.name && { section: post.categories.name }),
    },
    twitter: {
        card: 'summary_large_image',
        title: `${post.title} | Axiora Blogs`,
        description: description,
        images: [imageUrl],
    },
    alternates: { canonical: url, },
    keywords: keywords, // හදපු keywords array එක මෙතනට දානවා
  }
}

// ... (Default export BlogPostPage function එක එහෙමම තියන්න)
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getPostData(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <>
            <BlogPostClient initialPost={post} />
            <RelatedPosts currentPostId={post.id} />
        </>
    );
}
