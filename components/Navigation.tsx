'use client';

import Link from 'next/link';
import SoundControl from './SoundControl';
import { useState } from 'react';

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="nav">
            <Link href="/" className="nav-logo">
                🧩 PuzzlyNest
            </Link>

            {/* Desktop Navigation */}
            <div className="nav-links nav-desktop">
                <Link href="/games/kids" className="nav-link">
                    👶 Kids
                </Link>
                <Link href="/games/seniors" className="nav-link">
                    🧠 Brain Training
                </Link>
                <Link href="/games" className="nav-link">
                    🎯 All Games
                </Link>
                <Link href="/tools" className="nav-link">
                    ✨ Solvers
                </Link>
                <Link href="/achievements" className="nav-link">
                    🏆 Achievements
                </Link>
                <Link href="/blog" className="nav-link">
                    📝 Blog
                </Link>
                <SoundControl />
            </div>


            {/* Mobile Hamburger Button */}
            <button
                className="nav-hamburger"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
            >
                <span style={{
                    display: 'block',
                    width: '24px',
                    height: '3px',
                    background: '#fff',
                    marginBottom: '5px',
                    borderRadius: '2px',
                    transition: 'all 0.3s',
                    transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
                }}></span>
                <span style={{
                    display: 'block',
                    width: '24px',
                    height: '3px',
                    background: '#fff',
                    marginBottom: '5px',
                    borderRadius: '2px',
                    opacity: isMenuOpen ? 0 : 1,
                    transition: 'all 0.3s',
                }}></span>
                <span style={{
                    display: 'block',
                    width: '24px',
                    height: '3px',
                    background: '#fff',
                    borderRadius: '2px',
                    transition: 'all 0.3s',
                    transform: isMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
                }}></span>
            </button>

            {/* Mobile Menu Overlay - FULLY OPAQUE with inline styles */}
            {isMenuOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100vw',
                        height: '100vh',
                        // SOLID black background - NO transparency
                        backgroundColor: '#050510',
                        zIndex: 9998,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        padding: '2rem',
                    }}
                    onClick={() => setIsMenuOpen(false)}
                >
                    {/* Close button */}
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        style={{
                            position: 'absolute',
                            top: '1.5rem',
                            right: '1.5rem',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            color: '#fff',
                            cursor: 'pointer',
                        }}
                        aria-label="Close menu"
                    >
                        ✕
                    </button>

                    {/* Logo in menu */}
                    <div style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        marginBottom: '1rem',
                        color: '#fff'
                    }}>
                        🧩 PuzzlyNest
                    </div>

                    <Link
                        href="/games"
                        onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}
                        style={{
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: 'white',
                            textDecoration: 'none',
                            padding: '1rem 2rem',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #1e1e4a 0%, #15153a 100%)',
                            border: '1px solid rgba(99, 102, 241, 0.4)',
                            width: '100%',
                            maxWidth: '280px',
                            textAlign: 'center',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                        }}
                    >
                        🎯 All Games
                    </Link>
                    <Link
                        href="/games/kids"
                        onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}
                        style={{
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: 'white',
                            textDecoration: 'none',
                            padding: '1rem 2rem',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #1e1e4a 0%, #15153a 100%)',
                            border: '1px solid rgba(16, 185, 129, 0.4)',
                            width: '100%',
                            maxWidth: '280px',
                            textAlign: 'center',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                        }}
                    >
                        👶 Kids Games
                    </Link>
                    <Link
                        href="/games/seniors"
                        onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}
                        style={{
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: 'white',
                            textDecoration: 'none',
                            padding: '1rem 2rem',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #1e1e4a 0%, #15153a 100%)',
                            border: '1px solid rgba(139, 92, 246, 0.4)',
                            width: '100%',
                            maxWidth: '280px',
                            textAlign: 'center',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                        }}
                    >
                        🧠 Brain Training
                    </Link>
                    <Link
                        href="/tools"
                        onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}
                        style={{
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: 'white',
                            textDecoration: 'none',
                            padding: '1rem 2rem',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #1e1e4a 0%, #15153a 100%)',
                            border: '1px solid rgba(245, 158, 11, 0.4)',
                            width: '100%',
                            maxWidth: '280px',
                            textAlign: 'center',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                        }}
                    >
                        ✨ Puzzle Solvers
                    </Link>
                    <Link
                        href="/achievements"
                        onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}
                        style={{
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: 'white',
                            textDecoration: 'none',
                            padding: '1rem 2rem',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #1e1e4a 0%, #15153a 100%)',
                            border: '1px solid rgba(251, 191, 36, 0.4)',
                            width: '100%',
                            maxWidth: '280px',
                            textAlign: 'center',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                        }}
                    >
                        🏆 Achievements
                    </Link>
                    <Link
                        href="/blog"
                        onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}
                        style={{
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: 'white',
                            textDecoration: 'none',
                            padding: '1rem 2rem',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #1e1e4a 0%, #15153a 100%)',
                            border: '1px solid rgba(99, 102, 241, 0.4)',
                            width: '100%',
                            maxWidth: '280px',
                            textAlign: 'center',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                        }}
                    >
                        📝 Blog & Tips
                    </Link>

                    {/* Secondary links */}
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        marginTop: '1rem'
                    }}>
                        <Link
                            href="/about"
                            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}
                            style={{
                                fontSize: '0.9rem',
                                color: 'rgba(255,255,255,0.7)',
                                textDecoration: 'none',
                            }}
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}
                            style={{
                                fontSize: '0.9rem',
                                color: 'rgba(255,255,255,0.7)',
                                textDecoration: 'none',
                            }}
                        >
                            Contact
                        </Link>
                        <Link
                            href="/privacy"
                            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}
                            style={{
                                fontSize: '0.9rem',
                                color: 'rgba(255,255,255,0.7)',
                                textDecoration: 'none',
                            }}
                        >
                            Privacy
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
