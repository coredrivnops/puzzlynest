'use client';

import { useState } from 'react';
import Link from 'next/link';

// Fish Feeding Game - drop food to hungry fish
export default function FishFeedingGame() {
    const [fish, setFish] = useState([
        { id: 1, x: 20, hungry: true, emoji: '🐠' },
        { id: 2, x: 50, hungry: true, emoji: '🐟' },
        { id: 3, x: 80, hungry: true, emoji: '🐡' },
    ]);
    const [food, setFood] = useState<{ id: number, x: number, y: number }[]>([]);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [foodId, setFoodId] = useState(0);

    const dropFood = (x: number) => {
        setFood(prev => [...prev, { id: foodId, x: x, y: 0 }]);
        setFoodId(id => id + 1);
    };

    // Animate food falling
    useState(() => {
        const interval = setInterval(() => {
            setFood(prev => {
                const updated = prev.map(f => ({ ...f, y: f.y + 5 }));

                // Check if food reached fish level
                const remaining = updated.filter(f => {
                    if (f.y > 70) {
                        // Check collision with fish
                        const fedFish = fish.find(fi =>
                            fi.hungry && Math.abs(fi.x - f.x) < 15
                        );

                        if (fedFish) {
                            setFish(prev => prev.map(fi =>
                                fi.id === fedFish.id ? { ...fi, hungry: false } : fi
                            ));
                            setScore(s => s + 10);

                            // Check level complete
                            setTimeout(() => {
                                const stillHungry = fish.filter(fi => fi.hungry && fi.id !== fedFish.id);
                                if (stillHungry.length === 0) {
                                    nextLevel();
                                }
                            }, 100);

                            return false;
                        }
                    }
                    return f.y < 90;
                });

                return remaining;
            });
        }, 100);

        return () => clearInterval(interval);
    });

    const nextLevel = () => {
        setLevel(l => l + 1);
        const newFish = Array(3 + level).fill(null).map((_, i) => ({
            id: i + Date.now(),
            x: 10 + (80 / (3 + level)) * i + 10,
            hungry: true,
            emoji: ['🐠', '🐟', '🐡', '🦈', '🐋'][i % 5]
        }));
        setFish(newFish);
    };

    const resetGame = () => {
        setLevel(1);
        setScore(0);
        setFood([]);
        setFish([
            { id: 1, x: 20, hungry: true, emoji: '🐠' },
            { id: 2, x: 50, hungry: true, emoji: '🐟' },
            { id: 3, x: 80, hungry: true, emoji: '🐡' },
        ]);
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Feed the Fish</h1>
                    <div className="flex gap-4">
                        <span className="text-yellow-400 font-bold">🐟 {score}</span>
                        <span className="text-emerald-400 font-bold">Level {level}</span>
                    </div>
                </div>

                <div
                    className="relative w-full h-[450px] bg-gradient-to-b from-sky-500 via-blue-600 to-blue-800 rounded-xl overflow-hidden cursor-pointer"
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                        dropFood(x);
                    }}
                >
                    {/* Water surface */}
                    <div className="absolute top-0 left-0 right-0 h-4 bg-sky-300/50" />

                    {/* Bubbles decoration */}
                    {[10, 30, 60, 85].map((x, i) => (
                        <div
                            key={i}
                            className="absolute w-4 h-4 bg-white/30 rounded-full animate-bounce"
                            style={{ left: `${x}%`, bottom: '20%', animationDelay: `${i * 0.3}s` }}
                        />
                    ))}

                    {/* Seaweed */}
                    <div className="absolute bottom-0 left-5 text-5xl">🌿</div>
                    <div className="absolute bottom-0 right-10 text-4xl">🌿</div>
                    <div className="absolute bottom-0 left-1/2 text-4xl">🪸</div>

                    {/* Food drops */}
                    {food.map(f => (
                        <div
                            key={f.id}
                            className="absolute text-2xl"
                            style={{ left: `${f.x}%`, top: `${f.y}%`, transform: 'translateX(-50%)' }}
                        >
                            🍪
                        </div>
                    ))}

                    {/* Fish */}
                    {fish.map(f => (
                        <div
                            key={f.id}
                            className={`absolute text-5xl transition-all duration-300 ${f.hungry ? 'animate-bounce' : 'opacity-50'}`}
                            style={{
                                left: `${f.x}%`,
                                bottom: '15%',
                                transform: 'translateX(-50%)'
                            }}
                        >
                            {f.emoji}
                            {f.hungry && <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xl">💭</span>}
                        </div>
                    ))}

                    {/* Instructions */}
                    {fish.every(f => !f.hungry) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="text-center bg-white/90 p-6 rounded-xl">
                                <div className="text-4xl mb-2">🎉</div>
                                <p className="text-xl font-bold text-slate-800">Level {level} Complete!</p>
                                <button
                                    onClick={nextLevel}
                                    className="mt-4 px-6 py-2 bg-emerald-500 rounded-lg text-white font-bold"
                                >
                                    Next Level
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-center mt-4 text-slate-400">
                    Tap above the hungry fish to drop food! 🐟
                </div>
            </div>
        </div>
    );
}
