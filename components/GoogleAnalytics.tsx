'use client';

import Script from 'next/script';
import { ANALYTICS_CONFIG } from '@/lib/analytics';

export default function GoogleAnalytics() {
    const GA_MEASUREMENT_ID = ANALYTICS_CONFIG.GA_MEASUREMENT_ID;

    // Don't render if no valid GA ID
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
        return null;
    }

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_MEASUREMENT_ID}', {
                        page_path: window.location.pathname,
                        anonymize_ip: true,
                        cookie_flags: 'SameSite=None;Secure'
                    });
                `}
            </Script>
        </>
    );
}

// Track custom events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
}

// Track game events specifically
export function trackGameEvent(gameId: string, eventType: 'start' | 'complete' | 'score', score?: number) {
    trackEvent(eventType, 'game', gameId, score);
}
