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
    { name: '♠', color: '#1a1a3e' },
    { name: '♥', color: '#ef4444' },
    { name: '♦', color: '#ef4444' },
    { name: '♣', color: '#1a1a3e' },
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
    const [gameStarted, setGameStarted] = useState(false);

    const initGame = useCallback(() => {
        const newDeck = createDeck();
        const newTableau: Card[][] = [];
        let cardIndex = 0;

        // Deal 7 piles
        for (let i = 0; i < 7; i++) {
            const pile: Card[] = [];
            for (let j = 0; j <= i; j++) {
                const card = { ...newDeck[cardIndex++] };
                card.faceUp = j === i; // Only top card face up
                pile.push(card);
            }
            newTableau.push(pile);
        }

        setTableau(newTableau);
        setDeck(newDeck.slice(cardIndex));
        setWaste([]);
        setFoundations([[], [], [], []]);
        setMoves(0);
        setGameStarted(true);
    }, []);

    const drawCard = () => {
        if (deck.length === 0) {
            // Flip waste back to deck
            setDeck(waste.map(c => ({ ...c, faceUp: false })).reverse());
            setWaste([]);
        } else {
            const card = { ...deck[0], faceUp: true };
            setWaste([...waste, card]);
            setDeck(deck.slice(1));
        }
        setMoves(m => m + 1);
    };

    useEffect(() => {
        initGame();
    }, [initGame]);

    if (!gameStarted) {
        return (
            <div className="game-container">
                <div className="game-canvas-wrapper">
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🃏</div>
                        <h2 style={{ marginBottom: '1rem' }}>Solitaire</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
                            The classic card game
                        </p>
                        <button className="btn btn-primary" onClick={initGame}>
                            Start Game
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper" style={{ overflow: 'auto' }}>
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                        ← Back
                    </Link>
                    <h1 className="game-title">Solitaire</h1>
                    <div className="game-score">Moves: {moves}</div>
                </div>

                {/* Top Row: Deck, Waste, Foundations */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                }}>
                    {/* Deck */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div
                            onClick={drawCard}
                            style={{
                                width: '70px',
                                height: '100px',
                                background: deck.length > 0
                                    ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                                    : 'rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid rgba(255,255,255,0.2)',
                                fontSize: '1.5rem',
                            }}
                        >
                            {deck.length > 0 ? '🂠' : '↻'}
                        </div>

                        {/* Waste */}
                        <div
                            style={{
                                width: '70px',
                                height: '100px',
                                background: waste.length > 0 ? 'white' : 'rgba(255,255,255,0.05)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                border: '2px dashed rgba(255,255,255,0.2)',
                            }}
                        >
                            {waste.length > 0 && (
                                <>
                                    <span style={{
                                        color: waste[waste.length - 1].color,
                                        fontSize: '1.25rem',
                                        fontWeight: 'bold',
                                    }}>
                                        {waste[waste.length - 1].display}
                                    </span>
                                    <span style={{
                                        color: waste[waste.length - 1].color,
                                        fontSize: '1.5rem',
                                    }}>
                                        {waste[waste.length - 1].suit}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Foundations */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {foundations.map((pile, i) => (
                            <div
                                key={i}
                                style={{
                                    width: '70px',
                                    height: '100px',
                                    background: pile.length > 0 ? 'white' : 'rgba(255,255,255,0.05)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    border: '2px dashed rgba(255,255,255,0.2)',
                                }}
                            >
                                {pile.length > 0 ? (
                                    <>
                                        <span style={{
                                            color: pile[pile.length - 1].color,
                                            fontSize: '1.25rem',
                                            fontWeight: 'bold',
                                        }}>
                                            {pile[pile.length - 1].display}
                                        </span>
                                        <span style={{
                                            color: pile[pile.length - 1].color,
                                            fontSize: '1.5rem',
                                        }}>
                                            {pile[pile.length - 1].suit}
                                        </span>
                                    </>
                                ) : (
                                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.5rem' }}>
                                        {SUITS[i].name}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tableau */}
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    justifyContent: 'center',
                }}>
                    {tableau.map((pile, pileIndex) => (
                        <div key={pileIndex} style={{ position: 'relative', height: '300px', width: '70px' }}>
                            {pile.map((card, cardIndex) => (
                                <div
                                    key={cardIndex}
                                    style={{
                                        position: 'absolute',
                                        top: cardIndex * 25,
                                        width: '70px',
                                        height: '100px',
                                        background: card.faceUp ? 'white' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        border: '1px solid rgba(0,0,0,0.2)',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                        cursor: card.faceUp ? 'pointer' : 'default',
                                    }}
                                >
                                    {card.faceUp ? (
                                        <>
                                            <span style={{
                                                color: card.color,
                                                fontSize: '1.25rem',
                                                fontWeight: 'bold',
                                            }}>
                                                {card.display}
                                            </span>
                                            <span style={{
                                                color: card.color,
                                                fontSize: '1.5rem',
                                            }}>
                                                {card.suit}
                                            </span>
                                        </>
                                    ) : (
                                        <span style={{ fontSize: '1.5rem' }}>🂠</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <button className="btn btn-ghost" onClick={initGame}>
                        🔄 New Game
                    </button>
                </div>
            </div>
        </div>
    );
}
