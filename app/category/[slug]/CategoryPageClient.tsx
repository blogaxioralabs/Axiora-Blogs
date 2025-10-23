// app/category/[slug]/CategoryPageClient.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { AnimatedPostCard } from '@/components/AnimatedPostCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react'; // Only Filter icon is needed now
import type { Post, Category, SubCategory } from '@/lib/types';
import { cn } from '@/lib/utils'; // cn function for combining styles

interface CategoryPageClientProps {
  category: Category;
  initialPosts: Post[];
  allSubCategories: SubCategory[]; // Receive all sub-categories related to the parent
}

export default function CategoryPageClient({ category, initialPosts, allSubCategories }: CategoryPageClientProps) {
  // State for the selected sub-category value (e.g., 'all' or 'sub-12')
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  // State to manage loading indicator during filtering
  const [loading, setLoading] = useState(false);
  // State to hold the posts currently displayed
  const [postsToShow, setPostsToShow] = useState<Post[]>(initialPosts);

  // Filter sub-categories relevant to the current main category
  const relevantSubCategories = useMemo(() => {
    return allSubCategories.filter(sc => sc.parent_category_id === category.id);
  }, [allSubCategories, category.id]);

  // Effect to filter posts when the selectedSubCategory changes
  useEffect(() => {
    setLoading(true); // Start loading state
    let filteredPosts = initialPosts; // Default to all initial posts for the category

    // If a specific sub-category is selected (and not 'all')
    if (selectedSubCategory !== 'all' && selectedSubCategory.startsWith('sub-')) {
        const subIdString = selectedSubCategory.split('-')[1];
        if (subIdString) {
            const subId = parseInt(subIdString);
            // Ensure subId is a valid number before filtering
            if (!isNaN(subId)) {
                filteredPosts = initialPosts.filter(post => post.sub_category_id === subId);
            }
        }
    }

    setPostsToShow(filteredPosts); // Update the posts to display

    // End loading state after a short delay for smoother UI transition
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer); // Cleanup timer on unmount or change

  }, [selectedSubCategory, initialPosts]);

  // Function to determine the display label for the selected value in the dropdown trigger
  const getSelectedLabel = () => {
    if (selectedSubCategory === 'all') {
      return `All ${category.name}`; // Label for 'all' selection
    }
    // Extract sub-category ID safely
    const subIdString = selectedSubCategory.split('-')[1];
    if (!subIdString) return `All ${category.name}`; // Fallback
    const subId = parseInt(subIdString);
    if (isNaN(subId)) return `All ${category.name}`; // Fallback

    // Find the sub-category name
    const sub = relevantSubCategories.find(s => s.id === subId);
    return sub ? sub.name : `All ${category.name}`; // Return name or fallback
  };

  return (
    <div className="container py-12">
      {/* --- Responsive Title and Filter Section --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        {/* Responsive Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold leading-tight flex-shrink-0 mr-4">
          Category: <span className="text-primary">{category.name}</span>
        </h1>
        {/* Render dropdown only if there are relevant sub-categories */}
        {relevantSubCategories.length > 0 && (
          <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
            {/* --- Styled Dropdown Trigger --- */}
            <SelectTrigger
              className={cn(
                // Base styles: width, layout, rounding, font
                "w-full sm:w-[250px] justify-between rounded-full font-semibold",
                // Appearance styles (like an outline button)
                "border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm h-10", // Added fixed height h-10
                // Focus ring styles
                "focus:ring-2 focus:ring-ring focus:ring-offset-2"
              )}
              aria-label={`Filter posts in ${category.name} category`}
            >
              {/* Content inside the trigger button */}
              <div className="flex items-center gap-2 truncate">
                <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                {/* Display selected label, ensuring it doesn't overflow */}
                <span className="truncate flex-1 text-left">{getSelectedLabel()}</span>
              </div>
              {/* The default ChevronDown icon is automatically added by SelectTrigger here */}
            </SelectTrigger>
            {/* --- End of Trigger --- */}

            {/* Dropdown Content */}
            <SelectContent>
              {/* Option to show all posts in the main category */}
              <SelectItem value="all">All {category.name} Posts</SelectItem>
              {/* List relevant sub-category options */}
              {relevantSubCategories.map((sub) => (
                <SelectItem key={sub.id} value={`sub-${sub.id}`}>
                  {sub.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      {/* --- Section End --- */}

      {/* Display Posts Section */}
      {loading ? (
        // Loading indicator
        <p className="text-center text-muted-foreground pt-10">Filtering posts...</p>
      ) : postsToShow.length > 0 ? (
        // Grid for posts
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {postsToShow.map((post, index) => (
            <AnimatedPostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      ) : (
        // Message when no posts are found
        <p className="text-center text-muted-foreground pt-10">
          No posts found {selectedSubCategory !== 'all' ? `for the tag "${getSelectedLabel()}"` : 'in this category'} yet.
        </p>
      )}
    </div>
  );
}