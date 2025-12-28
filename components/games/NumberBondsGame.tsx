'use client';

import React, { useState, useEffect } from 'react';

// --- Types ---
type Bubble = {
    id: number;
    value: number;
    status: 'idle' | 'selected' | 'matched';
};

// --- Levels Configuration ---
const LEVELS = [
    { target: 10, count: 12, range: [1, 9] },
    { target: 20, count: 16, range: [1, 19] },
    { target: 50, count: 20, range: [5, 45] },
    { target: 100, count: 24, range: [10, 90] },
];

export default function NumberBondsGame() {
    const [currentLevel, setCurrentLevel] = useState(0);
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(1);
    const [message, setMessage] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);

    // Initialize Level
    useEffect(() => {
        startLevel(currentLevel);
    }, [currentLevel]);

    const startLevel = (levelIdx: number) => {
        const config = LEVELS[levelIdx];
        const newBubbles: Bubble[] = [];
        const numPairs = config.count / 2;

        for (let i = 0; i < numPairs; i++) {
            // Generate a pair that sums to target
            // Ensure values are within range (simple logic)
            // Ideally non-zero pair.
            let val1 = Math.floor(Math.random() * (config.target - 2)) + 1;
            // Adjust bounds if range provided
            // For MVP simpler logic: val1 random, val2 = target - val1
            // Check constraints if strictly needed, but simple is fine.
            let val2 = config.target - val1;

            newBubbles.push({ id: i * 2, value: val1, status: 'idle' });
            newBubbles.push({ id: i * 2 + 1, value: val2, status: 'idle' });
        }

        // Shuffle
        for (let i = newBubbles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newBubbles[i], newBubbles[j]] = [newBubbles[j], newBubbles[i]];
        }

        setBubbles(newBubbles);
        setSelectedIds([]);
        setStartTime(Date.now());
        setMessage(`Level ${levelIdx + 1}: Make ${config.target}!`);
    };

    const handleBubbleClick = (id: number) => {
        // Validation checks
        const clickedBubble = bubbles.find(b => b.id === id);
        if (!clickedBubble || clickedBubble.status === 'matched') return; // Ignore matched
        if (selectedIds.includes(id)) {
            // Deselect
            setBubbles(prev => prev.map(b => b.id === id ? { ...b, status: 'idle' } : b));
            setSelectedIds(prev => prev.filter(sid => sid !== id));
            return;
        }

        if (selectedIds.length >= 2) return; // limit to 2

        // Select it
        const newSelected = [...selectedIds, id];
        setBubbles(prev => prev.map(b => b.id === id ? { ...b, status: 'selected' } : b));
        setSelectedIds(newSelected);

        // Check Match
        if (newSelected.length === 2) {
            const b1 = bubbles.find(b => b.id === newSelected[0]);
            // Re-fetch b2 because state update might not be instant in this closure if we relied on state
            // But here we rely on 'clickedBubble' + previous selection. 
            // Better to rely on the ids we just determined.
            const b2 = clickedBubble;

            // Wait, b1 comes from 'bubbles' state, which is fresh enough? No.
            // Better to just grab objects from current bubbles state + clicked one.
            // Actually 'b1' is NOT clickedBubble, it's the OTHER one.
            const b1Ref = bubbles.find(b => b.id === newSelected[0])!;

            checkMatch(b1Ref, b2);
        }
    };

    const checkMatch = (b1: Bubble, b2: Bubble) => {
        const target = LEVELS[currentLevel].target;
        const sum = b1.value + b2.value;

        if (sum === target) {
            // Match!
            setTimeout(() => {
                setBubbles(prev => prev.map(b =>
                    (b.id === b1.id || b.id === b2.id) ? { ...b, status: 'matched' } : b
                ));
                setSelectedIds([]);
                setScore(s => s + (10 * combo));
                setCombo(c => c + 1);
                setMessage('Nice Match!');

                // Check Win
                // We need to count remaining bubbles. 
                // Since state update is pending, we check bubbles.length - 2 matched.
                // Or better, effect hook? 
                // Let's do a simple check in next render loop via effect?
                // Or check count here (previous matched + 2)
            }, 300);
        } else {
            // No Match
            setTimeout(() => {
                setBubbles(prev => prev.map(b =>
                    (b.id === b1.id || b.id === b2.id) ? { ...b, status: 'idle' } : b
                ));
                setSelectedIds([]);
                setCombo(1);
                setMessage('Try Again');
            }, 800);
        }
    };

    // Check Level Complete
    useEffect(() => {
        if (bubbles.length > 0 && bubbles.every(b => b.status === 'matched')) {
            // Level Complete
            const timeBonus = Math.max(0, 30 - Math.floor((Date.now() - (startTime || 0)) / 1000)) * 5;
            setScore(s => s + 100 + timeBonus);

            if (currentLevel < LEVELS.length - 1) {
                setMessage('Level Complete! Next...');
                setTimeout(() => setCurrentLevel(l => l + 1), 2000);
            } else {
                setMessage('All Levels Complete! Awesome!');
            }
        }
    }, [bubbles]);


    const target = LEVELS[currentLevel].target;

    return (
        <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-4xl mx-auto p-4 select-none">

            {/* Header */}
            <div className="flex justify-between items-center w-full mb-8 bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700">
                <div className="flex flex-col">
                    <span className="text-slate-400 text-sm">Level</span>
                    <span className="text-2xl font-bold text-white">{currentLevel + 1}</span>
                </div>

                <div className="flex flex-col items-center animate-pulse">
                    <span className="text-indigo-400 font-bold text-sm uppercase tracking-wider">Target</span>
                    <span className="text-5xl font-black text-white drop-shadow-lg">{target}</span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-slate-400 text-sm">Score</span>
                    <span className="text-2xl font-bold text-emerald-400">{score}</span>
                </div>
            </div>

            {/* Message Area */}
            <div className="h-8 mb-6 text-xl font-medium text-indigo-300 transition-all duration-300">
                {message}
            </div>

            {/* Bubbles Grid */}
            <div className="flex flex-wrap justify-center gap-4 max-w-2xl">
                {bubbles.map(bubble => (
                    <button
                        key={bubble.id}
                        onClick={() => handleBubbleClick(bubble.id)}
                        disabled={bubble.status === 'matched'}
                        className={`
                            w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center
                            text-3xl font-bold shadow-lg transition-all duration-300 transform
                            ${bubble.status === 'idle' ? 'bg-slate-700 text-white hover:bg-slate-600 hover:scale-105' : ''}
                            ${bubble.status === 'selected' ? 'bg-indigo-600 text-white scale-110 ring-4 ring-indigo-400' : ''}
                            ${bubble.status === 'matched' ? 'bg-emerald-600 text-transparent opacity-0 scale-50 cursor-default' : ''}
                        `}
                    >
                        {bubble.status !== 'matched' && bubble.value}
                    </button>
                ))}
            </div>

            {/* Instructions */}
            <div className="mt-12 text-slate-500 text-sm">
                Select two bubbles that add up to the TARGET number.
            </div>

        </div>
    );
}
