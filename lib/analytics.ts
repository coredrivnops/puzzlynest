// Analytics and Ads Configuration for PuzzlyNest
// Domain-specific configuration for puzzlynest.com and puzzlynest.io

// GA Measurement IDs per domain
const GA_IDS = {
    'puzzlynest.com': 'G-VD91T63N38',
    'puzzlynest.io': 'G-4TNJ2KRK76',
    'default': 'G-VD91T63N38', // Default to .com
};

// Function to get the correct GA ID based on current domain
export function getGAMeasurementId(): string {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname.includes('puzzlynest.io')) {
            return GA_IDS['puzzlynest.io'];
        }
        if (hostname.includes('puzzlynest.com')) {
            return GA_IDS['puzzlynest.com'];
        }
    }
    // Server-side or fallback
    return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || GA_IDS['default'];
}

export const ANALYTICS_CONFIG = {
    // Google Analytics 4 - Domain-specific IDs
    GA_MEASUREMENT_ID: GA_IDS['default'], // Static fallback for SSR
    GA_IDS, // Export all IDs for reference

    // Google Search Console
    // Verify at: https://search.google.com/search-console
    SEARCH_CONSOLE_VERIFICATION: process.env.NEXT_PUBLIC_SEARCH_CONSOLE_VERIFICATION || '',
};

export const ADS_CONFIG = {
    // Google AdSense - Same publisher ID for all PuzzlyNest domains
    ADSENSE_CLIENT_ID: 'ca-pub-9470560014928072',

    // Ad Unit IDs (create these in AdSense after approval)
    AD_UNITS: {
        BANNER_TOP: process.env.NEXT_PUBLIC_AD_BANNER_TOP || '',
        BANNER_BOTTOM: process.env.NEXT_PUBLIC_AD_BANNER_BOTTOM || '',
        SIDEBAR: process.env.NEXT_PUBLIC_AD_SIDEBAR || '',
        IN_GAME: process.env.NEXT_PUBLIC_AD_IN_GAME || '',
    },

    // Child-friendly content settings for kids games
    CHILD_DIRECTED: true,

    // Ad refresh rate (seconds) - don't refresh too often
    REFRESH_RATE: 60,
};

// Cookie consent settings (GDPR)
export const CONSENT_CONFIG = {
    ENABLED: true,
    COOKIE_NAME: 'puzzlynest_consent',
    EXPIRES_DAYS: 365,
};
