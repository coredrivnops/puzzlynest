import { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';
import { GAMES } from '@/lib/games';
import { getFAQSchema, getGameListSchema, stringifySchema } from '@/lib/structuredData';

export const metadata: Metadata = {
    title: 'Free Online Puzzles - Play Puzzle Games Instantly | PuzzlyNest',
    description: 'Play 100+ free puzzle games online. Sudoku, crosswords, jigsaw puzzles, logic games, and brain teasers. No download or registration required!',
    alternates: {
        canonical: 'https://puzzlynest.com/free-online-puzzles',
    },
    openGraph: {
        title: 'Free Online Puzzles - Play Instantly',
        description: 'Play 100+ free puzzle games online. Sudoku, crosswords, jigsaws, and more!',
        url: 'https://puzzlynest.com/free-online-puzzles',
        siteName: 'PuzzlyNest',
        type: 'website',
    },
    robots: { index: true, follow: true },
};

const PAGE_FAQS = [
    {
        question: "Are these puzzle games really free?",
        answer: "Yes! All puzzle games on PuzzlyNest are 100% free to play. No credit card, no subscription, no hidden fees. Just click and play instantly."
    },
    {
        question: "Do I need to download anything to play?",
        answer: "No downloads required. All our puzzles run directly in your web browser on any device - computers, tablets, and mobile phones."
    },
    {
        question: "What types of puzzles are available?",
        answer: "We offer Sudoku, crossword puzzles, jigsaw puzzles, word searches, logic puzzles, memory games, pattern matching, and many more brain teasers."
    },
    {
        question: "Can I play on my phone or tablet?",
        answer: "Absolutely! PuzzlyNest is fully responsive and works perfectly on all devices including smartphones, tablets, laptops, and desktop computers."
    }
];

export default function FreeOnlinePuzzlesPage() {
    // Get puzzle-type games
    const puzzleGames = GAMES.filter(g =>
        ['brain-training', 'word-games'].includes(g.category) ||
        g.name.toLowerCase().includes('puzzle') ||
        g.name.toLowerCase().includes('sudoku') ||
        g.name.toLowerCase().includes('jigsaw')
    ).slice(0, 12);

    return (
        <>
            <Navigation />

            <main style={{
                background: 'linear-gradient(135deg, #0a0a1a 0%, #0f0f2d 50%, #0a0a1a 100%)',
                minHeight: '100vh',
            }}>
                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: stringifySchema(getFAQSchema(PAGE_FAQS))
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: stringifySchema(getGameListSchema(puzzleGames, 'Free Online Puzzles'))
                    }}
                />

                <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                    {/* Hero Section */}
                    <header style={{
                        textAlign: 'center',
                        marginBottom: '3rem',
                        padding: '3rem 2rem',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.08))',
                        borderRadius: '24px',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                    }}>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            fontWeight: 800,
                            marginBottom: '1rem',
                            background: 'linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #a5b4fc 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            🧩 Free Online Puzzles
                        </h1>
                        <p style={{
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '1.2rem',
                            maxWidth: '700px',
                            margin: '0 auto 1.5rem',
                            lineHeight: 1.7,
                        }}>
                            Challenge your mind with our collection of <strong>100+ free puzzle games</strong>.
                            From classic Sudoku to brain-bending logic puzzles, find your next favorite game.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/games" className="btn btn-primary">Browse All Games</Link>
                            <Link href="/tools" className="btn btn-ghost">Puzzle Solvers</Link>
                        </div>
                    </header>

                    {/* Quick Links */}
                    <section style={{ marginBottom: '3rem' }}>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}>
                            {[
                                { href: '/play/sudoku-classic', label: '🔢 Sudoku', color: '#6366f1' },
                                { href: '/play/jigsaw-easy', label: '🧩 Jigsaw', color: '#8b5cf6' },
                                { href: '/play/word-search', label: '🔍 Word Search', color: '#10b981' },
                                { href: '/play/memory-match', label: '🎴 Memory', color: '#f59e0b' },
                                { href: '/play/logic-grid', label: '🧠 Logic', color: '#ec4899' },
                            ].map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '100px',
                                        background: `${item.color}20`,
                                        border: `1px solid ${item.color}40`,
                                        color: '#fff',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Featured Games Grid */}
                    <section style={{ marginBottom: '3rem' }}>
                        <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
                            🎮 Featured Puzzle Games
                        </h2>
                        <div className="game-grid">
                            {puzzleGames.map(game => (
                                <GameCard key={game.id} game={game} />
                            ))}
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <Link href="/games" className="btn btn-primary">
                                View All 100+ Games →
                            </Link>
                        </div>
                    </section>

                    {/* SEO Content Block */}
                    <section style={{
                        padding: '2.5rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        marginBottom: '3rem',
                    }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem', color: '#fff' }}>
                            Why Play Puzzle Games Online?
                        </h2>
                        <div style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.9 }}>
                            <p style={{ marginBottom: '1rem' }}>
                                Puzzle games have been a beloved pastime for centuries, and the digital age has made them more accessible than ever.
                                Whether you're looking to <strong>sharpen your mind</strong>, pass time during a commute, or simply unwind after a long day,
                                online puzzles offer the perfect solution.
                            </p>
                            <p style={{ marginBottom: '1rem' }}>
                                Research from cognitive science suggests that regularly engaging with puzzles can help maintain mental acuity.
                                Activities like <Link href="/play/sudoku-classic" style={{ color: '#a5b4fc' }}>Sudoku</Link> improve logical thinking,
                                while <Link href="/play/word-search" style={{ color: '#a5b4fc' }}>word searches</Link> enhance vocabulary and pattern recognition.
                            </p>
                            <p>
                                At PuzzlyNest, we've curated a diverse collection of puzzles suitable for all skill levels.
                                From beginners tackling their first <Link href="/play/jigsaw-easy" style={{ color: '#a5b4fc' }}>jigsaw puzzle</Link> to
                                experts seeking challenging <Link href="/play/kakuro" style={{ color: '#a5b4fc' }}>Kakuro</Link> grids,
                                there's something for everyone—and it's all completely free.
                            </p>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section style={{ marginBottom: '3rem' }}>
                        <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
                            ❓ Frequently Asked Questions
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {PAGE_FAQS.map((faq, index) => (
                                <details
                                    key={index}
                                    className="card"
                                    style={{
                                        padding: '1.5rem',
                                        cursor: 'pointer',
                                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.02))',
                                        border: '1px solid rgba(99, 102, 241, 0.15)',
                                    }}
                                >
                                    <summary style={{
                                        fontWeight: 600,
                                        fontSize: '1.1rem',
                                        color: '#fff',
                                        listStyle: 'none',
                                    }}>
                                        {faq.question}
                                    </summary>
                                    <p style={{
                                        marginTop: '1rem',
                                        color: 'rgba(255,255,255,0.75)',
                                        lineHeight: 1.7,
                                    }}>
                                        {faq.answer}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </section>

                    {/* Category Links */}
                    <section>
                        <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
                            📂 Explore More Categories
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1rem',
                        }}>
                            {[
                                { href: '/memory-games-online', label: '🧠 Memory Games', desc: 'Test your recall' },
                                { href: '/word-games-online', label: '📝 Word Games', desc: 'Word puzzles & more' },
                                { href: '/solitaire-games', label: '🃏 Solitaire', desc: 'Classic card games' },
                                { href: '/logic-puzzles-free', label: '💡 Logic Puzzles', desc: 'Brain teasers' },
                            ].map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="card"
                                    style={{
                                        padding: '1.5rem',
                                        textDecoration: 'none',
                                        color: '#fff',
                                        textAlign: 'center',
                                    }}
                                >
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.label.split(' ')[0]}</div>
                                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.label.split(' ').slice(1).join(' ')}</div>
                                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{item.desc}</div>
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
