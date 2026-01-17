
"use client";

import { useState } from "react";

type Grid = number[][];

const EMPTY_GRID: Grid = Array(9).fill(0).map(() => Array(9).fill(0));

const isValid = (grid: Grid, row: number, col: number, num: number): boolean => {
    for (let x = 0; x < 9; x++) if (grid[row][x] === num && x !== col) return false;
    for (let x = 0; x < 9; x++) if (grid[x][col] === num && x !== row) return false;
    const startRow = 3 * Math.floor(row / 3);
    const startCol = 3 * Math.floor(col / 3);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[startRow + i][startCol + j] === num && (startRow + i !== row || startCol + j !== col)) return false;
        }
    }
    return true;
};

const solve = (grid: Grid): boolean => {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(grid, row, col, num)) {
                        grid[row][col] = num;
                        if (solve(grid)) return true;
                        grid[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
};

export default function SudokuSolver() {
    const [grid, setGrid] = useState<Grid>(JSON.parse(JSON.stringify(EMPTY_GRID)));
    const [initialGrid, setInitialGrid] = useState<Grid>(JSON.parse(JSON.stringify(EMPTY_GRID)));
    const [status, setStatus] = useState<string>("");
    const [hint, setHint] = useState<string | null>(null);

    const handleCellChange = (row: number, col: number, value: string) => {
        const num = parseInt(value) || 0;
        if (num >= 0 && num <= 9) {
            const newGrid = grid.map(r => [...r]);
            newGrid[row][col] = num;
            setGrid(newGrid);
            const newInit = initialGrid.map(r => [...r]);
            newInit[row][col] = num;
            setInitialGrid(newInit);
            setHint(null);
            setStatus("");
        }
    };

    const handleSolve = () => {
        const gridCopy = grid.map(row => [...row]);
        if (solve(gridCopy)) {
            setGrid(gridCopy);
            setStatus("Solved!");
            setHint(null);
        } else {
            setStatus("No solution exists for this board.");
        }
    };

    const handleClear = () => {
        setGrid(JSON.parse(JSON.stringify(EMPTY_GRID)));
        setInitialGrid(JSON.parse(JSON.stringify(EMPTY_GRID)));
        setStatus("");
        setHint(null);
    };

    const generateHint = () => {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (grid[r][c] === 0) {
                    const possibilities: number[] = [];
                    for (let n = 1; n <= 9; n++) {
                        if (isValid(grid, r, c, n)) {
                            possibilities.push(n);
                        }
                    }
                    if (possibilities.length === 1) {
                        setGrid(prev => {
                            const next = prev.map(row => [...row]);
                            next[r][c] = possibilities[0];
                            return next;
                        });
                        setHint(`Cell (Row ${r + 1}, Col ${c + 1}) must be ${possibilities[0]} because it's the only valid number for this spot.`);
                        return;
                    }
                }
            }
        }

        const gridCopy = grid.map(row => [...row]);
        if (solve(gridCopy)) {
            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    if (grid[r][c] === 0) {
                        const answer = gridCopy[r][c];
                        setGrid(prev => {
                            const next = prev.map(row => [...row]);
                            next[r][c] = answer;
                            return next;
                        });
                        setHint(`Cell (Row ${r + 1}, Col ${c + 1}) is ${answer}. (Found via logic lookahead)`);
                        return;
                    }
                }
            }
        } else {
            setStatus("Board appears unsolvable.");
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(9, 1fr)',
                gap: '2px',
                background: 'rgba(255,255,255,0.2)',
                padding: '4px',
                borderRadius: '12px',
                maxWidth: '360px',
                width: '100%'
            }}>
                {grid.map((row, rIndex) => (
                    row.map((cell, cIndex) => {
                        const isThickRight = (cIndex + 1) % 3 === 0 && cIndex !== 8;
                        const isThickBottom = (rIndex + 1) % 3 === 0 && rIndex !== 8;
                        return (
                            <input
                                key={`${rIndex}-${cIndex}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={cell === 0 ? "" : cell}
                                onChange={(e) => handleCellChange(rIndex, cIndex, e.target.value)}
                                style={{
                                    width: '100%',
                                    aspectRatio: '1',
                                    textAlign: 'center',
                                    fontSize: 'clamp(1rem, 4vw, 1.5rem)',
                                    fontWeight: 700,
                                    background: (Math.floor(rIndex / 3) + Math.floor(cIndex / 3)) % 2 === 0 ? 'rgba(30,30,60,0.9)' : 'rgba(40,40,80,0.9)',
                                    color: initialGrid[rIndex][cIndex] !== 0 ? '#fff' : '#818cf8',
                                    border: 'none',
                                    borderRight: isThickRight ? '3px solid rgba(255,255,255,0.4)' : 'none',
                                    borderBottom: isThickBottom ? '3px solid rgba(255,255,255,0.4)' : 'none',
                                    outline: 'none',
                                }}
                            />
                        );
                    })
                ))}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                <button onClick={handleSolve} className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.75rem 1.25rem' }}>
                    Solve Complete Board
                </button>
                <button onClick={generateHint} className="btn btn-accent" style={{ fontSize: '0.9rem', padding: '0.75rem 1.25rem' }}>
                    Get Hint (Explain)
                </button>
                <button onClick={handleClear} className="btn btn-ghost" style={{ fontSize: '0.9rem', padding: '0.75rem 1.25rem' }}>
                    Clear Board
                </button>
            </div>

            {/* Status */}
            {status && (
                <div style={{ padding: '1rem', background: status === 'Solved!' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', borderRadius: '8px', width: '100%', maxWidth: '400px', textAlign: 'center', color: status === 'Solved!' ? '#10b981' : '#ef4444' }}>
                    {status}
                </div>
            )}

            {/* Hint */}
            {hint && (
                <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.15)', borderLeft: '4px solid #f59e0b', borderRadius: '0 8px 8px 0', width: '100%', maxWidth: '400px' }}>
                    <p style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '0.25rem' }}>Logic Hint:</p>
                    <p style={{ color: 'rgba(255,255,255,0.8)' }}>{hint}</p>
                </div>
            )}

            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', textAlign: 'center' }}>
                Enter your current puzzle numbers into the grid above, then try our logic helper!
            </p>
        </div>
    );
}
