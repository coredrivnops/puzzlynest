'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';

// Pyramid Solitaire
// Deck: Standard 52.
// Layout: 28 cards in pyramid.
// Row 1 (Top): 1 card. Row 7 (Base): 7 cards.
// Remaining 24 cards in Stock. Drawing reveals 1 card (Waste).
// Match: Pairs summing to 13.
// K (13) removes itself.
// Q(12)+A(1), J(11)+2, 10+3, 9+4, 8+5, 7+6.
// Only uncovered cards are available.

interface Card {
    val: number; // 1-13
    suit: string;
    display: string;
    id: number;
    // Position in pyramid
    row?: number;
    col?: number;
    status: 'deck' | 'waste' | 'pyramid' | 'removed';
}

const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export default function PyramidSolitaireGame() {
    const [cards, setCards] = useState<Card[]>([]);
    const [stockIndex, setStockIndex] = useState(0); // Index in 'deck' array where stock starts loop
    // Actually simpler: Just filter by status.
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [score, setScore] = useState(0);

    const initGame = useCallback(() => {
        // Create Deck
        const deck: Card[] = [];
        let id = 0;
        ['♠', '♥', '♦', '♣'].forEach(suit => {
            VALUES.forEach((display, i) => {
                deck.push({ val: i + 1, suit, display, id: id++, status: 'deck' });
            });
        });

        // Shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        // Assign to Pyramid (0..27)
        let cIdx = 0;
        for (let r = 0; r < 7; r++) {
            for (let c = 0; c <= r; c++) {
                deck[cIdx].status = 'pyramid';
                deck[cIdx].row = r;
                deck[cIdx].col = c;
                cIdx++;
            }
        }
        // Rest remain 'deck'

        setCards(deck);
        setSelectedId(null);
        setScore(0);
    }, []);

    const isCovered = (card: Card) => {
        if (card.status !== 'pyramid') return false;
        // Covered if Row+1 has cards at Col and Col+1
        const r = card.row!;
        const c = card.col!;
        // Valid blockers are those in pyramid and NOT removed
        const leftBlocker = cards.find(x => x.status === 'pyramid' && x.row === r + 1 && x.col === c);
        const rightBlocker = cards.find(x => x.status === 'pyramid' && x.row === r + 1 && x.col === c + 1);
        return !!(leftBlocker || rightBlocker);
    };

    const handleCardClick = (id: number) => {
        const card = cards.find(c => c.id === id);
        if (!card || card.status === 'removed' || card.status === 'deck') return; // Can't select deck directly, only waste?
        // Wait, standard rules: flip from deck to waste. Top waste available.
        // My 'deck' status means face down stock.

        if (card.status === 'pyramid' && isCovered(card)) return;

        // Logic
        if (card.val === 13) {
            // King removes immediately
            removeCards([card]);
            setSelectedId(null);
            return;
        }

        if (selectedId === null) {
            setSelectedId(id);
        } else {
            if (selectedId === id) {
                setSelectedId(null);
                return;
            }

            const first = cards.find(c => c.id === selectedId)!;
            const second = card;

            if (first.val + second.val === 13) {
                removeCards([first, second]);
                setSelectedId(null);
            } else {
                setSelectedId(id); // Switch selection
            }
        }
    };

    const removeCards = (targets: Card[]) => {
        setCards(prev => prev.map(c =>
            targets.find(t => t.id === c.id) ? { ...c, status: 'removed' } : c
        ));
        setScore(s => s + (targets.length * 50));
    };

    const drawCard = () => {
        setSelectedId(null);
        // Find top 'deck' card -> 'waste'
        // If no 'deck', recycle 'waste' -> 'deck'?
        // Pyramid usually limits recycles. Let's allow 3? Or infinite for Easy.

        // Simple logic: maintain order. 
        // We have 'deck' cards. Move first 'deck' to 'waste'.
        // If no 'deck', move all 'waste' back to 'deck'.

        const deckCards = cards.filter(c => c.status === 'deck');
        if (deckCards.length > 0) {
            const next = deckCards[0];
            // Hide previous waste? No, waste piles up. Top visible.
            // Actually, standard is 1 waste pile.
            setCards(prev => prev.map(c => c.id === next.id ? { ...c, status: 'waste' } : c));
        } else {
            // Recycle
            setCards(prev => prev.map(c => c.status === 'waste' ? { ...c, status: 'deck' } : c));
        }
    };

    useEffect(() => {
        initGame();
    }, [initGame]);

    // Render Helpers
    const pyramidHeight = 350;
    const cardW = 50;
    const cardH = 70;

    // Get visible waste
    // The LAST card with status 'waste' is the top one.
    // We rely on array order (id order). id order matches shuffle order?
    // Wait, shuffle changed array order.
    // We should filter then take last.
    // BUT we need stable sort to know which was drawn last?
    // My drawCard uses 'deckCards[0]'. But deckCards order depends on 'cards' order.
    // 'cards' state order doesn't change during status update map.
    // So deckCards[0] is always the first one in the list.
    // When recycling, waste elements become deck.
    // We need to track the "Top" waste.
    // This state logic is slightly buggy for precise stack behavior if I rely on implicit order.
    // Better: Add `zIndex` or `drawOrder`?
    // Or just valid: Find LAST `waste` in current list.
    let topWaste: Card | undefined;
    // Iterating reverse to find last waste
    for (let i = cards.length - 1; i >= 0; i--) {
        if (cards[i].status === 'waste') {
            topWaste = cards[i];
            break;
        }
    }

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Pyramid Solitaire</h1>
                    <div className="text-emerald-400 font-bold">Score: {score}</div>
                </div>

                <div className="relative w-full h-[500px]">
                    {/* Pyramid */}
                    {cards.filter(c => c.status === 'pyramid').map(c => {
                        const x = 50 + (c.col! * 60) - (c.row! * 30) + (c.row! * 60 / 2); // Center alignment logic...
                        // Simplest: Row 0: Center. Row 1: Center +/- offset.
                        // Canvas Width ~600? Center 300.
                        // r=0, c=0 -> x=300.
                        // r=1, c=0 -> x=270, c=1 -> x=330.
                        // x = 300 - (r * 30) + (c * 60)
                        const left = 300 - (c.row! * 35) + (c.col! * 70);
                        const top = 20 + c.row! * 45;

                        const covered = isCovered(c);
                        const selected = selectedId === c.id;

                        return (
                            <button
                                key={c.id}
                                onClick={() => handleCardClick(c.id)}
                                disabled={covered}
                                className={`
                                    absolute w-[60px] h-[80px] rounded bg-white border border-slate-300 flex items-center justify-center text-xl font-bold
                                    ${covered ? 'brightness-50' : 'cursor-pointer hover:scale-105 shadow-lg'}
                                    ${selected ? 'ring-4 ring-yellow-400 z-50' : ''}
                                `}
                                style={{ left: `${left}px`, top: `${top}px`, color: (c.suit === '♥' || c.suit === '♦') ? 'red' : 'black' }}
                            >
                                <div className="flex flex-col items-center leading-none">
                                    <span>{c.display}</span>
                                    <span className="text-2xl">{c.suit}</span>
                                </div>
                            </button>
                        );
                    })}

                    {/* Stock & Waste (Bottom Left) */}
                    <div className="absolute bottom-10 left-10 flex gap-8">
                        {/* Stock */}
                        <div
                            onClick={drawCard}
                            className="w-[60px] h-[80px] bg-indigo-900 border-2 border-slate-500 rounded flex items-center justify-center cursor-pointer hover:brightness-110 shadow-lg"
                        >
                            <span className="text-white text-2xl">↻</span>
                        </div>

                        {/* Waste */}
                        <div className="w-[60px] h-[80px] relative">
                            {topWaste ? (
                                <button
                                    onClick={() => handleCardClick(topWaste!.id)}
                                    className={`
                                        w-full h-full rounded bg-white border border-slate-300 flex items-center justify-center text-xl font-bold shadow-lg
                                        ${selectedId === topWaste.id ? 'ring-4 ring-yellow-400' : ''}
                                    `}
                                    style={{ color: (topWaste.suit === '♥' || topWaste.suit === '♦') ? 'red' : 'black' }}
                                >
                                    <div className="flex flex-col items-center leading-none">
                                        <span>{topWaste.display}</span>
                                        <span className="text-2xl">{topWaste.suit}</span>
                                    </div>
                                </button>
                            ) : (
                                <div className="w-full h-full border-2 border-dashed border-slate-600 rounded"></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
