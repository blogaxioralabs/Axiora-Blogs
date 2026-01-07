import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Axiora Blogs',
    short_name: 'Axiora',
    description: 'Your daily dose of Science, Technology, Engineering, and Mathematics.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/axiora-logo.png', // Make sure this image exists in /public folder
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/axiora-logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}