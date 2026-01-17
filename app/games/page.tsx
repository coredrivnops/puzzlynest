import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';

import { GAMES } from '@/lib/games';
import Link from 'next/link';

export const metadata = {
    title: 'All Games - PuzzlyNest | Free Online Games',
    description: 'Browse our complete collection of 100+ free online games. Puzzle games, card games, brain training, and fun arcade games for all ages.',
};

export default function GamesPage() {
    return (
        <>
            <Navigation />

            <main style={{
                background: '#0a0a1a',
                minHeight: '100vh',
                paddingTop: '2rem',
                paddingBottom: '4rem'
            }}>
                <div className="container">
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        marginBottom: '2rem'
                    }}>
                        <h1 style={{
                            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
                            color: '#fff'
                        }}>
                            🎯 All Games
                        </h1>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <Link href="/games/kids" style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '100px',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                background: 'rgba(255,255,255,0.08)',
                                color: 'rgba(255,255,255,0.9)',
                                border: '1px solid rgba(255,255,255,0.15)',
                            }}>
                                👶 Kids Games
                            </Link>
                            <Link href="/games/seniors" style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '100px',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                background: 'rgba(255,255,255,0.08)',
                                color: 'rgba(255,255,255,0.9)',
                                border: '1px solid rgba(255,255,255,0.15)',
                            }}>
                                🧠 Brain Games
                            </Link>
                        </div>
                    </div>


                    <div className="game-grid">
                        {GAMES.map(game => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </div>

                </div>
            </main>

            <Footer />
        </>
    );
}
