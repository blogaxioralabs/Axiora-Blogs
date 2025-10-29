
export type Post = {
    id: number;
    title: string;
    slug: string;
    image_url?: string | null; // Changed to allow null
    created_at: string;
    category_id: number;
    sub_category_id?: number | null; // Changed to allow null
    categories?: { name: string } | null; // Changed to allow null
    sub_categories?: { name: string; slug: string } | null; // Changed to allow null
    content?: string | null; // Changed to allow null
    is_featured?: boolean;
    author_name?: string | null; // Changed to allow null
    like_count?: number;
    view_count?: number;
    tags?: { id: number; name: string; slug: string; }[] | null; // Changed to allow null
    user_id?: string; // Add user_id if needed elsewhere

    // --- අලුතින් එකතු කළ කොටස ---
    profiles?: { // Use profiles (table name) for clarity
        avatar_url: string | null;
        full_name?: string | null; // Optional: Also fetch full_name from profile if needed
    } | null; // Allow profiles to be null if join fails or no profile exists
    // ----------------------------
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