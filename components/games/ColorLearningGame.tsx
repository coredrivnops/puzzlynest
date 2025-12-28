'use client';

import { useState } from 'react';
import Link from 'next/link';

const COLORS = [
    { hex: '#ef4444', name: 'Red' },
    { hex: '#f59e0b', name: 'Orange' },
    { hex: '#fbbf24', name: 'Yellow' },
    { hex: '#10b981', name: 'Green' },
    { hex: '#3b82f6', name: 'Blue' },
    { hex: '#8b5cf6', name: 'Purple' },
    { hex: '#ec4899', name: 'Pink' },
    { hex: '#94a3b8', name: 'Gray' },
];

export default function ColorLearningGame() {
    const [currentColor, setCurrentColor] = useState(COLORS[0]);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState('');

    const getRandomColor = () => {
        const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        setCurrentColor(randomColor);
        setFeedback('');
    };

    const handleColorClick = (colorName: string) => {
        if (colorName === currentColor.name) {
            setScore(prev => prev + 1);
            setFeedback('✅ Correct!');
            setTimeout(getRandomColor, 1000);
        } else {
            setFeedback('❌ Try again!');
        }
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                        ← Back
                    </Link>
                    <h1 className="game-title">Color Learning</h1>
                    <span className="game-score">Score: {score}</span>
                </div>

                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <h2 style={{ marginBottom: '2rem' }}>What color is this?</h2>

                    <div style={{
                        width: '200px',
                        height: '200px',
                        background: currentColor.hex,
                        margin: '0 auto 3rem',
                        borderRadius: '50%',
                        boxShadow: `0 0 60px ${currentColor.hex}`,
                        animation: 'pulse-scale 2s ease-in-out infinite',
                    }} />

                    {feedback && (
                        <div style={{
                            fontSize: '2rem',
                            marginBottom: '2rem',
                            minHeight: '3rem',
                            animation: 'fade-in-up 0.5s ease',
                        }}>
                            {feedback}
                        </div>
                    )}

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1rem',
                        maxWidth: '400px',
                        margin: '0 auto',
                    }}>
                        {COLORS.map(color => (
                            <button
                                key={color.name}
                                onClick={() => handleColorClick(color.name)}
                                className="btn"
                                style={{
                                    background: `linear-gradient(135deg, ${color.hex}, ${color.hex}dd)`,
                                    color: 'white',
                                    padding: '1.5rem',
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                }}
                            >
                                {color.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
