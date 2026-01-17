
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import { getToolSchema, getBreadcrumbSchema, stringifySchema } from "@/lib/structuredData";

export const metadata: Metadata = {
    title: "Free Puzzle Tools & Solvers | PuzzlyNest",
    description: "Use our free utility tools to solve Sudoku, unscramble anagrams, match crossword patterns, and create printable puzzles.",
    alternates: {
        canonical: 'https://puzzlynest.com/tools',
    },
    openGraph: {
        title: "Free Puzzle Solvers & Tools",
        description: "Solve Sudoku, unscramble words, find crossword answers, and create puzzles - all free!",
        url: 'https://puzzlynest.com/tools',
        siteName: 'PuzzlyNest',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
    },
};

const tools = [
    {
        id: "sudoku-solver",
        title: "Smart Sudoku Solver",
        description: "Stuck? Get logical hints that explain the 'why' behind the next move.",
        icon: "🧩",
        href: "/tools/sudoku-solver",
        color: "#6366f1",
    },
    {
        id: "word-unscrambler",
        title: "Word Unscrambler",
        description: "Turn random letters into high-scoring words for Scrabble and Wordle.",
        icon: "🔠",
        href: "/tools/word-unscrambler",
        color: "#10b981",
    },
    {
        id: "crossword-solver",
        title: "Crossword Pattern Matcher",
        description: "Missing letters? Find words that fit your pattern (e.g. P?ZZLE).",
        icon: "🔍",
        href: "/tools/crossword-solver",
        color: "#f59e0b",
    },
    {
        id: "word-search-maker",
        title: "Word Search Maker",
        description: "Create custom printable PDF word searches for schools and parties.",
        icon: "🖨️",
        href: "/tools/word-search-maker",
        color: "#8b5cf6",
    }
];

export default function ToolsIndexPage() {
    return (
        <>
            <Navigation />

            {/* Dark background wrapper with animated orbs */}
            <main style={{
                background: 'linear-gradient(135deg, #0a0a1a 0%, #0f0f2d 50%, #0a0a1a 100%)',
                minHeight: '100vh',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Structured Data - Breadcrumbs */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: stringifySchema(getBreadcrumbSchema([
                            { name: 'Home', url: '/' },
                            { name: 'Puzzle Tools', url: '/tools' }
                        ]))
                    }}
                />
                {/* Structured Data - SoftwareApplication for each tool */}
                {tools.map(tool => (
                    <script
                        key={tool.id}
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: stringifySchema(getToolSchema({
                                name: tool.title,
                                description: tool.description,
                                url: tool.href,
                                category: 'Puzzle Solver'
                            }))
                        }}
                    />
                ))}
                {/* Animated background orbs */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-20%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    animation: 'float 20s ease-in-out infinite',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-30%',
                    right: '-10%',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    animation: 'float 25s ease-in-out infinite reverse',
                    pointerEvents: 'none',
                }} />

                <div className="container" style={{
                    paddingTop: '3rem',
                    paddingBottom: '4rem',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    {/* Hero Header */}
                    <header style={{
                        textAlign: 'center',
                        marginBottom: '3rem',
                        padding: '2rem',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
                        borderRadius: '24px',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        backdropFilter: 'blur(10px)',
                    }}>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            fontWeight: 800,
                            marginBottom: '1rem',
                            background: 'linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #a5b4fc 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 0 60px rgba(99, 102, 241, 0.5)',
                        }}>
                            ✨ Puzzle Solvers & Makers
                        </h1>
                        <p style={{
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '1.15rem',
                            maxWidth: '600px',
                            margin: '0 auto',
                            lineHeight: 1.6,
                        }}>
                            Stuck on a puzzle? Need a custom worksheet? Our free solvers and generators are here to help.
                        </p>
                    </header>

                    {/* Tools Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1.5rem',
                        maxWidth: '900px',
                        margin: '0 auto'
                    }}>
                        {tools.map(tool => (
                            <Link
                                key={tool.id}
                                href={tool.href}
                                style={{
                                    padding: '2rem',
                                    display: 'block',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                                    borderRadius: '20px',
                                    border: `1px solid ${tool.color}30`,
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                                className="hover-lift"
                            >
                                {/* Glow effect on hover */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '2px',
                                    background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)`,
                                    opacity: 0.6,
                                }} />

                                <div style={{ display: 'flex', alignItems: 'start', gap: '1.25rem' }}>
                                    <div style={{
                                        fontSize: '3rem',
                                        width: '70px',
                                        height: '70px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: `${tool.color}15`,
                                        borderRadius: '16px',
                                        border: `1px solid ${tool.color}30`,
                                        flexShrink: 0,
                                    }}>
                                        {tool.icon}
                                    </div>
                                    <div>
                                        <h2 style={{
                                            fontSize: '1.35rem',
                                            fontWeight: 700,
                                            marginBottom: '0.5rem',
                                            color: '#fff',
                                        }}>
                                            {tool.title}
                                        </h2>
                                        <p style={{
                                            color: 'rgba(255,255,255,0.7)',
                                            fontSize: '0.95rem',
                                            lineHeight: 1.5,
                                        }}>
                                            {tool.description}
                                        </p>
                                        <div style={{
                                            marginTop: '1rem',
                                            color: tool.color,
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                        }}>
                                            Open Tool →
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div style={{
                        textAlign: 'center',
                        marginTop: '3rem',
                        padding: '2rem',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.05)',
                    }}>
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>
                            Want to play games instead?
                        </p>
                        <Link
                            href="/games"
                            style={{
                                display: 'inline-block',
                                padding: '0.75rem 2rem',
                                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                color: '#fff',
                                borderRadius: '100px',
                                textDecoration: 'none',
                                fontWeight: 600,
                                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            🎮 Browse All Games
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
