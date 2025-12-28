'use client';

import React, { useState, useEffect } from 'react';

// Simplified Mahjong Layout logic
// Tile: { id, layer, r, c, value, status }
// Tile dimensions: W=4, H=5 roughly in grid units.
// Overlap logic: standard.

type Tile = {
    id: number;
    layer: number;
    r: number;
    c: number;
    value: string;
    status: 'idle' | 'selected';
};

// Unicode Mahjong Tiles
const TILE_VALUES = [
    '🀀', '🀁', '🀂', '🀃', // Winds
    '🀄', '🀅', '🀆', // Dragons
    '🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏', // Man
    '🀐', '🀑', '🀒', '🀓', '🀔', '🀕', '🀖', '🀗', '🀘', // Pin
    '🀙', '🀚', '🀛', '🀜', '🀝', '🀞', '🀟', '🀠', '🀡', // Bamboo
    '🀢', '🀣', '🀤', '🀥', '🀦', '🀧', '🀨', '🀩', // Flowers/Seasons (Simplified: treat as identicals or simple pairs)
];

// Layout: 4 Layers Pyramid
// L0: 6x8 base
// L1: 4x6
// L2: 2x4
// L3: 1x2 (Top)
// Total tiles must be even.
// L0: 30 tiles?
// Let's define manual positions for a small "Turtle"
// Grid unit: 1. Tile Size: 2x2 grid units for simplicity?
// Let's say Tile is at (r,c). Size 2x2.
// Blocking:
// Top: Tile at (L+1) intersects (r,c).
// Left: Tile at (L, r, c-2). Right: Tile at (L, r, c+2).

