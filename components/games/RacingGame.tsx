'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Simple Racing Game - avoid traffic and collect coins
export default function RacingGame() {
    const [playerLane, setPlayerLane] = useState(1); // 0, 1, 2 (3 lanes)
    const [obstacles, setObstacles] = useState<{ id: number, lane: number, y: number }[]>([]);
    const [coins, setCoins] = useState<{ id: number, lane: number, y: number }[]>([]);
    const [score, setScore] = useState(0);
    const [distance, setDistance] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [itemId, setItemId] = useState(0);

    const changeLane = useCallback((direction: 'left' | 'right') => {
        setPlayerLane(prev => {
            if (direction === 'left') return Math.max(0, prev - 1);
            return Math.min(2, prev + 1);
        });
    }, []);

    // Keyboard
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') changeLane('left');
            if (e.key === 'ArrowRight' || e.key === 'd') changeLane('right');
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [changeLane]);

    // Game loop
    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const interval = setInterval(() => {
            setDistance(d => d + 1);

            // Move obstacles
            setObstacles(prev => {
                const updated = prev.map(o => ({ ...o, y: o.y + 4 })).filter(o => o.y < 100);

                // Collision
                updated.forEach(o => {
                    if (o.y > 70 && o.y < 90 && o.lane === playerLane) {
                        setGameOver(true);
                    }
                });

                return updated;
            });

            // Move coins
            setCoins(prev => {
                const remaining: typeof prev = [];
                prev.forEach(c => {
                    const updated = { ...c, y: c.y + 4 };
                    if (updated.y > 70 && updated.y < 90 && c.lane === playerLane) {
                        setScore(s => s + 10);
                    } else if (updated.y < 100) {
                        remaining.push(updated);
                    }
                });
                return remaining;
            });

            // Spawn obstacles
            if (Math.random() < 0.03) {
                setObstacles(prev => [...prev, {
                    id: itemId,
                    lane: Math.floor(Math.random() * 3),
                    y: -10
                }]);
                setItemId(id => id + 1);
            }

            // Spawn coins
            if (Math.random() < 0.02) {
                setCoins(prev => [...prev, {
                    id: itemId + 1000,
                    lane: Math.floor(Math.random() * 3),
                    y: -10
                }]);
                setItemId(id => id + 1);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [gameStarted, gameOver, playerLane, itemId]);

    const startGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setDistance(0);
        setObstacles([]);
        setCoins([]);
        setPlayerLane(1);
    };

    const lanePositions = [17, 50, 83]; // Percentages for 3 lanes

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Simple Racer</h1>
                    <div className="text-yellow-400 font-bold">🪙 {score} | 📏 {Math.floor(distance / 10)}m</div>
                </div>

                <div className="relative w-full h-[450px] bg-gradient-to-b from-slate-700 to-slate-800 rounded-xl overflow-hidden">
                    {/* Road */}
                    <div className="absolute inset-x-[10%] inset-y-0 bg-slate-600">
                        {/* Lane dividers */}
                        <div className="absolute left-1/3 top-0 bottom-0 w-2 border-l-4 border-dashed border-yellow-400/50" />
                        <div className="absolute left-2/3 top-0 bottom-0 w-2 border-l-4 border-dashed border-yellow-400/50" />
                    </div>

                    {!gameStarted ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button
                                onClick={startGame}
                                className="px-8 py-4 bg-emerald-600 rounded-xl text-white text-xl font-bold"
                            >
                                🏎️ Start Racing!
                            </button>
                        </div>
                    ) : gameOver ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                            <div className="text-4xl mb-4">💥 Crash!</div>
                            <div className="text-xl mb-4">Distance: {Math.floor(distance / 10)}m | Coins: {score}</div>
                            <button onClick={startGame} className="px-6 py-3 bg-emerald-600 rounded-lg text-white font-bold">
                                Race Again
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Obstacles (other cars) */}
                            {obstacles.map(o => (
                                <div
                                    key={o.id}
                                    className="absolute text-4xl"
                                    style={{
                                        left: `${lanePositions[o.lane]}%`,
                                        top: `${o.y}%`,
                                        transform: 'translateX(-50%) rotate(180deg)'
                                    }}
                                >
                                    🚗
                                </div>
                            ))}

                            {/* Coins */}
                            {coins.map(c => (
                                <div
                                    key={c.id}
                                    className="absolute text-3xl animate-spin"
                                    style={{
                                        left: `${lanePositions[c.lane]}%`,
                                        top: `${c.y}%`,
                                        transform: 'translateX(-50%)',
                                        animationDuration: '1s'
                                    }}
                                >
                                    🪙
                                </div>
                            ))}

                            {/* Player car */}
                            <div
                                className="absolute text-5xl transition-all duration-150"
                                style={{
                                    left: `${lanePositions[playerLane]}%`,
                                    bottom: '10%',
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                🚙
                            </div>
                        </>
                    )}
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-8 mt-4">
                    <button
                        onClick={() => changeLane('left')}
                        className="px-10 py-5 bg-slate-700 rounded-xl text-3xl active:bg-slate-600"
                    >
                        ◀️
                    </button>
                    <button
                        onClick={() => changeLane('right')}
                        className="px-10 py-5 bg-slate-700 rounded-xl text-3xl active:bg-slate-600"
                    >
                        ▶️
                    </button>
                </div>
            </div>
        </div>
    );
}
