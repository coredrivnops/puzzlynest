import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';
import GamePlayer from '@/components/GamePlayer';
import { getGameById, GAMES } from '@/lib/games';
import Link from 'next/link';

export function generateStaticParams() {
    return GAMES.map((game) => ({
        gameId: game.id,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ gameId: string }> }) {
    const { gameId } = await params;
    const game = getGameById(gameId);
    if (!game) return {};

    return {
        title: `${game.name} - Play Free Online | PlayZen`,
        description: `${game.description}. Play ${game.name} for free online, no download required. Perfect for ${game.ageGroup === 'kids' ? 'children' : game.ageGroup === 'seniors' ? 'seniors' : 'all ages'}.`,
    };
}

export default async function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
    const { gameId } = await params;
    const game = getGameById(gameId);

    if (!game) {
        notFound();
    }

    return (
        <>
            <Navigation />

            <main>
                <AdBanner type="horizontal" slot="game-top" />

                <GamePlayer game={game} />

                <AdBanner type="horizontal" slot="game-bottom" />

                {/* SEO Content & Related Games */}
                <div className="container" style={{ marginTop: '2rem' }}>
                    {/* Structured Data */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "VideoGame",
                                "name": game.name,
                                "description": game.description,
                                "genre": game.category,
                                "gamePlatform": "Web Browser",
                                "applicationCategory": "Game",
                                "offers": {
                                    "@type": "Offer",
                                    "price": "0",
                                    "priceCurrency": "USD"
                                },
                                "audience": {
                                    "@type": "Audience",
                                    "audienceType": game.ageGroup === 'kids' ? 'Children' : game.ageGroup === 'seniors' ? 'Seniors' : 'General',
                                },
                            }),
                        }}
                    />

                    {/* SEO Block */}
                    <section style={{
                        padding: '2rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        marginBottom: '2rem',
                    }}>
                        <h2 style={{ marginBottom: '1rem' }}>About {game.name}</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
                            {game.description}. This free online game is part of our {game.category.replace('-', ' ')} collection
                            and is designed for {game.ageGroup === 'kids' ? 'children ages 4-12' : game.ageGroup === 'seniors' ? 'adults 60+' : 'players of all ages'}.
                        </p>
                        <ul style={{ color: 'rgba(255,255,255,0.7)', marginLeft: '1.5rem' }}>
                            <li>Difficulty: {game.difficulty}</li>
                            <li>Average play time: {game.estimatedPlayTime} minutes</li>
                            <li>No download or signup required</li>
                            <li>Works on desktop and mobile devices</li>
                        </ul>
                    </section>

                    {/* Related Games */}
                    <section>
                        <h2 className="section-title" style={{ marginBottom: '1rem' }}>
                            More {game.category.replace('-', ' ')} Games
                        </h2>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {GAMES
                                .filter(g => g.category === game.category && g.id !== game.id)
                                .slice(0, 4)
                                .map(relatedGame => (
                                    <Link
                                        key={relatedGame.id}
                                        href={`/play/${relatedGame.id}`}
                                        className="card"
                                        style={{
                                            padding: '1rem 1.5rem',
                                            textDecoration: 'none',
                                            color: 'white',
                                        }}
                                    >
                                        {relatedGame.name}
                                    </Link>
                                ))}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
}
