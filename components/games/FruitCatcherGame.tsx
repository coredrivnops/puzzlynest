'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

interface FallingFruit {
    id: number;
    x: number;
    y: number;
    emoji: string;
    speed: number;
}

const FRUITS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🥝', '🍒'];
const BASKET_WIDTH = 80;

export default function FruitCatcherGame() {
    const [fruits, setFruits] = useState<FallingFruit[]>([]);
    const [basketX, setBasketX] = useState(50);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [isPlaying, setIsPlaying] = useState(false);
    const [highScore, setHighScore] = useState(0);
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const fruitIdRef = useRef(0);

    const handleMove = useCallback((clientX: number) => {
        if (!gameAreaRef.current) return;
        const rect = gameAreaRef.current.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 100;
        setBasketX(Math.max(BASKET_WIDTH / 2, Math.min(100 - BASKET_WIDTH / 2, x)));
    }, []);

    const startGame = () => {
        setFruits([]);
        setScore(0);
        setLives(3);
        setIsPlaying(true);
        fruitIdRef.current = 0;
    };

    const spawnFruit = useCallback(() => {
        const newFruit: FallingFruit = {
            id: fruitIdRef.current++,
            x: 10 + Math.random() * 80,
            y: 0,
            emoji: FRUITS[Math.floor(Math.random() * FRUITS.length)],
            speed: 1 + Math.random() * 1.5,
        };
        setFruits(prev => [...prev, newFruit]);
    }, []);

    // Spawn fruits
    useEffect(() => {
        if (!isPlaying) return;
        const spawner = setInterval(spawnFruit, 1000);
        return () => clearInterval(spawner);
    }, [isPlaying, spawnFruit]);

    // Move fruits and check collisions
    useEffect(() => {
        if (!isPlaying) return;

        const mover = setInterval(() => {
            setFruits(prev => {
                const updated: FallingFruit[] = [];
                let newLives = lives;
                let newScore = score;

                for (const fruit of prev) {
                    const newY = fruit.y + fruit.speed * 2;

                    // Check if caught
                    if (newY >= 85 && newY <= 100) {
                        const basketLeft = basketX - BASKET_WIDTH / 2;
                        const basketRight = basketX + BASKET_WIDTH / 2;

                        if (fruit.x >= basketLeft && fruit.x <= basketRight) {
                            newScore += 10;
                            continue; // Caught! Don't add to updated
                        }
                    }

                    // Check if missed
                    if (newY > 100) {
                        newLives--;
                        if (newLives <= 0) {
                            setIsPlaying(false);
                            setHighScore(h => Math.max(h, newScore));
                        }
                        continue; // Missed! Don't add to updated
                    }

                    updated.push({ ...fruit, y: newY });
                }

                setLives(newLives);
                setScore(newScore);
                return updated;
            });
        }, 50);

        return () => clearInterval(mover);
    }, [isPlaying, basketX, lives, score]);

    useEffect(() => {
        if (!isPlaying) return;

        const handleMouse = (e: MouseEvent) => handleMove(e.clientX);
        const handleTouch = (e: TouchEvent) => {
            e.preventDefault();
            handleMove(e.touches[0].clientX);
        };

        const area = gameAreaRef.current;
        area?.addEventListener('mousemove', handleMouse);
        area?.addEventListener('touchmove', handleTouch, { passive: false });

        return () => {
            area?.removeEventListener('mousemove', handleMouse);
            area?.removeEventListener('touchmove', handleTouch);
        };
    }, [isPlaying, handleMove]);

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                        ← Back
                    </Link>
                    <h1 className="game-title">Fruit Catcher</h1>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span className="game-score">Score: {score}</span>
                        <span>{'❤️'.repeat(lives)}</span>
                    </div>
                </div>

                {!isPlaying && lives <= 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍎</div>
                        <h2 style={{ marginBottom: '0.5rem' }}>Game Over!</h2>
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
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🧺</div>
                        <h2 style={{ marginBottom: '1rem' }}>Catch the Fruits!</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
                            Move your basket left and right to catch falling fruits!
                        </p>
                        <button className="btn btn-accent" onClick={startGame}>
                            Start Game
                        </button>
                    </div>
                ) : (
                    <div
                        ref={gameAreaRef}
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '400px',
                            background: 'linear-gradient(180deg, rgba(135, 206, 250, 0.3), rgba(34, 139, 34, 0.2))',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            cursor: 'none',
                        }}
                    >
                        {/* Falling Fruits */}
                        {fruits.map(fruit => (
                            <div
                                key={fruit.id}
                                style={{
                                    position: 'absolute',
                                    left: `${fruit.x}%`,
                                    top: `${fruit.y}%`,
                                    fontSize: '2.5rem',
                                    transform: 'translate(-50%, -50%)',
                                    transition: 'top 0.05s linear',
                                }}
                            >
                                {fruit.emoji}
                            </div>
                        ))}

                        {/* Basket */}
                        <div
                            style={{
                                position: 'absolute',
                                left: `${basketX}%`,
                                bottom: '0',
                                transform: 'translateX(-50%)',
                                fontSize: '3rem',
                            }}
                        >
                            🧺
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
