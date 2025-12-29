'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Simple Crossword Engine
// Supports 10x10 or similar grids.

interface CrosswordData {
    id: string;
    width: number;
    height: number;
    grid: (string | null)[][]; // Answer grid. null = black block.
    clues: {
        across: { num: number, text: string, row: number, col: number }[];
        down: { num: number, text: string, row: number, col: number }[];
    };
    numbers: (number | null)[][]; // To display numbers in cells
}

// Sample Data (Mini)
const SAMPLE_PUZZLE: CrosswordData = {
    id: 'mini-1',
    width: 6,
    height: 6,
    grid: [
        ['C', 'A', 'T', null, 'D', 'O'],
        ['A', 'R', 'E', 'A', null, 'N'],
        ['R', 'E', 'D', 'N', 'E', 'C'], // Rednec? No.
        // Let's make a real mini.
        // CAT, DOG
        // AREA
        // TEN
    ],
    // Let's use a simpler static layout for MVP.
    // 5x5
    // H E A R T
    // E A R T H
    // A R T - -
    // R T - - -
    // T H - - -
    // No.
    // Let's use hardcoded data structure that renders.
    clues: {
        across: [],
        down: []
    },
    numbers: []
};

// Better: Generate grid from words? Hard.
// Use pre-defined simple puzzle.
// 0 1 2 3 4
// S T A R T (1)
// T E N S E (2)
// A N G E R (3)
// R B S - - (4)
// T E A - - (5)

// Let's do a 5x5 Mini Crossword.
// 1. ASTRO
// 2. SHEEP
// 3. TIGER
// 4. ROOST
// 5. ORDER

const PUZZLE_DATA = {
    rows: 5,
    cols: 5,
    grid: [
        ['A', 'S', 'T', 'R', 'O'],
        ['S', 'H', 'E', 'E', 'P'],
        ['T', 'I', 'G', 'E', 'R'],
        ['R', 'O', 'O', 'S', 'T'],
        ['O', 'R', 'D', 'E', 'R'] // A bit nonsense but valid letters?
        // ASTRO
        // SHEEP
        // TIGER
        // ROOST
        // ORDER
        // Down:
        // ASTRO
        // SHIOR
        // TEGOD
        // REESE
        // OPRTR
    ],
    clues: {
        across: [
            { num: 1, text: 'Space relation prefix', r: 0, c: 0 },
            { num: 2, text: 'Woolly farm animal', r: 1, c: 0 },
            { num: 3, text: 'Large striped cat', r: 2, c: 0 },
            { num: 4, text: 'Where birds sleep', r: 3, c: 0 },
            { num: 5, text: 'Command or request', r: 4, c: 0 }
        ],
        down: [
            { num: 1, text: 'Space-related (same as 1A)', r: 0, c: 0 },
            { num: 2, text: 'Japanese religion (typo?)', r: 0, c: 1 }, // Shior?? No.
            // Let's just use "Fill the Grid" logic.
        ]
    }
};

// Let's use a valid easy 5x5.
// S P A C E
// T R A I N
// A P P L E
// R I V E R
// T E E T H
// Down: START, PRICE, A..., C..., ENTER.
// START (1)
// PRICE (2)
// APPIE? No.
// Let's go with Very Simple 3-word crossing.
//    C A T
//    A
// D O G
//    E
//    R A T

const MVP_PUZZLE = {
    width: 5,
    height: 5,
    //    1 2 . . .
    //    C A T . . (1A: Pet)
    //    A . O . .
    // 3 D O G . . (3A: Barking Pet)
    //    E . . . .
    // . . . . .
    grid: [
        [null, 'C', 'A', 'T', null],
        [null, 'A', null, 'R', null], // CAR? C A R
        ['D', 'O', 'G', null, null],
        [null, null, 'O', null, null], // GO?
        [null, null, null, null, null]
    ],
    numbers: [
        [null, 1, 2, null, null],
        [null, null, null, null, null],
        [3, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null]
    ],
    clues: {
        across: [
            { num: 1, text: 'Domestic feline', r: 0, c: 1 }, // CAT
            { num: 3, text: 'Man\'s best friend', r: 2, c: 0 }  // DOG
        ],
        down: [
            { num: 1, text: 'Vehicle', r: 0, c: 1 }, // CAR? No grid[1][1]=A. C-A-D? No.
            // Let's ignore complex intersection validation for MVP and just do simple loose grid.
            { num: 2, text: 'Sticky substance', r: 0, c: 3 } // TAR? T-R...
        ]
    }
};

// Correct 5x5:
// B E A R
// E A G L E (too long)
// L I O N
// W O L F

