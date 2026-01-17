import { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';
import { GAMES } from '@/lib/games';
import { getFAQSchema, getGameListSchema, stringifySchema } from '@/lib/structuredData';

export const metadata: Metadata = {
    title: 'Free Solitaire Games Online - Classic Card Games | PuzzlyNest',
    description: 'Play free solitaire games online. Klondike, Spider, FreeCell, Pyramid, and more classic card games. No download needed - play instantly!',
    alternates: {
        canonical: 'https://puzzlynest.com/solitaire-games',
    },
    openGraph: {
        title: 'Free Solitaire Games - Play Classic Card Games Online',
        description: 'Klondike, Spider, FreeCell solitaire and more - all free, no download!',
        url: 'https://puzzlynest.com/solitaire-games',
        siteName: 'PuzzlyNest',
        type: 'website',
    },
    robots: { index: true, follow: true },
};

const PAGE_FAQS = [
    {
        question: "What solitaire games can I play for free?",
        answer: "PuzzlyNest offers Klondike (classic solitaire), Spider Solitaire, FreeCell, Pyramid Solitaire, and more. All games are completely free with no registration or download required."
    },
    {
        question: "What's the difference between Klondike and Spider Solitaire?",
        answer: "Klondike is the classic single-deck solitaire most people know. Spider Solitaire uses two decks and requires you to build descending sequences of the same suit. Spider is generally considered more challenging."
    },
    {
        question: "Is FreeCell always winnable?",
        answer: "Almost! About 99.999% of FreeCell deals are solvable. The original Windows FreeCell had only one known unsolvable deal (#11982). It's all about strategy, not luck!"
    },
    {
        question: "Can I play solitaire on my phone?",
        answer: "Yes! All our solitaire games are fully responsive and work perfectly on smartphones, tablets, and desktop computers. Just open the website in your browser and start playing."
    }
];

export default function SolitaireGamesPage() {
    // Get card games / solitaire
    const cardGames = GAMES.filter(g =>
        g.name.toLowerCase().includes('solitaire') ||
        g.name.toLowerCase().includes('freecell') ||
        g.name.toLowerCase().includes('pyramid') ||
        g.name.toLowerCase().includes('spider') ||
        g.name.toLowerCase().includes('rummy') ||
        g.name.toLowerCase().includes('hearts') ||
        g.name.toLowerCase().includes('cribbage') ||
        g.name.toLowerCase().includes('mahjong') ||
        g.category === 'classic-games'
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
                        __html: stringifySchema(getGameListSchema(cardGames, 'Free Solitaire Games'))
                    }}
                />

                <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                    {/* Hero Section */}
                    <header style={{
                        textAlign: 'center',
                        marginBottom: '3rem',
                        padding: '3rem 2rem',
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(248, 113, 113, 0.06))',
                        borderRadius: '24px',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                    }}>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            fontWeight: 800,
                            marginBottom: '1rem',
                            background: 'linear-gradient(135deg, #fff 0%, #fecaca 50%, #f87171 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            🃏 Free Solitaire Games
                        </h1>
                        <p style={{
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '1.2rem',
                            maxWidth: '700px',
                            margin: '0 auto 1.5rem',
                            lineHeight: 1.7,
                        }}>
                            Play classic <strong>solitaire and card games</strong> online for free.
                            Klondike, Spider, FreeCell, and more—no download needed!
                        </p>
                        <Link href="/play/solitaire-klondike" className="btn btn-primary">
                            Play Klondike Solitaire →
                        </Link>
                    </header>

                    {/* Quick Game Selection */}
                    <section style={{ marginBottom: '3rem' }}>
                        <h2 className="section-title" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                            Choose Your Solitaire
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1rem',
                            maxWidth: '800px',
                            margin: '0 auto',
                        }}>
                            {[
                                { label: '🂡 Klondike', href: '/play/solitaire-klondike', desc: 'Classic Solitaire' },
                                { label: '🕷️ Spider', href: '/play/solitaire-spider', desc: '2-Deck Challenge' },
                                { label: '🆓 FreeCell', href: '/play/solitaire-freecell', desc: 'Strategic Play' },
                                { label: '🔺 Pyramid', href: '/play/pyramid-solitaire', desc: 'Match to 13' },
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
                                        background: 'rgba(239, 68, 68, 0.08)',
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                    }}
                                >
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.label.split(' ')[0]}</div>
                                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.label.split(' ').slice(1).join(' ')}</div>
                                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{item.desc}</div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* All Card Games */}
                    <section style={{ marginBottom: '3rem' }}>
                        <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
                            🎴 All Card & Classic Games
                        </h2>
                        <div className="game-grid">
                            {cardGames.map(game => (
                                <GameCard key={game.id} game={game} />
                            ))}
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <Link href="/category/classic-games" className="btn btn-primary">
                                View All Classic Games →
                            </Link>
                        </div>
                    </section>

                    {/* Solitaire Variants */}
                    <section style={{
                        padding: '2.5rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        marginBottom: '3rem',
                    }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem', color: '#fff' }}>
                            Popular Solitaire Variants
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '1.5rem',
                        }}>
                            {[
                                {
                                    title: '🂡 Klondike Solitaire',
                                    desc: 'The most popular solitaire game in the world. Build four foundation piles from Ace to King, alternating colors in the tableau.',
                                    difficulty: 'Medium',
                                    link: '/play/solitaire-klondike',
                                },
                                {
                                    title: '🕷️ Spider Solitaire',
                                    desc: 'Uses two decks of cards. Build descending sequences of the same suit. Available in 1-suit (easy), 2-suit, and 4-suit (hard) versions.',
                                    difficulty: 'Hard',
                                    link: '/play/solitaire-spider',
                                },
                                {
                                    title: '🆓 FreeCell',
                                    desc: 'All cards are dealt face-up, making it a game of pure skill. Use the four free cells strategically to move cards around.',
                                    difficulty: 'Medium-Hard',
                                    link: '/play/solitaire-freecell',
                                },
                                {
                                    title: '🔺 Pyramid Solitaire',
                                    desc: 'Match pairs of cards that add up to 13 to clear the pyramid. A great alternative for those who want something different.',
                                    difficulty: 'Medium',
                                    link: '/play/pyramid-solitaire',
                                },
                            ].map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.link}
                                    className="card"
                                    style={{
                                        padding: '1.5rem',
                                        textDecoration: 'none',
                                        color: '#fff',
                                        background: 'rgba(239, 68, 68, 0.05)',
                                        border: '1px solid rgba(239, 68, 68, 0.12)',
                                    }}
                                >
                                    <h3 style={{ marginBottom: '0.5rem', color: '#f87171' }}>{item.title}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                                        {item.desc}
                                    </p>
                                    <span
                                        style={{
                                            padding: '0.25rem 0.75rem',
                                            background: 'rgba(239, 68, 68, 0.15)',
                                            borderRadius: '100px',
                                            fontSize: '0.8rem',
                                            color: '#fca5a5',
                                        }}
                                    >
                                        Difficulty: {item.difficulty}
                                    </span>
                                </Link>
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
                            The Timeless Appeal of Solitaire
                        </h2>
                        <div style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.9 }}>
                            <p style={{ marginBottom: '1rem' }}>
                                Solitaire has been a beloved pastime for over 200 years. What began as a
                                fortune-telling practice in 18th century Europe evolved into the classic card
                                game we know today. Its inclusion in Windows 3.0 (1990) introduced millions to
                                the digital version, making it one of the most played computer games ever.
                            </p>
                            <p style={{ marginBottom: '1rem' }}>
                                <strong>Why we still love solitaire:</strong> In our fast-paced world, solitaire
                                offers a moment of calm, meditative focus. It's the perfect balance of luck and
                                skill—simple enough to play while your mind wanders, yet strategic enough to
                                engage your problem-solving abilities. Whether you have 5 minutes or an hour,
                                there's always time for a quick game.
                            </p>
                            <p>
                                At PuzzlyNest, we offer classic <Link href="/play/solitaire-klondike" style={{ color: '#f87171' }}>Klondike Solitaire</Link> for
                                purists, challenging <Link href="/play/solitaire-spider" style={{ color: '#f87171' }}>Spider Solitaire</Link> for
                                those who want more complexity, and <Link href="/play/solitaire-freecell" style={{ color: '#f87171' }}>FreeCell</Link> for
                                players who prefer skill over luck. All free, all instant—no download needed.
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
                                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(248, 113, 113, 0.02))',
                                        border: '1px solid rgba(239, 68, 68, 0.15)',
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

                    {/* More Games */}
                    <section>
                        <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
                            🔗 More Games to Explore
                        </h2>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Link href="/free-online-puzzles" className="btn btn-ghost">🧩 Puzzles</Link>
                            <Link href="/memory-games-online" className="btn btn-ghost">🧠 Memory Games</Link>
                            <Link href="/word-games-online" className="btn btn-ghost">📝 Word Games</Link>
                            <Link href="/logic-puzzles-free" className="btn btn-ghost">💡 Logic Puzzles</Link>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
}
