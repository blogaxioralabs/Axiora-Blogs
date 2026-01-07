import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  items: {
    label: string;
    href: string;
  }[];
}

export default function Breadcrumbs({ items }: BreadcrumbProps) {
  // Schema.org Markup for Breadcrumbs (Google එකට තේරෙන භාෂාවෙන්)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `${process.env.NEXT_PUBLIC_SITE_URL}${item.href}`
    }))
  };

  return (
    <nav aria-label="Breadcrumb" className="md:mb-3 w-full">
      {/* Search Engine Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground">
        <li>
          <Link href="/" className="hover:text-primary transition-colors hover:underline">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-1.5 md:gap-2">
            <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground/50" />
            
            {index === items.length - 1 ? (
               <span className="font-semibold text-foreground line-clamp-1 max-w-[150px] md:max-w-none">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-primary transition-colors hover:underline">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}