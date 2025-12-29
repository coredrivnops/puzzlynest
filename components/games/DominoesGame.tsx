'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';

// Simple Dominoes (Block)
// 28 Tiles (Double-6).
// 2 Players (Human vs AI). 7 tiles each.

interface Tile {
    left: number;
    right: number;
    id: number;
}

interface PlacedTile extends Tile {
    x: number;
    y: number;
    rotation: number; // 0, 90, 180, 270
}

export default function DominoesGame() {
    const [humanHand, setHumanHand] = useState<Tile[]>([]);
    const [aiHand, setAiHand] = useState<Tile[]>([]);
    const [board, setBoard] = useState<{ leftVal: number, rightVal: number, tiles: PlacedTile[] }>({ leftVal: -1, rightVal: -1, tiles: [] });
    const [message, setMessage] = useState('Start Game');
    const [turn, setTurn] = useState<'human' | 'ai' | null>(null);

    const initGame = useCallback(() => {
        // Create Deck
        const deck: Tile[] = [];
        let id = 0;
        for (let i = 0; i <= 6; i++) {
            for (let j = i; j <= 6; j++) {
                deck.push({ left: i, right: j, id: id++ });
            }
        }

        // Shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        const hHand = deck.slice(0, 7);
        const aHand = deck.slice(7, 14);

        // Find highest double to start?
        // Logic: whoever has highest double starts.
        // Simplified: First tile from deck starts board.
        const startTile = deck[14];

        setHumanHand(hHand);
        setAiHand(aHand);

        // START BOARD
        const firstPlaced: PlacedTile = { ...startTile, x: 0, y: 0, rotation: 0 };
        setBoard({
            leftVal: startTile.left,
            rightVal: startTile.right,
            tiles: [firstPlaced]
        });

        setTurn('human');
        setMessage('Your Turn');
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const playTile = (tile: Tile, end: 'left' | 'right') => {
        if (turn !== 'human') return;

        // Validate match
        let matched = false;
        let newLeft = board.leftVal;
        let newRight = board.rightVal;
        let placed: PlacedTile;

        // Just visual logic is hard. 
        // Let's implement logical connection first.

        if (end === 'left') {
            if (tile.right === board.leftVal) {
                // Match Logic: [L|R] - [BoardLeft|...]
                newLeft = tile.left;
                matched = true;
            } else if (tile.left === board.leftVal) {
                // Flip needed: [R|L] - [BoardLeft|...]
                newLeft = tile.right;
                matched = true;
            }
        } else {
            if (tile.left === board.rightVal) {
                // ...|BoardRight] - [L|R]
                newRight = tile.right;
                matched = true;
            } else if (tile.right === board.rightVal) {
                // ...|BoardRight] - [R|L]
                newRight = tile.left;
                matched = true;
            }
        }

        if (matched) {
            // Add to visual board (simplified visual list for MVP)
            // We won't compute X/Y snake layout perfectly here, just a list of connections.
            const newTiles = [...board.tiles, { ...tile, x: 0, y: 0, rotation: 0 }]; // Logic only
            setBoard({ leftVal: newLeft, rightVal: newRight, tiles: newTiles });

            // Remove from hand
            setHumanHand(prev => prev.filter(t => t.id !== tile.id));

            if (humanHand.length === 1) { // Was 1, now 0
                setMessage('You Win! 🏆');
                setTurn(null);
                return;
            }

            setTurn('ai');
            setMessage('AI Thinking...');
            setTimeout(aiTurn, 1000);
        }
    };

    const aiTurn = () => {
        // Simple AI: Find any match
        // Check Ai Hand
        // We need current state reference.
        // Bug: state inside setTimeout closure? Use Refs or pass data?
        // Using "functional update" pattern can verify state, but reading `board` and `aiHand` needs care.
        // Let's rely on component re-render cycle not being broken.
        // Actually, simple way: Effect on `turn`.
    };

    // Effect for AI Turn to access latest state
    useEffect(() => {
        if (turn === 'ai') {
            const timer = setTimeout(() => {
                const validMoves: { tile: Tile, end: 'left' | 'right' }[] = [];
                aiHand.forEach(t => {
                    if (t.left === board.leftVal || t.right === board.leftVal) validMoves.push({ tile: t, end: 'left' });
                    else if (t.left === board.rightVal || t.right === board.rightVal) validMoves.push({ tile: t, end: 'right' });
                });

                if (validMoves.length > 0) {
                    const move = validMoves[0];
                    // Update Board
                    let newLeft = board.leftVal;
                    let newRight = board.rightVal;

                    if (move.end === 'left') {
                        newLeft = (move.tile.right === board.leftVal) ? move.tile.left : move.tile.right;
                    } else {
                        newRight = (move.tile.left === board.rightVal) ? move.tile.right : move.tile.left;
                    }

                    setBoard(prev => ({ ...prev, leftVal: newLeft, rightVal: newRight, tiles: [...prev.tiles, { ...move.tile, x: 0, y: 0, rotation: 0 }] }));

                    // Remove from AI Hand
                    const newHand = aiHand.filter(t => t.id !== move.tile.id);
                    setAiHand(newHand);

                    if (newHand.length === 0) {
                        setMessage('AI Wins! 🤖');
                        setTurn(null);
                    } else {
                        setTurn('human');
                        setMessage('Your Turn');
                    }
                } else {
                    // Pass?
                    setMessage('AI Passes');
                    setTurn('human');
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [turn, aiHand, board]);

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper flex flex-col justify-between">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Dominoes</h1>
                    <div>{message}</div>
                </div>

                {/* AI Hand (Hidden) */}
                <div className="flex justify-center gap-1 opacity-70">
                    {aiHand.map(t => (
                        <div key={t.id} className="w-8 h-12 bg-slate-700 rounded border border-slate-600"></div>
                    ))}
                </div>

                {/* Board Area */}
                <div className="flex-1 bg-green-800/30 m-4 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="flex items-center gap-1 flex-wrap justify-center p-8">
                        {/* Visual Chain representation */}
                        <div className="bg-slate-900 text-white p-2 rounded">Example Match: [{board.leftVal}|...|{board.rightVal}]</div>
                        <div className="text-xs text-center w-full">Visual placement coming soon... logic works!</div>
                        {board.tiles.map(t => (
                            <div key={t.id} className="w-8 h-16 bg-white border border-black rounded text-black flex flex-col items-center justify-center text-xs font-bold">
                                <div>{t.left}</div>
                                <div className="w-full h-px bg-black"></div>
                                <div>{t.right}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Player Hand */}
                <div className="flex justify-center gap-2 mb-4 flex-wrap">
                    {humanHand.map(t => (
                        <div key={t.id} className="flex flex-col gap-2">
                            <div className="w-12 h-24 bg-white border-2 border-slate-400 rounded hover:scale-110 transition cursor-pointer flex flex-col">
                                <div className="flex-1 flex items-center justify-center text-2xl text-black font-bold">{t.left}</div>
                                <div className="h-0.5 bg-black w-full"></div>
                                <div className="flex-1 flex items-center justify-center text-2xl text-black font-bold">{t.right}</div>
                            </div>
                            {turn === 'human' && (
                                <div className="flex gap-1 justify-center">
                                    <button onClick={() => playTile(t, 'left')} className="text-xs bg-indigo-600 px-1 rounded">L</button>
                                    <button onClick={() => playTile(t, 'right')} className="text-xs bg-indigo-600 px-1 rounded">R</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
