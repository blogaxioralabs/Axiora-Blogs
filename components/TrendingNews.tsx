import { Flame } from 'lucide-react';

interface NewsArticle {
    title: string;
    url: string;
    source: { name: string };
    publishedAt: string;
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export function TrendingNews({ articles }: { articles: NewsArticle[] }) {
    if (!articles || articles.length === 0) {
        return null;
    }

    return (
        <div className="bg-card border rounded-xl p-6 h-full">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Trending News</h2>
            <div className="space-y-5">
                {articles.map((article, index) => (
                    <a 
                        key={`${article.url}-${index}`} 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="block group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="mt-1 flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-sm bg-destructive/10 text-destructive">
                                <Flame className="h-3.5 w-3.5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1.5">
                                    {formatDate(article.publishedAt)} • {article.source.name}
                                </p>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}