// app/news/NewsPageClient.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Search, LayoutGrid, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/Pagination';
import NewsCard from '@/components/NewsCard'; 
import { cn } from '@/lib/utils';

const POSTS_PER_PAGE = 9;

interface NewsPageClientProps {
  excludeNewsId?: string | number;
  // ✅ Server-side preloaded data for SEO + instant first paint
  initialNews?: any[];
  initialTotalPages?: number;
  initialProfilesData?: Record<string, any>;
  initialCategories?: any[];
}

export default function NewsPageClient({ 
  excludeNewsId,
  initialNews = [],
  initialTotalPages = 0,
  initialProfilesData = {},
  initialCategories = [],
}: NewsPageClientProps) {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const [news, setNews] = useState<any[]>(initialNews);
  const [profilesData, setProfilesData] = useState<Record<string, any>>(initialProfilesData);
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(initialNews.length === 0); // Only show loading if no server data

  const [activeCategory, setActiveCategory] = useState<string>('all'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const dragDistance = useRef(0); 
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    dragDistance.current = 0; 
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    dragDistance.current += Math.abs(e.movementX);
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; 
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (dragDistance.current > 5) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    async function fetchCategories() {
      if (initialCategories.length > 0) return; // Skip if server provided
      const { data } = await supabase.from('news_categories').select('id, name').order('name');
      setCategories(data || []);
    }
    fetchCategories();
  }, [supabase, initialCategories.length]);

  const debouncedSetSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
  }, 500);

  useEffect(() => {
    async function fetchNewsData() {
      setLoading(true);
      setNews([]);

      let countQuery = supabase.from('news_posts').select('*', { count: 'exact', head: true }).eq('status', 'published');
      
      // Exclude Hero News
      if (excludeNewsId) {
          countQuery = countQuery.neq('id', excludeNewsId);
      }

      if (activeCategory !== 'all' && activeCategory !== 'top') {
        countQuery = countQuery.eq('category_id', parseInt(activeCategory));
      }
      if (searchQuery.length > 0) {
        countQuery = countQuery.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      const { count } = await countQuery;
      const calculatedTotalPages = Math.ceil((count || 0) / POSTS_PER_PAGE);
      setTotalPages(calculatedTotalPages);

      const validCurrentPage = Math.max(1, Math.min(currentPage, calculatedTotalPages || 1));
      const from = (validCurrentPage - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      let dataQuery = supabase
        .from('news_posts')
        .select('*, news_categories(name, slug)')
        .eq('status', 'published')
        .range(from, to);

      // Exclude Hero News
      if (excludeNewsId) {
          dataQuery = dataQuery.neq('id', excludeNewsId);
      }

      if (activeCategory === 'top') {
        dataQuery = dataQuery.order('like_count', { ascending: false });
      } else if (activeCategory === 'all') {
        dataQuery = dataQuery.order('published_at', { ascending: false });
      } else {
        dataQuery = dataQuery.eq('category_id', parseInt(activeCategory));
        dataQuery = dataQuery.order('published_at', { ascending: false });
      }

      if (searchQuery.length > 0) {
        dataQuery = dataQuery.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      const { data: newsData, error } = await dataQuery;

      if (!error && newsData) {
        setNews(newsData);

        const userIds = [...new Set(newsData.map((n) => n.author_id).filter(Boolean))] as string[];
        if (userIds.length > 0) {
          const { data: profiles } = await supabase.from('profiles').select('id, avatar_url, full_name').in('id', userIds);
          if (profiles) {
            const profilesMap = profiles.reduce((acc, profile) => {
              acc[profile.id] = { avatar_url: profile.avatar_url, full_name: profile.full_name };
              return acc;
            }, {} as Record<string, any>);
            setProfilesData(profilesMap);
          }
        }
      }
      setLoading(false);
    }

    fetchNewsData();
  }, [currentPage, activeCategory, searchQuery, supabase, excludeNewsId]);

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-4xl font-bold text-center md:text-left">All News</h1>
        
        <div className="relative w-72 md:w-96">
          <Input
            type="text"
            placeholder="Search news on this page..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              debouncedSetSearchQuery(e.target.value);
            }}
            className="pl-10 rounded-full h-10 bg-secondary/50 dark:bg-input/50 shadow-sm focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary/50"
          />
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div className="relative w-full max-w-5xl mx-auto mb-10 group">
        <div 
          className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background via-background/80 to-transparent z-10 flex items-center justify-end pr-2 cursor-pointer transition-opacity duration-300"
          onClick={scrollRight}
        >
          <div className="bg-background/80 hover:bg-background border shadow-sm rounded-full p-1.5 backdrop-blur-md transition-all">
            <ChevronRight className="h-5 w-5 text-foreground" />
          </div>
        </div>

        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onClickCapture={handleClickCapture}
          className="flex items-center gap-3 overflow-x-auto hide-scrollbar bg-card/60 backdrop-blur-xl border border-border shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.05)] rounded-full px-4 py-3 cursor-grab active:cursor-grabbing"
        >
          <Button
            variant={activeCategory === 'all' ? 'default' : 'ghost'}
            onClick={() => setActiveCategory('all')}
            className={cn("rounded-full font-semibold shrink-0 transition-all duration-300", activeCategory === 'all' ? "shadow-md scale-105" : "hover:bg-secondary text-muted-foreground hover:text-foreground")}
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            All News
          </Button>

          <Button
            variant={activeCategory === 'top' ? 'default' : 'ghost'}
            onClick={() => setActiveCategory('top')}
            className={cn("rounded-full font-semibold shrink-0 transition-all duration-300", activeCategory === 'top' ? "shadow-md scale-105" : "hover:bg-secondary text-muted-foreground hover:text-foreground")}
          >
            Top Stories
          </Button>
          
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === String(cat.id) ? 'default' : 'ghost'}
              onClick={() => setActiveCategory(String(cat.id))}
              className={cn("rounded-full font-semibold shrink-0 transition-all duration-300", activeCategory === String(cat.id) ? "shadow-md scale-105" : "hover:bg-secondary text-muted-foreground hover:text-foreground")}
            >
              {cat.name}
            </Button>
          ))}

          <div className="w-6 shrink-0" aria-hidden="true" />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {loading ? (
        <p className="text-center text-muted-foreground pt-10">Loading news...</p>
      ) : news.length > 0 ? (
        <>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => {
              const profileInfo = item.author_id ? profilesData[item.author_id] : null;
              const newsWithProfile = { ...item, profiles: profileInfo };
              
              return (
                 <NewsCard key={item.id} news={newsWithProfile} />
              );
            })}
          </div>
          <Pagination totalPages={totalPages} />
        </>
      ) : (
        <p className="text-center text-muted-foreground pt-10">
          {searchQuery.length > 0
            ? `No news found matching "${searchQuery}".`
            : 'No news found in this category. Check back later!'
          }
        </p>
      )}
    </div>
  );
}