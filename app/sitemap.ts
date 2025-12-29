import { MetadataRoute } from 'next';
import { GAMES } from '@/lib/games';
import { GAME_CATEGORIES } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://puzzlynest.com';

    const staticPages = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
        { url: `${baseUrl}/games`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
        { url: `${baseUrl}/games/kids`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
        { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
        { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
        { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    ];

    const categoryPages = GAME_CATEGORIES.map(category => ({
        url: `${baseUrl}/category/${category.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const gamePages = GAMES.map(game => ({
        url: `${baseUrl}/play/${game.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...staticPages, ...categoryPages, ...gamePages];
}
