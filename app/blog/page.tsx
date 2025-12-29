import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Blog - PuzzlyNest | Game Tips & Brain Training Articles',
    description: 'Read our latest articles on brain training, game tips, and educational content for all ages.',
};

// Blog posts data (in a real app, this would come from a CMS or database)
const BLOG_POSTS = [
    {
        id: 'benefits-of-puzzle-games',
        title: '5 Amazing Benefits of Playing Puzzle Games Daily',
        excerpt: 'Discover how just 15 minutes of puzzle games a day can boost your memory, focus, and cognitive abilities.',
        date: '2024-12-28',
        category: 'Brain Training',
        emoji: '🧩',
        readTime: '5 min read'
    },
    {
        id: 'best-games-for-kids-learning',
        title: 'Top 10 Educational Games That Make Learning Fun',
        excerpt: 'Find the perfect educational games for your children that combine entertainment with learning.',
        date: '2024-12-25',
        category: 'Kids',
        emoji: '📚',
        readTime: '7 min read'
    },
    {
        id: 'memory-improvement-tips',
        title: 'How Memory Games Can Improve Your Daily Life',
        excerpt: 'Science-backed techniques using memory games to enhance your recall abilities and mental sharpness.',
        date: '2024-12-20',
        category: 'Brain Training',
        emoji: '🧠',
        readTime: '6 min read'
    },
    {
        id: 'screen-time-balance',
        title: 'Finding the Right Balance: Educational Screen Time',
        excerpt: 'Tips for parents on managing screen time while ensuring kids benefit from educational games.',
        date: '2024-12-15',
        category: 'Parenting',
        emoji: '⚖️',
        readTime: '4 min read'
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

            <div style={{
                display: 'grid',
                gap: '1.5rem',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            }}>
                {BLOG_POSTS.map((post) => (
                    <article
                        key={post.id}
                        className="card hover-lift"
                        style={{
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '1rem'
                        }}>
                            <span style={{
                                background: 'rgba(99, 102, 241, 0.2)',
                                borderRadius: '6px',
                                padding: '0.25rem 0.5rem',
                                fontSize: '0.8rem',
                                color: '#a5b4fc'
                            }}>
                                {post.category}
                            </span>
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                                {post.readTime}
                            </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                            <span style={{ fontSize: '2.5rem' }}>{post.emoji}</span>
                            <div>
                                <h2 style={{
                                    fontSize: '1.1rem',
                                    marginBottom: '0.5rem',
                                    color: 'white',
                                    lineHeight: 1.3
                                }}>
                                    {post.title}
                                </h2>
                                <p style={{
                                    color: 'rgba(255,255,255,0.6)',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.5
                                }}>
                                    {post.excerpt}
                                </p>
                            </div>
                        </div>

                        <div style={{
                            marginTop: '1rem',
                            paddingTop: '1rem',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                                {new Date(post.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                            <span style={{
                                color: '#a5b4fc',
                                fontSize: '0.9rem',
                                cursor: 'pointer'
                            }}>
                                Coming Soon →
                            </span>
                        </div>
                    </article>
                ))}
            </div>

            <div style={{
                marginTop: '3rem',
                padding: '2rem',
                background: 'rgba(99, 102, 241, 0.1)',
                borderRadius: '1rem',
                textAlign: 'center'
            }}>
                <h3 style={{ marginBottom: '1rem' }}>🔔 Stay Updated</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
                    We're working on more great content! Check back soon for full articles.
                </p>
                <Link href="/games" className="btn btn-primary">
                    Play Games While You Wait →
                </Link>
            </div>
        </main>
    );
}
