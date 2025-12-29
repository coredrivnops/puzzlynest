'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Catch butterflies with a net - timing/reaction game
export default function ButterflyCatchGame() {
    const [butterflies, setButterflies] = useState<{ id: number, x: number, y: number, color: string }[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [butterflyId, setButterflyId] = useState(0);

    const colors = ['🦋', '🧚', '🪲', '🐝', '🌸'];

    // Spawn butterflies
    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const interval = setInterval(() => {
            setButterflies(prev => {
                // Remove old butterflies randomly
                const filtered = prev.filter(() => Math.random() > 0.05);

                // Add new butterfly
                if (filtered.length < 6) {
                    return [...filtered, {
                        id: butterflyId,
                        x: 10 + Math.random() * 80,
                        y: 10 + Math.random() * 70,
                        color: colors[Math.floor(Math.random() * colors.length)]
                    }];
                }
                return filtered;
            });
            setButterflyId(id => id + 1);
        }, 800);

        return () => clearInterval(interval);
    }, [gameStarted, gameOver, butterflyId, colors]);

    // Timer
    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setGameOver(true);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameStarted, gameOver]);

    const catchButterfly = (id: number) => {
        setButterflies(prev => prev.filter(b => b.id !== id));
        setScore(s => s + 10);
    };

    const startGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setTimeLeft(30);
        setButterflies([]);
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Butterfly Catcher</h1>
                    <div className="flex gap-4">
                        <span className="text-yellow-400 font-bold">🦋 {score}</span>
                        <span className="text-rose-400 font-bold">⏱️ {timeLeft}s</span>
                    </div>
                </div>

                <div className="relative w-full h-[450px] bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-300 rounded-xl overflow-hidden">
                    {/* Garden decoration */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-around">
                        {['🌷', '🌻', '🌺', '🌸', '🌹', '🌼'].map((flower, i) => (
                            <span key={i} className="text-4xl">{flower}</span>
                        ))}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-emerald-500/50 rounded-t-full" />

                    {/* Clouds */}
                    <div className="absolute top-4 left-10 text-4xl">☁️</div>
                    <div className="absolute top-8 right-16 text-3xl">☁️</div>

                    {!gameStarted ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center bg-white/80 p-8 rounded-2xl">
                                <div className="text-6xl mb-4">🦋</div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">Catch the Butterflies!</h2>
                                <button
                                    onClick={startGame}
                                    className="px-8 py-4 bg-emerald-500 rounded-xl text-white text-xl font-bold"
                                >
                                    Start Playing!
                                </button>
                            </div>
                        </div>
                    ) : gameOver ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="text-center bg-white/90 p-8 rounded-2xl">
                                <div className="text-6xl mb-4">🏆</div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">Great Job!</h2>
                                <p className="text-xl text-slate-600 mb-4">You caught {score / 10} butterflies!</p>
                                <button
                                    onClick={startGame}
                                    className="px-6 py-3 bg-emerald-500 rounded-lg text-white font-bold"
                                >
                                    Play Again
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {butterflies.map(butterfly => (
                                <button
                                    key={butterfly.id}
                                    onClick={() => catchButterfly(butterfly.id)}
                                    className="absolute text-5xl animate-bounce cursor-pointer hover:scale-125 transition-transform"
                                    style={{
                                        left: `${butterfly.x}%`,
                                        top: `${butterfly.y}%`,
                                        animationDuration: '1.5s'
                                    }}
                                >
                                    {butterfly.color}
                                </button>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
