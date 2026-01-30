// app/manifest.ts
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Axiora Blogs',
    short_name: 'Axiora',
    description: 'The Future of STEM & AI Technology',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/axiora-logo.png', // Ensure you have a 192x192 version ideally
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/axiora-logo.png', // Ensure you have a 512x512 version
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}