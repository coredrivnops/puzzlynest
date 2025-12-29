'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Dodge moving obstacles game
export default function DodgeObstaclesGame() {
    const [playerX, setPlayerX] = useState(50);
    const [obstacles, setObstacles] = useState<{ id: number, x: number, y: number, width: number }[]>([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [obstacleId, setObstacleId] = useState(0);

    const movePlayer = useCallback((direction: 'left' | 'right') => {
        setPlayerX(prev => {
            if (direction === 'left') return Math.max(5, prev - 8);
            return Math.min(95, prev + 8);
        });
    }, []);

    // Keyboard controls
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') movePlayer('left');
            if (e.key === 'ArrowRight' || e.key === 'd') movePlayer('right');
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [movePlayer]);

    // Game loop
    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const interval = setInterval(() => {
            setScore(s => s + 1);

            // Move obstacles down
            setObstacles(prev => {
                const updated = prev.map(o => ({ ...o, y: o.y + 2 })).filter(o => o.y < 100);

                // Collision check - player is at bottom (y ~90%)
                updated.forEach(o => {
                    if (o.y > 80 && o.y < 95) {
                        const playerLeft = playerX - 5;
                        const playerRight = playerX + 5;
                        const obsLeft = o.x;
                        const obsRight = o.x + o.width;

                        if (!(playerRight < obsLeft || playerLeft > obsRight)) {
                            setGameOver(true);
                        }
                    }
                });

                return updated;
            });

            // Spawn obstacles - increase spawn rate with score
            const spawnRate = 0.02 + Math.min(score / 5000, 0.05);
            if (Math.random() < spawnRate) {
                const width = 15 + Math.random() * 20;
                setObstacles(prev => [...prev, {
                    id: obstacleId,
                    x: Math.random() * (100 - width),
                    y: 0,
                    width
                }]);
                setObstacleId(id => id + 1);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [gameStarted, gameOver, playerX, score, obstacleId]);

    const startGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setObstacles([]);
        setPlayerX(50);
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Dodge & Weave</h1>
                    <div className="text-yellow-400 font-bold">Score: {score}</div>
                </div>

                <div className="relative w-full h-[450px] bg-gradient-to-b from-purple-900 via-indigo-900 to-slate-900 rounded-xl overflow-hidden">
                    {/* Road lines */}
                    <div className="absolute inset-0 flex justify-around">
                        {[25, 50, 75].map(x => (
                            <div key={x} className="w-1 h-full bg-yellow-500/30" style={{ left: `${x}%` }} />
                        ))}
                    </div>

                    {!gameStarted ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button
                                onClick={startGame}
                                className="px-8 py-4 bg-emerald-600 rounded-xl text-white text-xl font-bold"
                            >
                                🏎️ Start Dodging!
                            </button>
                        </div>
                    ) : gameOver ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                            <div className="text-4xl mb-4">💥 Crashed!</div>
                            <div className="text-2xl mb-4">Score: {score}</div>
                            <button
                                onClick={startGame}
                                className="px-6 py-3 bg-emerald-600 rounded-lg text-white font-bold"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Obstacles */}
                            {obstacles.map(o => (
                                <div
                                    key={o.id}
                                    className="absolute h-8 bg-red-600 rounded"
                                    style={{
                                        left: `${o.x}%`,
                                        top: `${o.y}%`,
                                        width: `${o.width}%`,
                                    }}
                                />
                            ))}

                            {/* Player */}
                            <div
                                className="absolute text-4xl transition-all duration-100"
                                style={{ left: `${playerX}%`, bottom: '5%', transform: 'translateX(-50%)' }}
                            >
                                🚗
                            </div>
                        </>
                    )}
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-8 mt-4">
                    <button
                        onMouseDown={() => movePlayer('left')}
                        onTouchStart={() => movePlayer('left')}
                        className="px-10 py-5 bg-slate-700 rounded-xl text-3xl active:bg-slate-600"
                    >
                        ◀️
                    </button>
                    <button
                        onMouseDown={() => movePlayer('right')}
                        onTouchStart={() => movePlayer('right')}
                        className="px-10 py-5 bg-slate-700 rounded-xl text-3xl active:bg-slate-600"
                    >
                        ▶️
                    </button>
                </div>
            </div>
        </div>
    );
}
