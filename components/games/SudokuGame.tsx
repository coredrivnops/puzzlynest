'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import type { Game } from '@/lib/games';

// --- DATA ---

const PUZZLE_9x9 = [
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

const SOLUTION_9x9 = [
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

const PUZZLE_6x6 = [
    [0, 0, 3, 0, 1, 0],
    [5, 6, 0, 3, 2, 0],
    [0, 5, 4, 2, 0, 3],
    [2, 0, 6, 4, 5, 0],
    [0, 1, 2, 0, 4, 5],
    [0, 4, 0, 1, 0, 0],
];
const SOLUTION_6x6 = [
    [4, 2, 3, 5, 1, 6],
    [5, 6, 1, 3, 2, 4],
    [1, 5, 4, 2, 6, 3],
    [2, 3, 6, 4, 5, 1],
    [3, 1, 2, 6, 4, 5],
    [6, 4, 5, 1, 3, 2],
];

export default function SudokuGame({ game }: { game?: Game }) {
    const isMini = game?.id === 'sudoku-mini';
    const gridSize = isMini ? 6 : 9;
    const initialPuzzle = isMini ? PUZZLE_6x6 : PUZZLE_9x9;
    const solution = isMini ? SOLUTION_6x6 : SOLUTION_9x9;
    const boxRows = isMini ? 2 : 3;
    const boxCols = isMini ? 3 : 3;

    const [grid, setGrid] = useState<number[][]>(() => initialPuzzle.map(row => [...row]));
    const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [isComplete, setIsComplete] = useState(false);

    // Reset when game mode changes
    useEffect(() => {
        resetGame();
    }, [isMini]);

    const isFixed = (row: number, col: number) => initialPuzzle[row][col] !== 0;

    const checkComplete = useCallback((newGrid: number[][]) => {
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (newGrid[r][c] !== solution[r][c]) {
                    return false;
                }
            }
        }
        return true;
    }, [gridSize, solution]);

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
        if (num !== 0 && num !== solution[row][col]) {
            newErrors.add(`${row}-${col}`);
        }
        setErrors(newErrors);

        // Check if puzzle is complete
        if (checkComplete(newGrid)) {
            setIsComplete(true);
        }
    };

    const resetGame = () => {
        setGrid(initialPuzzle.map(row => [...row]));
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
                    <h1 className="game-title">{isMini ? 'Mini Sudoku' : 'Sudoku Classic'}</h1>
                    <span style={{
                        padding: '0.5rem 1rem',
                        background: isMini ? 'rgba(99, 102, 241, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        borderRadius: '100px',
                        color: isMini ? '#818cf8' : '#fbbf24',
                        fontSize: '0.9rem',
                    }}>
                        {isMini ? '6x6' : 'Easy 9x9'}
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
                        <div
                            className="sudoku-grid"
                            style={{
                                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                                maxWidth: isMini ? '400px' : '500px'
                            }}
                        >
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
                                            // Grid Lines
                                            borderRight: (colIndex + 1) % boxCols === 0 && colIndex < gridSize - 1 ? '3px solid rgba(255,255,255,0.5)' : undefined,
                                            borderBottom: (rowIndex + 1) % boxRows === 0 && rowIndex < gridSize - 1 ? '3px solid rgba(255,255,255,0.5)' : undefined,
                                        }}
                                    >
                                        {cell !== 0 ? cell : ''}
                                    </button>
                                ))
                            )}
                        </div>

                        <div className="number-pad">
                            {Array.from({ length: gridSize }, (_, i) => i + 1).map(num => (
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
