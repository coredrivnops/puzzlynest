'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Treasure Hunt - find hidden treasures in a grid
export default function TreasureHuntGame() {
    const [grid, setGrid] = useState<('hidden' | 'empty' | 'treasure' | 'bomb')[][]>([]);
    const [revealed, setRevealed] = useState<boolean[][]>([]);
    const [score, setScore] = useState(0);
    const [treasuresFound, setTreasuresFound] = useState(0);
    const [totalTreasures, setTotalTreasures] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [hintsLeft, setHintsLeft] = useState(3);

    const initGame = () => {
        const size = 5;
        const numTreasures = 5;
        const numBombs = 3;

        // Create empty grid
        const newGrid: ('hidden' | 'empty' | 'treasure' | 'bomb')[][] =
            Array(size).fill(null).map(() => Array(size).fill('empty'));

        // Place treasures
        let placed = 0;
        while (placed < numTreasures) {
            const r = Math.floor(Math.random() * size);
            const c = Math.floor(Math.random() * size);
            if (newGrid[r][c] === 'empty') {
                newGrid[r][c] = 'treasure';
                placed++;
            }
        }

        // Place bombs
        placed = 0;
        while (placed < numBombs) {
            const r = Math.floor(Math.random() * size);
            const c = Math.floor(Math.random() * size);
            if (newGrid[r][c] === 'empty') {
                newGrid[r][c] = 'bomb';
                placed++;
            }
        }

        setGrid(newGrid);
        setRevealed(Array(size).fill(null).map(() => Array(size).fill(false)));
        setScore(0);
        setTreasuresFound(0);
        setTotalTreasures(numTreasures);
        setGameOver(false);
        setWon(false);
        setHintsLeft(3);
    };

    useEffect(() => {
        initGame();
    }, []);

    const revealCell = (r: number, c: number) => {
        if (revealed[r][c] || gameOver) return;

        const newRevealed = revealed.map(row => [...row]);
        newRevealed[r][c] = true;
        setRevealed(newRevealed);

        const cell = grid[r][c];

        if (cell === 'treasure') {
            setScore(s => s + 50);
            setTreasuresFound(t => {
                const newCount = t + 1;
                if (newCount >= totalTreasures) {
                    setWon(true);
                    setGameOver(true);
                }
                return newCount;
            });
        } else if (cell === 'bomb') {
            setGameOver(true);
        } else {
            setScore(s => Math.max(0, s - 5));
        }
    };

    const useHint = () => {
        if (hintsLeft <= 0 || gameOver) return;

        // Find an unrevealed treasure
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                if (grid[r][c] === 'treasure' && !revealed[r][c]) {
                    // Flash hint
                    const cell = document.getElementById(`cell-${r}-${c}`);
                    if (cell) {
                        cell.classList.add('animate-ping');
                        setTimeout(() => cell.classList.remove('animate-ping'), 1000);
                    }
                    setHintsLeft(h => h - 1);
                    return;
                }
            }
        }
    };

    const getCellEmoji = (r: number, c: number) => {
        if (!revealed[r][c]) return '❓';
        switch (grid[r][c]) {
            case 'treasure': return '💎';
            case 'bomb': return '💣';
            default: return '🕳️';
        }
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Treasure Hunt</h1>
                    <div className="flex gap-4">
                        <span className="text-yellow-400 font-bold">💎 {treasuresFound}/{totalTreasures}</span>
                        <span className="text-emerald-400 font-bold">🏆 {score}</span>
                    </div>
                </div>

                <div className="text-center mb-4">
                    <button
                        onClick={useHint}
                        disabled={hintsLeft <= 0 || gameOver}
                        className="px-4 py-2 bg-indigo-600 rounded-lg disabled:opacity-50"
                    >
                        💡 Hint ({hintsLeft} left)
                    </button>
                </div>

                {/* Game grid */}
                <div className="flex justify-center">
                    <div className="bg-amber-800 p-4 rounded-xl shadow-xl">
                        <div className="grid grid-cols-5 gap-2">
                            {grid.map((row, r) =>
                                row.map((cell, c) => (
                                    <button
                                        key={`${r}-${c}`}
                                        id={`cell-${r}-${c}`}
                                        onClick={() => revealCell(r, c)}
                                        disabled={revealed[r][c] || gameOver}
                                        className={`
                                            w-14 h-14 text-3xl rounded-lg transition-all
                                            ${revealed[r][c]
                                                ? cell === 'treasure'
                                                    ? 'bg-yellow-400'
                                                    : cell === 'bomb'
                                                        ? 'bg-red-600'
                                                        : 'bg-amber-600'
                                                : 'bg-amber-700 hover:bg-amber-600'}
                                            ${!revealed[r][c] && !gameOver ? 'hover:scale-105' : ''}
                                        `}
                                    >
                                        {getCellEmoji(r, c)}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Game over overlay */}
                {gameOver && (
                    <div className="text-center mt-6">
                        <div className="text-5xl mb-4">{won ? '🏆' : '💥'}</div>
                        <h2 className="text-2xl font-bold mb-2">
                            {won ? 'All Treasures Found!' : 'Boom! Hit a bomb!'}
                        </h2>
                        <p className="text-slate-400 mb-4">Final Score: {score}</p>
                        <button
                            onClick={initGame}
                            className="px-6 py-3 bg-emerald-600 rounded-lg font-bold"
                        >
                            Play Again
                        </button>
                    </div>
                )}

                <p className="text-center text-slate-400 mt-4 text-sm">
                    Find all treasures 💎 without hitting bombs 💣!
                </p>
            </div>
        </div>
    );
}
