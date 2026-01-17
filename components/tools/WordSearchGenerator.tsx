
"use client";

import { useState } from "react";

type Grid = string[][];
type Direction = [number, number];

const DIRECTIONS: Direction[] = [
    [0, 1],   // Right
    [1, 0],   // Down
    [1, 1],   // Diagonal Down-Right
    [-1, 1],  // Diagonal Up-Right
];

export default function WordSearchGenerator() {
    const [title, setTitle] = useState("My Word Search");
    const [wordsInput, setWordsInput] = useState("SUN\nMOON\nSTARS\nPLANET\nCOMET");
    const [grid, setGrid] = useState<Grid>([]);
    const [size, setSize] = useState(15);
    const [isGenerated, setIsGenerated] = useState(false);
    const [placedWords, setPlacedWords] = useState<string[]>([]);

    const generateMesh = () => {
        const words = wordsInput
            .toUpperCase()
            .split(/[\n,]+/)
            .map(w => w.replace(/[^A-Z]/g, ""))
            .filter(w => w.length > 2)
            .sort((a, b) => b.length - a.length);

        const newGrid: string[][] = Array(size).fill(null).map(() => Array(size).fill(""));
        const successfulWords: string[] = [];

        for (const word of words) {
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < 100) {
                const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
                const startRow = Math.floor(Math.random() * size);
                const startCol = Math.floor(Math.random() * size);

                if (canPlace(newGrid, word, startRow, startCol, dir, size)) {
                    place(newGrid, word, startRow, startCol, dir);
                    successfulWords.push(word);
                    placed = true;
                }
                attempts++;
            }
        }

        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (newGrid[r][c] === "") {
                    newGrid[r][c] = letters[Math.floor(Math.random() * letters.length)];
                }
            }
        }

        setGrid(newGrid);
        setPlacedWords(successfulWords);
        setIsGenerated(true);
    };

    const canPlace = (g: Grid, word: string, r: number, c: number, [dr, dc]: Direction, size: number) => {
        const endR = r + (word.length - 1) * dr;
        const endC = c + (word.length - 1) * dc;
        if (endR < 0 || endR >= size || endC < 0 || endC >= size) return false;
        for (let i = 0; i < word.length; i++) {
            const cell = g[r + i * dr][c + i * dc];
            if (cell !== "" && cell !== word[i]) return false;
        }
        return true;
    };

    const place = (g: Grid, word: string, r: number, c: number, [dr, dc]: Direction) => {
        for (let i = 0; i < word.length; i++) {
            g[r + i * dr][c + i * dc] = word[i];
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Input Form */}
            <div className="no-print card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Create Your Puzzle</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Puzzle Title</label>
                        <input
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '8px',
                                color: '#fff',
                            }}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <label style={{ display: 'block', marginTop: '1rem', marginBottom: '0.5rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Word List (one per line)</label>
                        <textarea
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '8px',
                                color: '#fff',
                                fontFamily: 'monospace',
                                height: '150px',
                                resize: 'vertical',
                            }}
                            value={wordsInput}
                            onChange={(e) => setWordsInput(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Grid Size: {size} x {size}</label>
                            <input
                                type="range" min="10" max="25"
                                value={size}
                                onChange={(e) => setSize(parseInt(e.target.value))}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <button onClick={generateMesh} className="btn btn-accent" style={{ marginTop: 'auto' }}>
                            Generate Word Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Generated Puzzle */}
            {isGenerated && (
                <div className="print-section" style={{ background: '#fff', padding: '2rem', borderRadius: '16px', color: '#000' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h1>
                        <p style={{ color: '#666' }}>Find the hidden words!</p>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${size}, 1fr)`,
                            gap: '2px',
                            background: '#000',
                            padding: '4px',
                            width: 'fit-content',
                            margin: '0 auto',
                            borderRadius: '4px',
                        }}
                    >
                        {grid.map((row, r) => (
                            row.map((cell, c) => (
                                <div key={`${r}-${c}`} style={{
                                    width: 'clamp(20px, 4vw, 28px)',
                                    height: 'clamp(20px, 4vw, 28px)',
                                    background: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                                }}>
                                    {cell}
                                </div>
                            ))
                        ))}
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '1.1rem', borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Word Bank</h3>
                        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem', listStyle: 'none', padding: 0 }}>
                            {placedWords.sort().map(w => (
                                <li key={w} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                    <span style={{ width: '14px', height: '14px', border: '1px solid #000', borderRadius: '3px', flexShrink: 0 }}></span>
                                    {w}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {isGenerated && (
                <div className="no-print" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <button onClick={handlePrint} className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                        Print Puzzle
                    </button>
                    <p style={{ marginTop: '0.75rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
                        Tip: Enable &quot;Background Graphics&quot; in your print settings for best results.
                    </p>
                </div>
            )}

            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-section { 
                        box-shadow: none !important; 
                        border-radius: 0 !important; 
                        width: 100% !important;
                        max-width: none !important;
                    }
                    body { background: white !important; }
                    nav, footer { display: none !important; }
                }
            `}</style>
        </div>
    );
}
