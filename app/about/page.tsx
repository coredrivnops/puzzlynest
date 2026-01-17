import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
    title: 'About PuzzlyNest - Free Games for All Ages',
    description: 'Learn about PuzzlyNest, our mission to provide free, high-quality games accessible and enjoyable for everyone.',
};

export default function AboutPage() {
    return (
        <>
            <Navigation />

            <main style={{
                background: 'linear-gradient(135deg, #0a0a1a 0%, #0f0f2d 50%, #0a0a1a 100%)',
                minHeight: '100vh',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Animated background orbs */}
                <div style={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '-5%',
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
                    maxWidth: '800px',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                        marginBottom: '2rem',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #a5b4fc 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 800,
                    }}>
                        About PuzzlyNest
                    </h1>

                    {/* Our Mission */}
                    <section style={{
                        padding: '2rem',
                        marginBottom: '2rem',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.08))',
                        borderRadius: '20px',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                    }}>
                        <h2 style={{
                            marginBottom: '1rem',
                            fontSize: '1.5rem',
                            color: '#c7d2fe',
                        }}>
                            🎯 Our Mission
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.9 }}>
                            PuzzlyNest was created with a simple goal: to provide high-quality, free games that are
                            accessible and enjoyable for everyone. We believe that play is essential for mental
                            well-being, whether you are taking a quick break from work or looking to relax in the evening.
                        </p>
                    </section>

                    {/* Why PuzzlyNest */}
                    <section style={{
                        padding: '2rem',
                        marginBottom: '2rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}>
                        <h2 style={{ marginBottom: '1rem', fontSize: '1.35rem', color: '#fff' }}>
                            ✨ Why PuzzlyNest?
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                            After seeing how many puzzle websites were cluttered with intrusive ads, required downloads,
                            or asked for unnecessary account signups, we decided to build something better.
                        </p>
                        <ul style={{
                            color: 'rgba(255,255,255,0.8)',
                            lineHeight: 1.9,
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                        }}>
                            <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                <span style={{ color: '#a5b4fc' }}>•</span>
                                <span><strong style={{ color: '#c7d2fe' }}>Zero Friction:</strong> No downloads, no signups, no hidden costs.</span>
                            </li>
                            <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                <span style={{ color: '#a5b4fc' }}>•</span>
                                <span><strong style={{ color: '#c7d2fe' }}>Clean Interface:</strong> We prioritize a clutter-free experience so you can focus entirely on the game.</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                <span style={{ color: '#a5b4fc' }}>•</span>
                                <span><strong style={{ color: '#c7d2fe' }}>Quality Over Quantity:</strong> Every game on PuzzlyNest is selected for performance and genuine replay value.</span>
                            </li>
                        </ul>
                    </section>

                    {/* What We Offer */}
                    <section style={{
                        padding: '2rem',
                        marginBottom: '2rem',
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.03))',
                        borderRadius: '20px',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                    }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.35rem', color: '#fbbf24' }}>
                            🎮 What We Offer
                        </h2>
                        <ul style={{
                            color: 'rgba(255,255,255,0.8)',
                            lineHeight: 1.9,
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                        }}>
                            <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                <span style={{ color: '#fbbf24' }}>✓</span>
                                <span><strong style={{ color: '#fef3c7' }}>Classic Puzzles:</strong> Sudoku, Solitaire, and Logic Grids.</span>
                            </li>
                            <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                <span style={{ color: '#fbbf24' }}>✓</span>
                                <span><strong style={{ color: '#fef3c7' }}>Brain Training:</strong> Quick mental exercises to keep your mind sharp.</span>
                            </li>
                            <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                <span style={{ color: '#fbbf24' }}>✓</span>
                                <span><strong style={{ color: '#fef3c7' }}>Word Games:</strong> Challenge your vocabulary with our daily word puzzles.</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                <span style={{ color: '#fbbf24' }}>✓</span>
                                <span><strong style={{ color: '#fef3c7' }}>Learning Tools:</strong> Integrated solvers and guides to help you improve your skills.</span>
                            </li>
                        </ul>
                    </section>

                    {/* Free & Accessible */}
                    <section style={{
                        padding: '2rem',
                        marginBottom: '2rem',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.03))',
                        borderRadius: '20px',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}>
                        <h2 style={{ marginBottom: '1rem', fontSize: '1.35rem', color: '#6ee7b7' }}>
                            💚 Free & Accessible
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
                            All games on PuzzlyNest are completely free. We support our platform through non-intrusive
                            advertisements, allowing us to keep the servers running while providing you with a premium
                            experience at no cost.
                        </p>
                    </section>

                    {/* Contact Us */}
                    <section style={{
                        padding: '2rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        textAlign: 'center',
                    }}>
                        <h2 style={{ marginBottom: '1rem', fontSize: '1.35rem', color: '#fff' }}>
                            📬 Contact Us
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, marginBottom: '1rem' }}>
                            We value feedback from our community. If you have a game request, found a bug, or just want
                            to say hello, please reach out to us.
                        </p>
                        <Link
                            href="mailto:solutions@coredrivn.com"
                            style={{
                                display: 'inline-block',
                                padding: '0.75rem 1.5rem',
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                borderRadius: '100px',
                                color: '#fff',
                                textDecoration: 'none',
                                fontWeight: 600,
                            }}
                        >
                            solutions@coredrivn.com
                        </Link>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
}
