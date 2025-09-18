'use client';

import * as React from "react";
import { Check, ChevronsUpDown, LayoutGrid, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Type definitions
type Category = {
    id: number;
    name: string;
};

type SubCategory = {
    id: number;
    name: string;
    parent_category_id: number;
};

interface CategoryFilterProps {
    categories: Category[];
    subCategories: SubCategory[];
    selectedValue: string;
    setSelectedValue: (value: string) => void;
}

// Custom hook to check screen size
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = React.useState(false);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      if (media.matches !== matches) setMatches(media.matches);
      const listener = () => setMatches(media.matches);
      window.addEventListener("resize", listener);
      return () => window.removeEventListener("resize", listener);
    }
  }, [matches, query]);
  return matches;
};

export function CategoryFilter({ categories, subCategories, selectedValue, setSelectedValue }: CategoryFilterProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const getLabel = () => {
    if (selectedValue === 'all') return 'All Categories';
    if (selectedValue.startsWith('cat-')) {
      const catId = parseInt(selectedValue.split('-')[1]);
      return categories.find(c => c.id === catId)?.name || 'Filter...';
    }
    if (selectedValue.startsWith('sub-')) {
      const subId = parseInt(selectedValue.split('-')[1]);
      return subCategories.find(s => s.id === subId)?.name || 'Filter...';
    }
    return 'Filter by Category';
  };

  const triggerButton = (
    <Button variant="outline" role="combobox" className="w-[250px] justify-between rounded-full font-semibold">
      <div className="flex items-center gap-2"><LayoutGrid className="h-4 w-4 text-muted-foreground" /><span className="truncate">{getLabel()}</span></div>
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );

  const handleSelectAndClose = (value: string) => {
    setSelectedValue(value);
    setOpen(false);
  };

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
        <PopoverContent className="w-[480px] p-0" align="end">
          <DesktopFilterContent {...{ categories, subCategories, selectedValue, setSelectedValue: handleSelectAndClose }} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="p-0 gap-0 h-[80dvh] flex flex-col">
        <DialogHeader className="p-4 border-b"><DialogTitle>Filter by Category</DialogTitle></DialogHeader>
        <MobileFilterContent {...{ categories, subCategories, selectedValue, setSelectedValue: handleSelectAndClose }} />
      </DialogContent>
    </Dialog>
  );
}

// --- Desktop Specific Component ---
function DesktopFilterContent({ categories, subCategories, selectedValue, setSelectedValue }: CategoryFilterProps) {
  const [activeCategoryId, setActiveCategoryId] = React.useState<number | null>(null);
  const activeSubCategories = React.useMemo(() => subCategories.filter(sc => sc.parent_category_id === activeCategoryId), [activeCategoryId, subCategories]);

  return (
    <div className="flex">
      <div className="w-[190px] border-r p-2 space-y-1">
        <CategoryItem label="All Categories" onMouseEnter={() => setActiveCategoryId(null)} onClick={() => setSelectedValue('all')} isSelected={selectedValue === 'all'} />
        {categories.map((cat) => (
          <CategoryItem key={cat.id} label={cat.name} onMouseEnter={() => setActiveCategoryId(cat.id)} onClick={() => setSelectedValue(`cat-${cat.id}`)} isSelected={selectedValue.startsWith('cat-') && parseInt(selectedValue.split('-')[1]) === cat.id} />
        ))}
      </div>
      <div className="flex-1 p-2 min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div key={activeCategoryId || 'placeholder'} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2, ease: 'easeInOut' }} className="h-full">
            {activeCategoryId && activeSubCategories.length > 0 ? (
              <div className="flex flex-col space-y-1"><p className="px-3 py-2 text-sm font-semibold">Tags</p>{activeSubCategories.map(sub => (<SubCategoryItem key={sub.id} label={sub.name} onClick={() => setSelectedValue(`sub-${sub.id}`)} isSelected={selectedValue === `sub-${sub.id}`}/>))}</div>
            ) : (<div className="h-full flex items-center justify-center text-sm text-muted-foreground p-4 text-center">{activeCategoryId ? 'No tags for this category' : 'Hover a category to see tags'}</div>)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Mobile Specific Component with Drill-Down Logic ---
function MobileFilterContent({ categories, subCategories, selectedValue, setSelectedValue }: CategoryFilterProps) {
    const [view, setView] = React.useState<'main' | 'sub'>('main');
    const [activeCategory, setActiveCategory] = React.useState<Category | null>(null);

    const subCategoriesForActive = subCategories.filter(sc => sc.parent_category_id === activeCategory?.id);

    const handleCategoryClick = (category: Category) => {
        setActiveCategory(category);
        setView('sub');
    };

    return (
        <div className="overflow-hidden flex-1 relative">
            <AnimatePresence>
                {view === 'main' && (
                    <motion.div key="main" initial={{ x: '-100%' }} animate={{ x: '0%' }} exit={{ x: '-100%' }} transition={{ ease: 'easeInOut', duration: 0.3 }} className="p-2 space-y-1 absolute w-full h-full overflow-y-auto">
                        <CategoryItem label="All Categories" onClick={() => setSelectedValue('all')} isSelected={selectedValue === 'all'}/>
                        {categories.map((cat) => (<CategoryItem key={cat.id} label={cat.name} onClick={() => handleCategoryClick(cat)} isSelected={selectedValue.startsWith('cat-') && parseInt(selectedValue.split('-')[1]) === cat.id} />))}
                    </motion.div>
                )}
                {view === 'sub' && activeCategory && (
                    <motion.div key="sub" initial={{ x: '100%' }} animate={{ x: '0%' }} exit={{ x: '100%' }} transition={{ ease: 'easeInOut', duration: 0.3 }} className="p-2 space-y-1 absolute w-full h-full overflow-y-auto">
                        <button onClick={() => setView('main')} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground w-full text-left">
                           <ArrowLeft className="h-4 w-4" /> Back to Categories
                        </button>
                        <div className="px-3 pt-4 pb-2 text-lg font-bold border-b mb-2">{activeCategory.name}</div>
                        <SubCategoryItem label={`All ${activeCategory.name}`} onClick={() => setSelectedValue(`cat-${activeCategory.id}`)} isSelected={selectedValue === `cat-${activeCategory.id}`} />
                        {subCategoriesForActive.map(sub => (<SubCategoryItem key={sub.id} label={sub.name} onClick={() => setSelectedValue(`sub-${sub.id}`)} isSelected={selectedValue === `sub-${sub.id}`} />))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- Shared UI Components ---
function CategoryItem({ label, isSelected, ...props }: { label: string, isSelected: boolean } & React.HTMLAttributes<HTMLDivElement>) {
    return (<div {...props} className={cn("px-3 py-2.5 text-sm font-medium rounded-md cursor-pointer transition-colors", isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent")}>{label}</div>)
}

function SubCategoryItem({ label, isSelected, ...props }: { label: string, isSelected: boolean } & React.HTMLAttributes<HTMLDivElement>) {
    return (<div {...props} className={cn("flex items-center justify-between px-3 py-2.5 text-sm rounded-md cursor-pointer transition-colors", isSelected ? "bg-accent text-accent-foreground font-semibold" : "hover:bg-accent")}>{label}{isSelected && <Check className="h-4 w-4" />}</div>)
}