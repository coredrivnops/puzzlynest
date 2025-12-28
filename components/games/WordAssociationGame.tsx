'use client';

import React, { useState, useEffect } from 'react';

const PAIRS = [
    ['SUN', 'MOON'],
    ['HOT', 'COLD'],
    ['DAY', 'NIGHT'],
    ['SALT', 'PEPPER'],
    ['CAT', 'DOG'],
    ['BREAD', 'BUTTER'],
    ['LEFT', 'RIGHT'],
    ['UP', 'DOWN'],
    ['KING', 'QUEEN'],
    ['SHOE', 'SOCK'],
    ['PEN', 'PAPER'],
    ['LOCK', 'KEY'],
    ['THUNDER', 'LIGHTNING'],
    ['FORK', 'SPOON'],
    ['BLACK', 'WHITE'],
    ['IN', 'OUT'],
    ['BOY', 'GIRL'],
    ['BAT', 'BALL'],
    ['FISH', 'CHIPS'],
    ['NEEDLE', 'THREAD'],
];

type Tile = {
    id: number;
    word: string;
    pairId: number; // Groups pair
    status: 'idle' | 'selected' | 'matched' | 'wrong';
};

export default function WordAssociationGame() {
    const [tiles, setTiles] = useState<Tile[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [matches, setMatches] = useState(0);

    useEffect(() => {
        startRound();
    }, []);

    const startRound = () => {
        // Pick 6 random pairs
        const shuffledPairs = [...PAIRS].sort(() => Math.random() - 0.5).slice(0, 6);

        const newTiles: Tile[] = [];
        shuffledPairs.forEach((pair, pairId) => {
            newTiles.push({ id: pairId * 2, word: pair[0], pairId, status: 'idle' });
            newTiles.push({ id: pairId * 2 + 1, word: pair[1], pairId, status: 'idle' });
        });

        // Shuffle tiles
        for (let i = newTiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
        }

        setTiles(newTiles);
        setSelectedId(null);
        setMatches(0);
        // Reset score? Actually accumulated score is nice.
    };

    const handleTileClick = (id: number) => {
        const tile = tiles.find(t => t.id === id);
        if (!tile || tile.status === 'matched' || tile.status === 'wrong') return;

        if (selectedId === null) {
            // Select first
            setSelectedId(id);
            setTiles(prev => prev.map(t => t.id === id ? { ...t, status: 'selected' } : t));
        } else {
            if (selectedId === id) {
                // Deselect
                setSelectedId(null);
                setTiles(prev => prev.map(t => t.id === id ? { ...t, status: 'idle' } : t));
                return;
            }

            // Select second
            const first = tiles.find(t => t.id === selectedId)!;
            const second = tile; // Clicked one

            if (first.pairId === second.pairId) {
                // Match
                setTiles(prev => prev.map(t =>
                    (t.id === first.id || t.id === second.id) ? { ...t, status: 'matched' } : t
                ));
                setSelectedId(null);
                setScore(s => s + 10);
                setMatches(m => m + 1);
            } else {
                // Mismatch
                setTiles(prev => prev.map(t =>
                    (t.id === first.id || t.id === second.id) ? { ...t, status: 'wrong' } : t
                ));
                setSelectedId(null);
                setScore(s => Math.max(0, s - 2));

                setTimeout(() => {
                    setTiles(prev => prev.map(t =>
                        (t.id === first.id || t.id === second.id) ? { ...t, status: 'idle' } : t
                    ));
                }, 800);
            }
        }
    };

    // Check Win
    const isComplete = matches === 6;

    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-3xl mx-auto p-4 select-none">

            <div className="flex justify-between w-full mb-8 bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700">
                <button
                    onClick={() => { setScore(0); startRound(); }}
                    className="text-slate-400 text-sm hover:text-white"
                >
                    Reset
                </button>
                <div className="text-xl font-bold text-white">Word Association</div>
                <div className="flex flex-col items-end">
                    <span className="text-slate-400 text-sm">Score</span>
                    <span className="text-2xl font-bold text-emerald-400">{score}</span>
                </div>
            </div>

            {isComplete ? (
                <div className="text-center animate-bounce mb-8">
                    <h2 className="text-4xl font-bold text-white mb-4">Well Done! 🎉</h2>
                    <button
                        onClick={startRound}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg"
                    >
                        Next Round
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
                    {tiles.map(tile => {
                        let baseStyle = 'bg-slate-700 text-slate-200 hover:bg-slate-600';
                        if (tile.status === 'selected') baseStyle = 'bg-indigo-600 text-white ring-4 ring-indigo-400';
                        if (tile.status === 'matched') baseStyle = 'bg-emerald-600 text-emerald-100 opacity-50 scale-95';
                        if (tile.status === 'wrong') baseStyle = 'bg-rose-600 text-white animate-shake'; // animate-shake needs css

                        return (
                            <button
                                key={tile.id}
                                onClick={() => handleTileClick(tile.id)}
                                disabled={tile.status === 'matched'}
                                className={`
                                    h-20 rounded-xl text-lg sm:text-xl font-bold shadow-md transition-all duration-300 transform
                                    ${baseStyle}
                                `}
                            >
                                {tile.word}
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="mt-8 text-slate-500 text-sm">
                Match related words! (e.g. Bread & Butter)
            </div>

            <style jsx global>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.4s ease-in-out;
                }
            `}</style>
        </div>
    );
}
