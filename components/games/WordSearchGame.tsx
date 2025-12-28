'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Generate Word Search grid
function generateWordSearch(words: string[], gridSize: number = 10) {
    const grid: string[][] = Array(gridSize).fill(null).map(() =>
        Array(gridSize).fill('')
    );

    const placedWords: { word: string; cells: [number, number][] }[] = [];

    // Place each word
    for (const word of words) {
        const placed = placeWord(grid, word.toUpperCase(), gridSize);
        if (placed) {
            placedWords.push({ word: word.toUpperCase(), cells: placed });
        }
    }

    // Fill empty spaces with random letters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (grid[r][c] === '') {
                grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
            }
        }
    }

    return { grid, placedWords };
}

function placeWord(grid: string[][], word: string, gridSize: number): [number, number][] | null {
    const directions = [
        [0, 1],   // right
        [1, 0],   // down
        [1, 1],   // diagonal down-right
    ];

    // Try random positions
    for (let attempt = 0; attempt < 100; attempt++) {
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const startRow = Math.floor(Math.random() * gridSize);
        const startCol = Math.floor(Math.random() * gridSize);

        const endRow = startRow + dir[0] * (word.length - 1);
        const endCol = startCol + dir[1] * (word.length - 1);

        if (endRow >= gridSize || endCol >= gridSize) continue;

        // Check if word fits
        let fits = true;
        const cells: [number, number][] = [];

        for (let i = 0; i < word.length; i++) {
            const r = startRow + dir[0] * i;
            const c = startCol + dir[1] * i;
            cells.push([r, c]);

            if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
                fits = false;
                break;
            }
        }

        if (fits) {
            for (let i = 0; i < word.length; i++) {
                const [r, c] = cells[i];
                grid[r][c] = word[i];
            }
            return cells;
        }
    }

    return null;
}

const WORD_SETS = [
    ['APPLE', 'BANANA', 'ORANGE', 'GRAPE', 'MELON'],
    ['CAT', 'DOG', 'BIRD', 'FISH', 'LION'],
    ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PINK'],
    ['SUN', 'MOON', 'STAR', 'SKY', 'CLOUD'],
];

export default function WordSearchGame() {
    const [grid, setGrid] = useState<string[][]>([]);
    const [words, setWords] = useState<{ word: string; cells: [number, number][] }[]>([]);
    const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
    const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
    const [startCell, setStartCell] = useState<[number, number] | null>(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [gameComplete, setGameComplete] = useState(false);

    const initGame = useCallback(() => {
        const wordSet = WORD_SETS[Math.floor(Math.random() * WORD_SETS.length)];
        const { grid: newGrid, placedWords } = generateWordSearch(wordSet, 8);
        setGrid(newGrid);
        setWords(placedWords);
        setFoundWords(new Set());
        setSelectedCells(new Set());
        setGameComplete(false);
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const cellKey = (r: number, c: number) => `${r}-${c}`;

    const handleCellMouseDown = (r: number, c: number) => {
        setIsSelecting(true);
        setStartCell([r, c]);
        setSelectedCells(new Set([cellKey(r, c)]));
    };

    const handleCellMouseEnter = (r: number, c: number) => {
        if (!isSelecting || !startCell) return;

        // Build selection from start to current
        const [sr, sc] = startCell;
        const dr = Math.sign(r - sr);
        const dc = Math.sign(c - sc);

        // Only allow straight lines
        if (dr !== 0 && dc !== 0 && Math.abs(r - sr) !== Math.abs(c - sc)) return;
        if (dr === 0 && dc === 0) return;

        const newSelection = new Set<string>();
        let cr = sr, cc = sc;

        while (true) {
            newSelection.add(cellKey(cr, cc));
            if (cr === r && cc === c) break;
            cr += dr || 0;
            cc += dc || 0;
            if (cr < 0 || cr >= grid.length || cc < 0 || cc >= grid[0].length) break;
        }

        setSelectedCells(newSelection);
    };

    const handleMouseUp = () => {
        if (!isSelecting) return;
        setIsSelecting(false);

        // Check if selection matches a word
        for (const { word, cells } of words) {
            if (foundWords.has(word)) continue;

            const wordCellKeys = new Set(cells.map(([r, c]) => cellKey(r, c)));
            const reverseCellKeys = new Set(cells.reverse().map(([r, c]) => cellKey(r, c)));

            if (
                (selectedCells.size === wordCellKeys.size &&
                    [...selectedCells].every(k => wordCellKeys.has(k))) ||
                (selectedCells.size === reverseCellKeys.size &&
                    [...selectedCells].every(k => reverseCellKeys.has(k)))
            ) {
                const newFound = new Set(foundWords);
                newFound.add(word);
                setFoundWords(newFound);

                if (newFound.size === words.length) {
                    setGameComplete(true);
                }
                return;
            }
        }

        // No match - clear selection
        setSelectedCells(new Set());
    };

    const isCellInFoundWord = (r: number, c: number) => {
        for (const { word, cells } of words) {
            if (foundWords.has(word)) {
                if (cells.some(([wr, wc]) => wr === r && wc === c)) {
                    return true;
                }
            }
        }
        return false;
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                        ← Back
                    </Link>
                    <h1 className="game-title">Word Search</h1>
                    <div className="game-score">
                        {foundWords.size}/{words.length}
                    </div>
                </div>

                {gameComplete ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                        <h2 style={{ marginBottom: '1rem' }}>All Words Found!</h2>
                        <button className="btn btn-primary" onClick={initGame}>
                            New Puzzle
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Word List */}
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.75rem',
                            justifyContent: 'center',
                            marginBottom: '1.5rem',
                        }}>
                            {words.map(({ word }) => (
                                <span
                                    key={word}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: foundWords.has(word) ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '100px',
                                        textDecoration: foundWords.has(word) ? 'line-through' : 'none',
                                        opacity: foundWords.has(word) ? 0.6 : 1,
                                    }}
                                >
                                    {word}
                                </span>
                            ))}
                        </div>

                        {/* Grid */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${grid[0]?.length || 8}, 1fr)`,
                                gap: '4px',
                                maxWidth: '400px',
                                margin: '0 auto',
                                userSelect: 'none',
                            }}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            {grid.map((row, r) =>
                                row.map((cell, c) => (
                                    <div
                                        key={cellKey(r, c)}
                                        onMouseDown={() => handleCellMouseDown(r, c)}
                                        onMouseEnter={() => handleCellMouseEnter(r, c)}
                                        style={{
                                            aspectRatio: '1',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: isCellInFoundWord(r, c)
                                                ? 'rgba(16, 185, 129, 0.4)'
                                                : selectedCells.has(cellKey(r, c))
                                                    ? 'rgba(99, 102, 241, 0.5)'
                                                    : 'rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            fontSize: '1.25rem',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s ease',
                                        }}
                                    >
                                        {cell}
                                    </div>
                                ))
                            )}
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                            <button className="btn btn-ghost" onClick={initGame}>
                                🔄 New Puzzle
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
