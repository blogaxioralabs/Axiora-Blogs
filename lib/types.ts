
export type Post = {
    id: number;
    title: string;
    slug: string;
    image_url?: string;
    created_at: string;
    category_id: number;
    sub_category_id?: number;
    categories?: { name: string };
    sub_categories?: { name: string; slug: string };
    content?: string;
    is_featured?: boolean;
    author_name?: string;
    like_count?: number;
    view_count?: number;
    tags?: { id: number; name: string; slug: string; }[];
};

export type Category = { 
    id: number; 
    name: string; 
};

export type SubCategory = { 
    id: number; 
    name: string; 
    parent_category_id: number; 
};

export type NewsArticle = {
    source: { id: string | null; name: string; };
    author: string | null;
    title: string;
    description: string;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string;
};