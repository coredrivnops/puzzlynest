'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

// Simple Sudoku puzzle (0 = empty cell)
const EASY_PUZZLE = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

const SOLUTION = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

export default function SudokuGame() {
    const [grid, setGrid] = useState<number[][]>(() =>
        EASY_PUZZLE.map(row => [...row])
    );
    const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [isComplete, setIsComplete] = useState(false);

    const isFixed = (row: number, col: number) => EASY_PUZZLE[row][col] !== 0;

    const checkComplete = useCallback((newGrid: number[][]) => {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (newGrid[r][c] !== SOLUTION[r][c]) {
                    return false;
                }
            }
        }
        return true;
    }, []);

    const handleCellClick = (row: number, col: number) => {
        if (!isFixed(row, col)) {
            setSelectedCell([row, col]);
        }
    };

    const handleNumberInput = (num: number) => {
        if (!selectedCell) return;

        const [row, col] = selectedCell;
        if (isFixed(row, col)) return;

        const newGrid = grid.map(r => [...r]);
        newGrid[row][col] = num;
        setGrid(newGrid);

        // Check for errors
        const newErrors = new Set<string>();
        if (num !== 0 && num !== SOLUTION[row][col]) {
            newErrors.add(`${row}-${col}`);
        }
        setErrors(newErrors);

        // Check if puzzle is complete
        if (checkComplete(newGrid)) {
            setIsComplete(true);
        }
    };

    const resetGame = () => {
        setGrid(EASY_PUZZLE.map(row => [...row]));
        setSelectedCell(null);
        setErrors(new Set());
        setIsComplete(false);
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                        ← Back
                    </Link>
                    <h1 className="game-title">Sudoku</h1>
                    <span style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(245, 158, 11, 0.2)',
                        borderRadius: '100px',
                        color: '#fbbf24',
                        fontSize: '0.9rem',
                    }}>
                        Easy
                    </span>
                </div>

                {isComplete ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                        <h2 style={{ marginBottom: '1rem' }}>Puzzle Complete!</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
                            Excellent work! Your brain thanks you.
                        </p>
                        <button className="btn btn-primary" onClick={resetGame}>
                            Play Again
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="sudoku-grid">
                            {grid.map((row, rowIndex) =>
                                row.map((cell, colIndex) => (
                                    <button
                                        key={`${rowIndex}-${colIndex}`}
                                        className={`sudoku-cell 
                      ${isFixed(rowIndex, colIndex) ? 'fixed' : ''} 
                      ${selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex ? 'selected' : ''}
                      ${errors.has(`${rowIndex}-${colIndex}`) ? 'error' : ''}
                    `}
                                        onClick={() => handleCellClick(rowIndex, colIndex)}
                                        style={{
                                            color: errors.has(`${rowIndex}-${colIndex}`) ? '#ef4444' : undefined,
                                            borderRight: (colIndex + 1) % 3 === 0 && colIndex < 8 ? '2px solid rgba(255,255,255,0.3)' : undefined,
                                            borderBottom: (rowIndex + 1) % 3 === 0 && rowIndex < 8 ? '2px solid rgba(255,255,255,0.3)' : undefined,
                                        }}
                                    >
                                        {cell !== 0 ? cell : ''}
                                    </button>
                                ))
                            )}
                        </div>

                        <div className="number-pad">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                <button
                                    key={num}
                                    className="number-btn"
                                    onClick={() => handleNumberInput(num)}
                                >
                                    {num}
                                </button>
                            ))}
                            <button
                                className="number-btn"
                                onClick={() => handleNumberInput(0)}
                                style={{ background: 'rgba(239, 68, 68, 0.2)' }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                            <button className="btn btn-ghost" onClick={resetGame}>
                                🔄 Reset Puzzle
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
