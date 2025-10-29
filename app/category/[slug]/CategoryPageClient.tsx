// app/category/[slug]/CategoryPageClient.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { AnimatedPostCard } from '@/components/AnimatedPostCard';
// --- Select components saha Input, Search icon import karanna ---
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input'; // <-- Aluthin ekathu karanna
import { Filter, Search } from 'lucide-react'; // <-- Search ekathu karanna
import { BackButton } from '@/components/BackButton';
import type { Post, Category, SubCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CategoryPageClientProps {
  category: Category;
  initialPosts: Post[];
  allSubCategories: SubCategory[];
}

export default function CategoryPageClient({ category, initialPosts, allSubCategories }: CategoryPageClientProps) {
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [postsToShow, setPostsToShow] = useState<Post[]>(initialPosts);
  // --- Sub-category search sadaha state ekak ---
  const [subCategorySearch, setSubCategorySearch] = useState('');
  // ------------------------------------------

  // Filter relevant sub-categories (venasak næhæ)
  const relevantSubCategories = useMemo(() => {
    return allSubCategories.filter(sc => sc.parent_category_id === category.id);
  }, [allSubCategories, category.id]);

  // --- Search eken filter karapu sub-categories ---
  const filteredSubCategoriesForDropdown = useMemo(() => {
    return relevantSubCategories.filter(sub =>
      sub.name.toLowerCase().includes(subCategorySearch.toLowerCase())
    );
  }, [relevantSubCategories, subCategorySearch]);
  // ------------------------------------------------

  // Filter posts based on selection (venasak næhæ)
  useEffect(() => {
    setLoading(true);
    let filteredPosts = initialPosts;
    if (selectedSubCategory !== 'all' && selectedSubCategory.startsWith('sub-')) {
        const subIdString = selectedSubCategory.split('-')[1];
        if (subIdString) {
            const subId = parseInt(subIdString);
            if (!isNaN(subId)) {
                filteredPosts = initialPosts.filter(post => post.sub_category_id === subId);
            }
        }
    }
    setPostsToShow(filteredPosts);
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, [selectedSubCategory, initialPosts]);

  // Get selected label (venasak næhæ)
  const getSelectedLabel = () => {
    if (selectedSubCategory === 'all') return `All ${category.name}`;
    const subIdString = selectedSubCategory.split('-')[1];
    if (!subIdString) return `All ${category.name}`;
    const subId = parseInt(subIdString);
    if (isNaN(subId)) return `All ${category.name}`;
    const sub = relevantSubCategories.find(s => s.id === subId);
    return sub ? sub.name : `All ${category.name}`;
  };

  return (
  <div className="container py-8 md:py-12">
    {/* --- Back Button --- */}
    <div className="mb-4">
      <BackButton />
    </div>
    {/* ----------------- */}
      {/* Title and Filter Section (venasak næhæ) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight flex-shrink-0 mr-4">
          Category: <span className="text-primary">{category.name}</span>
        </h1>
        {relevantSubCategories.length > 0 && (
          // --- Select component eka ---
          <Select
            value={selectedSubCategory}
            onValueChange={(value) => {
              setSelectedSubCategory(value);
              // Dropdown eka close karanna search input eken focus eka ayin karanna onē nǣ.
              // Select component eka mēka handle karanava.
            }}
            // Dropdown eka open karanakota search eka reset karanna
            onOpenChange={(open) => {
              if (open) {
                setSubCategorySearch('');
              }
            }}
          >
            {/* Trigger Button (venasak næhæ) */}
            <SelectTrigger
              className={cn(
                "w-full sm:w-[250px] justify-between rounded-full font-semibold",
                "border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm h-10",
                "focus:ring-2 focus:ring-ring focus:ring-offset-2"
              )}
              aria-label={`Filter posts in ${category.name} category`}
            >
              <div className="flex items-center gap-2 truncate">
                <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate flex-1 text-left">{getSelectedLabel()}</span>
              </div>
            </SelectTrigger>

            {/* --- Dropdown Content (Search bar ekathu kara) --- */}
            <SelectContent>
              {/* === Search Bar === */}
              <div className="relative p-2 border-b">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search tags..."
                  value={subCategorySearch}
                  // Input eke type karana kota dropdown eka close novenna hædīma
                  onClick={(e) => e.stopPropagation()} // Click event eka parent Select ekaṭa yana eka navathvanava
                  onChange={(e) => {
                    e.stopPropagation(); // Change event ekath navathvanava
                    setSubCategorySearch(e.target.value);
                  }}
                  onKeyDown={(e) => e.stopPropagation()} // Keydown event ekath navathvanava
                  className="h-9 pl-9 text-sm" // Height, padding adjust karanna
                />
              </div>
              {/* ================== */}

              {/* === Filtered Sub-Category List === */}
              {/* "All" Option */}
              <SelectItem value="all">All {category.name} Posts</SelectItem>

              {/* Filtered Sub-Categories */}
              {filteredSubCategoriesForDropdown.length > 0 ? (
                filteredSubCategoriesForDropdown.map((sub) => (
                  <SelectItem key={sub.id} value={`sub-${sub.id}`}>
                    {sub.name}
                  </SelectItem>
                ))
              ) : subCategorySearch ? (
                 // No results message
                 <div className="px-2 py-1.5 text-center text-sm text-muted-foreground">
                   No tags found for "{subCategorySearch}"
                 </div>
              ) : (
                 // Message if no sub-categories exist initially (rare case)
                 <div className="px-2 py-1.5 text-center text-sm text-muted-foreground">
                   No tags available
                 </div>
              )}
              {/* =================================== */}
            </SelectContent>
            {/* ------------------------------------- */}
          </Select>
          // --------------------------
        )}
      </div>

      {/* Display Posts Section (venasak næhæ) */}
      {loading ? (
        <p className="text-center text-muted-foreground pt-10">Filtering posts...</p>
      ) : postsToShow.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {postsToShow.map((post, index) => (
            <AnimatedPostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground pt-10">
          No posts found {selectedSubCategory !== 'all' ? `for the tag "${getSelectedLabel()}"` : 'in this category'} yet.
        </p>
      )}
    </div>
  );
}