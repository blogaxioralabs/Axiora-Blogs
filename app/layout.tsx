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
  keywords: ['STEM', 'Technology Blog', 'Science', 'AI', 'Web Development', 'Axiora Labs'],
  openGraph: {
    title: 'Axiora Blogs',
    description: 'Exploring the frontiers of Science, Technology, Engineering, and Mathematics.',
    url: 'https://axiorablogs.com',
    siteName: 'Axiora Blogs',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Axiora Blogs',
    description: 'Exploring the frontiers of Science, Technology, Engineering, and Mathematics.',
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
            <div className="flex-1">{children}</div>
            <Footer />
        </div>
      </body>
    </html>
  )
}