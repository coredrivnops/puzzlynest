'use client';

import React, { useState, useEffect, useCallback } from 'react';

// --- Types ---
type CellState = 0 | 1 | 2; // 0: Empty, 1: Filled, 2: Crossed
type Difficulty = 'easy' | 'medium';
type Level = { name: string; grid: number[][] };

// --- Levels ---
const LEVELS: Record<Difficulty, Level[]> = {
    easy: [
        {
            name: 'Heart',
            grid: [
                [0, 1, 0, 1, 0],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1],
                [0, 1, 1, 1, 0],
                [0, 0, 1, 0, 0]
            ]
        },
        {
            name: 'Smiley',
            grid: [
                [0, 1, 0, 1, 0],
                [0, 1, 0, 1, 0],
                [0, 0, 0, 0, 0],
                [1, 0, 0, 0, 1],
                [0, 1, 1, 1, 0]
            ]
        },
        {
            name: 'House',
            grid: [
                [0, 0, 1, 0, 0],
                [0, 1, 1, 1, 0],
                [1, 1, 1, 1, 1],
                [0, 1, 1, 1, 0],
                [0, 1, 0, 1, 0]
            ]
        }
    ],
    medium: [
        {
            name: 'Duck',
            grid: [
                [0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
                [0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
                [0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
                [0, 1, 1, 1, 0, 1, 0, 0, 0, 0],
                [0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                [0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                [0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
                [1, 1, 0, 0, 0, 1, 1, 0, 0, 0]
            ]
        },
        {
            name: 'Anchor',
            grid: [
                [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
                [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
                [0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
                [0, 1, 0, 0, 1, 1, 0, 0, 1, 0],
                [0, 1, 0, 0, 1, 1, 0, 0, 1, 0],
                [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
                [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
                [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                [0, 0, 1, 1, 1, 1, 1, 1, 0, 0]
            ]
        }
    ]
};

// --- Helper: Generate Clues ---
function getClues(grid: number[][]) {
    const rows = grid.map(row => {
        const clues: number[] = [];
        let count = 0;
        row.forEach(cell => {
            if (cell === 1) {
                count++;
            } else if (count > 0) {
                clues.push(count);
                count = 0;
            }
        });
        if (count > 0) clues.push(count);
        return clues.length > 0 ? clues : [0];
    });

    const cols: number[][] = [];
    if (grid.length > 0) {
        for (let j = 0; j < grid[0].length; j++) {
            const clue: number[] = [];
            let count = 0;
            for (let i = 0; i < grid.length; i++) {
                if (grid[i][j] === 1) {
                    count++;
                } else if (count > 0) {
                    clue.push(count);
                    count = 0;
                }
            }
            if (count > 0) clue.push(count);
            cols.push(clue.length > 0 ? clue : [0]);
        }
    }

    return { rows, cols };
}

// --- Components ---
export default function NonogramGame() {
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
    const [grid, setGrid] = useState<CellState[][]>([]);
    const [solution, setSolution] = useState<number[][]>([]);
    const [clues, setClues] = useState<{ rows: number[][]; cols: number[][] }>({ rows: [], cols: [] });
    const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
    const [mistakes, setMistakes] = useState(0);

    // Initialize level
    useEffect(() => {
        const level = LEVELS[difficulty][currentLevelIdx];
        const newSolution = level.grid;
        const rows = newSolution.length;
        const cols = newSolution[0].length;

        setSolution(newSolution);
        setGrid(Array(rows).fill(null).map(() => Array(cols).fill(0)));
        setClues(getClues(newSolution));
        setGameState('playing');
        setMistakes(0);
    }, [difficulty, currentLevelIdx]);

    const handleCellClick = (r: number, c: number, action: 'fill' | 'cross') => {
        if (gameState !== 'playing') return;

        setGrid(prev => {
            const newGrid = prev.map(row => [...row]);
            const current = newGrid[r][c];

            // Logic:
            // If action is Fill: Toggle 0 -> 1 -> 0 (ignore 2)
            // If action is Cross: Toggle 0 -> 2 -> 0 (ignore 1)
            // But we can simplify: just check what we want to do.

            let newValue: CellState = current;

            if (action === 'fill') {
                if (current === 1) newValue = 0;
                else if (current === 0) newValue = 1;
                // If it's crossed (2), do nothing or uncross? Let's assume uncross and fill to be friendly? 
                // Traditional: Right click to cross, Left to fill. 
                else if (current === 2) newValue = 1;
            } else { // cross
                if (current === 2) newValue = 0;
                else if (current === 0) newValue = 2;
                else if (current === 1) newValue = 2;
            }

            newGrid[r][c] = newValue;
            return newGrid;
        });
    };

    // Check win condition
    useEffect(() => {
        if (gameState !== 'playing' || !grid.length) return;

        // Check if all Filled cells match Solution
        // We ignore Crossed cells essentially, but strictly speaking,
        // The user wins if the pattern of 1s matches the solution pattern of 1s.
        // 0s and 2s are functionally equivalent for the solution check.

        let won = true;
        for (let i = 0; i < solution.length; i++) {
            for (let j = 0; j < solution[0].length; j++) {
                const isFilledInSolution = solution[i][j] === 1;
                const isFilledInGrid = grid[i][j] === 1;
                if (isFilledInSolution !== isFilledInGrid) {
                    won = false;
                    break;
                }
            }
        }

        if (won) {
            setGameState('won');
        }
    }, [grid, solution]);

    // Prevent context menu on grid
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-4xl mx-auto p-4 select-none">

            {/* Header Controls */}
            <div className="flex justify-between w-full mb-6">
                <div className="flex gap-2">
                    <button
                        onClick={() => setDifficulty('easy')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${difficulty === 'easy' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                    >
                        Easy (5x5)
                    </button>
                    <button
                        onClick={() => setDifficulty('medium')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${difficulty === 'medium' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                    >
                        Medium (10x10)
                    </button>
                </div>
                <button
                    onClick={() => {
                        const max = LEVELS[difficulty].length;
                        setCurrentLevelIdx((currentLevelIdx + 1) % max);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium"
                >
                    Next Puzzle
                </button>
            </div>

            {/* Game Board */}
            <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700" onContextMenu={handleContextMenu}>
                <div className="flex flex-col items-center">

                    {/* Top Clues */}
                    <div className="flex mb-1">
                        {/* Empty corner */}
                        <div className="w-[100px] shrink-0"></div>

                        {/* Clue Columns */}
                        <div className="flex" style={{ width: solution[0]?.length * 32 }}>
                            {clues.cols.map((colClues, i) => (
                                <div key={i} className="flex flex-col justify-end items-center w-8 gap-1 pb-2 border-r border-slate-700/50">
                                    {colClues.map((num, idx) => (
                                        <span key={idx} className="text-sm font-bold text-slate-400">{num}</span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Left Clues + Grid */}
                    <div className="flex">
                        {/* Left Clues */}
                        <div className="flex flex-col w-[100px] border-t border-slate-700/50">
                            {clues.rows.map((rowClues, i) => (
                                <div key={i} className="flex justify-end items-center h-8 pr-3 gap-2 border-b border-slate-700/50">
                                    {rowClues.map((num, idx) => (
                                        <span key={idx} className="text-sm font-bold text-slate-400">{num}</span>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* The Grid */}
                        <div className="flex flex-col border-t border-l border-slate-600">
                            {grid.map((row, r) => (
                                <div key={r} className="flex h-8">
                                    {row.map((cell, c) => (
                                        <div
                                            key={c}
                                            onMouseDown={(e) => {
                                                if (e.button === 0) handleCellClick(r, c, 'fill'); // Left click
                                                else if (e.button === 2) handleCellClick(r, c, 'cross'); // Right click
                                            }}
                                            className={`
                                                w-8 h-8 border-r border-b border-slate-600 cursor-pointer transition-colors duration-100
                                                flex items-center justify-center
                                                ${cell === 1 ? 'bg-indigo-500' : 'bg-slate-800 hover:bg-slate-700'}
                                                ${/* Tick mark for every 5 lines for easier reading? Optional */ ''}
                                                ${(r + 1) % 5 === 0 && r !== grid.length - 1 ? 'border-b-2 border-b-slate-500' : ''}
                                                ${(c + 1) % 5 === 0 && c !== grid[0].length - 1 ? 'border-r-2 border-r-slate-500' : ''}
                                            `}
                                        >
                                            {cell === 2 && (
                                                <span className="text-slate-500 text-lg select-none">✕</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Victory Message */}
            {gameState === 'won' && (
                <div className="mt-8 text-center animate-bounce">
                    <h2 className="text-3xl font-bold text-emerald-400">Puzzle Solved! 🎉</h2>
                    <p className="text-slate-400 mt-2">Level: {LEVELS[difficulty][currentLevelIdx].name}</p>
                </div>
            )}

            {/* Instructions */}
            <div className="mt-8 text-sm text-slate-500 flex gap-6">
                <span className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-indigo-500 rounded-sm"></span>
                    Left Click: Fill
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-4 h-4 flex items-center justify-center text-slate-500 font-bold border border-slate-600 rounded-sm">✕</span>
                    Right Click: Cross
                </span>
            </div>

        </div>
    );
}
