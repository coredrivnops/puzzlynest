import { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';
import { GAMES } from '@/lib/games';
import { getFAQSchema, getGameListSchema, stringifySchema } from '@/lib/structuredData';

export const metadata: Metadata = {
    title: 'Memory Games Online - Free Brain Training Games | PuzzlyNest',
    description: 'Play free memory games online to improve concentration and recall. Memory match, pattern recognition, and concentration games for all ages.',
    alternates: {
        canonical: 'https://puzzlynest.com/memory-games-online',
    },
    openGraph: {
        title: 'Memory Games Online - Train Your Brain Free',
        description: 'Improve your memory with free online games. Memory match, pattern games & more!',
        url: 'https://puzzlynest.com/memory-games-online',
        siteName: 'PuzzlyNest',
        type: 'website',
    },
    robots: { index: true, follow: true },
};

const PAGE_FAQS = [
    {
        question: "Do memory games actually improve memory?",
        answer: "Research suggests that regularly playing memory games can improve short-term memory, concentration, and cognitive function. Like physical exercise for your body, mental exercise helps keep your brain healthy."
    },
    {
        question: "How often should I play memory games?",
        answer: "For best results, try to play for 15-20 minutes daily. Consistency is more important than duration. Even a few quick games during a break can provide benefits."
    },
    {
        question: "Are these memory games suitable for children?",
        answer: "Absolutely! Memory games are excellent for children's cognitive development. We offer difficulty levels suitable for all ages, from simple matching games to complex pattern challenges."
    },
    {
        question: "Can I play memory games on my mobile phone?",
        answer: "Yes! All our memory games are fully responsive and work great on smartphones, tablets, and computers. No app download needed."
    }
];

export default function MemoryGamesPage() {
    // Get memory-related games
    const memoryGames = GAMES.filter(g =>
        g.name.toLowerCase().includes('memory') ||
        g.name.toLowerCase().includes('match') ||
        g.name.toLowerCase().includes('pattern') ||
        g.name.toLowerCase().includes('simon') ||
        g.name.toLowerCase().includes('sequence') ||
        g.id.includes('memory') ||
        g.id.includes('tile-matching') ||
        g.id.includes('color-match')
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
                        __html: stringifySchema(getGameListSchema(memoryGames, 'Free Memory Games Online'))
                    }}
                />

                <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                    {/* Hero Section */}
                    <header style={{
                        textAlign: 'center',
                        marginBottom: '3rem',
                        padding: '3rem 2rem',
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.08))',
                        borderRadius: '24px',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                    }}>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            fontWeight: 800,
                            marginBottom: '1rem',
                            background: 'linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #a78bfa 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            🧠 Memory Games Online
                        </h1>
                        <p style={{
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '1.2rem',
                            maxWidth: '700px',
                            margin: '0 auto 1.5rem',
                            lineHeight: 1.7,
                        }}>
                            Sharpen your recall and boost concentration with our collection of
                            <strong> free memory games</strong>. From classic card matching to advanced pattern challenges.
                        </p>
                        <Link href="/play/memory-match" className="btn btn-primary">
                            Play Memory Match Now →
                        </Link>
                    </header>

                    {/* Quick Stats */}
                    <section style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '3rem',
                        flexWrap: 'wrap',
                        marginBottom: '3rem',
                        padding: '2rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.08)',
                    }}>
                        {[
                            { value: '15+', label: 'Memory Games' },
                            { value: '100%', label: 'Free to Play' },
                            { value: '0', label: 'Downloads' },
                            { value: '∞', label: 'Replays' },
                        ].map((stat, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontSize: '2rem',
                                    fontWeight: 800,
                                    background: 'linear-gradient(135deg, #a78bfa, #f472b6)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>
                                    {stat.value}
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Featured Games Grid */}
                    <section style={{ marginBottom: '3rem' }}>
                        <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
                            🎴 Featured Memory Games
                        </h2>
                        <div className="game-grid">
                            {memoryGames.map(game => (
                                <GameCard key={game.id} game={game} />
                            ))}
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <Link href="/games" className="btn btn-primary">
                                Explore All Games →
                            </Link>
                        </div>
                    </section>

                    {/* Benefits Section */}
                    <section style={{
                        padding: '2.5rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        marginBottom: '3rem',
                    }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem', color: '#fff' }}>
                            Benefits of Playing Memory Games
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '1.5rem',
                        }}>
                            {[
                                {
                                    title: '🎯 Improved Concentration',
                                    desc: 'Train your brain to focus for longer periods. Memory games require sustained attention, helping you develop better concentration skills.',
                                },
                                {
                                    title: '💡 Enhanced Short-Term Memory',
                                    desc: 'Regular practice strengthens the neural pathways responsible for short-term memory, making it easier to remember names, numbers, and daily tasks.',
                                },
                                {
                                    title: '⚡ Faster Recall Speed',
                                    desc: 'The more you play, the faster your brain becomes at retrieving stored information. This translates to quicker thinking in everyday situations.',
                                },
                                {
                                    title: '😌 Stress Relief',
                                    desc: 'Focusing on a game provides a mental break from daily worries. The sense of accomplishment when you win triggers dopamine release.',
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    style={{
                                        padding: '1.5rem',
                                        background: 'rgba(139, 92, 246, 0.08)',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(139, 92, 246, 0.15)',
                                    }}
                                >
                                    <h3 style={{ marginBottom: '0.5rem', color: '#c4b5fd' }}>{item.title}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                        {item.desc}
                                    </p>
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
                            How Memory Games Work
                        </h2>
                        <div style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.9 }}>
                            <p style={{ marginBottom: '1rem' }}>
                                Memory games challenge your brain's ability to encode, store, and retrieve information.
                                The most common type is the <strong>matching game</strong>, where you flip cards to find pairs.
                                This simple mechanic engages multiple cognitive processes: visual processing, spatial memory, and pattern recognition.
                            </p>
                            <p style={{ marginBottom: '1rem' }}>
                                As you progress to harder levels with more cards, your brain adapts by developing more efficient
                                memory strategies. You might start using spatial cues ("the cat was in the corner") or
                                creating mental stories to link images together. These techniques are known as
                                <em> mnemonic devices</em> and are used by memory champions worldwide.
                            </p>
                            <p>
                                At PuzzlyNest, we offer memory games with varying difficulty levels.
                                <Link href="/play/memory-match" style={{ color: '#a5b4fc' }}> Classic Memory Match</Link> is perfect for beginners,
                                while <Link href="/play/memory-cards-advanced" style={{ color: '#a5b4fc' }}> Advanced Memory</Link> challenges even experienced players
                                with larger grids and time limits.
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
                                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(168, 85, 247, 0.02))',
                                        border: '1px solid rgba(139, 92, 246, 0.15)',
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
                            🔗 Related Game Categories
                        </h2>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Link href="/free-online-puzzles" className="btn btn-ghost">🧩 All Puzzles</Link>
                            <Link href="/logic-puzzles-free" className="btn btn-ghost">💡 Logic Puzzles</Link>
                            <Link href="/word-games-online" className="btn btn-ghost">📝 Word Games</Link>
                            <Link href="/games/kids" className="btn btn-ghost">👶 Kids Games</Link>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
}
