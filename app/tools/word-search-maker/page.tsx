
import WordSearchGenerator from "@/components/tools/WordSearchGenerator";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Free Word Search Maker (Printable PDF) | PuzzlyNest",
    description: "Create custom printable word search puzzles for free. Perfect for teachers, parents, and parties. Enter your words and print instantly.",
    alternates: {
        canonical: 'https://puzzlynest.com/tools/word-search-maker',
    },
    openGraph: {
        title: "Free Printable Word Search Maker",
        description: "Create custom word search puzzles for classrooms, parties, and events - free online",
        url: 'https://puzzlynest.com/tools/word-search-maker',
        siteName: 'PuzzlyNest',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function WordSearchMakerPage() {
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
                    top: '-10%',
                    left: '10%',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '5%',
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
                    position: 'relative',
                    zIndex: 1,
                }}>
                    {/* Breadcrumb */}
                    <nav className="no-print" style={{ marginBottom: '1.5rem' }}>
                        <Link href="/tools" style={{
                            color: 'rgba(255,255,255,0.5)',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                        }}>
                            ← Back to Solvers
                        </Link>
                    </nav>

                    <header className="no-print" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                            fontWeight: 800,
                            marginBottom: '0.75rem',
                            background: 'linear-gradient(135deg, #fff 0%, #c084fc 50%, #a855f7 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            🖨️ Free Word Search Maker
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                            Design custom puzzles for your classroom, kids, or events in seconds.
                        </p>
                    </header>

                    <WordSearchGenerator />

                    <article className="no-print" style={{
                        padding: '2rem',
                        marginTop: '3rem',
                        maxWidth: '900px',
                        margin: '3rem auto 0',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '20px',
                        border: '1px solid rgba(168, 85, 247, 0.15)',
                    }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: '#fff' }}>Why use this Word Search Generator?</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                                <h3 style={{ color: '#c084fc', marginBottom: '0.5rem', fontSize: '1.1rem' }}>For Teachers</h3>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                    Reinforce vocabulary lists. Create puzzles for spelling words, history terms, or science concepts.
                                </p>
                            </div>
                            <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                                <h3 style={{ color: '#c084fc', marginBottom: '0.5rem', fontSize: '1.1rem' }}>For Parents</h3>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                    Make learning fun at home. Create puzzles about your child&apos;s favorite topics.
                                </p>
                            </div>
                            <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                                <h3 style={{ color: '#c084fc', marginBottom: '0.5rem', fontSize: '1.1rem' }}>For Events</h3>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                    Baby showers, weddings, or birthday parties. Make a custom puzzle with names and themes.
                                </p>
                            </div>
                            <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                                <h3 style={{ color: '#c084fc', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Completely Free</h3>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                    No sign-up required. No watermarks. Unlimited prints.
                                </p>
                            </div>
                        </div>
                    </article>
                </div>
            </main>

            <Footer />
        </>
    );
}
