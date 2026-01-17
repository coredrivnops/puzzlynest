import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';

import { GAMES } from '@/lib/games';
import { GAME_CATEGORIES } from '@/lib/config';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export function generateStaticParams() {
    return GAME_CATEGORIES.map((category) => ({
        categoryId: category.id,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ categoryId: string }> }) {
    const { categoryId } = await params;
    const category = GAME_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return {};

    return {
        title: `${category.name} Games - Play Free Online | PuzzlyNest`,
        description: `${category.description}. Browse our collection of free ${category.name.toLowerCase()} games, perfect for ${category.ageGroup === 'kids' ? 'children' : category.ageGroup === 'seniors' ? 'seniors' : 'all ages'}.`,
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
    const { categoryId } = await params;
    const category = GAME_CATEGORIES.find(c => c.id === categoryId);

    if (!category) {
        notFound();
    }

    const categoryGames = GAMES.filter(g => g.category === category.id);

    return (
        <>
            <Navigation />

            {/* Solid dark background wrapper */}
            <main style={{
                background: '#0a0a1a',
                minHeight: '100vh',
                paddingTop: '2rem',
                paddingBottom: '4rem'
            }}>
                <div className="container">
                    {/* Header */}
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '2rem',
                        padding: '2rem',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.08))',
                        borderRadius: '20px',
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                    }}>
                        <span style={{ fontSize: '4rem', display: 'block', marginBottom: '0.5rem' }}>{category.icon}</span>
                        <h1 style={{
                            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
                            marginBottom: '0.5rem',
                            color: '#fff'
                        }}>
                            {category.name}
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem' }}>
                            {category.description}
                        </p>
                    </div>

                    {/* Category Navigation Pills */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        justifyContent: 'center',
                        marginBottom: '2rem',
                    }}>
                        {GAME_CATEGORIES.map(cat => (
                            <Link
                                key={cat.id}
                                href={`/category/${cat.id}`}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '100px',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease',
                                    background: cat.id === category.id
                                        ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                                        : 'rgba(255,255,255,0.08)',
                                    color: cat.id === category.id ? '#fff' : 'rgba(255,255,255,0.8)',
                                    border: cat.id === category.id
                                        ? '1px solid #6366f1'
                                        : '1px solid rgba(255,255,255,0.15)',
                                }}
                            >
                                {cat.icon} {cat.name}
                            </Link>
                        ))}
                    </div>


                    {categoryGames.length > 0 ? (
                        <div className="game-grid">
                            {categoryGames.map(game => (
                                <GameCard key={game.id} game={game} />
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                                No games found in this category. Check out our <Link href="/games" style={{ color: '#818cf8', textDecoration: 'underline' }}>full game collection</Link>!
                            </p>
                        </div>
                    )}

                </div>
            </main>

            <Footer />
        </>
    );
}
