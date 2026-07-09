'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// S.T.E.M Data - මෙතන href එක ඔයාගේ /category/[slug] route එකට හරියටම මැච් වෙන්න හදලා තියෙන්නේ
const stemData = [
  {
    id: 'science',
    category: 'Science',
    title: 'Unravel the Mysteries of the Universe',
    desc: 'Explore new discoveries',
    href: '/category/science',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'technology',
    category: 'Technology',
    title: 'The Future is Now: AI & Innovations',
    desc: 'Gadgets & Software',
    href: '/category/technology',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'engineering',
    category: 'Engineering',
    title: 'Building the World of Tomorrow',
    desc: 'Mechanics & Architecture',
    href: '/category/engineering',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'mathematics',
    category: 'Mathematics',
    title: 'The Hidden Language of Nature',
    desc: 'Numbers, Logic & Patterns',
    href: '/category/mathematics',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=400&auto=format&fit=crop'
  }
];

export function StemHighlights() {
  return (
    <section className="relative py-10 my-8 overflow-hidden border-y border-border/40 bg-background/50">
      
      {/* Background Subtle Wave Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] flex items-center justify-center overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 1000 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="concentric" width="200" height="200" patternUnits="userSpaceOnUse">
              <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="100" cy="100" r="100" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#concentric)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 max-w-[1400px] relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stemData.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* මෙතන Next.js Link එක හරහා අදාළ Category Page එකට යවනවා */}
              <Link href={item.href} className="flex items-center gap-3 md:gap-4 group">
                
                <div className="relative w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden shrink-0 border-2 border-transparent group-hover:border-primary/20 transition-all duration-300 shadow-sm">
                  <Image 
                    src={item.image} 
                    alt={item.category} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    sizes="(max-width: 768px) 60px, 80px"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-xs md:text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <span className="text-[10px] md:text-xs text-muted-foreground mt-1 font-medium">
                    {item.desc}
                  </span>
                </div>

              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}