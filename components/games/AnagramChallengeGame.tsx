'use client';

import React, { useState, useEffect } from 'react';

// --- Data ---
const WORDS = [
    { word: 'PLANET', hint: 'Orbits a star' },
    { word: 'OCEAN', hint: 'Vast body of water' },
    { word: 'GUITAR', hint: 'Musical instrument with strings' },
    { word: 'SUMMER', hint: 'Warmest season' },
    { word: 'CASTLE', hint: 'Fortified residence' },
    { word: 'PYTHON', hint: 'Large snake or coding language' },
    { word: 'BAKERY', hint: 'Place for bread and cakes' },
    { word: 'JUNGLE', hint: 'Dense tropical forest' },
    { word: 'ROCKET', hint: 'Space vehicle' },
    { word: 'SOCKET', hint: 'Plug point' },
    { word: 'BRIDGE', hint: 'Crosses over water' },
    { word: 'PENCIL', hint: 'Writing tool' },
    { word: 'WINDOW', hint: 'Look through it' },
    { word: 'MARKET', hint: 'Place to buy goods' },
    { word: 'GARDEN', hint: 'Place for flowers' },
];

export default function AnagramChallengeGame() {
    const [currentWordIdx, setCurrentWordIdx] = useState(0);
    const [scrambled, setScrambled] = useState('');
    const [guess, setGuess] = useState('');
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState('');
    const [streak, setStreak] = useState(0);

    const currentWord = WORDS[currentWordIdx];

    useEffect(() => {
        scrambleWord();
        setGuess('');
        setMessage('');
    }, [currentWordIdx]);

    const scrambleWord = () => {
        const word = WORDS[currentWordIdx].word;
        // Keep scrambling until it's different from original (unless 1 char, but these are 4+)
        let s = '';
        do {
            s = word.split('').sort(() => Math.random() - 0.5).join('');
        } while (s === word);
        setScrambled(s);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGuess(e.target.value.toUpperCase());
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            checkGuess();
        }
    };

    const checkGuess = () => {
        if (guess === currentWord.word) {
            // Correct
            setScore(s => s + 100 + (streak * 10));
            setStreak(s => s + 1);
            setMessage('Correct! 🎉');
            setTimeout(() => {
                nextWord();
            }, 1000);
        } else {
            // Wrong
            setMessage('Try Again ❌');
            setStreak(0);
            setGuess('');
        }
    };

    const nextWord = () => {
        // Simple sequential loop for now, or random
        setCurrentWordIdx(prev => (prev + 1) % WORDS.length);
    };

    const skipWord = () => {
        setStreak(0);
        setMessage(`It was ${currentWord.word}`);
        setTimeout(nextWord, 1500);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-2xl mx-auto p-4">

            {/* Header */}
            <div className="flex justify-between w-full mb-8 bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700">
                <div className="flex flex-col">
                    <span className="text-slate-400 text-sm">Streak</span>
                    <span className="text-xl font-bold text-orange-400">🔥 {streak}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-slate-400 text-sm">Score</span>
                    <span className="text-2xl font-bold text-emerald-400">{score}</span>
                </div>
            </div>

            {/* Hint */}
            <div className="mb-4 text-indigo-300 font-medium bg-indigo-900/30 px-4 py-2 rounded-full">
                Hint: {currentWord.hint}
            </div>

            {/* Scrambled Word */}
            <div className="text-6xl font-black tracking-widest text-white mb-8 drop-shadow-xl text-center break-words w-full">
                {scrambled}
            </div>

            {/* Input */}
            <div className="relative w-full max-w-sm">
                <input
                    type="text"
                    value={guess}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    className="w-full px-6 py-4 bg-slate-700 text-white text-center text-3xl font-bold rounded-xl border-2 border-slate-600 focus:border-indigo-500 focus:outline-none transition-colors uppercase tracking-widest placeholder-slate-500"
                    placeholder="TYPE HERE"
                />
            </div>

            {/* Message Area */}
            <div className="h-12 mt-4 flex items-center justify-center">
                <span className={`text-2xl font-bold animate-bounce ${message.includes('Correct') ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {message}
                </span>
            </div>

            {/* Controls */}
            <div className="flex gap-4 mt-8">
                <button
                    onClick={skipWord}
                    className="px-6 py-3 rounded-lg bg-slate-600 text-slate-300 font-bold hover:bg-slate-500 transition-colors"
                >
                    Skip (-0 pts)
                </button>
                <button
                    onClick={checkGuess}
                    className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-500 shadow-lg transition-colors ring-4 ring-indigo-500/20"
                >
                    Check Word
                </button>
            </div>

        </div>
    );
}
