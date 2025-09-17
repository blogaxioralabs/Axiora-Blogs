'use client';

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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

export function CategoryFilter({ categories, subCategories, selectedValue, setSelectedValue }: CategoryFilterProps) {
  const [open, setOpen] = React.useState(false)

  const getLabel = () => {
    if (selectedValue === 'all') {
      return 'All Categories';
    }
    if (selectedValue.startsWith('cat-')) {
      const catId = parseInt(selectedValue.split('-')[1]);
      const categoryName = categories.find(c => c.id === catId)?.name;
      return categoryName ? `All ${categoryName}` : 'All Categories';
    }
    if (selectedValue.startsWith('sub-')) {
      const subId = parseInt(selectedValue.split('-')[1]);
      return subCategories.find(s => s.id === subId)?.name || 'All Categories';
    }
    return 'All Categories';
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          <span className="truncate">{getLabel()}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                  value="All Categories"
                  onSelect={() => {
                      setSelectedValue('all');
                      setOpen(false);
                  }}
              >
                <Check className={cn("mr-2 h-4 w-4", selectedValue === 'all' ? "opacity-100" : "opacity-0")} />
                All Categories
              </CommandItem>
            </CommandGroup>
            
            {categories.map((category) => {
              const childSubCategories = subCategories.filter(s => s.parent_category_id === category.id);
              
              {/* THIS IS THE FIX: We removed the line that was hiding empty categories */}
              return (
                <CommandGroup key={category.id} heading={category.name}>
                  <CommandItem
                      key={`cat-${category.id}`}
                      value={`All ${category.name}`}
                      onSelect={() => {
                          setSelectedValue(`cat-${category.id}`);
                          setOpen(false);
                      }}
                  >
                      <Check className={cn("mr-2 h-4 w-4", selectedValue === `cat-${category.id}` ? "opacity-100" : "opacity-0")} />
                      All {category.name}
                  </CommandItem>

                  {childSubCategories.map((sub) => (
                    <CommandItem
                      key={`sub-${sub.id}`}
                      value={sub.name}
                      onSelect={() => {
                        setSelectedValue(`sub-${sub.id}`);
                        setOpen(false);
                      }}
                      className="pl-8"
                    >
                      <Check className={cn("mr-2 h-4 w-4", selectedValue === `sub-${sub.id}` ? "opacity-100" : "opacity-0")} />
                      {sub.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}