export default function MahjongGame() {
    const [tiles, setTiles] = useState<Tile[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [matches, setMatches] = useState(0);

    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        const layout = generateLayout();
        const numPairs = layout.length / 2;

        // Pick values
        const values: string[] = [];
        for (let i = 0; i < numPairs; i++) {
            const val = TILE_VALUES[i % TILE_VALUES.length];
            values.push(val, val);
        }

        // Shuffle values
        for (let i = values.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [values[i], values[j]] = [values[j], values[i]];
        }

        const newTiles = layout.map((pos, idx) => ({
            ...pos,
            id: idx,
            value: values[idx],
            status: 'idle' as const
        }));

        setTiles(newTiles);
        setSelectedId(null);
        setMatches(0);
        setScore(0);
    };

    const generateLayout = () => {
        // Simple Pyramid Layout
        // Coordinate system: r, c. Tile size 2x2.
        const pos: { layer: number, r: number, c: number }[] = [];

        // Layer 0: 5x6 grid of tiles? (r=0,2,4,6,8, c=0,2,4,6,8,10)
        // 5 rows, 6 cols = 30 tiles
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 6; c++) {
                pos.push({ layer: 0, r: r * 2, c: c * 2 });
            }
        }

        // Layer 1: 3x4 grid centered
        // Offset: r+1, c+1 relative to L0?
        // Center of L0 (5 rows -> indices 0..8, center 4. 6 cols -> indices 0..10, center 5)
        // L1 start r=2, c=2. End r=6, c=8.
        // 3 rows (2,4,6), 4 cols (2,4,6,8) -> 12 tiles
        for (let r = 1; r < 4; r++) {
            for (let c = 1; c < 5; c++) {
                pos.push({ layer: 1, r: r * 2, c: c * 2 });
            }
        }

        // Layer 2: 1x2 grid centered
        // r=4, c=4,6 -> 2 tiles
        pos.push({ layer: 2, r: 4, c: 4 });
        pos.push({ layer: 2, r: 4, c: 6 });

        // Total: 30 + 12 + 2 = 44 tiles. Even number. Good.
        return pos;
    };

    const isBlocked = (target: Tile, currentTiles: Tile[]) => {
        // 1. Check Top (Layer + 1)
        const hasTop = currentTiles.some(t =>
            t.layer === target.layer + 1 &&
            Math.abs(t.r - target.r) < 2 && // Overlap R
            Math.abs(t.c - target.c) < 2    // Overlap C
        );
        if (hasTop) return true;

        // 2. Check Sides (Left OR Right must be free)
        // Left Blocker: Same layer, r overlap, c = target.c - 2
        const hasLeft = currentTiles.some(t =>
            t.layer === target.layer &&
            t.id !== target.id &&
            Math.abs(t.r - target.r) < 2 &&
            t.c === target.c - 2
        );

        // Right Blocker: Same layer, r overlap, c = target.c + 2
        const hasRight = currentTiles.some(t =>
            t.layer === target.layer &&
            t.id !== target.id &&
            Math.abs(t.r - target.r) < 2 &&
            t.c === target.c + 2
        );

        return hasLeft && hasRight; // Blocked if BOTH sides have neighbors
    };

    const handleTileClick = (id: number) => {
        const tile = tiles.find(t => t.id === id);
        if (!tile || isBlocked(tile, tiles)) return;

        if (selectedId === null) {
            setSelectedId(id);
            setTiles(prev => prev.map(t => t.id === id ? { ...t, status: 'selected' } : t));
        } else {
            if (selectedId === id) {
                // Deselect
                setSelectedId(null);
                setTiles(prev => prev.map(t => t.id === id ? { ...t, status: 'idle' } : t));
                return;
            }

            const first = tiles.find(t => t.id === selectedId)!;
            const second = tile;

            if (first.value === second.value) {
                // Match! Remove both
                setTiles(prev => prev.filter(t => t.id !== first.id && t.id !== second.id));
                setSelectedId(null);
                setScore(s => s + 100);
                setMatches(m => m + 1);
            } else {
                // Mismatch
                // Deselect first, ignore second? Or select second?
                // Standard: Select second, deselect first.
                setTiles(prev => prev.map(t => {
                    if (t.id === first.id) return { ...t, status: 'idle' };
                    if (t.id === second.id) return { ...t, status: 'selected' };
                    return t;
                }));
                setSelectedId(second.id);
            }
        }
    };

    // Limits computation for render
    // Pre-calculate blocked status for visual feedback?
    // Doing it in render loop is okay for 44 tiles.

    return (
        <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-4xl mx-auto p-4 select-none">

            <div className="flex justify-between w-full mb-8 bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700">
                <button
                    onClick={startNewGame}
                    className="px-4 py-2 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition"
                >
                    Restart
                </button>
                <div className="text-xl font-bold text-amber-200">Mahjong Solitaire</div>
                <div className="text-2xl font-bold text-emerald-400">{score}</div>
            </div>

            {tiles.length === 0 ? (
                <div className="text-center animate-bounce mt-10">
                    <h2 className="text-4xl font-bold text-white mb-4">Cleared! 🎉</h2>
                    <button
                        onClick={startNewGame}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg"
                    >
                        Play Again
                    </button>
                </div>
            ) : (
                <div className="relative w-full h-[400px] bg-emerald-900/50 rounded-xl border border-emerald-800 overflow-hidden shadow-inner">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px]">
                        {tiles.map(tile => {
                            const blocked = isBlocked(tile, tiles);
                            // Calculate px position. grid unit = 40px?
                            // Center offsets
                            const x = tile.c * 30 + (tile.layer * 5); // Shift layers slightly
                            const y = tile.r * 35 - (tile.layer * 5);

                            return (
                                <div
                                    key={tile.id}
                                    onClick={() => handleTileClick(tile.id)}
                                    className={`
                                        absolute w-[50px] h-[65px] flex items-center justify-center text-3xl cursor-pointer transition-transform
                                        ${tile.status === 'selected' ? 'brightness-125 z-50 -translate-y-2' : ''}
                                        ${blocked ? 'brightness-50 cursor-not-allowed bg-slate-400' : 'bg-amber-100 hover:brightness-110'}
                                    `}
                                    style={{
                                        left: `${x + 100}px`, // Offset to center
                                        top: `${y + 50}px`,
                                        zIndex: tile.layer * 10 + (tile.r + tile.c), // Z-order by layer + position
                                        borderRadius: '8px',
                                        boxShadow: `${tile.layer * 2 + 2}px ${tile.layer * 2 + 2}px 5px rgba(0,0,0,0.5)`,
                                        border: '1px solid #d4b483',
                                        borderBottom: '4px solid #bfa070',
                                        borderRight: '4px solid #bfa070',
                                    }}
                                >
                                    <span className={blocked ? 'opacity-50' : ''}>{tile.value}</span>
                                    {/* Layer Badge for debug? No. */}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="mt-8 text-slate-500 text-sm">
                Match pairs of free tiles (tiles with no one on top, and free on left or right).
            </div>

        </div>
    );
}
