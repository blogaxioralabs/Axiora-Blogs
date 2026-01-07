/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'source.unsplash.com' },
            { protocol: 'https', hostname: 'oskbnnusqmdzysgtrovl.supabase.co' },
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