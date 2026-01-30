import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';
import { getOrganizationSchema } from '@/lib/seo-utils'; // අලුත් ෆයිල් එකෙන්

const inter = Inter({ subsets: ['latin'] });

// --- 1. Mobile & Visual SEO (SXO - Search Experience Optimization) ---
export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

// --- 2. Advanced Global Metadata (Core SEO) ---
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://axiorablogs.com'),
  
  title: {
    default: 'Axiora Blogs | Future of STEM, AI & Technology',
    template: '%s | Axiora Blogs - Premium Tech Insights',
  },
  description: 'Explore world-class articles on Artificial Intelligence, Engineering, Space, and Coding. The ultimate destination for STEM enthusiasts and professionals.',
  
  applicationName: 'Axiora Blogs',
  authors: [{ name: 'Paduma Induwara', url: 'https://padumainduwara.me' }, { name: 'Axiora Labs' }],
  generator: 'Next.js 14',
  keywords: ['STEM', 'AI', 'Machine Learning', 'Space Tech', 'Web Development', 'Future Trends', 'Coding Tutorials'],
  
  referrer: 'origin-when-cross-origin',
  creator: 'Paduma Induwara',
  publisher: 'Axiora Media',
  
  // --- International SEO (Hreflang support preparation) ---
  alternates: {
    canonical: './',
    languages: {
      'en-US': '/en-US',
    },
  },

  // --- Search Engine Verification (Trust) ---
  verification: {
    google: '17e1lIZoJSLOk1XEoFk1aalUCrms0shXRx2uwzanBCk',
    yandex: 'b6c1807dc4805753',
    other: {
      'msvalidate.01': 'YOUR_BING_CODE_HERE',
    },
  },

  // --- Robot Config for AI Crawlers (AEO & SGE) ---
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // --- Social Media Optimization (Visual SEO) ---
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://axiorablogs.com',
    siteName: 'Axiora Blogs',
    title: 'Axiora Blogs - The Edge of Tomorrow',
    description: 'Deep dive into the world of AI, Space, and Engineering.',
    images: [
      {
        url: '/axiora-og-image.png',
        width: 1200,
        height: 630,
        alt: 'Axiora Blogs Official Cover',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Axiora Blogs',
    description: 'Deep dive into the world of AI, Space, and Engineering.',
    site: '@axiorablogs',
    creator: '@padumainduwara',
    images: ['/axiora-og-image.png'],
  },

  // --- Apple & App SEO (ASO Style) ---
  appleWebApp: {
    capable: true,
    title: 'Axiora Blogs',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Knowledge Graph Data load කිරීම
  const orgSchema = getOrganizationSchema();

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* --- GEO Tags for Local/International SEO --- */}
        <meta name="geo.region" content="LK-1" /> {/* Western Province */}
        <meta name="geo.placename" content="Colombo" />
        <meta name="geo.position" content="6.9271;79.8612" />
        <meta name="ICBM" content="6.9271, 79.8612" />
        
        {/* --- Schema Injection --- */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className={`min-h-screen bg-background font-sans antialiased ${inter.className}`}>
        <div className="relative flex min-h-screen flex-col overflow-x-hidden">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster richColors />
        </div>
      </body>
    </html>
  )
}