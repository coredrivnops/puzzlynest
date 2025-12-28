'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';

interface Card {
    suit: string;
    value: number;
    display: string;
    color: string;
    id: number;
}

const SUITS = [
    { name: '♠', color: 'black' },
    { name: '♥', color: 'red' },
    { name: '♦', color: 'red' },
    { name: '♣', color: 'black' },
];

const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export default function FreeCellGame() {
    const [tableau, setTableau] = useState<Card[][]>([]); // 8
    const [freeCells, setFreeCells] = useState<(Card | null)[]>([null, null, null, null]); // 4
    const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []]); // 4
    const [selected, setSelected] = useState<{ zone: 'tableau' | 'free', idx: number } | null>(null);
    const [moves, setMoves] = useState(0);

    const initGame = useCallback(() => {
        const deck: Card[] = [];
        let id = 0;
        SUITS.forEach(s => {
            VALUES.forEach((v, i) => {
                deck.push({
                    suit: s.name,
                    value: i + 1,
                    display: v,
                    color: s.color,
                    id: id++
                });
            });
        });

        // Shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        const newTableau: Card[][] = Array(8).fill(null).map(() => []);
        deck.forEach((card, i) => {
            newTableau[i % 8].push(card);
        });

        setTableau(newTableau);
        setFreeCells([null, null, null, null]);
        setFoundations([[], [], [], []]);
        setMoves(0);
        setSelected(null);
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const handleCardClick = (zone: 'tableau' | 'free', idx: number) => {
        // Source selection
        if (!selected) {
            if (zone === 'tableau') {
                if (tableau[idx].length === 0) return;
                setSelected({ zone, idx });
            } else {
                if (freeCells[idx] === null) return;
                setSelected({ zone, idx });
            }
            return;
        }

        // Action: Move Selected -> Target (zone, idx)

        // 1. Identify Moving Card
        let card: Card;
        if (selected.zone === 'tableau') {
            card = tableau[selected.idx][tableau[selected.idx].length - 1];
        } else {
            card = freeCells[selected.idx]!;
        }

        // 2. Deselect if same
        if (selected.zone === zone && selected.idx === idx) {
            setSelected(null);
            return;
        }

        // 3. Try Move
        let success = false;

        if (zone === 'free') {
            // Move to FreeCell
            if (freeCells[idx] === null) {
                // Execute
                const newFree = [...freeCells];
                newFree[idx] = card;
                setFreeCells(newFree);
                success = true;
            }
        } else {
            // Move to Tableau
            const pile = tableau[idx];
            let valid = false;

            if (pile.length === 0) {
                valid = true; // Any card to empty tableau
            } else {
                const top = pile[pile.length - 1];
                // Rule: Alternating Color, Descending Value
                if (top.color !== card.color && top.value === card.value + 1) {
                    valid = true;
                }
            }

            if (valid) {
                const newTableau = [...tableau];
                newTableau[idx] = [...pile, card];
                setTableau(newTableau);
                success = true;
            }
        }

        if (success) {
            // Remove from source
            if (selected.zone === 'tableau') {
                setTableau(prev => {
                    const next = [...prev];
                    next[selected.idx] = next[selected.idx].slice(0, -1);
                    return next;
                });
            } else {
                setFreeCells(prev => {
                    const next = [...prev];
                    next[selected.idx] = null;
                    return next;
                });
            }
            setMoves(m => m + 1);
            setSelected(null);
        } else {
            // If failed, maybe we clicked a valid new source?
            // If clicked occupied free cell or occupied tableau (that wasn't valid target)
            if (zone === 'tableau' && tableau[idx].length > 0) {
                setSelected({ zone, idx });
            } else if (zone === 'free' && freeCells[idx] !== null) {
                setSelected({ zone, idx });
            }
        }
    };

    const handleFoundationClick = (fIdx: number) => {
        if (!selected) return;

        // Get Card
        let card: Card;
        if (selected.zone === 'tableau') {
            card = tableau[selected.idx][tableau[selected.idx].length - 1];
        } else {
            card = freeCells[selected.idx]!;
        }

        const pile = foundations[fIdx];
        let valid = false;

        if (pile.length === 0) {
            if (card.value === 1) valid = true; // Ace
        } else {
            const top = pile[pile.length - 1];
            if (top.suit === card.suit && top.value === card.value - 1) valid = true;
        }

        if (valid) {
            // Execute
            setFoundations(prev => {
                const next = [...prev];
                next[fIdx] = [...pile, card];
                return next;
            });

            // Remove Source
            if (selected.zone === 'tableau') {
                setTableau(prev => {
                    const next = [...prev];
                    next[selected.idx] = next[selected.idx].slice(0, -1);
                    return next;
                });
            } else {
                setFreeCells(prev => {
                    const next = [...prev];
                    next[selected.idx] = null;
                    return next;
                });
            }
            setMoves(m => m + 1);
            setSelected(null);
        }
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">FreeCell</h1>
                    <div className="text-white font-bold">Moves: {moves}</div>
                </div>

                <div className="flex flex-col h-full gap-4">
                    {/* Top Row: FreeCells --- Foundations */}
                    <div className="flex justify-between px-2 sm:px-8">
                        {/* Free Cells */}
                        <div className="flex gap-2">
                            {freeCells.map((card, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleCardClick('free', i)}
                                    className={`
                                          w-[60px] h-[80px] rounded border-2 border-slate-500 bg-slate-800/30 flex items-center justify-center cursor-pointer
                                          ${selected?.zone === 'free' && selected.idx === i ? 'ring-4 ring-yellow-400' : ''}
                                      `}
                                >
                                    {card && <CardView card={card} />}
                                </div>
                            ))}
                        </div>

                        {/* Foundations */}
                        <div className="flex gap-2">
                            {foundations.map((pile, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleFoundationClick(i)}
                                    className="w-[60px] h-[80px] rounded border-2 border-slate-500 bg-slate-800/30 flex items-center justify-center cursor-pointer text-slate-600 font-bold"
                                >
                                    {pile.length > 0 ? (
                                        <CardView card={pile[pile.length - 1]} />
                                    ) : (
                                        <span className="text-2xl">{SUITS[i].name}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tableau */}
                    <div className="flex justify-center gap-2 px-2 h-full">
                        {tableau.map((pile, i) => (
                            <div key={i} className="flex-1 min-w-[40px] max-w-[70px] flex flex-col items-center relative">
                                {/* Click area for empty column */}
                                {pile.length === 0 && (
                                    <div
                                        onClick={() => handleCardClick('tableau', i)}
                                        className="w-full h-24 border border-dashed border-slate-700 rounded bg-slate-800/10 cursor-pointer"
                                    ></div>
                                )}

                                {pile.map((card, cIdx) => (
                                    <div
                                        key={card.id}
                                        onClick={() => {
                                            if (cIdx === pile.length - 1) handleCardClick('tableau', i);
                                        }}
                                        className={`
                                                absolute w-full aspect-[3/4] rounded bg-white border border-slate-300 shadow-sm flex items-center justify-center text-lg sm:text-xl font-bold
                                                ${cIdx === pile.length - 1 ? 'cursor-pointer hover:brightness-105' : ''}
                                                ${selected?.zone === 'tableau' && selected.idx === i && cIdx === pile.length - 1 ? 'ring-4 ring-yellow-400 z-50' : ''}
                                            `}
                                        style={{
                                            top: `${cIdx * 30}px`,
                                            zIndex: cIdx
                                        }}
                                    >
                                        <CardView card={card} />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function CardView({ card }: { card: Card }) {
    return (
        <div className="flex flex-col items-center leading-none" style={{ color: card.color }}>
            <span>{card.display}</span>
            <span className="text-2xl">{card.suit}</span>
        </div>
    );
}
