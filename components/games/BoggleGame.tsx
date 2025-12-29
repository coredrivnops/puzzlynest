'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Boggle-style word grid game
const LETTER_VALUES: Record<string, number> = {
    A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8,
    K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1,
    U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
};

const COMMON_WORDS = [
    'CAT', 'DOG', 'SUN', 'RUN', 'FUN', 'THE', 'AND', 'FOR', 'ARE', 'BUT',
    'NOT', 'YOU', 'ALL', 'CAN', 'HAD', 'HER', 'WAS', 'ONE', 'OUR', 'OUT',
    'DAY', 'GET', 'HAS', 'HIM', 'HIS', 'HOW', 'MAN', 'NEW', 'NOW', 'OLD',
    'SEE', 'TWO', 'WAY', 'WHO', 'BOY', 'DID', 'ITS', 'LET', 'PUT', 'SAY',
    'SHE', 'TOO', 'USE', 'STAR', 'STOP', 'PLAY', 'READ', 'WORD', 'TREE',
    'RAIN', 'SNOW', 'FISH', 'BIRD', 'BEAR', 'LION', 'FROG', 'CAKE', 'GAME'
];

export default function BoggleGame() {
    const [grid, setGrid] = useState<string[][]>([]);
    const [selected, setSelected] = useState<{ r: number, c: number }[]>([]);
    const [currentWord, setCurrentWord] = useState('');
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [message, setMessage] = useState('');

    const generateGrid = useCallback(() => {
        // Weighted letter distribution
        const letters = 'EEEEAAAAOOOIIINNRRSSTTLCUDPMHGBFYWKVXZJQ';
        const size = 4;

        const newGrid: string[][] = [];
        for (let r = 0; r < size; r++) {
            const row: string[] = [];
            for (let c = 0; c < size; c++) {
                row.push(letters[Math.floor(Math.random() * letters.length)]);
            }
            newGrid.push(row);
        }

        setGrid(newGrid);
        setSelected([]);
        setCurrentWord('');
        setFoundWords([]);
        setScore(0);
        setTimeLeft(120);
        setGameOver(false);
        setMessage('');
    }, []);

    useEffect(() => {
        if (gameStarted && !gameOver) generateGrid();
    }, [gameStarted, generateGrid]);

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

    const isAdjacent = (r1: number, c1: number, r2: number, c2: number): boolean => {
        return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1;
    };

    const handleCellClick = (r: number, c: number) => {
        if (gameOver) return;

        // Check if already selected
        const existingIndex = selected.findIndex(s => s.r === r && s.c === c);

        if (existingIndex === selected.length - 1) {
            // Clicked last selected - deselect it
            setSelected(prev => prev.slice(0, -1));
            setCurrentWord(prev => prev.slice(0, -1));
            return;
        }

        if (existingIndex !== -1) {
            // Can't select already selected cell (except last)
            return;
        }

        // Check adjacency
        if (selected.length > 0) {
            const last = selected[selected.length - 1];
            if (!isAdjacent(last.r, last.c, r, c)) {
                return;
            }
        }

        setSelected(prev => [...prev, { r, c }]);
        setCurrentWord(prev => prev + grid[r][c]);
    };

    const submitWord = () => {
        if (currentWord.length < 3) {
            setMessage('Word must be at least 3 letters');
            return;
        }

        if (foundWords.includes(currentWord)) {
            setMessage('Already found!');
            clearSelection();
            return;
        }

        // Check if valid word
        if (COMMON_WORDS.includes(currentWord)) {
            const wordScore = currentWord.split('').reduce((sum, letter) =>
                sum + (LETTER_VALUES[letter] || 1), 0
            ) * currentWord.length;

            setScore(s => s + wordScore);
            setFoundWords(prev => [...prev, currentWord]);
            setMessage(`+${wordScore} points!`);
        } else {
            setMessage('Not a valid word');
        }

        clearSelection();
    };

    const clearSelection = () => {
        setSelected([]);
        setCurrentWord('');
        setTimeout(() => setMessage(''), 1500);
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Word Grid</h1>
                    <div className="flex gap-4">
                        <span className="text-yellow-400 font-bold">🏆 {score}</span>
                        <span className={`font-bold ${timeLeft <= 20 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                            ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </span>
                    </div>
                </div>

                {!gameStarted ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-6">🔤</div>
                        <h2 className="text-2xl font-bold mb-4">Word Grid</h2>
                        <p className="text-slate-400 mb-6 max-w-md mx-auto">
                            Connect adjacent letters to form words. The longer the word, the more points!
                        </p>
                        <button
                            onClick={() => setGameStarted(true)}
                            className="px-8 py-4 bg-indigo-600 rounded-xl text-xl font-bold"
                        >
                            Start Game
                        </button>
                    </div>
                ) : gameOver ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🏆</div>
                        <h2 className="text-3xl font-bold mb-2">Time's Up!</h2>
                        <p className="text-2xl text-yellow-400 mb-4">Score: {score}</p>
                        <p className="text-slate-400 mb-6">Words found: {foundWords.length}</p>
                        <button
                            onClick={generateGrid}
                            className="px-8 py-4 bg-indigo-600 rounded-xl font-bold"
                        >
                            Play Again
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        {/* Current word display */}
                        <div className="h-16 flex items-center justify-center">
                            <span className="text-4xl font-bold tracking-wider text-yellow-400">
                                {currentWord || '_ _ _'}
                            </span>
                        </div>

                        {/* Message */}
                        <div className="h-6 text-center">
                            {message && <span className="text-emerald-400 animate-pulse">{message}</span>}
                        </div>

                        {/* Grid */}
                        <div className="bg-slate-800 p-3 rounded-xl">
                            <div className="grid grid-cols-4 gap-2">
                                {grid.map((row, r) =>
                                    row.map((letter, c) => {
                                        const isSelected = selected.some(s => s.r === r && s.c === c);
                                        const selIndex = selected.findIndex(s => s.r === r && s.c === c);

                                        return (
                                            <button
                                                key={`${r}-${c}`}
                                                onClick={() => handleCellClick(r, c)}
                                                className={`
                                                    w-16 h-16 text-2xl font-bold rounded-lg transition-all
                                                    ${isSelected
                                                        ? 'bg-indigo-500 scale-105 shadow-lg'
                                                        : 'bg-amber-100 text-slate-800 hover:bg-amber-200'}
                                                `}
                                            >
                                                {letter}
                                                {selIndex >= 0 && (
                                                    <span className="absolute top-0 right-1 text-xs">{selIndex + 1}</span>
                                                )}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-4">
                            <button
                                onClick={clearSelection}
                                className="px-6 py-2 bg-slate-700 rounded-lg"
                            >
                                Clear
                            </button>
                            <button
                                onClick={submitWord}
                                disabled={currentWord.length < 3}
                                className="px-6 py-2 bg-emerald-600 rounded-lg disabled:opacity-50"
                            >
                                Submit Word
                            </button>
                        </div>

                        {/* Found words */}
                        <div className="flex flex-wrap gap-1 max-w-xs">
                            {foundWords.map(word => (
                                <span key={word} className="px-2 py-1 bg-emerald-600/30 rounded text-sm">
                                    {word}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
