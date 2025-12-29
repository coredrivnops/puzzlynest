'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Spot the Difference - find differences between two scenes
// Using emoji-based scenes for simplicity

interface Difference {
    id: number;
    row: number;
    col: number;
    left: string;
    right: string;
}

const LEVELS = [
    {
        name: 'Garden',
        baseEmoji: '🌳',
        grid: [
            ['🌳', '🌸', '🌻', '🌳'],
            ['🦋', '🌿', '🌿', '🌺'],
            ['🌷', '🌼', '🪻', '🌳'],
            ['🌿', '🌸', '🌿', '🦎'],
        ],
        differences: [
            { id: 1, row: 0, col: 1, left: '🌸', right: '🌺' },
            { id: 2, row: 1, col: 0, left: '🦋', right: '🐝' },
            { id: 3, row: 2, col: 2, left: '🪻', right: '🌷' },
            { id: 4, row: 3, col: 3, left: '🦎', right: '🐸' },
        ]
    },
    {
        name: 'Ocean',
        baseEmoji: '🌊',
        grid: [
            ['🌊', '🐟', '🐠', '🌊'],
            ['🦀', '🌊', '🐡', '🦑'],
            ['🐚', '🦐', '🌊', '🐙'],
            ['🌊', '🦞', '🐬', '🌊'],
        ],
        differences: [
            { id: 1, row: 0, col: 2, left: '🐠', right: '🐡' },
            { id: 2, row: 1, col: 3, left: '🦑', right: '🦐' },
            { id: 3, row: 2, col: 0, left: '🐚', right: '🦪' },
            { id: 4, row: 3, col: 2, left: '🐬', right: '🐳' },
            { id: 5, row: 1, col: 0, left: '🦀', right: '🦞' },
        ]
    },
];

export default function SpotDifferenceGame() {
    const [levelIndex, setLevelIndex] = useState(0);
    const [found, setFound] = useState<number[]>([]);
    const [wrongClicks, setWrongClicks] = useState(0);
    const [completed, setCompleted] = useState(false);

    const level = LEVELS[levelIndex];
    const totalDiffs = level.differences.length;

    useEffect(() => {
        setFound([]);
        setWrongClicks(0);
        setCompleted(false);
    }, [levelIndex]);

    useEffect(() => {
        if (found.length === totalDiffs) {
            setCompleted(true);
        }
    }, [found, totalDiffs]);

    const checkClick = (row: number, col: number) => {
        const diff = level.differences.find(d => d.row === row && d.col === col);

        if (diff && !found.includes(diff.id)) {
            setFound(prev => [...prev, diff.id]);
        } else if (!diff) {
            setWrongClicks(w => w + 1);
        }
    };

    const getRightEmoji = (row: number, col: number): string => {
        const diff = level.differences.find(d => d.row === row && d.col === col);
        return diff ? diff.right : level.grid[row][col];
    };

    const isFound = (row: number, col: number): boolean => {
        const diff = level.differences.find(d => d.row === row && d.col === col);
        return diff ? found.includes(diff.id) : false;
    };

    const nextLevel = () => {
        if (levelIndex < LEVELS.length - 1) {
            setLevelIndex(i => i + 1);
        }
    };

    const resetGame = () => {
        setLevelIndex(0);
        setFound([]);
        setWrongClicks(0);
        setCompleted(false);
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Spot the Difference</h1>
                    <div className="flex gap-4">
                        <span className="text-emerald-400 font-bold">✅ {found.length}/{totalDiffs}</span>
                        <span className="text-rose-400 font-bold">❌ {wrongClicks}</span>
                    </div>
                </div>

                <p className="text-center text-lg mb-4">
                    Level {levelIndex + 1}: {level.name}
                </p>

                <div className="flex justify-center gap-8 flex-wrap">
                    {/* Left image */}
                    <div className="bg-slate-800 p-4 rounded-xl">
                        <div className="text-center text-sm text-slate-400 mb-2">Original</div>
                        <div className="grid grid-cols-4 gap-1">
                            {level.grid.map((row, r) =>
                                row.map((cell, c) => (
                                    <div
                                        key={`l-${r}-${c}`}
                                        className={`
                                            w-14 h-14 flex items-center justify-center text-3xl rounded
                                            ${isFound(r, c) ? 'bg-emerald-500/30 ring-2 ring-emerald-400' : 'bg-slate-700'}
                                        `}
                                    >
                                        {cell}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right image (with differences) */}
                    <div className="bg-slate-800 p-4 rounded-xl">
                        <div className="text-center text-sm text-slate-400 mb-2">Find Differences</div>
                        <div className="grid grid-cols-4 gap-1">
                            {level.grid.map((row, r) =>
                                row.map((_, c) => {
                                    const emoji = getRightEmoji(r, c);
                                    const foundIt = isFound(r, c);

                                    return (
                                        <button
                                            key={`r-${r}-${c}`}
                                            onClick={() => checkClick(r, c)}
                                            disabled={completed}
                                            className={`
                                                w-14 h-14 flex items-center justify-center text-3xl rounded transition-all
                                                ${foundIt
                                                    ? 'bg-emerald-500/30 ring-2 ring-emerald-400'
                                                    : 'bg-slate-700 hover:bg-slate-600 active:scale-95'}
                                            `}
                                        >
                                            {emoji}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Completion */}
                {completed && (
                    <div className="text-center mt-6">
                        <div className="text-4xl mb-4">🎉</div>
                        <p className="text-xl font-bold text-emerald-400 mb-4">
                            All differences found!
                        </p>
                        {levelIndex < LEVELS.length - 1 ? (
                            <button
                                onClick={nextLevel}
                                className="px-6 py-3 bg-indigo-600 rounded-lg font-bold"
                            >
                                Next Level →
                            </button>
                        ) : (
                            <div>
                                <p className="text-slate-400 mb-4">You completed all levels!</p>
                                <button
                                    onClick={resetGame}
                                    className="px-6 py-3 bg-emerald-600 rounded-lg font-bold"
                                >
                                    Play Again
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
