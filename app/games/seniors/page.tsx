import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';

import { GAMES } from '@/lib/games';

export const metadata = {
    title: 'Brain Training Games - PuzzlyNest',
    description: 'Free brain training games designed for adults 60+. Sudoku, crosswords, memory games, and puzzles with large fonts and easy controls.',
};

export default function SeniorsGamesPage() {
    const seniorGames = GAMES.filter(g => g.ageGroup === 'seniors' || g.ageGroup === 'all-ages');

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
                        textAlign: 'center',
                        marginBottom: '2rem',
                        padding: '2rem',
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(99, 102, 241, 0.08))',
                        borderRadius: '20px',
                        border: '1px solid rgba(139, 92, 246, 0.2)'
                    }}>
                        <h1 style={{
                            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
                            marginBottom: '0.5rem',
                            color: '#fff'
                        }}>
                            🧠 Brain Training Games
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem' }}>
                            Keep your mind sharp with puzzles and classic games
                        </p>
                    </div>


                    <div className="game-grid">
                        {seniorGames.map(game => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </div>

                    {/* SEO Content */}
                    <section style={{
                        marginTop: '3rem',
                        padding: '2rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}>
                        <h2 style={{ marginBottom: '1rem', color: '#fff' }}>Brain Games for Seniors</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', lineHeight: 1.8 }}>
                            Our games feature large fonts, high contrast, and simple one-click controls
                            designed for comfortable play. Regular mental exercise helps maintain cognitive health.
                        </p>
                        <ul style={{ color: 'rgba(255,255,255,0.7)', marginLeft: '1.5rem', lineHeight: 1.8 }}>
                            <li>Classic games like Solitaire and Mahjong</li>
                            <li>Word puzzles including crosswords and word search</li>
                            <li>Logic puzzles like Sudoku to challenge your mind</li>
                            <li>Memory games to improve recall and concentration</li>
                        </ul>
                    </section>

                </div>
            </main>

            <Footer />
        </>
    );
}
