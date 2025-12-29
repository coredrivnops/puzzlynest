'use client';

import Script from 'next/script';
import { ADS_CONFIG } from '@/lib/analytics';

// AdSense Script Loader - goes in layout
export function AdSenseScript() {
    const ADSENSE_CLIENT_ID = ADS_CONFIG.ADSENSE_CLIENT_ID;

    // Don't render if no valid AdSense ID
    if (!ADSENSE_CLIENT_ID || ADSENSE_CLIENT_ID.includes('XXXXXXXXXX')) {
        return null;
    }

    return (
        <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="beforeInteractive"
        />
    );
}

interface AdUnitProps {
    slot: string;
    format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
    responsive?: boolean;
    className?: string;
}

// Individual Ad Unit Component
export function AdUnit({ slot, format = 'auto', responsive = true, className = '' }: AdUnitProps) {
    const ADSENSE_CLIENT_ID = ADS_CONFIG.ADSENSE_CLIENT_ID;

    // Don't render if no valid AdSense ID or slot
    if (!ADSENSE_CLIENT_ID || ADSENSE_CLIENT_ID.includes('XXXXXXXXXX') || !slot) {
        // Return placeholder for development
        return (
            <div
                className={`ad-placeholder ${className}`}
                style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px dashed rgba(99, 102, 241, 0.3)',
                    borderRadius: '8px',
                    padding: '1rem',
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.75rem',
                    minHeight: format === 'horizontal' ? '90px' : format === 'rectangle' ? '250px' : '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                Ad Space
            </div>
        );
    }

    return (
        <div className={className}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={ADSENSE_CLIENT_ID}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? 'true' : 'false'}
            />
            <Script id={`ad-${slot}`}>
                {`(adsbygoogle = window.adsbygoogle || []).push({});`}
            </Script>
        </div>
    );
}

// Pre-configured ad placements
export function TopBannerAd() {
    return (
        <AdUnit
            slot={ADS_CONFIG.AD_UNITS.BANNER_TOP}
            format="horizontal"
            className="ad-banner-top"
        />
    );
}

export function BottomBannerAd() {
    return (
        <AdUnit
            slot={ADS_CONFIG.AD_UNITS.BANNER_BOTTOM}
            format="horizontal"
            className="ad-banner-bottom"
        />
    );
}

export function SidebarAd() {
    return (
        <AdUnit
            slot={ADS_CONFIG.AD_UNITS.SIDEBAR}
            format="rectangle"
            className="ad-sidebar"
        />
    );
}

export function InGameAd() {
    return (
        <AdUnit
            slot={ADS_CONFIG.AD_UNITS.IN_GAME}
            format="rectangle"
            className="ad-in-game"
        />
    );
}
