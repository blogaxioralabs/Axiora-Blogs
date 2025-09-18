import { NewsCard } from '@/components/NewsCard';
import { Pagination } from '@/components/Pagination';
import { NewsFilterControls } from '@/components/NewsFilterControls';
import { Rss } from 'lucide-react';
import type { Metadata } from 'next';
import type { NewsArticle } from '@/lib/types'; // Using the centralized type

const POSTS_PER_PAGE = 24;

async function getStemNews(page: number, sortBy: string) {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
        console.error("News API key is not configured.");
        return { articles: [], totalPages: 0 };
    }
    
    const query = '(science OR technology OR engineering OR mathematics OR AI OR space OR programming) NOT (celebrity OR politics OR sports)';
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=${sortBy}&language=en&page=${page}&pageSize=${POSTS_PER_PAGE}&apiKey=${apiKey}`;

    try {
        const response = await fetch(url, { next: { revalidate: 3600 } }); 

        if (!response.ok) {
            const errorBody = await response.json();
            console.error(`News API error: ${response.statusText}`, errorBody);
            return { articles: [], totalPages: 0 };
        }

        const data = await response.json();
        
        const totalResults = Math.min(data.totalResults, 100); 
        const totalPages = Math.ceil(totalResults / POSTS_PER_PAGE);

        const articles = data.articles.filter((article: NewsArticle) => article.urlToImage && article.title && article.description);

        return { articles, totalPages };

    } catch (error) {
        console.error("Failed to fetch news:", error);
        return { articles: [], totalPages: 0 };
    }
}

export const metadata: Metadata = {
  title: 'Latest STEM News',
  description: 'Stay updated with the latest news and breakthroughs from the world of STEM, curated by Axiora Blogs.',
};

export default async function NewsPage({ searchParams }: {
    searchParams?: {
        page?: string;
        sortBy?: string;
    };
}) {
    const currentPage = Number(searchParams?.page) || 1;
    const sortBy = searchParams?.sortBy || 'publishedAt';
    const { articles, totalPages } = await getStemNews(currentPage, sortBy);

    return (
        <div className="container py-12">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-3 rounded-full mb-4">
                    <Rss className="h-8 w-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    Latest in STEM
                </h1>
                <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
                    Discover the latest breakthroughs and stories from the worlds of science, technology, engineering, and math.
                </p>
            </div>

            <div className="flex justify-end mb-8">
                <NewsFilterControls />
            </div>

            {articles.length > 0 ? (
                <>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* --- THIS IS THE FIX --- */}
                        {articles.map((article: NewsArticle, index: number) => (
                            <NewsCard key={`${article.url}-${index}`} article={article} />
                        ))}
                    </div>
                    <Pagination totalPages={totalPages} />
                </>
            ) : (
                <div className="text-center py-20 px-6 bg-secondary/30 rounded-lg">
                    <h3 className="font-semibold text-lg">Could Not Load News</h3>
                    <p className="text-muted-foreground mt-1">
                        There was an issue fetching the latest news. This might be due to API rate limits. Please try again later.
                    </p>
                </div>
            )}
        </div>
    );
}