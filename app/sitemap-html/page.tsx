import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { GAMES } from '@/lib/games';
import { GAME_CATEGORIES } from '@/lib/config';

export const metadata = {
    title: 'Sitemap - All Games & Pages | PuzzlyNest',
    description: 'Browse all games and pages on PuzzlyNest. Find brain training games, kids games, puzzle solvers, and more.',
};

export default function SitemapPage() {
    const seniorGames = GAMES.filter(g => g.ageGroup === 'seniors');
    const kidsGames = GAMES.filter(g => g.ageGroup === 'kids');

    return (
        <>
            <Navigation />

            <main style={{
                background: 'linear-gradient(135deg, #0a0a1a 0%, #0f0f2d 50%, #0a0a1a 100%)',
                minHeight: '100vh',
                position: 'relative',
            }}>
                <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                        marginBottom: '2rem',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #a5b4fc 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 800,
                    }}>
                        Sitemap - All Pages
                    </h1>

                    {/* Main Pages */}
                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ color: '#c7d2fe', marginBottom: '1rem', fontSize: '1.5rem' }}>
                            📄 Main Pages
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '0.75rem',
                        }}>
                            <Link href="/" style={linkStyle}>🏠 Home</Link>
                            <Link href="/games" style={linkStyle}>🎮 All Games</Link>
                            <Link href="/games/kids" style={linkStyle}>👶 Kids Games</Link>
                            <Link href="/games/seniors" style={linkStyle}>🧠 Brain Training</Link>
                            <Link href="/blog" style={linkStyle}>📝 Blog</Link>
                            <Link href="/tools" style={linkStyle}>✨ Puzzle Solvers</Link>
                            <Link href="/achievements" style={linkStyle}>🏆 Achievements</Link>
                            <Link href="/about" style={linkStyle}>ℹ️ About Us</Link>
                            <Link href="/contact" style={linkStyle}>📬 Contact</Link>
                            <Link href="/privacy" style={linkStyle}>🔒 Privacy Policy</Link>
                            <Link href="/terms" style={linkStyle}>📋 Terms of Use</Link>
                        </div>
                    </section>

                    {/* Tools */}
                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ color: '#fbbf24', marginBottom: '1rem', fontSize: '1.5rem' }}>
                            🔧 Puzzle Solvers & Tools
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '0.75rem',
                        }}>
                            <Link href="/tools/sudoku-solver" style={linkStyle}>Sudoku Solver</Link>
                            <Link href="/tools/word-unscrambler" style={linkStyle}>Word Unscrambler</Link>
                            <Link href="/tools/crossword-solver" style={linkStyle}>Crossword Solver</Link>
                            <Link href="/tools/word-search-maker" style={linkStyle}>Word Search Maker</Link>
                        </div>
                    </section>

                    {/* Categories */}
                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ color: '#6ee7b7', marginBottom: '1rem', fontSize: '1.5rem' }}>
                            📂 Game Categories
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '0.75rem',
                        }}>
                            {GAME_CATEGORIES.map(cat => (
                                <Link key={cat.id} href={`/category/${cat.id}`} style={linkStyle}>
                                    {cat.icon} {cat.name}
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Brain Training Games */}
                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ color: '#c4b5fd', marginBottom: '1rem', fontSize: '1.5rem' }}>
                            🧠 Brain Training Games ({seniorGames.length})
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                            gap: '0.5rem',
                        }}>
                            {seniorGames.map(game => (
                                <Link key={game.id} href={`/play/${game.id}`} style={smallLinkStyle}>
                                    {game.name}
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Kids Games */}
                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ color: '#fca5a5', marginBottom: '1rem', fontSize: '1.5rem' }}>
                            👶 Kids Games ({kidsGames.length})
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                            gap: '0.5rem',
                        }}>
                            {kidsGames.map(game => (
                                <Link key={game.id} href={`/play/${game.id}`} style={smallLinkStyle}>
                                    {game.name}
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

const linkStyle: React.CSSProperties = {
    display: 'block',
    padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    transition: 'background 0.2s',
};

const smallLinkStyle: React.CSSProperties = {
    display: 'block',
    padding: '0.5rem 0.75rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '6px',
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '0.9rem',
};
