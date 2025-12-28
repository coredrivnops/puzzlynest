'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';

// Spider Solitaire (1 Suit - Easy Mode for MVP)
// 104 Cards (8 decks of Spades? Or 2 decks of standard 52? No, full Spider is 8 decks. 1 suit = 8 copies of Spades).
// 10 Columns.
// Deal: 10 piles. 4 piles of 6, 6 piles of 5. Top face up. Rest face down.
// Stock: 50 cards remaining. Deal 1 to each of 10 columns.

interface Card {
    suit: string;
    value: number;
    display: string;
    id: number; // Unique ID needed for 104 cards
    faceUp: boolean;
}

const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export default function SpiderSolitaireGame() {
    const [tableau, setTableau] = useState<Card[][]>([]);
    const [stock, setStock] = useState<Card[]>([]);
    const [completedSuits, setCompletedSuits] = useState(0); // Max 8
    const [score, setScore] = useState(500);
    const [moves, setMoves] = useState(0);
    const [selected, setSelected] = useState<{ col: number, cardIdx: number } | null>(null);
    const [gameStarted, setGameStarted] = useState(false);

    const initGame = useCallback(() => {
        // Create 104 Spades
        const deck: Card[] = [];
        let idCounter = 0;
        for (let i = 0; i < 8; i++) { // 8 sets
            for (let v = 0; v < 13; v++) {
                deck.push({
                    suit: '♠',
                    value: v + 1,
                    display: VALUES[v],
                    id: idCounter++,
                    faceUp: false
                });
            }
        }

        // Shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        // Deal Tableau
        const newTableau: Card[][] = [];
        let cardIdx = 0;
        // 10 columns
        // Cols 0-3: 6 cards. Cols 4-9: 5 cards.
        for (let col = 0; col < 10; col++) {
            const count = col < 4 ? 6 : 5;
            const pile: Card[] = [];
            for (let k = 0; k < count; k++) {
                const card = deck[cardIdx++];
                if (k === count - 1) card.faceUp = true;
                pile.push(card);
            }
            newTableau.push(pile);
        }

        setStock(deck.slice(cardIdx)); // Rest to stock (50 cards)
        setTableau(newTableau);
        setCompletedSuits(0);
        setScore(500);
        setMoves(0);
        setSelected(null);
        setGameStarted(true);
    }, []);

    const handleStockClick = () => {
        if (stock.length === 0) return;
        // Check: Standard Spider rules say no empty columns allowed before dealing?
        // We'll skip that strict rule for Easy/MVP.

        // Deal 1 to each of 10 cols
        const newStock = [...stock];
        const newTableau = [...tableau];

        for (let i = 0; i < 10; i++) {
            if (newStock.length === 0) break;
            const card = { ...newStock.pop()!, faceUp: true };
            newTableau[i].push(card);
        }

        setStock(newStock);
        setTableau(newTableau);
        checkCompletedSuits(newTableau); // Dealing might complete a suit? Unlikely but possible?
        // Actually usually must be sorted.
    };

    const handleCardClick = (colIdx: number, cardIdx: number) => {
        const pile = tableau[colIdx];
        const card = pile[cardIdx];

        // Selection
        if (!selected) {
            if (!card.faceUp) return;
            // Valid Selection?
            // Must be top of a valid descending sequence to be moved?
            // Or we check validity when moving.
            setSelected({ col: colIdx, cardIdx });
            return;
        }

        // Deselect
        if (selected.col === colIdx && selected.cardIdx === cardIdx) {
            setSelected(null);
            return;
        }

        // Move Attempt
        // From selected -> Target (colIdx)
        // Target is the Pile, not the specific card technically (always top).
        // But invalid if we click valid card in middle?
        // Let's assume user clicked "Destination Column".

        const sourcePile = tableau[selected.col];
        const targetPile = tableau[colIdx];

        const movingStack = sourcePile.slice(selected.cardIdx);
        const targetCard = targetPile.length > 0 ? targetPile[targetPile.length - 1] : null;

        // 1. Validate Source Stack Structure
        // Must be descending by 1. Suit matches (1 suit mode = always matches).
        for (let i = 0; i < movingStack.length - 1; i++) {
            if (movingStack[i].value !== movingStack[i + 1].value + 1) {
                // Invalid stack selection
                setSelected({ col: colIdx, cardIdx }); // Change selection to this card
                return;
            }
        }

        // 2. Validate Target
        let valid = false;
        if (!targetCard) {
            valid = true; // Any stack to empty
        } else {
            if (targetCard.value === movingStack[0].value + 1) valid = true;
        }

        if (valid) {
            const newTableau = [...tableau];
            // Remove from source
            const newSource = sourcePile.slice(0, selected.cardIdx);
            if (newSource.length > 0) {
                const top = newSource[newSource.length - 1];
                newSource[newSource.length - 1] = { ...top, faceUp: true };
            }
            newTableau[selected.col] = newSource;

            // Add to target
            newTableau[colIdx] = [...targetPile, ...movingStack];

            setTableau(newTableau);
            setSelected(null);
            setMoves(m => m + 1);
            setScore(s => Math.max(0, s - 1));

            checkCompletedSuits(newTableau);
        } else {
            // Invalid target, select this card instead if face up?
            if (card && card.faceUp) setSelected({ col: colIdx, cardIdx });
        }
    };

    const checkCompletedSuits = (tab: Card[][]) => {
        // Look for K...A runs at end of piles
        const newTableau = [...tab];
        let found = false;

        for (let i = 0; i < 10; i++) {
            const pile = newTableau[i];
            if (pile.length < 13) continue;

            // Check last 13 cards for K..A
            const suffix = pile.slice(-13);
            let isRun = true;
            if (suffix[0].value !== 13) isRun = false; // Must start with K

            if (isRun) {
                for (let k = 0; k < 12; k++) {
                    if (suffix[k].value !== suffix[k + 1].value + 1) {
                        isRun = false;
                        break;
                    }
                }
            }

            if (isRun) {
                // Remove them
                newTableau[i] = pile.slice(0, pile.length - 13);
                // Reveal new top
                if (newTableau[i].length > 0) {
                    const top = newTableau[i][newTableau[i].length - 1];
                    newTableau[i][newTableau[i].length - 1] = { ...top, faceUp: true };
                }
                setCompletedSuits(prev => prev + 1);
                setScore(s => s + 100);
                found = true;
            }
        }

        if (found) setTableau(newTableau);
    };

    const handleEmptyColClick = (colIdx: number) => {
        if (selected) handleCardClick(colIdx, -1);
    };

    useEffect(() => {
        initGame();
    }, [initGame]);

    if (!gameStarted) return null;

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper" style={{ overflow: 'auto' }}>
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <div className="flex flex-col items-center">
                        <h1 className="game-title">Spider Solitaire</h1>
                        <span className="text-xs text-indigo-300">1 Suit (Easy)</span>
                    </div>
                    <div className="text-right">
                        <div className="text-emerald-400 font-bold">Suits: {completedSuits}/8</div>
                        <div className="text-sm text-slate-400">Moves: {moves}</div>
                    </div>
                </div>

                {/* Stock Area */}
                <div className="mb-4 pl-4">
                    <div
                        onClick={handleStockClick}
                        className={`
                            w-14 h-20 bg-indigo-900 border-2 border-slate-500 rounded-lg flex items-center justify-center cursor-pointer hover:brightness-110 shadow-lg
                        `}
                    >
                        {stock.length > 0 ? (
                            <div className="w-full h-full bg-slate-800 rounded flex items-center justify-center border border-slate-600">
                                <span className="text-white font-bold">{stock.length / 10}</span>
                            </div>
                        ) : (
                            <span className="text-slate-600">X</span>
                        )}
                    </div>
                </div>

                {/* Columns */}
                <div className="flex justify-center gap-1 sm:gap-2 px-1" style={{ minWidth: 'max-content' }}>
                    {tableau.map((pile, colIdx) => (
                        <div key={colIdx} className="relative w-10 sm:w-14" style={{ minHeight: '400px' }}>
                            {/* Click target for empty */}
                            <div
                                onClick={() => handleEmptyColClick(colIdx)}
                                className="absolute top-0 w-full h-20 border border-slate-800 rounded bg-slate-800/20"
                            ></div>

                            {pile.map((card, cardIdx) => (
                                <div
                                    key={card.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCardClick(colIdx, cardIdx);
                                    }}
                                    className={`
                                        absolute w-10 h-16 sm:w-14 sm:h-20 rounded border border-slate-400 flex items-center justify-center text-lg font-bold shadow-sm transition-transform
                                        ${card.faceUp ? 'bg-white text-slate-900 cursor-pointer' : 'bg-indigo-800 border-indigo-600'}
                                        ${selected?.col === colIdx && cardIdx >= selected.cardIdx ? 'ring-2 ring-yellow-400 z-50 brightness-110' : ''}
                                    `}
                                    style={{
                                        top: `${cardIdx * (card.faceUp ? 25 : 8)}px`,
                                        zIndex: cardIdx,
                                    }}
                                >
                                    {card.faceUp && (
                                        <span className="text-black">{card.display} ♠</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {completedSuits === 8 && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <div className="text-center">
                            <h2 className="text-6xl mb-4">👑</h2>
                            <h1 className="text-4xl font-bold text-white mb-4">You Win!</h1>
                            <button onClick={initGame} className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold">Play Again</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
