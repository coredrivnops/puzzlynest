import { MetadataRoute } from 'next';
import { GAMES } from '@/lib/games';
import { GAME_CATEGORIES } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://puzzlynest.com';
    const currentDate = new Date();

    // Core static pages - high value, complete content
    const staticPages = [
        { url: baseUrl, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 1.0 },
        { url: `${baseUrl}/games`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
        { url: `${baseUrl}/games/kids`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.9 },
        { url: `${baseUrl}/games/seniors`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.9 },
        { url: `${baseUrl}/achievements`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.7 },
        { url: `${baseUrl}/blog`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
        { url: `${baseUrl}/sitemap-html`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.6 },
        { url: `${baseUrl}/about`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.5 },
        { url: `${baseUrl}/contact`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.4 },
        { url: `${baseUrl}/privacy`, lastModified: currentDate, changeFrequency: 'yearly' as const, priority: 0.3 },
        { url: `${baseUrl}/terms`, lastModified: currentDate, changeFrequency: 'yearly' as const, priority: 0.3 },
    ];

    // Puzzle Tools & Solvers - High-value utility pages with substantial content
    const toolPages = [
        { url: `${baseUrl}/tools`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.9 },
        { url: `${baseUrl}/tools/sudoku-solver`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.85 },
        { url: `${baseUrl}/tools/word-unscrambler`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.85 },
        { url: `${baseUrl}/tools/crossword-solver`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.85 },
        { url: `${baseUrl}/tools/word-search-maker`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.85 },
    ];

    // SEO Landing Pages - High-value pages targeting popular search keywords
    const seoLandingPages = [
        { url: `${baseUrl}/free-online-puzzles`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.9 },
        { url: `${baseUrl}/memory-games-online`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.9 },
        { url: `${baseUrl}/word-games-online`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.9 },
        { url: `${baseUrl}/logic-puzzles-free`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.9 },
        { url: `${baseUrl}/solitaire-games`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.9 },
    ];

    // Category pages - Only categories with actual games
    const categoryPages = GAME_CATEGORIES.map(category => ({
        url: `${baseUrl}/category/${category.id}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Individual game pages - All functional games with rich SEO content
    const gamePages = GAMES.map(game => ({
        url: `${baseUrl}/play/${game.id}`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...staticPages, ...toolPages, ...seoLandingPages, ...categoryPages, ...gamePages];
}
