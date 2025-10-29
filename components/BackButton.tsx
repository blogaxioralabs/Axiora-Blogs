// components/BackButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      // --- Venas kaḷa than ---
      variant="ghost"     // Background eka næthuva hover ekedi pamaṇak pennanna
      size="sm"           // Podi size ekak (text ekath ekka)
      // ---------------------
      onClick={() => router.back()}
      // --- Style kirīma: Tikak loku padding, raum vū kenavaru, hover ekedi venas venna ---
      className={cn(
          "group inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground", // <-- Class tika venas kaḷā
          className
      )}
      aria-label="Go back to previous page"
    >
      {/* Icon ekaṭa hover ekedi podiyata pasupasaṭa yana effect ekak */}
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> {/* <-- Class venas kaḷā */}
      {/* "Back" text eka */}
      <span>Back</span> {/* <-- Text eka ekathu kaḷā */}
    </Button>
  );
}