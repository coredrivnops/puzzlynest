'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Ball {
    id: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
    color: string;
}

export default function BalloonPopGame() {
    const [balloons, setBalloons] = useState<Ball[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isPlaying, setIsPlaying] = useState(false);
    const [nextId, setNextId] = useState(0);

    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

    const createBalloon = () => {
        const newBalloon: Ball = {
            id: nextId,
            x: Math.random() * 80 + 10,
            y: 100,
            dx: (Math.random() - 0.5) * 2,
            dy: -2 - Math.random() * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
        };
        setBalloons(prev => [...prev, newBalloon]);
        setNextId(prev => prev + 1);
    };

    const popBalloon = (id: number) => {
        if (!isPlaying) return;
        setBalloons(prev => prev.filter(b => b.id !== id));
        setScore(prev => prev + 10);
    };

    const startGame = () => {
        setBalloons([]);
        setScore(0);
        setTimeLeft(30);
        setIsPlaying(true);
    };

    // Timer
    useEffect(() => {
        if (!isPlaying) return;

        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setIsPlaying(false);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isPlaying]);

    // Spawn balloons
    useEffect(() => {
        if (!isPlaying) return;

        const spawner = setInterval(createBalloon, 800);
        return () => clearInterval(spawner);
    }, [isPlaying, nextId]);

    // Update balloon positions
    useEffect(() => {
        if (!isPlaying) return;

        const updater = setInterval(() => {
            setBalloons(prev =>
                prev
                    .map(balloon => ({
                        ...balloon,
                        x: balloon.x + balloon.dx,
                        y: balloon.y + balloon.dy,
                    }))
                    .filter(balloon => balloon.y > -20)
            );
        }, 50);

        return () => clearInterval(updater);
    }, [isPlaying]);

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                        ← Back
                    </Link>
                    <h1 className="game-title">Balloon Pop</h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <span className="game-score">Score: {score}</span>
                        {isPlaying && (
                            <span style={{
                                padding: '0.5rem 1rem',
                                background: timeLeft <= 10 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(99, 102, 241, 0.3)',
                                borderRadius: '100px',
                                color: timeLeft <= 10 ? '#fca5a5' : '#a5b4fc',
                            }}>
                                ⏱ {timeLeft}s
                            </span>
                        )}
                    </div>
                </div>

                {!isPlaying && timeLeft === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎈</div>
                        <h2 style={{ marginBottom: '0.5rem' }}>Time&apos;s Up!</h2>
                        <p style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '2rem' }}>
                            Score: {score}
                        </p>
                        <button className="btn btn-primary" onClick={startGame}>
                            Play Again
                        </button>
                    </div>
                ) : !isPlaying ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎈💥</div>
                        <h2 style={{ marginBottom: '1rem' }}>Pop the Balloons!</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
                            Click floating balloons before they escape!
                        </p>
                        <button className="btn btn-accent" onClick={startGame}>
                            Start Game
                        </button>
                    </div>
                ) : (
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '500px',
                        background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.1))',
                        borderRadius: 'var(--border-radius)',
                        overflow: 'hidden',
                    }}>
                        {balloons.map(balloon => (
                            <button
                                key={balloon.id}
                                onClick={() => popBalloon(balloon.id)}
                                style={{
                                    position: 'absolute',
                                    left: `${balloon.x}%`,
                                    top: `${balloon.y}%`,
                                    width: '60px',
                                    height: '80px',
                                    background: balloon.color,
                                    border: 'none',
                                    borderRadius: '50% 50% 50%50% / 60% 60% 40% 40%',
                                    cursor: 'pointer',
                                    fontSize: '2rem',
                                    transform: 'translateY(0)',
                                    transition: 'transform 0.1s ease',
                                    boxShadow: `0 4px 12px ${balloon.color}`,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                🎈
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
