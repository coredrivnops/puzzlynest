'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { getGAMeasurementId, ANALYTICS_CONFIG } from '@/lib/analytics';

export default function GoogleAnalytics() {
    const [measurementId, setMeasurementId] = useState<string | null>(null);

    useEffect(() => {
        // Get the correct measurement ID based on current domain
        const gaId = getGAMeasurementId();
        setMeasurementId(gaId);
    }, []);

    // Don't render until we have the correct ID (client-side)
    if (!measurementId || measurementId === 'G-XXXXXXXXXX') {
        return null;
    }

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${measurementId}', {
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
