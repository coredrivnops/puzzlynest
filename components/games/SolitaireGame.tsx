'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';

interface Card {
    suit: string;
    value: number;
    display: string;
    color: string;
    faceUp: boolean;
}

const SUITS = [
    { name: '♠', color: '#1a1a3e', type: 'black' },
    { name: '♥', color: '#ef4444', type: 'red' },
    { name: '♦', color: '#ef4444', type: 'red' },
    { name: '♣', color: '#1a1a3e', type: 'black' },
];

const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function createDeck(): Card[] {
    const deck: Card[] = [];
    for (const suit of SUITS) {
        for (let i = 0; i < VALUES.length; i++) {
            deck.push({
                suit: suit.name,
                value: i + 1,
                display: VALUES[i],
                color: suit.color,
                faceUp: false,
            });
        }
    }
    return shuffle(deck);
}

function shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export default function SolitaireGame() {
    const [deck, setDeck] = useState<Card[]>([]);
    const [waste, setWaste] = useState<Card[]>([]);
    const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []]);
    const [tableau, setTableau] = useState<Card[][]>([]);
    const [moves, setMoves] = useState(0);
    const [selected, setSelected] = useState<{ pile: 'tableau' | 'waste' | 'foundation', index: number, cardIndex?: number } | null>(null);
    const [gameStarted, setGameStarted] = useState(false);

    const initGame = useCallback(() => {
        const newDeck = createDeck();
        const newTableau: Card[][] = [];
        let cardIndex = 0;

        for (let i = 0; i < 7; i++) {
            const pile: Card[] = [];
            for (let j = 0; j <= i; j++) {
                const card = { ...newDeck[cardIndex++] };
                card.faceUp = j === i;
                pile.push(card);
            }
            newTableau.push(pile);
        }

        setTableau(newTableau);
        setDeck(newDeck.slice(cardIndex));
        setWaste([]);
        setFoundations([[], [], [], []]);
        setMoves(0);
        setSelected(null);
        setGameStarted(true);
    }, []);

    const drawCard = () => {
        setSelected(null);
        if (deck.length === 0) {
            if (waste.length === 0) return;
            setDeck(waste.map(c => ({ ...c, faceUp: false })).reverse());
            setWaste([]);
        } else {
            const card = { ...deck[0], faceUp: true };
            const newDeck = deck.slice(1);
            setDeck(newDeck);
            setWaste([...waste, card]);
        }
        setMoves(m => m + 1);
    };

    const handleWasteClick = () => {
        if (waste.length === 0) return;
        if (selected?.pile === 'waste') {
            setSelected(null);
        } else {
            setSelected({ pile: 'waste', index: 0 });
        }
    };

    const handleFoundationClick = (foundationIndex: number) => {
        if (!selected) return;

        let cardToMove: Card;
        if (selected.pile === 'waste') {
            cardToMove = waste[waste.length - 1];
        } else if (selected.pile === 'tableau') {
            const pile = tableau[selected.index];
            cardToMove = pile[pile.length - 1]; // Can only move top card to foundation
            if (selected.cardIndex !== pile.length - 1) return; // Can't move stack to foundation
        } else {
            return;
        }

        const foundation = foundations[foundationIndex];
        const topCard = foundation.length > 0 ? foundation[foundation.length - 1] : null;

        let valid = false;
        if (!topCard) {
            if (cardToMove.value === 1) valid = true; // Ace moves to empty
        } else {
            // Foundation must ideally match suit? Or just alternating? 
            // Standard Solitaire: Foundation is SAME SUIT, Ascending.
            if (cardToMove.suit === topCard.suit && cardToMove.value === topCard.value + 1) valid = true;
        }

        if (valid) {
            // Execute Move
            const newFoundations = [...foundations];
            newFoundations[foundationIndex] = [...foundation, cardToMove];
            setFoundations(newFoundations);

            if (selected.pile === 'waste') {
                setWaste(prev => prev.slice(0, -1));
            } else {
                const newTableau = [...tableau];
                const pile = [...newTableau[selected.index]];
                pile.pop();
                // Reveal new top card
                if (pile.length > 0) pile[pile.length - 1] = { ...pile[pile.length - 1], faceUp: true };
                newTableau[selected.index] = pile;
                setTableau(newTableau);
            }
            setSelected(null);
            setMoves(m => m + 1);
        }
    };

    const handleTableauClick = (pileIndex: number, cardIndex: number) => {
        const pile = tableau[pileIndex];
        const card = pile[cardIndex];

        // Case 1: Select Source
        if (!selected) {
            // Limit selection to face-up cards
            // Exception: Empty pile click (card is undefined)
            if (!card) {
                // Only Kings can move to empty
                return;
            }
            if (card.faceUp) {
                setSelected({ pile: 'tableau', index: pileIndex, cardIndex });
            }
            return;
        }

        // Case 2: Deselect if clicking same
        if (selected.pile === 'tableau' && selected.index === pileIndex && selected.cardIndex === cardIndex) {
            setSelected(null);
            return;
        }

        // Case 3: Move to Tableau
        // We are moving TO this pile (pileIndex)
        // If pile is empty, cardIndex is -1 or undefined
        const targetCard = card; // The card we clicked ON

        let cardsToMove: Card[] = [];
        if (selected.pile === 'waste') {
            cardsToMove = [waste[waste.length - 1]];
        } else if (selected.pile === 'tableau') {
            const sourcePile = tableau[selected.index];
            cardsToMove = sourcePile.slice(selected.cardIndex!);
        }

        const movingCard = cardsToMove[0];

        let valid = false;
        if (!targetCard) {
            // Empty pile: Only King
            if (movingCard.value === 13) valid = true;
        } else {
            // Standard Rule: Alternating Color, Descending Value
            // We need to check suit color. 
            // My SUITS array has 'color' hex, but not explicit type.
            // Let's rely on hex color comparison
            if (targetCard.color !== movingCard.color && targetCard.value === movingCard.value + 1) valid = true;
        }

        if (valid) {
            const newTableau = [...tableau];

            // Add to new pile
            newTableau[pileIndex] = [...newTableau[pileIndex], ...cardsToMove];

            // Remove from old pile
            if (selected.pile === 'waste') {
                setWaste(prev => prev.slice(0, -1));
            } else {
                const sourcePile = [...newTableau[selected.index]];
                // We removed N cards.
                // Issue: If we move within Tableau, we shouldn't mutate sourcePile directly before reading for target?
                // Actually newTableau is cloned, but nested arrays are refs?
                // Yes, [...tableau] is shallow copy of piles.
                // We must be careful.
                // If source and target are different piles, it's fine.
                // If same pile? Logic shouldn't trigger move to same pile.

                // Truncate source
                const newSourceLen = selected.cardIndex!;
                const newSourcePile = sourcePile.slice(0, newSourceLen);

                // Reveal top of source
                if (newSourcePile.length > 0) {
                    const top = newSourcePile[newSourcePile.length - 1];
                    newSourcePile[newSourcePile.length - 1] = { ...top, faceUp: true };
                }
                newTableau[selected.index] = newSourcePile;
            }

            setTableau(newTableau);
            setSelected(null);
            setMoves(m => m + 1);
        } else {
            // If invalid, maybe we just wanted to select this card instead?
            if (targetCard && targetCard.faceUp) {
                setSelected({ pile: 'tableau', index: pileIndex, cardIndex });
            }
        }
    };

    const handleEmptyPileClick = (pileIndex: number) => {
        // Handle clicking an empty spot
        if (selected) {
            // Try to move King there
            handleTableauClick(pileIndex, -1); // -1 dummy index
        }
    };

    useEffect(() => {
        initGame();
    }, [initGame]);

    if (!gameStarted) return <div onClick={initGame} className="text-white text-center p-10 cursor-pointer">Start Game</div>;

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper" style={{ overflow: 'auto' }}>
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Solitaire</h1>
                    <div className="text-white">Moves: {moves}</div>
                </div>

                {/* Top Area */}
                <div className="flex gap-4 mb-6 justify-center flex-wrap">
                    {/* Deck */}
                    <div onClick={drawCard} className={`
                        w-16 h-24 sm:w-20 sm:h-28 rounded-lg flex items-center justify-center cursor-pointer border-2 border-slate-500
                        ${deck.length > 0 ? 'bg-indigo-600' : 'bg-transparent text-white'}
                    `}>
                        {deck.length > 0 ? <span className="text-2xl text-white">🂠</span> : '↻'}
                    </div>

                    {/* Waste */}
                    <div onClick={handleWasteClick} className={`
                        w-16 h-24 sm:w-20 sm:h-28 rounded-lg flex flex-col items-center justify-center border-2 border-slate-500/50 bg-slate-800/30
                        ${selected?.pile === 'waste' ? 'ring-4 ring-yellow-400' : ''}
                    `}>
                        {waste.length > 0 && (
                            <CardView card={waste[waste.length - 1]} />
                        )}
                    </div>

                    <div className="w-4"></div>

                    {/* Foundations */}
                    {foundations.map((pile, i) => (
                        <div key={i} onClick={() => handleFoundationClick(i)} className="w-16 h-24 sm:w-20 sm:h-28 rounded-lg border-2 border-slate-500/50 flex items-center justify-center bg-slate-800/30">
                            {pile.length > 0 ? (
                                <CardView card={pile[pile.length - 1]} />
                            ) : (
                                <span className="text-2xl text-slate-600">{SUITS[i].name}</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Tableau */}
                <div className="flex justify-center gap-2 sm:gap-4 px-2">
                    {tableau.map((pile, pileIndex) => (
                        <div key={pileIndex} className="relative w-16 sm:w-20" style={{ minHeight: '300px' }}>
                            {/* Empty Pile Target */}
                            {pile.length === 0 && (
                                <div
                                    onClick={() => handleEmptyPileClick(pileIndex)}
                                    className="w-16 h-24 sm:w-20 sm:h-28 rounded-lg border border-slate-700/50 bg-slate-800/20 absolute top-0"
                                ></div>
                            )}

                            {pile.map((card, cardIndex) => (
                                <div
                                    key={cardIndex}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTableauClick(pileIndex, cardIndex);
                                    }}
                                    className={`
                                        absolute w-16 h-24 sm:w-20 sm:h-28 rounded-lg border border-slate-400 shadow-md flex flex-col items-center justify-center transition-transform
                                        ${card.faceUp ? 'bg-white cursor-pointer' : 'bg-indigo-700'}
                                        ${selected?.pile === 'tableau' && selected.index === pileIndex && cardIndex >= selected.cardIndex! ? 'ring-2 ring-yellow-400 brightness-110 z-10' : ''}
                                    `}
                                    style={{
                                        top: `${cardIndex * (card.faceUp ? 25 : 10)}px`,
                                        zIndex: cardIndex,
                                    }}
                                >
                                    {card.faceUp ? (
                                        <CardView card={card} />
                                    ) : (
                                        <span className="text-white text-xl">🂠</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function CardView({ card }: { card: Card }) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center select-none" style={{ color: card.color }}>
            <div className="font-bold text-xl leading-none">{card.display}</div>
            <div className="text-2xl leading-none">{card.suit}</div>
        </div>
    );
}
