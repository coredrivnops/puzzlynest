'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

interface Mole {
    id: number;
    isUp: boolean;
    wasHit: boolean;
}

export default function WhackAMoleGame() {
    const [moles, setMoles] = useState<Mole[]>(
        Array.from({ length: 9 }, (_, i) => ({ id: i, isUp: false, wasHit: false }))
    );
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isPlaying, setIsPlaying] = useState(false);
    const [highScore, setHighScore] = useState(0);
    const gameRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const popUpMole = useCallback(() => {
        setMoles(prev => {
            const newMoles = [...prev];
            // Hide all moles first
            newMoles.forEach(m => {
                m.isUp = false;
                m.wasHit = false;
            });
            // Pop up 1-2 random moles
            const numMoles = Math.random() > 0.5 ? 2 : 1;
            const indices = new Set<number>();
            while (indices.size < numMoles) {
                indices.add(Math.floor(Math.random() * 9));
            }
            indices.forEach(i => {
                newMoles[i].isUp = true;
            });
            return newMoles;
        });
    }, []);

    const startGame = () => {
        setMoles(Array.from({ length: 9 }, (_, i) => ({ id: i, isUp: false, wasHit: false })));
        setScore(0);
        setTimeLeft(30);
        setIsPlaying(true);
    };

    const whackMole = (id: number) => {
        if (!isPlaying) return;

        setMoles(prev => {
            const newMoles = [...prev];
            if (newMoles[id].isUp && !newMoles[id].wasHit) {
                newMoles[id].wasHit = true;
                setScore(s => s + 10);
            }
            return newMoles;
        });
    };

    // Timer
    useEffect(() => {
        if (!isPlaying) return;

        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setIsPlaying(false);
                    setHighScore(h => Math.max(h, score));
                    if (gameRef.current) clearInterval(gameRef.current);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isPlaying, score]);

    // Mole popup logic
    useEffect(() => {
        if (!isPlaying) return;

        popUpMole();
        gameRef.current = setInterval(popUpMole, 1000);

        return () => { if (gameRef.current) clearInterval(gameRef.current); };
    }, [isPlaying, popUpMole]);

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                        ← Back
                    </Link>
                    <h1 className="game-title">Whack-a-Mole!</h1>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🐹</div>
                        <h2 style={{ marginBottom: '0.5rem' }}>Time&apos;s Up!</h2>
                        <p style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>
                            Score: {score}
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
                            High Score: {highScore}
                        </p>
                        <button className="btn btn-primary" onClick={startGame}>
                            Play Again
                        </button>
                    </div>
                ) : !isPlaying ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🐹</div>
                        <h2 style={{ marginBottom: '1rem' }}>Whack the Moles!</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
                            Click or tap the moles before they hide!
                        </p>
                        <button className="btn btn-accent" onClick={startGame}>
                            Start Game
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem',
                        maxWidth: '350px',
                        margin: '0 auto',
                        padding: '1rem',
                    }}>
                        {moles.map(mole => (
                            <button
                                key={mole.id}
                                onClick={() => whackMole(mole.id)}
                                style={{
                                    aspectRatio: '1',
                                    fontSize: '3rem',
                                    background: mole.wasHit
                                        ? 'rgba(16, 185, 129, 0.3)'
                                        : mole.isUp
                                            ? 'rgba(139, 69, 19, 0.4)'
                                            : 'rgba(139, 69, 19, 0.15)',
                                    border: '3px solid rgba(139, 69, 19, 0.4)',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    transform: mole.isUp ? 'scale(1.1)' : 'scale(1)',
                                }}
                            >
                                {mole.wasHit ? '💥' : mole.isUp ? '🐹' : '🕳️'}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
