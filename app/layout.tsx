import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Axiora Blogs - Exploring STEM',
    template: '%s | Axiora Blogs',
  },
  description: 'Your daily dose of Science, Technology, Engineering, and Mathematics. Discover the future with Axiora Blogs.',
  keywords: ['STEM', 'Technology Blog', 'Science', 'AI', 'Web Development'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen bg-background font-sans antialiased ${inter.className}`}>
        {/* THIS IS THE FIX: We added overflow-x-hidden to the main div */}
        <div className="relative flex min-h-screen flex-col overflow-x-hidden">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
        </div>
      </body>
    </html>
  )
}