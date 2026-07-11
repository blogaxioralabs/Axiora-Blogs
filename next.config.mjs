import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
    // --- PRODUCTION OPTIMIZATIONS (SEO + Security) ---
    poweredByHeader: false, // Hide X-Powered-By: Next.js header
    compress: true, // Enable gzip/brotli compression
    reactStrictMode: true,

    // --- IMAGE OPTIMIZATION (LCP Boost) ---
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'source.unsplash.com' },
            { protocol: 'https', hostname: 'axiorablogs.com' },
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, 
            { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
            { protocol: 'https', hostname: 'YOUR_SUPABASE_PROJECT_ID.supabase.co' },
            { protocol: 'https', hostname: 'oskbnnusqmdzysgtrovl.supabase.co' },
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'picsum.photos' },
            { protocol: 'https', hostname: '**' },
        ],
        formats: ['image/avif', 'image/webp'],
        // Optimized sizes for responsive images (reduces wasted bytes)
        deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 31536000, // 1 year cache for optimized images
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },

    // --- EXPERIMENTAL PERFORMANCE OPTIMIZATIONS ---
    experimental: {
        optimizePackageImports: [
            'lucide-react',
            '@radix-ui/react-icons',
            'date-fns',
            'framer-motion',
        ],
        optimizeCss: true, // CSS optimization for production
    },

    // --- ADVANCED SECURITY HEADERS (Complete CSP + SEO) ---
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    // Security Headers
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://*.supabase.co https://va.vercel-scripts.com",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "img-src 'self' data: blob: https: http:",
                            "font-src 'self' https://fonts.gstatic.com",
                            "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://*.vercel-insights.com https://api.indexnow.org https://generativelanguage.googleapis.com",
                            "media-src 'self'",
                            "frame-src 'self' https://www.padumainduwara.me https://padumainduwara.me http://localhost:3000",
                            "frame-ancestors 'self' https://www.padumainduwara.me https://padumainduwara.me http://localhost:3000",
                            "worker-src 'self' blob:",
                            "manifest-src 'self'",
                        ].join('; '),
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=(), browsing-topics=()',
                    },
                    // SEO Cache Headers
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
                    },
                ],
            },
            // Static assets - aggressive caching (images)
            {
                source: '/:path*\\.(jpg|jpeg|gif|png|webp|avif|ico|svg)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            // Static assets - fonts
            {
                source: '/:path*\\.(woff|woff2|ttf|otf|eot)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            // Static assets - CSS & JS
            {
                source: '/:path*\\.(css|js)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },

    // --- REDIRECTS (SEO Canonical Consistency) ---
    async redirects() {
        return [
            // Redirect apex domain to www for canonical consistency
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'axiorablogs.com' }],
                destination: 'https://www.axiorablogs.com/:path*',
                permanent: true,
            },
        ];
    },
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzer(nextConfig);
