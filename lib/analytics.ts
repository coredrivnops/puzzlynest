// Analytics and Ads Configuration for PuzzlyNest
// Replace placeholder IDs with your actual IDs after creating accounts

export const ANALYTICS_CONFIG = {
    // Google Analytics 4
    // Create property at: https://analytics.google.com/
    GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX',

    // Google Search Console
    // Verify at: https://search.google.com/search-console
    SEARCH_CONSOLE_VERIFICATION: process.env.NEXT_PUBLIC_SEARCH_CONSOLE_VERIFICATION || '',
};

export const ADS_CONFIG = {
    // Google AdSense
    // Apply at: https://www.google.com/adsense
    ADSENSE_CLIENT_ID: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXXXX',

    // Ad Unit IDs (create these in AdSense after approval)
    AD_UNITS: {
        BANNER_TOP: process.env.NEXT_PUBLIC_AD_BANNER_TOP || '',
        BANNER_BOTTOM: process.env.NEXT_PUBLIC_AD_BANNER_BOTTOM || '',
        SIDEBAR: process.env.NEXT_PUBLIC_AD_SIDEBAR || '',
        IN_GAME: process.env.NEXT_PUBLIC_AD_IN_GAME || '',
    },

    // COPPA compliance for kids games
    COPPA_COMPLIANT: true,

    // Ad refresh rate (seconds) - don't refresh too often
    REFRESH_RATE: 60,
};

// Cookie consent settings (GDPR)
export const CONSENT_CONFIG = {
    ENABLED: true,
    COOKIE_NAME: 'puzzlynest_consent',
    EXPIRES_DAYS: 365,
};
