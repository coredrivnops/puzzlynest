import { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';
import { GAMES } from '@/lib/games';
import { getFAQSchema, getGameListSchema, stringifySchema } from '@/lib/structuredData';

export const metadata: Metadata = {
    title: 'Word Games Online - Free Word Puzzles & Vocabulary Games | PuzzlyNest',
    description: 'Play free word games online. Word search, crosswords, anagrams, spelling games, and vocabulary builders. Challenge your wordplay skills today!',
    alternates: {
        canonical: 'https://puzzlynest.com/word-games-online',
    },
    openGraph: {
        title: 'Word Games Online - Free Word Puzzles',
        description: 'Word search, crosswords, anagrams, and more word games - all free!',
        url: 'https://puzzlynest.com/word-games-online',
        siteName: 'PuzzlyNest',
        type: 'website',
    },
    robots: { index: true, follow: true },
};

const PAGE_FAQS = [
    {
        question: "What word games can I play for free?",
        answer: "PuzzlyNest offers Word Search, Crossword Helper, Hangman, Spelling Bee, Word Ladder, Anagram Challenge, Vocabulary Builder, and more. All games are 100% free with no registration required."
    },
    {
        question: "Do word games help improve vocabulary?",
        answer: "Yes! Playing word games regularly exposes you to new words and reinforces your existing vocabulary. Studies show that word puzzles can improve spelling, reading comprehension, and verbal fluency."
    },
    {
        question: "Can I use these games to practice for Scrabble or Wordle?",
        answer: "Absolutely! Our Word Unscrambler tool and Anagram games are perfect practice for Scrabble. The pattern-matching skills you develop translate directly to games like Wordle."
    },
    {
        question: "Are word games good for children learning to read?",
        answer: "Word games are excellent educational tools for developing readers. They make learning fun while building phonics skills, sight word recognition, and spelling abilities."
    }
];

export default function WordGamesPage() {
    // Get word-related games
    const wordGames = GAMES.filter(g =>
        g.category === 'word-games' ||
        g.name.toLowerCase().includes('word') ||
        g.name.toLowerCase().includes('spelling') ||
        g.name.toLowerCase().includes('anagram') ||
        g.name.toLowerCase().includes('vocabulary') ||
        g.name.toLowerCase().includes('hangman') ||
        g.name.toLowerCase().includes('boggle') ||
        g.name.toLowerCase().includes('cryptogram')
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
                        __html: stringifySchema(getGameListSchema(wordGames, 'Free Word Games Online'))
                    }}
                />

                <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                    {/* Hero Section */}
                    <header style={{
                        textAlign: 'center',
                        marginBottom: '3rem',
                        padding: '3rem 2rem',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(34, 197, 94, 0.08))',
                        borderRadius: '24px',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            fontWeight: 800,
                            marginBottom: '1rem',
                            background: 'linear-gradient(135deg, #fff 0%, #86efac 50%, #4ade80 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            📝 Word Games Online
                        </h1>
                        <p style={{
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '1.2rem',
                            maxWidth: '700px',
                            margin: '0 auto 1.5rem',
                            lineHeight: 1.7,
                        }}>
                            Expand your vocabulary and test your wordplay skills with our collection of
                            <strong> free word games</strong>. From classic word searches to challenging anagrams.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/play/word-search" className="btn btn-primary">Play Word Search</Link>
                            <Link href="/tools/word-unscrambler" className="btn btn-ghost">Word Unscrambler Tool →</Link>
                        </div>
                    </header>

                    {/* Quick Game Links */}
                    <section style={{ marginBottom: '3rem' }}>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}>
                            {[
                                { href: '/play/word-search', label: '🔍 Word Search' },
                                { href: '/play/hangman', label: '👤 Hangman' },
                                { href: '/play/spelling-bee', label: '🐝 Spelling Bee' },
                                { href: '/play/anagram-challenge', label: '🔤 Anagrams' },
                                { href: '/play/word-ladder', label: '🪜 Word Ladder' },
                            ].map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '100px',
                                        background: 'rgba(16, 185, 129, 0.15)',
                                        border: '1px solid rgba(16, 185, 129, 0.3)',
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
                            🎮 Featured Word Games
                        </h2>
                        <div className="game-grid">
                            {wordGames.map(game => (
                                <GameCard key={game.id} game={game} />
                            ))}
                        </div>
                    </section>

                    {/* Word Tools Promo */}
                    <section style={{
                        padding: '2.5rem',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(34, 197, 94, 0.05))',
                        borderRadius: '20px',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        marginBottom: '3rem',
                        textAlign: 'center',
                    }}>
                        <h2 style={{ marginBottom: '1rem', fontSize: '1.75rem', color: '#fff' }}>
                            🛠️ Word Solving Tools
                        </h2>
                        <p style={{
                            color: 'rgba(255,255,255,0.8)',
                            marginBottom: '1.5rem',
                            maxWidth: '600px',
                            margin: '0 auto 1.5rem',
                        }}>
                            Stuck on a crossword clue? Need help with Scrabble? Our free tools have you covered.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/tools/word-unscrambler" className="btn btn-primary">
                                🔠 Word Unscrambler
                            </Link>
                            <Link href="/tools/crossword-solver" className="btn btn-ghost">
                                🔍 Crossword Helper
                            </Link>
                        </div>
                    </section>

                    {/* SEO Content */}
                    <section style={{
                        padding: '2.5rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        marginBottom: '3rem',
                    }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem', color: '#fff' }}>
                            Why Play Word Games?
                        </h2>
                        <div style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.9 }}>
                            <p style={{ marginBottom: '1rem' }}>
                                Word games have been entertaining and educating people for centuries. From the first
                                crossword puzzle published in 1913 to today's viral word games, these puzzles continue
                                to captivate millions of players worldwide.
                            </p>
                            <p style={{ marginBottom: '1rem' }}>
                                <strong>Educational Benefits:</strong> Word games are more than just entertainment.
                                They actively build vocabulary, improve spelling, and enhance reading comprehension.
                                For language learners, they provide an engaging way to practice new words in context.
                                Teachers frequently use <Link href="/play/word-search" style={{ color: '#86efac' }}>word searches</Link> and
                                <Link href="/play/hangman" style={{ color: '#86efac' }}> hangman</Link> as classroom tools.
                            </p>
                            <p>
                                <strong>Mental Workout:</strong> Like physical exercise keeps your body healthy, word
                                puzzles exercise your brain's language centers. The challenge of finding the right word,
                                unscrambling letters, or solving a cryptic clue engages working memory, pattern recognition,
                                and creative thinking skills.
                            </p>
                        </div>
                    </section>

                    {/* Types of Word Games */}
                    <section style={{
                        marginBottom: '3rem',
                    }}>
                        <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
                            📚 Types of Word Games
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '1.5rem',
                        }}>
                            {[
                                {
                                    title: '🔍 Word Search',
                                    desc: 'Find hidden words in a grid of letters. Our searches range from easy 10x10 grids to challenging 20x20 puzzles.',
                                    link: '/play/word-search',
                                },
                                {
                                    title: '🔤 Anagram Games',
                                    desc: 'Rearrange scrambled letters to form words. Great practice for Scrabble enthusiasts!',
                                    link: '/play/anagram-challenge',
                                },
                                {
                                    title: '👤 Hangman',
                                    desc: 'The classic word guessing game. Guess letters to reveal the hidden word before running out of tries.',
                                    link: '/play/hangman',
                                },
                                {
                                    title: '🐝 Spelling Games',
                                    desc: 'Test your spelling skills with increasing difficulty levels. Perfect for students!',
                                    link: '/play/spelling-bee',
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
                                        background: 'rgba(16, 185, 129, 0.05)',
                                        border: '1px solid rgba(16, 185, 129, 0.15)',
                                    }}
                                >
                                    <h3 style={{ marginBottom: '0.5rem', color: '#86efac' }}>{item.title}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                        {item.desc}
                                    </p>
                                </Link>
                            ))}
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
                                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(34, 197, 94, 0.02))',
                                        border: '1px solid rgba(16, 185, 129, 0.15)',
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
                            🔗 Explore More
                        </h2>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Link href="/free-online-puzzles" className="btn btn-ghost">🧩 All Puzzles</Link>
                            <Link href="/memory-games-online" className="btn btn-ghost">🧠 Memory Games</Link>
                            <Link href="/logic-puzzles-free" className="btn btn-ghost">💡 Logic Puzzles</Link>
                            <Link href="/tools" className="btn btn-ghost">🛠️ All Tools</Link>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
}
