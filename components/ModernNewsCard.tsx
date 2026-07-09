// components/ModernNewsCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Clock, Eye } from "lucide-react";

export default function ModernNewsCard({ news }: { news: any }) {
  const isNew = new Date(news.published_at).getTime() > Date.now() - 24 * 60 * 60 * 1000;

  return (
    <motion.article 
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col justify-between h-full bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
    >
      <Link href={`/news/${news.slug}`} className="block overflow-hidden relative aspect-[16/10]">
        {news.image_url ? (
          <Image
            src={news.image_url}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground font-medium">Axiora News</span>
          </div>
        )}
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
          {news.news_categories && (
            <Badge className="bg-background/90 text-foreground backdrop-blur-md shadow-sm border-none hover:bg-background font-semibold">
              {news.news_categories.name}
            </Badge>
          )}
          {isNew && (
            <Badge className="bg-red-500/90 text-white backdrop-blur-md shadow-sm border-none animate-pulse">
              NEW
            </Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-grow p-6">
        <Link href={`/news/${news.slug}`} className="block group/title flex-grow">
          <h3 className="text-xl font-bold leading-snug mb-3 text-foreground group-hover/title:text-primary transition-colors line-clamp-3">
            {news.title}
          </h3>
        </Link>

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
            {news.tags.slice(0, 3).map((tag: string, idx: number) => (
              <span key={idx} className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer Meta */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50 text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary/70" />
              {formatDistanceToNow(new Date(news.published_at), { addSuffix: true })}
            </span>
          </div>
          <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
            <Eye className="w-4 h-4 text-blue-500" />
            {news.views || 0}
          </span>
        </div>
      </div>
    </motion.article>
  );
}