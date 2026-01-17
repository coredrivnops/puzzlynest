import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
    title: 'Contact Us - PuzzlyNest',
    description: 'Get in touch with PuzzlyNest. We value your feedback, bug reports, and feature suggestions.',
};

export default function ContactPage() {
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
                    maxWidth: '700px',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    {/* Breadcrumb */}
                    <nav style={{ marginBottom: '1.5rem' }}>
                        <Link href="/" style={{
                            color: 'rgba(255,255,255,0.5)',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                        }}>
                            ← Back to Games
                        </Link>
                    </nav>

                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                        marginBottom: '1rem',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #a5b4fc 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 800,
                    }}>
                        📬 Get in Touch
                    </h1>

                    <div style={{
                        padding: '2.5rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        textAlign: 'center',
                    }}>
                        <p style={{
                            color: 'rgba(255,255,255,0.85)',
                            fontSize: '1.15rem',
                            lineHeight: 1.8,
                            marginBottom: '1rem',
                        }}>
                            We value your feedback, bug reports, and feature suggestions. Whether you&apos;re stuck on
                            a puzzle or just want to say hi, we&apos;re here to listen.
                        </p>
                        <p style={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '1rem',
                            lineHeight: 1.8,
                            marginBottom: '2rem',
                        }}>
                            We&apos;re always adding new games and features based on player feedback. Your suggestions help us improve!
                        </p>

                        {/* Email Section */}
                        <div style={{
                            padding: '1.5rem',
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.08))',
                            borderRadius: '16px',
                            marginBottom: '2rem',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                        }}>
                            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                Email us at:
                            </p>
                            <a
                                href="mailto:solutions@coredrivn.com"
                                style={{
                                    color: '#a5b4fc',
                                    fontSize: '1.25rem',
                                    fontWeight: 600,
                                    textDecoration: 'none'
                                }}
                            >
                                solutions@coredrivn.com
                            </a>
                        </div>

                        {/* Contact Categories */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1rem',
                        }}>
                            <div style={{
                                padding: '1.25rem',
                                background: 'rgba(239, 68, 68, 0.1)',
                                borderRadius: '12px',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                            }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🐛</div>
                                <h3 style={{ color: '#fca5a5', fontSize: '1rem', marginBottom: '0.25rem' }}>Bug Reports</h3>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                                    Found a glitch? Let us know!
                                </p>
                            </div>
                            <div style={{
                                padding: '1.25rem',
                                background: 'rgba(245, 158, 11, 0.1)',
                                borderRadius: '12px',
                                border: '1px solid rgba(245, 158, 11, 0.2)',
                            }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💡</div>
                                <h3 style={{ color: '#fbbf24', fontSize: '1rem', marginBottom: '0.25rem' }}>Game Ideas</h3>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                                    Suggest new games for us to add.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
