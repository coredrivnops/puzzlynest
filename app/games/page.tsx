import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';
import AdBanner from '@/components/AdBanner';
import { GAMES } from '@/lib/games';
import Link from 'next/link';

export const metadata = {
    title: 'All Games - PuzzlyNest | Free Online Games',
    description: 'Browse our complete collection of 20+ free online games. Puzzle games, card games, brain training, and fun arcade games for all ages.',
};

export default function GamesPage() {
    return (
        <>
            <Navigation />

            <main className="container" style={{ paddingTop: '2rem' }}>
                <div className="section-header">
                    <h1 className="section-title">🎯 All Games</h1>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link href="/games/kids" className="btn btn-ghost">👶 Kids</Link>
                        <Link href="/games/seniors" className="btn btn-ghost">🧠 Seniors</Link>
                    </div>
                </div>

                <AdBanner type="horizontal" slot="games-top" />

                <div className="game-grid">
                    {GAMES.map(game => (
                        <GameCard key={game.id} game={game} />
                    ))}
                </div>

                <AdBanner type="horizontal" slot="games-bottom" />
            </main>

            <Footer />
        </>
    );
}
