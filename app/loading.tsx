import { Skeleton } from "@/components/ui/skeleton"; // Meka nathan pahala thiyena 'podi udawwa' balanna

export default function Loading() {
  return (
    <div className="container py-12 space-y-8 animate-in fade-in duration-500">
      {/* 1. Hero Section Skeleton */}
      <div className="w-full h-[300px] md:h-[400px] rounded-2xl bg-muted/50 animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
        <div className="absolute bottom-6 left-6 right-6 space-y-4">
          <div className="h-8 md:h-12 w-3/4 bg-background/50 rounded-lg" />
          <div className="h-4 md:h-6 w-1/2 bg-background/50 rounded-lg" />
        </div>
      </div>

      {/* 2. Filter Bar Skeleton */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-24 shrink-0 rounded-full bg-muted animate-pulse" />
        ))}
      </div>

      {/* 3. Blog Post Grid Skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="flex flex-col space-y-3 p-4 border rounded-xl bg-card shadow-sm">
            {/* Image Placeholder */}
            <div className="h-48 w-full rounded-lg bg-muted/80 animate-pulse relative overflow-hidden">
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] animate-[shimmer_1.5s_infinite]" />
            </div>
            {/* Content Lines */}
            <div className="space-y-2 pt-2">
              <div className="h-4 w-1/4 bg-primary/20 rounded" />
              <div className="h-6 w-4/5 bg-foreground/20 rounded" />
              <div className="h-4 w-full bg-muted-foreground/20 rounded" />
              <div className="h-4 w-2/3 bg-muted-foreground/20 rounded" />
            </div>
            {/* Footer Line */}
            <div className="pt-4 mt-auto flex justify-between items-center">
               <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
               <div className="h-4 w-20 bg-muted animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}