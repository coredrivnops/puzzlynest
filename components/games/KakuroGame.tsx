'use client';

import { useState } from 'react';
import Link from 'next/link';

// Simple Kakuro
// 5x5 Grid MVP
// X = Block. X/Sum = Clue.
// W = White cell.

interface Cell {
    type: 'block' | 'clue' | 'input';
    sumDown?: number;
    sumRight?: number;
    val?: number | ''; // User input
}

const EASY_GRID: Cell[][] = [
    // Row 0
    [
        { type: 'block' },
        { type: 'clue', sumDown: 4 },
        { type: 'clue', sumDown: 22 },
        { type: 'block' },
        { type: 'block' }
    ],
    // Row 1
    [
        { type: 'clue', sumRight: 3 },
        { type: 'input', val: '' }, // 1
        { type: 'input', val: '' }, // 2 -> 1+2=3
        { type: 'clue', sumDown: 16 },
        { type: 'clue', sumDown: 3 }
    ],
    // Row 2
    [
        { type: 'clue', sumRight: 18 },
        { type: 'input', val: '' }, // 3
        { type: 'input', val: '' }, // 5?
        { type: 'input', val: '' },
        { type: 'input', val: '' }
    ],
    // ...
    // Let's use a very small, valid, tested grid.
    //    \ 4 \ 3
    // 3  1   2
    // 4  3   1
];

// Valid 3x3 Kakuro (Corner)
//       D4    D3
// R3   [1]   [2]
// R4   [3]   [1]
//
// Cols: 1+3=4. 2+1=3.
// Rows: 1+2=3. 3+1=4.
// All unique 1-9? Yes.

const MVP_GRID_INIT: Cell[][] = [
    [{ type: 'block' }, { type: 'clue', sumDown: 4 }, { type: 'clue', sumDown: 3 }],
    [{ type: 'clue', sumRight: 3 }, { type: 'input', val: '' }, { type: 'input', val: '' }],
    [{ type: 'clue', sumRight: 4 }, { type: 'input', val: '' }, { type: 'input', val: '' }]
];
// Solution:
// [1, 2]
// [3, 1]

export default function KakuroGame() {
    const [grid, setGrid] = useState<Cell[][]>(MVP_GRID_INIT);
    const [won, setWon] = useState(false);

    const handleInput = (r: number, c: number, valStr: string) => {
        if (!/^[1-9]?$/.test(valStr)) return;

        const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
        newGrid[r][c].val = valStr === '' ? '' : parseInt(valStr);
        setGrid(newGrid);
        checkWin(newGrid);
    };

    const checkWin = (g: Cell[][]) => {
        // Hardcoded check for MVP solution
        const v = (r: number, c: number) => g[r][c].val;
        if (v(1, 1) === 1 && v(1, 2) === 2 && v(2, 1) === 3 && v(2, 2) === 1) {
            setWon(true);
        }
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper flex flex-col items-center">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Kakuro</h1>
                </div>

                {won && <div className="text-emerald-400 text-3xl font-bold mb-4 animate-bounce">Solved!</div>}

                <div className="bg-white p-2 rounded shadow-xl border-4 border-slate-800">
                    {grid.map((row, r) => (
                        <div key={r} className="flex">
                            {row.map((cell, c) => (
                                <div key={c} className="w-16 h-16 border border-slate-500 relative">
                                    {cell.type === 'block' && <div className="w-full h-full bg-slate-400"></div>}
                                    {cell.type === 'clue' && (
                                        <div className="w-full h-full bg-slate-300 relative">
                                            <div className="absolute w-[140%] h-[1px] bg-slate-500 top-0 left-0 origin-top-left rotate-45"></div>
                                            {cell.sumRight && <span className="absolute top-1 right-2 font-bold text-xs">{cell.sumRight}</span>}
                                            {cell.sumDown && <span className="absolute bottom-1 left-2 font-bold text-xs">{cell.sumDown}</span>}
                                        </div>
                                    )}
                                    {cell.type === 'input' && (
                                        <input
                                            value={cell.val || ''}
                                            onChange={(e) => handleInput(r, c, e.target.value)}
                                            className="w-full h-full text-center text-3xl font-bold text-slate-800 outline-none focus:bg-yellow-50"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
