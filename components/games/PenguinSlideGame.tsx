'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Penguin Slide - help penguin slide down collecting fish
export default function PenguinSlideGame() {
    const [penguinX, setPenguinX] = useState(50);
    const [fish, setFish] = useState<{ id: number, x: number, y: number }[]>([]);
    const [icebergs, setIcebergs] = useState<{ id: number, x: number, y: number }[]>([]);
    const [score, setScore] = useState(0);
    const [distance, setDistance] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [itemId, setItemId] = useState(0);

    // Controls
    const movePenguin = (direction: 'left' | 'right') => {
        setPenguinX(prev => {
            if (direction === 'left') return Math.max(10, prev - 10);
            return Math.min(90, prev + 10);
        });
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') movePenguin('left');
            if (e.key === 'ArrowRight') movePenguin('right');
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    // Game loop
    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const interval = setInterval(() => {
            setDistance(d => d + 1);

            // Move items up (penguin sliding down)
            setFish(prev => {
                const updated = prev.map(f => ({ ...f, y: f.y - 3 }));

                // Collect fish
                const remaining = updated.filter(f => {
                    if (f.y < 20 && f.y > 5 && Math.abs(f.x - penguinX) < 12) {
                        setScore(s => s + 10);
                        return false;
                    }
                    return f.y > -10;
                });

                return remaining;
            });

            setIcebergs(prev => {
                const updated = prev.map(i => ({ ...i, y: i.y - 3 }));

                // Collision with penguin
                updated.forEach(i => {
                    if (i.y < 20 && i.y > 5 && Math.abs(i.x - penguinX) < 12) {
                        setGameOver(true);
                    }
                });

                return updated.filter(i => i.y > -10);
            });

            // Spawn items
            if (Math.random() < 0.04) {
                setFish(prev => [...prev, {
                    id: itemId,
                    x: 15 + Math.random() * 70,
                    y: 100
                }]);
                setItemId(id => id + 1);
            }

            if (Math.random() < 0.02) {
                setIcebergs(prev => [...prev, {
                    id: itemId + 1000,
                    x: 15 + Math.random() * 70,
                    y: 100
                }]);
                setItemId(id => id + 1);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [gameStarted, gameOver, penguinX, itemId]);

    const startGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setDistance(0);
        setFish([]);
        setIcebergs([]);
        setPenguinX(50);
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Penguin Slide</h1>
                    <div className="flex gap-4">
                        <span className="text-yellow-400 font-bold">🐟 {score}</span>
                        <span className="text-emerald-400 font-bold">📏 {Math.floor(distance / 10)}m</span>
                    </div>
                </div>

                <div className="relative w-full h-[450px] bg-gradient-to-b from-sky-200 via-sky-100 to-white rounded-xl overflow-hidden">
                    {/* Ice texture lines */}
                    {[20, 40, 60, 80].map(y => (
                        <div
                            key={y}
                            className="absolute h-px w-full bg-sky-300/30"
                            style={{ top: `${y}%` }}
                        />
                    ))}

                    {!gameStarted ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center bg-white/90 p-8 rounded-2xl shadow-xl">
                                <div className="text-6xl mb-4">🐧</div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">Penguin Slide!</h2>
                                <p className="text-slate-600 mb-4">Collect fish 🐟 and avoid icebergs 🧊</p>
                                <button
                                    onClick={startGame}
                                    className="px-8 py-4 bg-sky-500 rounded-xl text-white text-xl font-bold"
                                >
                                    Start Sliding!
                                </button>
                            </div>
                        </div>
                    ) : gameOver ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="text-center bg-white/90 p-8 rounded-2xl">
                                <div className="text-5xl mb-4">💥🧊</div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops! Hit an iceberg!</h2>
                                <p className="text-slate-600 mb-4">Fish collected: {score / 10} | Distance: {Math.floor(distance / 10)}m</p>
                                <button
                                    onClick={startGame}
                                    className="px-6 py-3 bg-sky-500 rounded-lg text-white font-bold"
                                >
                                    Slide Again
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Fish */}
                            {fish.map(f => (
                                <div
                                    key={f.id}
                                    className="absolute text-3xl"
                                    style={{ left: `${f.x}%`, top: `${100 - f.y}%`, transform: 'translateX(-50%)' }}
                                >
                                    🐟
                                </div>
                            ))}

                            {/* Icebergs */}
                            {icebergs.map(i => (
                                <div
                                    key={i.id}
                                    className="absolute text-4xl"
                                    style={{ left: `${i.x}%`, top: `${100 - i.y}%`, transform: 'translateX(-50%)' }}
                                >
                                    🧊
                                </div>
                            ))}

                            {/* Penguin at top (sliding down = viewport goes up) */}
                            <div
                                className="absolute top-[10%] text-5xl transition-all duration-150"
                                style={{ left: `${penguinX}%`, transform: 'translateX(-50%)' }}
                            >
                                🐧
                            </div>
                        </>
                    )}
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-8 mt-4">
                    <button
                        onClick={() => movePenguin('left')}
                        className="px-10 py-5 bg-sky-600 rounded-xl text-3xl active:bg-sky-500"
                    >
                        ◀️
                    </button>
                    <button
                        onClick={() => movePenguin('right')}
                        className="px-10 py-5 bg-sky-600 rounded-xl text-3xl active:bg-sky-500"
                    >
                        ▶️
                    </button>
                </div>
            </div>
        </div>
    );
}