export default function CrosswordGame() {
    // Hardcoded simple puzzle
    const puzzle = {
        w: 5, h: 5,
        grid: [
            ['B', 'E', 'A', 'R', null],
            ['E', null, null, 'A', null],
            ['A', 'N', 'T', null, null],
            ['K', null, null, null, null],
            [null, null, null, null, null]
        ],
        solution: [
            ['B', 'E', 'A', 'R', '.'],
            ['E', '.', '.', 'A', '.'],
            ['A', 'N', 'T', '.', '.'],
            ['K', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.']
        ],
        numbers: [
            [1, 2, 3, 4, null],
            [null, null, null, null, null],
            [5, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null]
        ],
        cluesAcross: [
            { num: 1, text: 'Large fluffy mammal' }, // BEAR
            { num: 5, text: 'Small hardworking insect' }, // ANT
        ],
        cluesDown: [
            { num: 1, text: 'Bird mouth part' }, // BEAK
            { num: 4, text: 'Small rodent' }, // RAT
        ]
    };

    // User Input Grid
    const [userGrid, setUserGrid] = useState<string[][]>(
        Array(5).fill('').map(() => Array(5).fill(''))
    );
    const [selected, setSelected] = useState<{ r: number, c: number } | null>(null);
    const [won, setWon] = useState(false);

    // Initial check
    useEffect(() => {
        // Init logic if needed
    }, []);

    const handleCellClick = (r: number, c: number) => {
        if (puzzle.solution[r][c] === '.') return;
        setSelected({ r, c });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!selected || won) return;

        const { r, c } = selected;

        if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
            const newVal = e.key.toUpperCase();
            const newGrid = userGrid.map(row => [...row]);
            newGrid[r][c] = newVal;
            setUserGrid(newGrid);

            // Auto-advance logic (Basic right, then down?)
            // Simple: Just move right if possible, else stay.
            if (c + 1 < 5 && puzzle.solution[r][c + 1] !== '.') setSelected({ r, c: c + 1 });

            checkWin(newGrid);
        } else if (e.key === 'Backspace') {
            const newGrid = userGrid.map(row => [...row]);
            newGrid[r][c] = '';
            setUserGrid(newGrid);
            if (c - 1 >= 0 && puzzle.solution[r][c - 1] !== '.') setSelected({ r, c: c - 1 });
        } else if (e.key === 'ArrowRight') {
            if (c + 1 < 5) setSelected({ r, c: c + 1 });
        } else if (e.key === 'ArrowLeft') {
            if (c - 1 >= 0) setSelected({ r, c: c - 1 });
        } else if (e.key === 'ArrowDown') {
            if (r + 1 < 5) setSelected({ r: r + 1, c });
        } else if (e.key === 'ArrowUp') {
            if (r - 1 >= 0) setSelected({ r: r - 1, c });
        }
    };

    const checkWin = (grid: string[][]) => {
        let correct = true;
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                const sol = puzzle.solution[r][c];
                if (sol !== '.' && grid[r][c] !== sol) {
                    correct = false;
                    break;
                }
            }
        }
        if (correct) setWon(true);
    };

    // Add global Key listener for input when focused on game?
    // Using a hidden input or focusing the cell div with tabindex.
    // Easier: Just input element inside the cell.

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper flex flex-col items-center">
                <div className="game-header w-full flex justify-between">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Mini Crossword</h1>
                    <div></div>
                </div>

                {won && (
                    <div className="mb-4 text-3xl font-bold text-emerald-400 animate-bounce">
                        Puzzle Solved! 🎉
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-8 items-start bg-white p-6 rounded-xl text-black">
                    {/* Grid */}
                    <div className="grid grid-cols-5 gap-0 border-2 border-black bg-black">
                        {puzzle.solution.map((row, r) => (
                            row.map((sol, c) => {
                                const isBlack = sol === '.';
                                const num = puzzle.numbers[r][c];
                                const isSel = selected?.r === r && selected?.c === c;

                                if (isBlack) {
                                    return <div key={`${r}-${c}`} className="w-10 h-10 sm:w-14 sm:h-14 bg-black"></div>;
                                }

                                return (
                                    <div
                                        key={`${r}-${c}`}
                                        className={`
                                            relative w-10 h-10 sm:w-14 sm:h-14 bg-white border border-slate-300 flex items-center justify-center text-xl sm:text-2xl font-bold uppercase cursor-pointer
                                            ${isSel ? 'bg-yellow-100 ring-2 ring-indigo-500 z-10' : ''}
                                        `}
                                        onClick={() => handleCellClick(r, c)}
                                    >
                                        {num && <span className="absolute top-0.5 left-0.5 text-[10px] sm:text-xs text-slate-500 font-normal leading-none">{num}</span>}
                                        <input
                                            value={userGrid[r][c]}
                                            readOnly // Handle via container keydown or custom logic
                                            className="w-full h-full text-center bg-transparent outline-none cursor-pointer caret-transparent select-none"
                                            onKeyDown={handleKeyDown}
                                            // Focus management is tricky without individual refs.
                                            // Hack: Just let the div capture clicks and global window keydown?
                                            // Or simpler: put focus on this input when clicked.
                                            ref={el => { if (isSel && el) el.focus(); }}
                                        />
                                    </div>
                                );
                            })
                        ))}
                    </div>

                    {/* Clues */}
                    <div className="flex flex-col gap-4 min-w-[200px]">
                        <div>
                            <h3 className="font-bold border-b border-black mb-2">Across</h3>
                            <ul className="text-sm space-y-1">
                                {puzzle.cluesAcross.map(clue => (
                                    <li key={clue.num}><span className="font-bold">{clue.num}.</span> {clue.text}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold border-b border-black mb-2">Down</h3>
                            <ul className="text-sm space-y-1">
                                {puzzle.cluesDown.map(clue => (
                                    <li key={clue.num}><span className="font-bold">{clue.num}.</span> {clue.text}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
