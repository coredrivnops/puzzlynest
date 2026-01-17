// Structured Data (JSON-LD) helpers for SEO
// These schemas help search engines understand our content better

import { Game } from './games';
import { PLATFORM_CONFIG } from './config';

const BASE_URL = 'https://puzzlynest.com';

/**
 * Organization Schema - Used on all pages
 */
export function getOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "PuzzlyNest",
        "alternateName": "Puzzly Nest",
        "url": BASE_URL,
        "logo": `${BASE_URL}/favicon.ico`,
        "description": PLATFORM_CONFIG.description,
        "foundingDate": "2024",
        "sameAs": [
            // Add social media links when available
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "url": `${BASE_URL}/contact`,
            "availableLanguage": ["English"]
        }
    };
}

/**
 * WebSite Schema with SearchAction - Used on all pages
 */
export function getWebSiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "PuzzlyNest",
        "alternateName": "Puzzly Nest",
        "url": BASE_URL,
        "description": "Free brain games and educational games for kids. 100+ online games to play now!",
        "inLanguage": "en-US",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${BASE_URL}/games?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };
}

/**
 * VideoGame Schema - Used on individual game pages
 */
export function getGameSchema(game: Game) {
    const audienceType = game.ageGroup === 'kids'
        ? 'Children'
        : game.ageGroup === 'seniors'
            ? 'Adults'
            : 'General';

    return {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        "name": game.name,
        "description": game.description,
        "url": `${BASE_URL}/play/${game.id}`,
        "genre": game.category.replace('-', ' '),
        "gamePlatform": ["Web Browser", "Desktop", "Mobile"],
        "applicationCategory": "Game",
        "operatingSystem": "Any",
        "inLanguage": "en",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        },
        "audience": {
            "@type": "PeopleAudience",
            "audienceType": audienceType,
            "suggestedMinAge": game.ageGroup === 'kids' ? 4 : 0,
            "suggestedMaxAge": game.ageGroup === 'kids' ? 12 : undefined
        },
        "author": {
            "@type": "Organization",
            "name": "PuzzlyNest",
            "url": BASE_URL
        },
        "publisher": {
            "@type": "Organization",
            "name": "PuzzlyNest",
            "url": BASE_URL,
            "logo": {
                "@type": "ImageObject",
                "url": `${BASE_URL}/favicon.ico`
            }
        },
        "playMode": "SinglePlayer",
        "numberOfPlayers": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 1
        }
    };
}

/**
 * BreadcrumbList Schema - Used for navigation context
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`
        }))
    };
}

/**
 * FAQPage Schema - Used on pages with FAQ content
 */
export function getFAQSchema(faqs: { question: string; answer: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}

/**
 * ItemList Schema - Used for game collections
 */
export function getGameListSchema(games: Game[], listName: string) {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": listName,
        "numberOfItems": games.length,
        "itemListElement": games.map((game, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "VideoGame",
                "name": game.name,
                "url": `${BASE_URL}/play/${game.id}`,
                "description": game.description
            }
        }))
    };
}

/**
 * Article Schema - Used for blog posts
 */
export function getArticleSchema(article: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.excerpt,
        "url": `${BASE_URL}/blog#${article.id}`,
        "author": {
            "@type": "Organization",
            "name": "PuzzlyNest",
            "url": BASE_URL
        },
        "publisher": {
            "@type": "Organization",
            "name": "PuzzlyNest",
            "url": BASE_URL,
            "logo": {
                "@type": "ImageObject",
                "url": `${BASE_URL}/favicon.ico`
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${BASE_URL}/blog#${article.id}`
        },
        "articleSection": article.category,
        "inLanguage": "en-US"
    };
}

/**
 * SoftwareApplication Schema - Used for tools/solvers
 */
export function getToolSchema(tool: {
    name: string;
    description: string;
    url: string;
    category: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": tool.name,
        "description": tool.description,
        "url": tool.url.startsWith('http') ? tool.url : `${BASE_URL}${tool.url}`,
        "applicationCategory": tool.category,
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "author": {
            "@type": "Organization",
            "name": "PuzzlyNest",
            "url": BASE_URL
        }
    };
}

/**
 * Homepage FAQ data for rich snippets
 */
export const HOMEPAGE_FAQS = [
    {
        question: "Are all games on PuzzlyNest free to play?",
        answer: "Yes! All 100+ games on PuzzlyNest are completely free to play. No subscriptions, no hidden fees, and no downloads required. Simply visit puzzlynest.com and start playing instantly in your browser."
    },
    {
        question: "Are PuzzlyNest games safe for children?",
        answer: "Absolutely. PuzzlyNest games are designed with safety in mind. Our kids' games section features age-appropriate content suitable for children ages 4-12, with no chat features, no external links, and no collection of personal information from children."
    },
    {
        question: "Do I need to create an account to play?",
        answer: "No account is required to play any game on PuzzlyNest. You can start playing immediately without signing up. However, creating a free account allows you to track your progress and unlock achievements."
    },
    {
        question: "What types of games does PuzzlyNest offer?",
        answer: "PuzzlyNest offers over 100 games across multiple categories: Brain Training puzzles (Sudoku, Memory Match, Logic Games), Classic Games (Solitaire, Mahjong, Checkers), Word Games (Crosswords, Word Search, Hangman), and Educational games for kids (Counting, Alphabet, Shapes)."
    },
    {
        question: "Can I play PuzzlyNest games on my phone or tablet?",
        answer: "Yes! All PuzzlyNest games are fully responsive and work on any device with a web browser - desktop computers, laptops, tablets, and smartphones. No app download needed."
    }
];

/**
 * Helper to stringify schema for embedding in HTML
 */
export function stringifySchema(schema: object): string {
    return JSON.stringify(schema);
}
