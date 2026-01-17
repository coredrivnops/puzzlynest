import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

import GamePlayer from '@/components/GamePlayer';
import SocialShare from '@/components/SocialShare';
import { getGameById, GAMES } from '@/lib/games';
import { getSEOContent } from '@/lib/seoContent';
import { getGameSchema, getBreadcrumbSchema, stringifySchema } from '@/lib/structuredData';
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
        title: `${game.name} - Play Free Online | PuzzlyNest`,
        description: `${game.description}. Play ${game.name} for free online, no download required. Perfect for ${game.ageGroup === 'kids' ? 'children' : 'all ages'}.`,
    };
}

export default async function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
    const { gameId } = await params;
    const game = getGameById(gameId);
    const seoContent = getSEOContent(gameId);

    if (!game) {
        notFound();
    }

    return (
        <>
            <Navigation />

            <main>

                <GamePlayer game={game} />


                {/* SEO Content & Related Games */}
                <div className="container" style={{ marginTop: '2rem' }}>
                    {/* Enhanced Structured Data - VideoGame Schema */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: stringifySchema(getGameSchema(game)),
                        }}
                    />
                    {/* Breadcrumb Schema for navigation context */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: stringifySchema(getBreadcrumbSchema([
                                { name: 'Home', url: '/' },
                                { name: 'Games', url: '/games' },
                                { name: game.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), url: `/category/${game.category}` },
                                { name: game.name, url: `/play/${game.id}` }
                            ])),
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
                            and is designed for {game.ageGroup === 'kids' ? 'children ages 4-12' : 'players of all ages'}.
                        </p>
                        <ul style={{ color: 'rgba(255,255,255,0.7)', marginLeft: '1.5rem' }}>
                            <li>Difficulty: {game.difficulty}</li>
                            <li>Average play time: {game.estimatedPlayTime} minutes</li>
                            <li>No download or signup required</li>
                            <li>Works on desktop and mobile devices</li>
                        </ul>

                        {/* Social Share */}
                        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <SocialShare
                                title={`Play ${game.name} on PuzzlyNest!`}
                                description={game.description}
                            />
                        </div>
                    </section>

                    {/* Extended SEO Guide - "Learn to Play" Section */}
                    {seoContent && (
                        <section style={{ marginBottom: '2rem' }}>
                            {/* How to Play Card */}
                            <div className="card" style={{
                                padding: '2rem',
                                marginBottom: '1.5rem',
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                            }}>
                                <div
                                    style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.8 }}
                                    dangerouslySetInnerHTML={{ __html: seoContent.howToPlay }}
                                />
                            </div>

                            {/* Two-column layout for strategies and benefits */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                <div className="card" style={{
                                    padding: '1.5rem',
                                    background: 'rgba(245, 158, 11, 0.08)',
                                    border: '1px solid rgba(245, 158, 11, 0.2)',
                                }}>
                                    <div
                                        style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}
                                        dangerouslySetInnerHTML={{ __html: seoContent.strategies }}
                                    />
                                </div>
                                <div className="card" style={{
                                    padding: '1.5rem',
                                    background: 'rgba(16, 185, 129, 0.08)',
                                    border: '1px solid rgba(16, 185, 129, 0.2)',
                                }}>
                                    <div
                                        style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}
                                        dangerouslySetInnerHTML={{ __html: seoContent.benefits }}
                                    />
                                </div>
                            </div>
                        </section>
                    )}

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
