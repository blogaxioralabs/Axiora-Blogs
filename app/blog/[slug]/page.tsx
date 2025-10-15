import { supabase } from '../../../lib/supabaseClient';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypePrism from 'rehype-prism-plus';
import 'prismjs/themes/prism-tomorrow.css';
import { ShareButtons } from '@/components/ShareButtons';
import { ViewCounter } from '@/components/ViewCounter';
import { Eye, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { LikeButton } from '@/components/LikeButton';
import { CommentSection } from '@/components/CommentSection';
import { RelatedPosts } from '@/components/RelatedPosts';
import { CitationGenerator } from '@/components/CitationGenerator';
import type { Metadata } from 'next';
import Image from 'next/image';

type PostPageProps = {
  params: { slug: string };
};

function createExcerpt(content: string, length = 155): string {
    if (!content) return '';
    const strippedContent = content.replace(/(\r\n|\n|\r|#|\[.*?\]\(.*?\)|!\[.*?\]\(.*?\))/gm, " ").replace(/\s+/g, ' ').trim();
    if (strippedContent.length <= length) return strippedContent;
    return strippedContent.substring(0, strippedContent.lastIndexOf(' ', length)) + '...';
}

async function getPost(slug: string) {
  const { data: post, error } = await supabase
    .from('posts')
    .select(`*, like_count, view_count, categories ( name ), sub_categories ( name, slug ), tags ( id, name, slug )`)
    .eq('slug', slug)
    .single();

  if (error || !post) return null;
  return post;
}

// --- UPDATED & SIMPLIFIED: Custom Image Component for ReactMarkdown ---
const MarkdownImage = ({ src, alt }: { src?: string; alt?: string; }) => {
    if (!src) return null;

    return (
        <figure className="content-image">
            <Image
                src={src}
                alt={alt || 'Blog content image'}
                width={800}
                height={450}
                className="w-full h-auto object-cover rounded-lg"
            />
            {alt && <figcaption className="text-center text-sm text-muted-foreground mt-2">{alt}</figcaption>}
        </figure>
    );
};

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const siteUrl = 'https://axiora-blogs.vercel.app';
  const excerpt = createExcerpt(post.content || '');
  const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': post.title,
      'image': post.image_url || `${siteUrl}/axiora-logo.png`,
      'author': {
          '@type': 'Person',
          'name': post.author_name || 'Axiora Labs',
      },
      'publisher': {
          '@type': 'Organization',
          'name': 'Axiora Blogs',
          'logo': {
              '@type': 'ImageObject',
              'url': `${siteUrl}/axiora-logo.png`,
          },
      },
      'datePublished': new Date(post.created_at).toISOString(),
      'description': excerpt,
  };

  return (
    <>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="container max-w-4xl py-12">
            <ViewCounter postId={post.id} />
            <article>
                <header className="mb-8">
                    {post.categories && (
                        <p className="text-primary font-semibold mb-2">{post.categories.name}</p>
                    )}
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center text-muted-foreground mt-4 text-sm gap-x-4 gap-y-2">
                        {post.author_name && (
                             <div className="flex items-center gap-1.5">
                                <UserCircle className="h-4 w-4" />
                                <span>{post.author_name}</span>
                            </div>
                        )}
                        <span>
                            Posted on {new Date(post.created_at).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric',
                            })}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <Eye className="h-4 w-4" />
                            <span>{post.view_count || 0} views</span>
                        </div>
                    </div>
                </header>

                {post.image_url && (
                    <Image
                        src={post.image_url}
                        alt={`${post.title} - Main image`}
                        width={1200}
                        height={675}
                        className="w-full h-auto rounded-lg shadow-lg mb-8"
                        priority
                    />
                )}

                <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown
                        rehypePlugins={[rehypePrism]}
                        components={{
                            img: MarkdownImage,
                        }}
                    >
                        {post.content || ''}
                    </ReactMarkdown>
                </div>

                {post.tags && post.tags.length > 0 && (
                    <div className="mt-6 pt-6 border-t flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold mr-2">Tags:</span>
                        {post.tags.map((tag: { id: number; name: string; slug: string; }) => (
                            <Link key={tag.id} href={`/tag/${tag.slug}`}>
                               <span className="text-xs bg-secondary text-secondary-foreground py-1 px-2.5 rounded-full hover:bg-secondary/80 transition-colors">
                                    #{tag.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}

                <ShareButtons title={post.title} />
                <LikeButton postId={post.id} initialLikes={post.like_count || 0} />
                <CommentSection postId={post.id} />
                <CitationGenerator post={post} />
            </article>
        </div>

        <RelatedPosts currentPostId={post.id} />
    </>
  );
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const post = await getPost(params.slug);
    if (!post) { return { title: 'Post Not Found' }; }
    const excerpt = createExcerpt(post.content || '');
    const siteUrl = 'https://axiora-blogs.vercel.app';

    return {
        title: post.title,
        description: excerpt,
        alternates: {
            canonical: `${siteUrl}/blog/${post.slug}`,
        },
        openGraph: {
            title: post.title,
            description: excerpt,
            url: `${siteUrl}/blog/${post.slug}`,
            type: 'article',
            images: [{ url: post.image_url || `${siteUrl}/axiora-logo.png` }],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: excerpt,
            images: [post.image_url || `${siteUrl}/axiora-logo.png`],
        },
    };
}