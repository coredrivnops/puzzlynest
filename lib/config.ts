// Unified Gaming Platform Configuration
// Serves both kids (4-12) and seniors (60+) with age-appropriate categories

export type AgeGroup = 'kids' | 'seniors' | 'all-ages';

export interface GameCategory {
    id: string;
    name: string;
    description: string;
    ageGroup: AgeGroup;
    icon: string;
    color: string;
}

export const GAME_CATEGORIES: GameCategory[] = [
    {
        id: 'brain-training',
        name: 'Brain Training',
        description: 'Sharpen your mind with puzzles and memory games',
        ageGroup: 'seniors',
        icon: '🧠',
        color: '#6366f1', // Indigo
    },
    {
        id: 'classic-games',
        name: 'Classic Games',
        description: 'Timeless favorites like Solitaire and Mahjong',
        ageGroup: 'seniors',
        icon: '🎴',
        color: '#8b5cf6', // Violet
    },
    {
        id: 'word-games',
        name: 'Word Games',
        description: 'Crosswords, word search, and vocabulary challenges',
        ageGroup: 'all-ages',
        icon: '📝',
        color: '#ec4899', // Pink
    },
    {
        id: 'learning-fun',
        name: 'Learning & Fun',
        description: 'Educational games for counting, letters, and shapes',
        ageGroup: 'kids',
        icon: '🎓',
        color: '#f59e0b', // Amber
    },
    {
        id: 'action-arcade',
        name: 'Action & Arcade',
        description: 'Quick reflexes and fun challenges',
        ageGroup: 'kids',
        icon: '🎮',
        color: '#10b981', // Emerald
    },
    {
        id: 'creative-play',
        name: 'Creative Play',
        description: 'Coloring, drawing, and imagination games',
        ageGroup: 'kids',
        icon: '🎨',
        color: '#3b82f6', // Blue
    },
];

// Platform branding
export const PLATFORM_CONFIG = {
    name: 'PuzzlyNest',
    tagline: 'Your Cozy Corner for Brain Games',
    description: 'Free online games for kids, seniors, and everyone in between. Brain training puzzles, classic games, and educational fun!',
    domain: 'puzzlynest.com',
    primaryColor: '#6366f1', // Indigo
    accentColor: '#f59e0b', // Amber
};

// Tier 1 countries for highest CPM
export const TIER1_COUNTRIES = ['US', 'GB', 'DE', 'CA', 'AU', 'NL'];

// Unified ad configuration with age-appropriate rules
export const AD_CONFIG = {
    // Large, accessible close buttons for all ages
    minCloseButtonSize: 44, // 44px is iOS/Android minimum touch target

    // Conservative frequency to avoid frustration
    maxInterstitialFrequency: 240, // 4 minutes
    levelsBeforeInterstitial: 3,

    // Settings for kids games (child-friendly content)
    kidsGameSettings: {
        childDirected: true,
        noPersonalizedAds: true,
        tfcdTag: true, // Tag For Child Directed content
    },

    // Ad placements
    placements: {
        bannerBottom: true, // Persistent 320x50 / 728x90
        bannerTop: false,
        interstitial: true, // Between game levels
        rewarded: false, // Optional: watch ad for hints
    },
};
