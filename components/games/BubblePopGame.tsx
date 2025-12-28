'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

interface Bubble {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    popped: boolean;
    speed: number;
}

const COLORS = ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#8b5cf6', '#3b82f6'];

export default function BubblePopGame() {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isPlaying, setIsPlaying] = useState(false);
    const [highScore, setHighScore] = useState(0);
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const bubbleIdRef = useRef(0);

    const spawnBubble = useCallback(() => {
        if (!gameAreaRef.current) return;

        const areaWidth = gameAreaRef.current.clientWidth;
        const size = 40 + Math.random() * 40;

        const newBubble: Bubble = {
            id: bubbleIdRef.current++,
            x: size / 2 + Math.random() * (areaWidth - size),
            y: 400, // Start from bottom
            size,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            popped: false,
            speed: 1 + Math.random() * 2,
        };

        setBubbles(prev => [...prev, newBubble]);
    }, []);

    const popBubble = (id: number) => {
        setBubbles(prev =>
            prev.map(b => (b.id === id ? { ...b, popped: true } : b))
        );
        setScore(s => s + 10);
    };

    const startGame = () => {
        setBubbles([]);
        setScore(0);
        setTimeLeft(30);
        setIsPlaying(true);
        bubbleIdRef.current = 0;
    };

    // Game timer
    useEffect(() => {
        if (!isPlaying) return;

        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setIsPlaying(false);
                    setHighScore(h => Math.max(h, score));
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isPlaying, score]);

    // Spawn bubbles
    useEffect(() => {
        if (!isPlaying) return;

        const spawner = setInterval(() => {
            spawnBubble();
        }, 500);

        return () => clearInterval(spawner);
    }, [isPlaying, spawnBubble]);

    // Move bubbles up and remove old ones
    useEffect(() => {
        if (!isPlaying) return;

        const mover = setInterval(() => {
            setBubbles(prev =>
                prev
                    .map(b => ({ ...b, y: b.y - b.speed * 3 }))
                    .filter(b => b.y > -100 && !b.popped)
            );
        }, 50);

        return () => clearInterval(mover);
    }, [isPlaying]);

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                        ← Back
                    </Link>
                    <h1 className="game-title">Bubble Pop!</h1>
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
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🫧</div>
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
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🫧</div>
                        <h2 style={{ marginBottom: '1rem' }}>Pop the Bubbles!</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
                            Tap or click bubbles to pop them before they float away!
                        </p>
                        <button className="btn btn-accent" onClick={startGame}>
                            Start Game
                        </button>
                    </div>
                ) : (
                    <div
                        ref={gameAreaRef}
                        className="bubble-game"
                        style={{
                            position: 'relative',
                            cursor: 'crosshair',
                        }}
                    >
                        {bubbles.map(bubble => (
                            <div
                                key={bubble.id}
                                className={`bubble ${bubble.popped ? 'popped' : ''}`}
                                onClick={() => !bubble.popped && popBubble(bubble.id)}
                                style={{
                                    left: bubble.x - bubble.size / 2,
                                    top: bubble.y,
                                    width: bubble.size,
                                    height: bubble.size,
                                    background: `radial-gradient(circle at 30% 30%, white, ${bubble.color})`,
                                    boxShadow: `0 0 20px ${bubble.color}50`,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
