/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            { protocol: 'https', hostname: 'source.unsplash.com' },
            { protocol: 'https', hostname: 'oskbnnusqmdzysgtrovl.supabase.co' },
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'picsum.photos' },
            { protocol: 'https', hostname: '**' },
        ],
    },
    // --- ADVANCED SECURITY HEADERS ---
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://www.padumainduwara.me https://padumainduwara.me http://localhost:3000;",
          },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;