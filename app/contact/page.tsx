import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Contact Us - PuzzlyNest',
    description: 'Get in touch with the PuzzlyNest team. We love hearing from our players!',
};

export default function ContactPage() {
    return (
        <main className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
            <Link href="/" className="btn btn-ghost" style={{ marginBottom: '2rem', display: 'inline-block' }}>
                ← Back to Games
            </Link>

            <div className="card" style={{
                padding: '3rem',
                maxWidth: '600px',
                margin: '0 auto',
                textAlign: 'center'
            }}>
                <h1 style={{
                    marginBottom: '1.5rem',
                    fontSize: '2.5rem',
                    background: 'linear-gradient(135deg, #fff, #c7d2fe)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    📬 Contact Us
                </h1>

                <p style={{
                    color: 'rgba(255,255,255,0.8)',
                    marginBottom: '2rem',
                    lineHeight: 1.8
                }}>
                    We love hearing from our players! Whether you have feedback,
                    suggestions for new games, or just want to say hi, feel free to reach out.
                </p>

                <div style={{
                    padding: '2rem',
                    background: 'rgba(99, 102, 241, 0.1)',
                    borderRadius: '1rem',
                    marginBottom: '2rem'
                }}>
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        Email us at:
                    </p>
                    <a
                        href="mailto:hello@puzzlynest.com"
                        style={{
                            color: '#a5b4fc',
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            textDecoration: 'none'
                        }}
                    >
                        hello@puzzlynest.com
                    </a>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginTop: '2rem'
                }}>
                    <div style={{
                        padding: '1.5rem',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '0.75rem'
                    }}>
                        <span style={{ fontSize: '2rem' }}>🐛</span>
                        <h3 style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>Bug Reports</h3>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                            Found a glitch? Let us know!
                        </p>
                    </div>
                    <div style={{
                        padding: '1.5rem',
                        background: 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '0.75rem'
                    }}>
                        <span style={{ fontSize: '2rem' }}>💡</span>
                        <h3 style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>Game Ideas</h3>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                            Suggest new games for us to add
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
