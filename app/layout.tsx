// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://axiorablogs.com'),
  title: {
    default: 'Axiora Blogs - Exploring STEM',
    template: '%s | Axiora Blogs',
  },
  description: 'Your daily dose of Science, Technology, Engineering, and Mathematics. Discover the future with Axiora Blogs.',
  keywords: ['STEM', 'Technology Blog', 'Science', 'AI', 'Web Development', 'Axiora Labs', 'Programming', 'Space Exploration'],
  
  // --- Enhanced SEO Verification ---
  verification: {
    google: '17e1lIZoJSLOk1XEoFk1aalUCrms0shXRx2uwzanBCk', // You can add this later in Google Search Console
    yandex: 'b6c1807dc4805753',
    other: {
      'msvalidate.01': 'YOUR_BING_VERIFICATION_CODE',
    },
  },
  // ---------------------------------

  openGraph: {
    title: 'Axiora Blogs',
    description: 'Exploring the frontiers of Science, Technology, Engineering, and Mathematics.',
    url: 'https://axiorablogs.com',
    siteName: 'Axiora Blogs',
    locale: 'en_US',
    type: 'website',
    images: [
        {
          url: 'https://axiorablogs.com/axiora-og-image.png', // Ensure this image exists in public folder
          width: 1200,
          height: 630,
          alt: 'Axiora Blogs Cover',
        }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Axiora Blogs',
    description: 'Exploring the frontiers of Science, Technology, Engineering, and Mathematics.',
    images: ['https://axiorablogs.com/axiora-og-image.png'], 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen bg-background font-sans antialiased ${inter.className}`}>
        <div className="relative flex min-h-screen flex-col overflow-x-hidden">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
      </body>
    </html>
  )
}