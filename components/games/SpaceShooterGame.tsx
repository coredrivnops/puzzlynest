'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

interface Bullet {
    id: number;
    x: number;
    y: number;
}

interface Enemy {
    id: number;
    x: number;
    y: number;
    speed: number;
}

export default function SpaceShooterGame() {
    const [playerX, setPlayerX] = useState(50);
    const [bullets, setBullets] = useState<Bullet[]>([]);
    const [enemies, setEnemies] = useState<Enemy[]>([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const gameRef = useRef<HTMLDivElement>(null);
    const bulletIdRef = useRef(0);
    const enemyIdRef = useRef(0);

    const shoot = useCallback(() => {
        if (gameOver) return;
        setBullets(prev => [...prev, { id: bulletIdRef.current++, x: playerX, y: 85 }]);
    }, [playerX, gameOver]);

    const movePlayer = useCallback((direction: 'left' | 'right') => {
        setPlayerX(prev => {
            if (direction === 'left') return Math.max(5, prev - 5);
            return Math.min(95, prev + 5);
        });
    }, []);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') movePlayer('left');
            if (e.key === 'ArrowRight' || e.key === 'd') movePlayer('right');
            if (e.key === ' ') { e.preventDefault(); shoot(); }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [movePlayer, shoot]);

    // Game loop
    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const interval = setInterval(() => {
            // Move bullets up
            setBullets(prev => prev
                .map(b => ({ ...b, y: b.y - 3 }))
                .filter(b => b.y > 0)
            );

            // Move enemies down
            setEnemies(prev => {
                const updated = prev.map(e => ({ ...e, y: e.y + e.speed }));
                // Check if enemy reached bottom
                if (updated.some(e => e.y > 90)) {
                    setGameOver(true);
                }
                return updated.filter(e => e.y <= 95);
            });

            // Spawn enemies
            if (Math.random() < 0.03) {
                setEnemies(prev => [...prev, {
                    id: enemyIdRef.current++,
                    x: Math.random() * 80 + 10,
                    y: 0,
                    speed: 0.3 + Math.random() * 0.3
                }]);
            }

            // Collision detection
            setBullets(prevBullets => {
                const remainingBullets: Bullet[] = [];
                let bulletsToRemove: number[] = [];

                setEnemies(prevEnemies => {
                    const remainingEnemies: Enemy[] = [];

                    prevEnemies.forEach(enemy => {
                        let hit = false;
                        prevBullets.forEach(bullet => {
                            const dx = Math.abs(bullet.x - enemy.x);
                            const dy = Math.abs(bullet.y - enemy.y);
                            if (dx < 5 && dy < 5) {
                                hit = true;
                                bulletsToRemove.push(bullet.id);
                                setScore(s => s + 10);
                            }
                        });
                        if (!hit) remainingEnemies.push(enemy);
                    });

                    return remainingEnemies;
                });

                return prevBullets.filter(b => !bulletsToRemove.includes(b.id));
            });
        }, 50);

        return () => clearInterval(interval);
    }, [gameStarted, gameOver]);

    const startGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setBullets([]);
        setEnemies([]);
        setPlayerX(50);
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Space Adventure</h1>
                    <div className="text-xl text-yellow-400 font-bold">Score: {score}</div>
                </div>

                <div
                    ref={gameRef}
                    className="relative w-full h-[500px] bg-gradient-to-b from-slate-900 via-indigo-900 to-slate-900 rounded-xl overflow-hidden"
                    style={{ touchAction: 'none' }}
                >
                    {/* Stars background */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(30)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`
                                }}
                            />
                        ))}
                    </div>

                    {!gameStarted ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button
                                onClick={startGame}
                                className="px-8 py-4 bg-emerald-600 rounded-xl text-white text-xl font-bold hover:bg-emerald-500 transition"
                            >
                                🚀 Start Game
                            </button>
                        </div>
                    ) : gameOver ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                            <div className="text-4xl mb-4">💥 Game Over!</div>
                            <div className="text-2xl mb-4">Score: {score}</div>
                            <button
                                onClick={startGame}
                                className="px-6 py-3 bg-emerald-600 rounded-lg text-white font-bold"
                            >
                                Play Again
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Player spaceship */}
                            <div
                                className="absolute text-4xl transition-all duration-100"
                                style={{ left: `${playerX}%`, bottom: '5%', transform: 'translateX(-50%)' }}
                            >
                                🚀
                            </div>

                            {/* Bullets */}
                            {bullets.map(bullet => (
                                <div
                                    key={bullet.id}
                                    className="absolute w-2 h-4 bg-yellow-400 rounded-full"
                                    style={{ left: `${bullet.x}%`, top: `${bullet.y}%`, transform: 'translateX(-50%)' }}
                                />
                            ))}

                            {/* Enemies */}
                            {enemies.map(enemy => (
                                <div
                                    key={enemy.id}
                                    className="absolute text-3xl"
                                    style={{ left: `${enemy.x}%`, top: `${enemy.y}%`, transform: 'translateX(-50%)' }}
                                >
                                    👾
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onMouseDown={() => movePlayer('left')}
                        className="px-8 py-4 bg-slate-700 rounded-lg text-2xl active:bg-slate-600"
                    >
                        ◀️
                    </button>
                    <button
                        onClick={shoot}
                        className="px-8 py-4 bg-red-600 rounded-lg text-2xl active:bg-red-500"
                    >
                        🔥
                    </button>
                    <button
                        onMouseDown={() => movePlayer('right')}
                        className="px-8 py-4 bg-slate-700 rounded-lg text-2xl active:bg-slate-600"
                    >
                        ▶️
                    </button>
                </div>
            </div>
        </div>
    );
}
