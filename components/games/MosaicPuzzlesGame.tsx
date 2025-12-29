'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Cell {
    value: number | null; // Number of filled neighbors expected
    filled: boolean;
    locked: boolean;
}

interface Puzzle {
    size: number;
    grid: (number | null)[][];
    solution: boolean[][];
}

// Generate puzzles
const generatePuzzle = (size: number = 5): Puzzle => {
    // Create a random solution pattern
    const solution: boolean[][] = [];
    for (let r = 0; r < size; r++) {
        solution[r] = [];
        for (let c = 0; c < size; c++) {
            solution[r][c] = Math.random() > 0.5;
        }
    }

    // Calculate clue numbers based on solution
    const grid: (number | null)[][] = [];
    for (let r = 0; r < size; r++) {
        grid[r] = [];
        for (let c = 0; c < size; c++) {
            // Count filled neighbors (including self)
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
                        if (solution[nr][nc]) count++;
                    }
                }
            }
            // Only show some clues (about 40%)
            grid[r][c] = Math.random() < 0.4 ? count : null;
        }
    }

    return { size, grid, solution };
};

const PUZZLES: Puzzle[] = [
    generatePuzzle(5),
    generatePuzzle(6),
    generatePuzzle(7),
];

export default function MosaicPuzzlesGame() {
    const [puzzleIndex, setPuzzleIndex] = useState(0);
    const [cells, setCells] = useState<Cell[][]>([]);
    const [solved, setSolved] = useState(false);
    const [mistakes, setMistakes] = useState(0);
    const [showHint, setShowHint] = useState(false);

    // Initialize puzzle
    const initPuzzle = useCallback((index: number) => {
        const puzzle = PUZZLES[index] || generatePuzzle(5);
        const newCells: Cell[][] = [];

        for (let r = 0; r < puzzle.size; r++) {
            newCells[r] = [];
            for (let c = 0; c < puzzle.size; c++) {
                newCells[r][c] = {
                    value: puzzle.grid[r][c],
                    filled: false,
                    locked: false
                };
            }
        }

        setCells(newCells);
        setSolved(false);
        setMistakes(0);
        setShowHint(false);
    }, []);

    useEffect(() => {
        initPuzzle(puzzleIndex);
    }, [puzzleIndex, initPuzzle]);

    // Count filled neighbors
    const countFilledNeighbors = (cells: Cell[][], r: number, c: number): number => {
        let count = 0;
        const size = cells.length;

        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
                    if (cells[nr][nc].filled) count++;
                }
            }
        }

        return count;
    };

    // Check if puzzle is solved
    const checkSolution = (cells: Cell[][]): boolean => {
        for (let r = 0; r < cells.length; r++) {
            for (let c = 0; c < cells[r].length; c++) {
                if (cells[r][c].value !== null) {
                    const count = countFilledNeighbors(cells, r, c);
                    if (count !== cells[r][c].value) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    // Toggle cell
    const toggleCell = (row: number, col: number) => {
        if (solved || cells[row][col].locked) return;

        const newCells = cells.map((r, ri) =>
            r.map((c, ci) => {
                if (ri === row && ci === col) {
                    return { ...c, filled: !c.filled };
                }
                return c;
            })
        );

        setCells(newCells);

        // Check if solved
        if (checkSolution(newCells)) {
            setSolved(true);
        }
    };

    // Mark cell as definitely empty
    const markEmpty = (row: number, col: number, e: React.MouseEvent) => {
        e.preventDefault();
        if (solved || cells[row][col].value !== null) return;

        const newCells = cells.map((r, ri) =>
            r.map((c, ci) => {
                if (ri === row && ci === col) {
                    return { ...c, locked: !c.locked, filled: false };
                }
                return c;
            })
        );

        setCells(newCells);
    };

    // Get cell status for coloring
    const getCellStatus = (row: number, col: number): 'valid' | 'invalid' | 'neutral' => {
        const cell = cells[row][col];
        if (cell.value === null) return 'neutral';

        const count = countFilledNeighbors(cells, row, col);

        if (count === cell.value) return 'valid';
        if (count > cell.value) return 'invalid';
        return 'neutral';
    };

    // Show hint
    const giveHint = () => {
        const puzzle = PUZZLES[puzzleIndex] || PUZZLES[0];

        // Find a cell that doesn't match solution
        for (let r = 0; r < cells.length; r++) {
            for (let c = 0; c < cells[r].length; c++) {
                if (cells[r][c].filled !== puzzle.solution[r][c]) {
                    const newCells = cells.map((row, ri) =>
                        row.map((cell, ci) => {
                            if (ri === r && ci === c) {
                                return { ...cell, filled: puzzle.solution[r][c] };
                            }
                            return cell;
                        })
                    );
                    setCells(newCells);
                    setMistakes(m => m + 1);
                    return;
                }
            }
        }
    };

    const size = cells.length;
    const cellSize = size <= 5 ? 60 : size <= 6 ? 50 : 42;

    return (
        <div style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '0.5rem'
            }}>
                <div>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Puzzle: </span>
                    <span style={{ color: '#a5b4fc', fontWeight: 'bold' }}>{puzzleIndex + 1}</span>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}> / {PUZZLES.length}</span>
                </div>
                <div>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Hints used: </span>
                    <span style={{ color: mistakes > 0 ? '#f59e0b' : '#10b981' }}>{mistakes}</span>
                </div>
            </div>

            {/* Status message */}
            {solved && (
                <div style={{
                    textAlign: 'center',
                    padding: '1rem',
                    marginBottom: '1rem',
                    background: 'rgba(16, 185, 129, 0.2)',
                    borderRadius: '8px',
                    color: '#10b981'
                }}>
                    🎉 Puzzle Solved! {mistakes === 0 ? 'Perfect!' : ''}
                </div>
            )}

            {/* Grid */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1.5rem'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
                    gap: '2px',
                    background: '#1e293b',
                    padding: '2px',
                    borderRadius: '8px'
                }}>
                    {cells.map((row, r) =>
                        row.map((cell, c) => {
                            const status = getCellStatus(r, c);

                            return (
                                <button
                                    key={`${r}-${c}`}
                                    onClick={() => toggleCell(r, c)}
                                    onContextMenu={(e) => markEmpty(r, c, e)}
                                    disabled={solved}
                                    style={{
                                        width: `${cellSize}px`,
                                        height: `${cellSize}px`,
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: solved ? 'default' : 'pointer',
                                        background: cell.filled
                                            ? '#6366f1'
                                            : cell.locked
                                                ? 'rgba(255,255,255,0.1)'
                                                : 'rgba(255,255,255,0.05)',
                                        color: cell.value !== null
                                            ? status === 'valid'
                                                ? '#10b981'
                                                : status === 'invalid'
                                                    ? '#ef4444'
                                                    : 'white'
                                            : 'transparent',
                                        fontSize: cellSize > 50 ? '1.25rem' : '1rem',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.15s ease',
                                        position: 'relative'
                                    }}
                                >
                                    {cell.value !== null ? cell.value : ''}
                                    {cell.locked && !cell.filled && (
                                        <span style={{
                                            position: 'absolute',
                                            color: 'rgba(255,255,255,0.3)',
                                            fontSize: '1.5rem'
                                        }}>
                                            ×
                                        </span>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Controls */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.75rem',
                flexWrap: 'wrap'
            }}>
                {puzzleIndex > 0 && (
                    <button
                        onClick={() => setPuzzleIndex(i => i - 1)}
                        className="btn btn-ghost"
                        style={{ padding: '0.75rem 1.25rem' }}
                    >
                        ← Previous
                    </button>
                )}

                <button
                    onClick={giveHint}
                    disabled={solved}
                    className="btn btn-ghost"
                    style={{ padding: '0.75rem 1.25rem' }}
                >
                    💡 Hint
                </button>

                <button
                    onClick={() => initPuzzle(puzzleIndex)}
                    className="btn btn-ghost"
                    style={{ padding: '0.75rem 1.25rem' }}
                >
                    🔄 Reset
                </button>

                {(solved || puzzleIndex < PUZZLES.length - 1) && (
                    <button
                        onClick={() => {
                            if (puzzleIndex < PUZZLES.length - 1) {
                                setPuzzleIndex(i => i + 1);
                            } else {
                                // Generate new puzzle
                                PUZZLES.push(generatePuzzle(5 + Math.floor(Math.random() * 3)));
                                setPuzzleIndex(PUZZLES.length - 1);
                            }
                        }}
                        className="btn btn-primary"
                        style={{ padding: '0.75rem 1.25rem' }}
                    >
                        {puzzleIndex < PUZZLES.length - 1 ? 'Next →' : 'New Puzzle'}
                    </button>
                )}
            </div>

            {/* Instructions */}
            <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.6)'
            }}>
                <strong>How to Play:</strong>
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                    <li><strong>Click</strong> a cell to fill it (turns blue)</li>
                    <li><strong>Right-click</strong> to mark as definitely empty (×)</li>
                    <li>Numbers show how many filled cells surround that cell (including itself)</li>
                    <li><span style={{ color: '#10b981' }}>Green</span> = correct count, <span style={{ color: '#ef4444' }}>Red</span> = too many</li>
                    <li>Fill cells to satisfy all the number clues!</li>
                </ul>
            </div>
        </div>
    );
}
