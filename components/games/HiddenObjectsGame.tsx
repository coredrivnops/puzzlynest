'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Hidden Objects - find hidden items in a scene
const SCENES = [
    {
        name: 'Living Room',
        background: 'bg-amber-100',
        sceneEmojis: ['🛋️', '📺', '🪴', '🖼️', '💡', '📚', '🕰️', '🪟'],
        hiddenItems: [
            { emoji: '🔑', name: 'Key', x: 25, y: 60 },
            { emoji: '📱', name: 'Phone', x: 70, y: 40 },
            { emoji: '🎮', name: 'Controller', x: 45, y: 75 },
            { emoji: '👓', name: 'Glasses', x: 80, y: 65 },
            { emoji: '🍎', name: 'Apple', x: 15, y: 35 },
        ],
        decorations: [
            { emoji: '🛋️', x: 30, y: 70, scale: 2 },
            { emoji: '📺', x: 70, y: 30, scale: 1.5 },
            { emoji: '🪴', x: 10, y: 55, scale: 1.2 },
            { emoji: '🖼️', x: 50, y: 20, scale: 1.3 },
            { emoji: '📚', x: 85, y: 80, scale: 1 },
            { emoji: '🕰️', x: 90, y: 25, scale: 1 },
        ]
    },
    {
        name: 'Beach',
        background: 'bg-sky-200',
        sceneEmojis: ['🌴', '⛱️', '🏖️', '🌊', '☀️'],
        hiddenItems: [
            { emoji: '🐚', name: 'Shell', x: 20, y: 80 },
            { emoji: '⭐', name: 'Starfish', x: 60, y: 75 },
            { emoji: '🦀', name: 'Crab', x: 80, y: 70 },
            { emoji: '🔱', name: 'Trident', x: 35, y: 45 },
            { emoji: '💎', name: 'Gem', x: 75, y: 35 },
            { emoji: '🗝️', name: 'Old Key', x: 15, y: 60 },
        ],
        decorations: [
            { emoji: '🌴', x: 15, y: 30, scale: 2.5 },
            { emoji: '⛱️', x: 50, y: 40, scale: 2 },
            { emoji: '🌊', x: 50, y: 90, scale: 3 },
            { emoji: '☀️', x: 85, y: 15, scale: 2 },
            { emoji: '🏖️', x: 70, y: 55, scale: 1.5 },
        ]
    },
];

export default function HiddenObjectsGame() {
    const [sceneIndex, setSceneIndex] = useState(0);
    const [found, setFound] = useState<string[]>([]);
    const [hintUsed, setHintUsed] = useState(false);
    const [hintItem, setHintItem] = useState<string | null>(null);
    const [completed, setCompleted] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);

    const scene = SCENES[sceneIndex];

    useEffect(() => {
        setFound([]);
        setHintUsed(false);
        setHintItem(null);
        setCompleted(false);
        setTimeElapsed(0);
    }, [sceneIndex]);

    useEffect(() => {
        if (completed) return;

        const timer = setInterval(() => {
            setTimeElapsed(t => t + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [completed]);

    useEffect(() => {
        if (found.length === scene.hiddenItems.length) {
            setCompleted(true);
        }
    }, [found, scene.hiddenItems.length]);

    const clickItem = (name: string) => {
        if (!found.includes(name)) {
            setFound(prev => [...prev, name]);
            setHintItem(null);
        }
    };

    const useHint = () => {
        if (hintUsed) return;
        const notFound = scene.hiddenItems.filter(item => !found.includes(item.name));
        if (notFound.length > 0) {
            const randomItem = notFound[Math.floor(Math.random() * notFound.length)];
            setHintItem(randomItem.name);
            setHintUsed(true);

            setTimeout(() => setHintItem(null), 3000);
        }
    };

    const nextScene = () => {
        if (sceneIndex < SCENES.length - 1) {
            setSceneIndex(i => i + 1);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Hidden Objects</h1>
                    <div className="flex gap-4">
                        <span className="text-emerald-400 font-bold">✅ {found.length}/{scene.hiddenItems.length}</span>
                        <span className="text-slate-400">⏱️ {formatTime(timeElapsed)}</span>
                    </div>
                </div>

                {/* Items to find */}
                <div className="flex justify-center gap-2 mb-4 flex-wrap">
                    <span className="text-slate-400 mr-2">Find:</span>
                    {scene.hiddenItems.map(item => (
                        <div
                            key={item.name}
                            className={`
                                px-3 py-1 rounded-lg flex items-center gap-1
                                ${found.includes(item.name)
                                    ? 'bg-emerald-600/50 line-through'
                                    : hintItem === item.name
                                        ? 'bg-yellow-500 animate-pulse'
                                        : 'bg-slate-700'}
                            `}
                        >
                            {item.emoji} {item.name}
                        </div>
                    ))}
                    <button
                        onClick={useHint}
                        disabled={hintUsed}
                        className="px-3 py-1 bg-indigo-600 rounded-lg disabled:opacity-50"
                    >
                        💡 Hint
                    </button>
                </div>

                {/* Scene */}
                <div className={`
                    relative w-full h-[400px] rounded-xl overflow-hidden ${scene.background}
                `}>
                    {/* Decorations */}
                    {scene.decorations.map((dec, i) => (
                        <div
                            key={i}
                            className="absolute select-none pointer-events-none"
                            style={{
                                left: `${dec.x}%`,
                                top: `${dec.y}%`,
                                fontSize: `${dec.scale * 2}rem`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            {dec.emoji}
                        </div>
                    ))}

                    {/* Hidden items */}
                    {scene.hiddenItems.map(item => (
                        <button
                            key={item.name}
                            onClick={() => clickItem(item.name)}
                            disabled={found.includes(item.name)}
                            className={`
                                absolute text-2xl transition-all
                                ${found.includes(item.name)
                                    ? 'opacity-50 scale-150 pointer-events-none'
                                    : 'hover:scale-125 cursor-pointer'}
                                ${hintItem === item.name ? 'animate-bounce ring-4 ring-yellow-400 rounded-full' : ''}
                            `}
                            style={{
                                left: `${item.x}%`,
                                top: `${item.y}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            {item.emoji}
                        </button>
                    ))}

                    {/* Completion overlay */}
                    {completed && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="text-center bg-white/90 p-8 rounded-2xl text-slate-800">
                                <div className="text-5xl mb-4">🎉</div>
                                <h2 className="text-2xl font-bold mb-2">Scene Complete!</h2>
                                <p className="mb-4">Time: {formatTime(timeElapsed)}</p>
                                {sceneIndex < SCENES.length - 1 ? (
                                    <button onClick={nextScene} className="px-6 py-3 bg-indigo-600 rounded-lg text-white font-bold">
                                        Next Scene →
                                    </button>
                                ) : (
                                    <p className="text-emerald-600 font-bold">All scenes completed! 🏆</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <p className="text-center text-slate-400 mt-4 text-sm">
                    Scene: {scene.name} ({sceneIndex + 1}/{SCENES.length})
                </p>
            </div>
        </div>
    );
}
