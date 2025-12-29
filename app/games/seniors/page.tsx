import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';
import AdBanner from '@/components/AdBanner';
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

            <main className="container" style={{ paddingTop: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        🧠 Brain Training Games
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
                        Keep your mind sharp with puzzles and classic games
                    </p>
                </div>

                <AdBanner type="horizontal" slot="seniors-top" />

                <div className="game-grid">
                    {seniorGames.map(game => (
                        <GameCard key={game.id} game={game} />
                    ))}
                </div>

                {/* SEO Content */}
                <section style={{
                    marginTop: '3rem',
                    padding: '2rem',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '16px',
                }}>
                    <h2 style={{ marginBottom: '1rem' }}>Brain Games for Seniors</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
                        Our games feature large fonts, high contrast, and simple one-click controls
                        designed for comfortable play. Regular mental exercise helps maintain cognitive health.
                    </p>
                    <ul style={{ color: 'rgba(255,255,255,0.7)', marginLeft: '1.5rem' }}>
                        <li>Classic games like Solitaire and Mahjong</li>
                        <li>Word puzzles including crosswords and word search</li>
                        <li>Logic puzzles like Sudoku to challenge your mind</li>
                        <li>Memory games to improve recall and concentration</li>
                    </ul>
                </section>

                <AdBanner type="horizontal" slot="seniors-bottom" />
            </main>

            <Footer />
        </>
    );
}
