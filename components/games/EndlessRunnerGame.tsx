'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Endless Runner - jump over obstacles and collect stars
export default function EndlessRunnerGame() {
    const [playerY, setPlayerY] = useState(0); // 0 = ground
    const [isJumping, setIsJumping] = useState(false);
    const [obstacles, setObstacles] = useState<{ id: number, x: number, type: 'rock' | 'cactus' }[]>([]);
    const [stars, setStars] = useState<{ id: number, x: number, y: number }[]>([]);
    const [score, setScore] = useState(0);
    const [distance, setDistance] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [obstacleId, setObstacleId] = useState(0);
    const [starId, setStarId] = useState(0);

    const jump = useCallback(() => {
        if (isJumping || gameOver || !gameStarted) return;
        setIsJumping(true);
        setPlayerY(60);

        setTimeout(() => setPlayerY(40), 150);
        setTimeout(() => setPlayerY(20), 300);
        setTimeout(() => { setPlayerY(0); setIsJumping(false); }, 450);
    }, [isJumping, gameOver, gameStarted]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === ' ' || e.key === 'ArrowUp') {
                e.preventDefault();
                jump();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [jump]);

    // Game loop
    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const interval = setInterval(() => {
            setDistance(d => d + 1);

            // Move obstacles
            setObstacles(prev => {
                const updated = prev.map(o => ({ ...o, x: o.x - 3 })).filter(o => o.x > -10);

                // Collision check
                updated.forEach(o => {
                    if (o.x > 5 && o.x < 20 && playerY < 30) {
                        setGameOver(true);
                    }
                });

                return updated;
            });

            // Move stars
            setStars(prev => {
                const updated = prev.map(s => ({ ...s, x: s.x - 3 })).filter(s => s.x > -5);

                // Collect stars
                const remaining = updated.filter(s => {
                    const collected = s.x > 5 && s.x < 20 && Math.abs(s.y - playerY) < 30;
                    if (collected) setScore(sc => sc + 10);
                    return !collected;
                });

                return remaining;
            });

            // Spawn obstacles
            if (Math.random() < 0.02) {
                setObstacles(prev => [...prev, {
                    id: obstacleId,
                    x: 100,
                    type: Math.random() > 0.5 ? 'rock' : 'cactus'
                }]);
                setObstacleId(id => id + 1);
            }

            // Spawn stars
            if (Math.random() < 0.03) {
                setStars(prev => [...prev, {
                    id: starId,
                    x: 100,
                    y: Math.random() > 0.5 ? 40 : 10
                }]);
                setStarId(id => id + 1);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [gameStarted, gameOver, playerY, obstacleId, starId]);

    const startGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setDistance(0);
        setObstacles([]);
        setStars([]);
        setPlayerY(0);
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Endless Runner</h1>
                    <div className="text-yellow-400 font-bold">⭐ {score} | 📏 {Math.floor(distance / 10)}m</div>
                </div>

                <div
                    className="relative w-full h-[400px] bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-400 rounded-xl overflow-hidden cursor-pointer"
                    onClick={jump}
                >
                    {/* Ground */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-amber-800"></div>
                    <div className="absolute bottom-12 left-0 right-0 h-4 bg-emerald-600"></div>

                    {/* Clouds */}
                    {[20, 50, 80].map(x => (
                        <div key={x} className="absolute text-5xl" style={{ left: `${x}%`, top: '10%' }}>☁️</div>
                    ))}

                    {!gameStarted ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <button
                                onClick={startGame}
                                className="px-8 py-4 bg-emerald-600 rounded-xl text-white text-xl font-bold"
                            >
                                🏃 Start Running!
                            </button>
                        </div>
                    ) : gameOver ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                            <div className="text-4xl mb-4">💥 Crashed!</div>
                            <div className="text-xl mb-4">Distance: {Math.floor(distance / 10)}m | Stars: {score}</div>
                            <button onClick={startGame} className="px-6 py-3 bg-emerald-600 rounded-lg text-white font-bold">
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Player */}
                            <div
                                className="absolute text-5xl transition-all duration-100"
                                style={{ left: '10%', bottom: `${64 + playerY}px` }}
                            >
                                🏃
                            </div>

                            {/* Obstacles */}
                            {obstacles.map(o => (
                                <div
                                    key={o.id}
                                    className="absolute text-4xl"
                                    style={{ left: `${o.x}%`, bottom: '64px' }}
                                >
                                    {o.type === 'rock' ? '🪨' : '🌵'}
                                </div>
                            ))}

                            {/* Stars */}
                            {stars.map(s => (
                                <div
                                    key={s.id}
                                    className="absolute text-3xl animate-pulse"
                                    style={{ left: `${s.x}%`, bottom: `${64 + s.y}px` }}
                                >
                                    ⭐
                                </div>
                            ))}
                        </>
                    )}
                </div>

                <div className="text-center mt-4 text-slate-400">
                    Tap screen or press SPACE to jump!
                </div>
            </div>
        </div>
    );
}
