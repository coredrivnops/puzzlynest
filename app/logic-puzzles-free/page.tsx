import { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';
import { GAMES } from '@/lib/games';
import { getFAQSchema, getGameListSchema, stringifySchema } from '@/lib/structuredData';

export const metadata: Metadata = {
    title: 'Logic Puzzles Free - Brain Teasers & Reasoning Games | PuzzlyNest',
    description: 'Challenge your mind with free logic puzzles. Sudoku, Kakuro, Minesweeper, pattern puzzles, and brain teasers. Sharpen your reasoning skills online!',
    alternates: {
        canonical: 'https://puzzlynest.com/logic-puzzles-free',
    },
    openGraph: {
        title: 'Logic Puzzles Free - Brain Teasers Online',
        description: 'Sudoku, Kakuro, and more logic puzzles to challenge your brain - all free!',
        url: 'https://puzzlynest.com/logic-puzzles-free',
        siteName: 'PuzzlyNest',
        type: 'website',
    },
    robots: { index: true, follow: true },
};

const PAGE_FAQS = [
    {
        question: "What are logic puzzles?",
        answer: "Logic puzzles are games that require deductive reasoning and systematic thinking to solve. They include number puzzles like Sudoku and Kakuro, grid-based puzzles like Minesweeper, and pattern recognition challenges."
    },
    {
        question: "Are logic puzzles good for the brain?",
        answer: "Yes! Research suggests that regularly solving logic puzzles can improve problem-solving skills, enhance memory, and may help maintain cognitive function as we age. They exercise your brain's reasoning and analytical capabilities."
    },
    {
        question: "Which logic puzzle should I start with?",
        answer: "Sudoku is an excellent starting point for beginners. Start with an easy 4x4 or 6x6 grid before progressing to the standard 9x9. Once comfortable, try Minesweeper or Nonogram for variety."
    },
    {
        question: "How can I get better at logic puzzles?",
        answer: "Practice regularly, start with easier puzzles and gradually increase difficulty, learn common solving techniques for each puzzle type, and don't be afraid to use our hint tools when stuck."
    }
];

export default function LogicPuzzlesPage() {
    // Get logic-related games
    const logicGames = GAMES.filter(g =>
        g.category === 'brain-training' ||
        g.name.toLowerCase().includes('sudoku') ||
        g.name.toLowerCase().includes('logic') ||
        g.name.toLowerCase().includes('minesweeper') ||
        g.name.toLowerCase().includes('kakuro') ||
        g.name.toLowerCase().includes('nonogram') ||
        g.name.toLowerCase().includes('pattern') ||
        g.name.toLowerCase().includes('chess') ||
        g.id.includes('brain')
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
                        __html: stringifySchema(getGameListSchema(logicGames, 'Free Logic Puzzles'))
                    }}
                />

                <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                    {/* Hero Section */}
                    <header style={{
                        textAlign: 'center',
                        marginBottom: '3rem',
                        padding: '3rem 2rem',
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(251, 191, 36, 0.08))',
                        borderRadius: '24px',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                    }}>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            fontWeight: 800,
                            marginBottom: '1rem',
                            background: 'linear-gradient(135deg, #fff 0%, #fef3c7 50%, #fbbf24 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            💡 Logic Puzzles Free
                        </h1>
                        <p style={{
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '1.2rem',
                            maxWidth: '700px',
                            margin: '0 auto 1.5rem',
                            lineHeight: 1.7,
                        }}>
                            Exercise your brain with our collection of <strong>free logic puzzles</strong>.
                            From Sudoku to brain teasers, challenge your reasoning skills.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/play/sudoku-classic" className="btn btn-primary">Play Sudoku</Link>
                            <Link href="/tools/sudoku-solver" className="btn btn-ghost">Sudoku Solver Tool →</Link>
                        </div>
                    </header>

                    {/* Difficulty Selector */}
                    <section style={{ marginBottom: '3rem' }}>
                        <h2 className="section-title" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                            Choose Your Challenge Level
                        </h2>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}>
                            {[
                                { label: '🌱 Beginner', href: '/play/sudoku-mini', color: '#22c55e' },
                                { label: '📈 Intermediate', href: '/play/sudoku-classic', color: '#f59e0b' },
                                { label: '🔥 Advanced', href: '/play/kakuro', color: '#ef4444' },
                                { label: '🧠 Expert', href: '/play/logic-grid', color: '#8b5cf6' },
                            ].map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    style={{
                                        padding: '1rem 2rem',
                                        borderRadius: '12px',
                                        background: `${item.color}15`,
                                        border: `2px solid ${item.color}40`,
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
                            🎮 Featured Logic Games
                        </h2>
                        <div className="game-grid">
                            {logicGames.map(game => (
                                <GameCard key={game.id} game={game} />
                            ))}
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <Link href="/category/brain-training" className="btn btn-primary">
                                View All Brain Training Games →
                            </Link>
                        </div>
                    </section>

                    {/* Types of Logic Puzzles */}
                    <section style={{
                        padding: '2.5rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        marginBottom: '3rem',
                    }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem', color: '#fff' }}>
                            Types of Logic Puzzles
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '1.5rem',
                        }}>
                            {[
                                {
                                    title: '🔢 Number Puzzles',
                                    desc: 'Sudoku, Kakuro, and other number-based challenges that test your numerical reasoning.',
                                    games: ['Sudoku', 'Kakuro', 'Number Sequence'],
                                },
                                {
                                    title: '🔲 Grid Puzzles',
                                    desc: 'Minesweeper, Nonograms, and logic grids where you deduce the correct pattern.',
                                    games: ['Minesweeper', 'Nonogram', 'Logic Grid'],
                                },
                                {
                                    title: '🧩 Pattern Puzzles',
                                    desc: 'Find the pattern, complete the sequence, or identify the missing piece.',
                                    games: ['Pattern Master', 'Spatial Reasoning'],
                                },
                                {
                                    title: '♟️ Strategy Puzzles',
                                    desc: 'Chess puzzles and strategic thinking games that require planning ahead.',
                                    games: ['Chess Puzzles', 'Checkers'],
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    style={{
                                        padding: '1.5rem',
                                        background: 'rgba(245, 158, 11, 0.05)',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(245, 158, 11, 0.15)',
                                    }}
                                >
                                    <h3 style={{ marginBottom: '0.5rem', color: '#fbbf24' }}>{item.title}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                                        {item.desc}
                                    </p>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {item.games.map(game => (
                                            <span
                                                key={game}
                                                style={{
                                                    padding: '0.25rem 0.5rem',
                                                    background: 'rgba(245, 158, 11, 0.2)',
                                                    borderRadius: '4px',
                                                    fontSize: '0.8rem',
                                                    color: 'rgba(255,255,255,0.8)',
                                                }}
                                            >
                                                {game}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* SEO Content */}
                    <section style={{
                        padding: '2.5rem',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        marginBottom: '3rem',
                    }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: '#fff' }}>
                            The Power of Logic Puzzles
                        </h2>
                        <div style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.9 }}>
                            <p style={{ marginBottom: '1rem' }}>
                                Logic puzzles have been challenging minds for millennia. From ancient riddles to
                                modern Sudoku, these brain teasers share a common thread: they require you to
                                think systematically, consider possibilities, and eliminate incorrect options
                                through careful reasoning.
                            </p>
                            <p style={{ marginBottom: '1rem' }}>
                                <strong>Why logic puzzles matter:</strong> In our digital age, the ability to
                                think critically and solve problems is more valuable than ever. Logic puzzles
                                train these exact skills in an engaging, low-stakes environment. When you solve
                                a <Link href="/play/sudoku-classic" style={{ color: '#fbbf24' }}>Sudoku puzzle</Link>,
                                you're not just filling in numbers—you're strengthening neural pathways associated
                                with analytical thinking.
                            </p>
                            <p>
                                <strong>Getting started:</strong> If you're new to logic puzzles, we recommend
                                starting with our <Link href="/play/sudoku-mini" style={{ color: '#fbbf24' }}>Mini Sudoku</Link> (4x4 grid)
                                to learn the basics, then progress to the classic 9x9 version. For something different,
                                try <Link href="/play/minesweeper" style={{ color: '#fbbf24' }}>Minesweeper</Link>—it's
                                pure logic disguised as a game!
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
                                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(251, 191, 36, 0.02))',
                                        border: '1px solid rgba(245, 158, 11, 0.15)',
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

                    {/* Related Categories */}
                    <section>
                        <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
                            🔗 Explore More Games
                        </h2>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Link href="/free-online-puzzles" className="btn btn-ghost">🧩 All Puzzles</Link>
                            <Link href="/memory-games-online" className="btn btn-ghost">🧠 Memory Games</Link>
                            <Link href="/word-games-online" className="btn btn-ghost">📝 Word Games</Link>
                            <Link href="/solitaire-games" className="btn btn-ghost">🃏 Solitaire</Link>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
}
