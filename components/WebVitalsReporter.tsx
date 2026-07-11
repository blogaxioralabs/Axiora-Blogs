'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Types for Web Vitals metrics
interface Metric {
    id: string;
    name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    delta: number;
    navigationType: string;
}

/**
 * WebVitalsReporter — sends Core Web Vitals to Google Analytics 4
 * Placement: Inside layout.tsx, wrapped in Suspense
 * 
 * Note: import("web-vitals") is a dynamic import to avoid SSR issues
 */
export default function WebVitalsReporter() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Only run in production
        if (process.env.NODE_ENV !== 'production') return;

        const reportToGA4 = (metric: Metric) => {
            // Send to Google Analytics 4 (gtag)
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'web_vitals', {
                    event_category: 'Web Vitals',
                    event_label: metric.id,
                    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                    metric_name: metric.name,
                    metric_rating: metric.rating,
                    metric_delta: Math.round(metric.delta),
                    metric_value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                    page_path: pathname,
                    non_interaction: true,
                });
            }

            // Log to console in development
            if (process.env.NODE_ENV === 'development') {
                const color = metric.rating === 'good' ? 'green' : metric.rating === 'needs-improvement' ? 'orange' : 'red';
                console.log(
                    `%c[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`,
                    `color: ${color}; font-weight: bold;`
                );
            }
        };

        // Dynamically import web-vitals to avoid SSR issues
        import('web-vitals').then((webVitals) => {
            webVitals.onCLS(reportToGA4);
            webVitals.onFCP(reportToGA4);
            webVitals.onINP(reportToGA4);  // INP replaces FID in 2024+
            webVitals.onLCP(reportToGA4);
            webVitals.onTTFB(reportToGA4);
        }).catch((err) => {
            console.warn('Web Vitals not available:', err);
        });
    }, [pathname, searchParams]);

    return null; // This component renders nothing
}
