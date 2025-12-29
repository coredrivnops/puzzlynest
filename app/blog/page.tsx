import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Blog - PuzzlyNest | Game Tips & Brain Training Articles',
    description: 'Read our latest articles on brain training, game tips, and educational content for all ages.',
};

// Upcoming blog topics (not published yet)
const UPCOMING_TOPICS = [
    {
        title: 'Benefits of Playing Puzzle Games Daily',
        category: 'Brain Training',
        emoji: '🧩',
    },
    {
        title: 'Educational Games That Make Learning Fun',
        category: 'Kids',
        emoji: '📚',
    },
    {
        title: 'How Memory Games Can Improve Your Daily Life',
        category: 'Brain Training',
        emoji: '🧠',
    },
    {
        title: 'Finding the Right Balance: Educational Screen Time',
        category: 'Parenting',
        emoji: '⚖️',
    },
];

export default function BlogPage() {
    return (
        <main className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
            <Link href="/" className="btn btn-ghost" style={{ marginBottom: '2rem', display: 'inline-block' }}>
                ← Back to Games
            </Link>

            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{
                    marginBottom: '1rem',
                    fontSize: '2.5rem',
                    background: 'linear-gradient(135deg, #fff, #c7d2fe)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    📝 PuzzlyNest Blog
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto' }}>
                    Tips, tricks, and insights about brain games, learning through play, and keeping your mind sharp.
                </p>
            </header>

            {/* Coming Soon Notice */}
            <div style={{
                padding: '2rem',
                background: 'rgba(99, 102, 241, 0.15)',
                borderRadius: '1rem',
                textAlign: 'center',
                marginBottom: '2rem',
                border: '1px solid rgba(99, 102, 241, 0.3)'
            }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🚧</span>
                <h2 style={{ marginBottom: '0.5rem', color: '#a5b4fc' }}>Blog Coming Soon!</h2>
                <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                    We&apos;re working on creating helpful content for you. Check back soon!
                </p>
            </div>

            {/* Preview of upcoming topics */}
            <h3 style={{ marginBottom: '1.5rem', color: 'rgba(255,255,255,0.8)' }}>
                Topics We&apos;re Working On:
            </h3>

            <div style={{
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            }}>
                {UPCOMING_TOPICS.map((topic, index) => (
                    <div
                        key={index}
                        className="card"
                        style={{
                            padding: '1.25rem',
                            opacity: 0.7,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}
                    >
                        <span style={{ fontSize: '2rem' }}>{topic.emoji}</span>
                        <div>
                            <span style={{
                                background: 'rgba(99, 102, 241, 0.2)',
                                borderRadius: '4px',
                                padding: '0.15rem 0.4rem',
                                fontSize: '0.7rem',
                                color: '#a5b4fc',
                                marginBottom: '0.25rem',
                                display: 'inline-block'
                            }}>
                                {topic.category}
                            </span>
                            <h4 style={{
                                fontSize: '0.95rem',
                                color: 'rgba(255,255,255,0.9)',
                                lineHeight: 1.3
                            }}>
                                {topic.title}
                            </h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div style={{
                marginTop: '3rem',
                textAlign: 'center'
            }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>
                    In the meantime, enjoy our games!
                </p>
                <Link href="/games" className="btn btn-primary">
                    Browse All Games →
                </Link>
            </div>
        </main>
    );
}
