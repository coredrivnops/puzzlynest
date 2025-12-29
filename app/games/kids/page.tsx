import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';
import AdBanner from '@/components/AdBanner';
import { GAMES } from '@/lib/games';

export const metadata = {
    title: 'Kids Games - PuzzlyNest | Safe Fun Games for Children',
    description: 'Safe, fun, and educational games for kids ages 4-12. Learn counting, letters, shapes, and more while playing! No download required.',
};

export default function KidsGamesPage() {
    const kidsGames = GAMES.filter(g => g.ageGroup === 'kids');

    return (
        <>
            <Navigation />

            <main className="container" style={{ paddingTop: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        👶 Games for Kids
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
                        Safe, fun, and educational games for ages 4-12
                    </p>
                </div>

                <AdBanner type="horizontal" slot="kids-top" />

                <div className="game-grid">
                    {kidsGames.map(game => (
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
                    <h2 style={{ marginBottom: '1rem' }}>Safe Online Games for Kids</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
                        All our kids games are designed with safety in mind. No external links,
                        no chat features, and age-appropriate content only. Perfect for young learners!
                    </p>
                    <ul style={{ color: 'rgba(255,255,255,0.7)', marginLeft: '1.5rem' }}>
                        <li>Educational games that teach counting, letters, and shapes</li>
                        <li>Fun arcade games with simple one-touch controls</li>
                        <li>Creative activities like coloring and drawing</li>
                        <li>Memory games to boost cognitive development</li>
                    </ul>
                </section>

                <AdBanner type="horizontal" slot="kids-bottom" />
            </main>

            <Footer />
        </>
    );
}
