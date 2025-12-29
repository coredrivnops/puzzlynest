'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Match Three Zen - relaxing match-3 puzzle
const GEMS = ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣'];

export default function MatchThreeGame() {
    const [grid, setGrid] = useState<string[][]>([]);
    const [selected, setSelected] = useState<{ r: number, c: number } | null>(null);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(30);
    const [gameOver, setGameOver] = useState(false);
    const [animating, setAnimating] = useState(false);

    const initGrid = () => {
        const size = 6;
        let newGrid: string[][];

        // Keep generating until no initial matches
        do {
            newGrid = Array(size).fill(null).map(() =>
                Array(size).fill(null).map(() =>
                    GEMS[Math.floor(Math.random() * GEMS.length)]
                )
            );
        } while (hasMatches(newGrid));

        setGrid(newGrid);
        setScore(0);
        setMoves(30);
        setGameOver(false);
        setSelected(null);
    };

    useEffect(() => {
        initGrid();
    }, []);

    const hasMatches = (g: string[][]): boolean => {
        // Check horizontals
        for (let r = 0; r < g.length; r++) {
            for (let c = 0; c < g[r].length - 2; c++) {
                if (g[r][c] && g[r][c] === g[r][c + 1] && g[r][c] === g[r][c + 2]) {
                    return true;
                }
            }
        }
        // Check verticals
        for (let r = 0; r < g.length - 2; r++) {
            for (let c = 0; c < g[r].length; c++) {
                if (g[r][c] && g[r][c] === g[r + 1][c] && g[r][c] === g[r + 2][c]) {
                    return true;
                }
            }
        }
        return false;
    };

    const findAndClearMatches = (g: string[][]): { newGrid: string[][], matched: number } => {
        const toRemove: boolean[][] = g.map(row => row.map(() => false));
        let matched = 0;

        // Find horizontal matches
        for (let r = 0; r < g.length; r++) {
            for (let c = 0; c < g[r].length - 2; c++) {
                if (g[r][c] && g[r][c] === g[r][c + 1] && g[r][c] === g[r][c + 2]) {
                    toRemove[r][c] = toRemove[r][c + 1] = toRemove[r][c + 2] = true;
                }
            }
        }

        // Find vertical matches
        for (let r = 0; r < g.length - 2; r++) {
            for (let c = 0; c < g[r].length; c++) {
                if (g[r][c] && g[r][c] === g[r + 1][c] && g[r][c] === g[r + 2][c]) {
                    toRemove[r][c] = toRemove[r + 1][c] = toRemove[r + 2][c] = true;
                }
            }
        }

        // Count and remove
        const newGrid = g.map((row, r) =>
            row.map((cell, c) => {
                if (toRemove[r][c]) {
                    matched++;
                    return '';
                }
                return cell;
            })
        );

        return { newGrid, matched };
    };

    const dropGems = (g: string[][]): string[][] => {
        const newGrid = g.map(row => [...row]);

        for (let c = 0; c < newGrid[0].length; c++) {
            // Collect non-empty gems from bottom to top
            const column = [];
            for (let r = newGrid.length - 1; r >= 0; r--) {
                if (newGrid[r][c]) column.push(newGrid[r][c]);
            }

            // Fill from bottom with existing gems, then new ones
            for (let r = newGrid.length - 1; r >= 0; r--) {
                if (column.length > 0) {
                    newGrid[r][c] = column.shift()!;
                } else {
                    newGrid[r][c] = GEMS[Math.floor(Math.random() * GEMS.length)];
                }
            }
        }

        return newGrid;
    };

    const processMatches = async (g: string[][]) => {
        setAnimating(true);
        let currentGrid = g;
        let totalMatched = 0;

        while (hasMatches(currentGrid)) {
            const { newGrid, matched } = findAndClearMatches(currentGrid);
            totalMatched += matched;
            setGrid(newGrid);
            await new Promise(r => setTimeout(r, 300));

            currentGrid = dropGems(newGrid);
            setGrid(currentGrid);
            await new Promise(r => setTimeout(r, 300));
        }

        if (totalMatched > 0) {
            setScore(s => s + totalMatched * 10);
        }

        setAnimating(false);
    };

    const handleCellClick = (r: number, c: number) => {
        if (animating || gameOver) return;

        if (!selected) {
            setSelected({ r, c });
            return;
        }

        // Check if adjacent
        const dr = Math.abs(selected.r - r);
        const dc = Math.abs(selected.c - c);

        if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
            // Swap
            const newGrid = grid.map(row => [...row]);
            [newGrid[selected.r][selected.c], newGrid[r][c]] = [newGrid[r][c], newGrid[selected.r][selected.c]];

            // Check if swap creates match
            if (hasMatches(newGrid)) {
                setGrid(newGrid);
                setMoves(m => {
                    const newMoves = m - 1;
                    if (newMoves <= 0) {
                        setTimeout(() => setGameOver(true), 500);
                    }
                    return newMoves;
                });
                processMatches(newGrid);
            } else {
                // Invalid swap - swap back
                setTimeout(() => {
                    setGrid(grid); // Reset to original
                }, 200);
            }
        }

        setSelected(null);
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Zen Match</h1>
                    <div className="flex gap-4">
                        <span className="text-yellow-400 font-bold">🏆 {score}</span>
                        <span className={`font-bold ${moves <= 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                            🎯 {moves}
                        </span>
                    </div>
                </div>

                {gameOver ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">✨</div>
                        <h2 className="text-3xl font-bold mb-2">Game Over!</h2>
                        <p className="text-2xl text-yellow-400 mb-6">Score: {score}</p>
                        <button
                            onClick={initGrid}
                            className="px-8 py-4 bg-indigo-600 rounded-xl font-bold"
                        >
                            Play Again
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <div className="bg-slate-800 p-3 rounded-xl">
                            <div className="grid grid-cols-6 gap-1">
                                {grid.map((row, r) =>
                                    row.map((cell, c) => (
                                        <button
                                            key={`${r}-${c}`}
                                            onClick={() => handleCellClick(r, c)}
                                            disabled={animating}
                                            className={`
                                                w-12 h-12 text-3xl rounded-lg transition-all
                                                ${selected?.r === r && selected?.c === c
                                                    ? 'bg-yellow-500 scale-110'
                                                    : 'bg-slate-700 hover:bg-slate-600'}
                                                ${cell === '' ? 'opacity-0' : ''}
                                            `}
                                        >
                                            {cell}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <p className="text-center text-slate-400 mt-4 text-sm">
                    Swap adjacent gems to match 3 or more!
                </p>
            </div>
        </div>
    );
}
