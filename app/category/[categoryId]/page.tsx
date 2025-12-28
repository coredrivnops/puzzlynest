import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';
import AdBanner from '@/components/AdBanner';
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
        title: `${category.name} Games - Play Free Online | PlayZen`,
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

            <main className="container" style={{ paddingTop: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <span style={{ fontSize: '4rem' }}>{category.icon}</span>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        {category.name}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
                        {category.description}
                    </p>
                </div>

                {/* Category Navigation */}
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
                            className={`category-pill ${cat.id === category.id ? 'active' : ''}`}
                        >
                            {cat.icon} {cat.name}
                        </Link>
                    ))}
                </div>

                <AdBanner type="horizontal" slot="category-top" />

                {categoryGames.length > 0 ? (
                    <div className="game-grid">
                        {categoryGames.map(game => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                            Games coming soon to this category!
                        </p>
                    </div>
                )}

                <AdBanner type="horizontal" slot="category-bottom" />
            </main>

            <Footer />
        </>
    );
}
