import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';

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
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(52, 211, 153, 0.08))',
                        borderRadius: '20px',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                        <h1 style={{
                            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
                            marginBottom: '0.5rem',
                            color: '#fff'
                        }}>
                            👶 Games for Kids
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem' }}>
                            Safe, fun, and educational games for ages 4-12
                        </p>
                    </div>


                    <div className="game-grid">
                        {kidsGames.map(game => (
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
                        <h2 style={{ marginBottom: '1rem', color: '#fff' }}>Safe Online Games for Kids</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', lineHeight: 1.8 }}>
                            All our kids games are designed with safety in mind. No external links,
                            no chat features, and age-appropriate content only. Perfect for young learners!
                        </p>
                        <ul style={{ color: 'rgba(255,255,255,0.7)', marginLeft: '1.5rem', lineHeight: 1.8 }}>
                            <li>Educational games that teach counting, letters, and shapes</li>
                            <li>Fun arcade games with simple one-touch controls</li>
                            <li>Creative activities like coloring and drawing</li>
                            <li>Memory games to boost cognitive development</li>
                        </ul>
                    </section>

                </div>
            </main>

            <Footer />
        </>
    );
}
