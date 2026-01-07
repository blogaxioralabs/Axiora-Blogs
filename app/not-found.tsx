// app/not-found.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-4 text-center">
      <div className="space-y-2">
        <h1 className="text-6xl font-extrabold tracking-tighter sm:text-7xl text-primary">404</h1>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Page Not Found</h2>
        <p className="max-w-[500px] text-muted-foreground md:text-xl/relaxed">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
      </div>
      <div className="flex gap-4 pt-4">
        <Link href="/">
          <Button size="lg" className="font-semibold">
            Go Home
          </Button>
        </Link>
        <Link href="/blog">
          <Button variant="outline" size="lg" className="font-semibold">
            Read Blog
          </Button>
        </Link>
      </div>
    </div>
  )
}