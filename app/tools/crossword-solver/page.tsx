
import CrosswordHelper from "@/components/tools/CrosswordHelper";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Crossword Puzzle Solver & Helper | PuzzlyNest",
    description: "Stuck on a crossword clue? Enter the letters you know and let our pattern matcher find the missing words.",
};

export default function CrosswordPage() {
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
                    top: '10%',
                    right: '-5%',
                    width: '350px',
                    height: '350px',
                    background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '20%',
                    left: '-10%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
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
                            background: 'linear-gradient(135deg, #fff 0%, #fbbf24 50%, #f59e0b 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            🔍 Crossword Pattern Solver
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
                            Missing a few letters? We can help you fill in the blanks.
                        </p>
                    </header>

                    <section style={{
                        padding: '1.5rem',
                        marginBottom: '2rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '20px',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                    }}>
                        <CrosswordHelper />
                    </section>

                    <article style={{
                        padding: '2rem',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.08)',
                    }}>
                        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: '#fff' }}>How to Use the Pattern Matcher</h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
                            This tool searches over 200,000 English words to find matches for your pattern.
                            It is perfect for Crosswords, Cryptograms, and Wordle. Simply enter the letters you know
                            and use <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>?</code> for unknown letters.
                            For example, <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>P?ZZ?E</code> will return &quot;PUZZLE&quot;.
                        </p>
                    </article>
                </div>
            </main>

            <Footer />
        </>
    );
}
