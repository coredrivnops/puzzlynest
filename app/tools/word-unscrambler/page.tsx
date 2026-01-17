
import WordUnscrambler from "@/components/tools/WordUnscrambler";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Word Unscrambler & Anagram Solver | PuzzlyNest",
    description: "Unscramble letters to find high-scoring words for Scrabble, Words With Friends, and Wordle. Supports wildcard inputs.",
    alternates: {
        canonical: 'https://puzzlynest.com/tools/word-unscrambler',
    },
    openGraph: {
        title: "Word Unscrambler & Anagram Solver",
        description: "Find high-scoring words from scrambled letters - free online tool",
        url: 'https://puzzlynest.com/tools/word-unscrambler',
        siteName: 'PuzzlyNest',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function UnscramblerPage() {
    return (
        <>
            <Navigation />

            {/* Dark background wrapper */}
            <main style={{
                background: 'linear-gradient(135deg, #0a0a1a 0%, #0f0f2d 50%, #0a0a1a 100%)',
                minHeight: '100vh',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Animated background orbs */}
                <div style={{
                    position: 'absolute',
                    top: '5%',
                    left: '-10%',
                    width: '350px',
                    height: '350px',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '-5%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                }} />

                <div className="container" style={{
                    paddingTop: '2rem',
                    paddingBottom: '4rem',
                    maxWidth: '900px',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    {/* Breadcrumb */}
                    <nav style={{ marginBottom: '1.5rem' }}>
                        <Link href="/tools" style={{
                            color: 'rgba(255,255,255,0.5)',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                        }}>
                            ← Back to Solvers
                        </Link>
                    </nav>

                    <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                            fontWeight: 800,
                            marginBottom: '0.75rem',
                            background: 'linear-gradient(135deg, #fff 0%, #6ee7b7 50%, #34d399 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            🔠 Word Unscrambler
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
                            Turn your random letters into high-scoring words. Perfect for Scrabble, Wordle, and Anagram puzzles.
                        </p>
                    </header>

                    <section style={{
                        padding: '1.5rem',
                        marginBottom: '2rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '20px',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}>
                        <WordUnscrambler />
                    </section>

                    <article style={{
                        padding: '2rem',
                        marginBottom: '2rem',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.08)',
                    }}>
                        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: '#fff' }}>How to Win at Word Games</h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, marginBottom: '1rem' }}>
                            Whether you are playing Scrabble, Words with Friends, or just trying to solve the daily newspaper anagram, having a powerful unscrambler is your secret weapon.
                        </p>

                        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.1rem', color: '#6ee7b7' }}>Using Wildcards</h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                            Have a blank tile? No problem. Simply type a <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>?</code> in the input box above. We will calculate every possible letter that could fit that spot and show you the best words.
                            For example, entering <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>B?T</code> might return <em>BAT, BET, BIT, BOT, BUT</em>.
                        </p>

                        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.1rem', color: '#6ee7b7' }}>Scrabble Scoring Tips</h3>
                        <ul style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                            <li><strong style={{ color: '#fff' }}>Memorize 2-Letter Words:</strong> QI, ZA, JO, XI. These are essential for hooking onto high-scoring tiles on the board.</li>
                            <li><strong style={{ color: '#fff' }}>Look for Suffixes:</strong> Even if you have bad letters, look for common endings like -ING, -ED, or -ER to extend existing words.</li>
                            <li><strong style={{ color: '#fff' }}>Save your S:</strong> The letter &apos;S&apos; is the most powerful tile because it can pluralize almost any word. Don&apos;t waste it on a low-scoring word!</li>
                        </ul>
                    </article>
                </div>
            </main>

            <Footer />
        </>
    );
}
