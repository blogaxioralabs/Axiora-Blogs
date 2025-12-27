'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Page Error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      
      {/* Background Ambience (Aurora Effect) */}
      <div className="absolute inset-0 -z-10 opacity-20 dark:opacity-10 pointer-events-none overflow-hidden">
         <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-primary/30 rounded-full blur-[100px] animate-pulse" />
         <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-blue-500/30 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      <div className="space-y-6 max-w-md mx-auto relative z-10 animate-in zoom-in-95 duration-500">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-destructive/5">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Something went wrong!
          </h2>
          <p className="text-muted-foreground text-lg">
            Don't worry, even our AI hiccups sometimes. We couldn't load this page.
          </p>
          {/* Technical Error Message (Optional - only show in dev or if needed) */}
          <p className="text-xs text-muted-foreground/50 font-mono bg-muted/50 p-2 rounded max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
            Error: {error.message || "Unknown Error"}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button 
            onClick={() => reset()} 
            size="lg" 
            className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            size="lg"
            className="gap-2 hover:bg-muted"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Go Back Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}