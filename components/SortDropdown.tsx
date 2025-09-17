// components/SortDropdown.tsx
'use client';

import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";

interface SortDropdownProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function SortDropdown({ options, value, onChange }: SortDropdownProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={cn(
          "h-10 w-full cursor-pointer appearance-none rounded-md border border-input bg-background pl-10 pr-8 text-sm ring-offset-background",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}