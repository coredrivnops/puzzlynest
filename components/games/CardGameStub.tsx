'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Simple emoji pair card matching game — used as a playable fallback for classic card games
const CARD_EMOJIS = ['🃏', '♠️', '♣️', '♥️', '♦️', '🎴', '🀄', '🎲'];

interface Card {
    id: number;
    emoji: string;
    flipped: boolean;
    matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function CardGameStub({ game }: { game?: { name?: string } }) {
    const gameName = game?.name ?? 'Card Game';

    const initCards = useCallback((): Card[] => {
        const pairs = [...CARD_EMOJIS, ...CARD_EMOJIS];
        return shuffle(pairs).map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
    }, []);

    const [cards, setCards] = useState<Card[]>(initCards);
    const [selected, setSelected] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [won, setWon] = useState(false);
    const [locked, setLocked] = useState(false);

    // Check win
    useEffect(() => {
        if (cards.length > 0 && cards.every(c => c.matched)) setWon(true);
    }, [cards]);

    // Evaluate pair after two cards flipped
    useEffect(() => {
        if (selected.length !== 2) return;
        setLocked(true);
        setMoves(m => m + 1);

        const [a, b] = selected;
        if (cards[a].emoji === cards[b].emoji) {
            setCards(prev => prev.map(c => c.id === a || c.id === b ? { ...c, matched: true } : c));
            setSelected([]);
            setLocked(false);
        } else {
            const timer = setTimeout(() => {
                setCards(prev => prev.map(c => c.id === a || c.id === b ? { ...c, flipped: false } : c));
                setSelected([]);
                setLocked(false);
            }, 900);
            return () => clearTimeout(timer);
        }
    }, [selected, cards]);

    const handleFlip = (id: number) => {
        if (locked || selected.length === 2) return;
        const card = cards[id];
        if (card.flipped || card.matched) return;

        setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
        setSelected(prev => [...prev, id]);
    };

    const restart = () => {
        setCards(initCards());
        setSelected([]);
        setMoves(0);
        setWon(false);
        setLocked(false);
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">{gameName}</h1>
                    <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Moves: {moves}</div>
                </div>

                {won ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                        <h2 style={{ marginBottom: '0.5rem' }}>You Won!</h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>Completed in {moves} moves</p>
                        <button onClick={restart} style={{
                            padding: '0.75rem 2rem', borderRadius: '12px',
                            background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
                            color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1rem'
                        }}>Play Again</button>
                    </div>
                ) : (
                    <>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '0.75rem',
                            maxWidth: '360px',
                            margin: '1.5rem auto',
                        }}>
                            {cards.map(card => (
                                <button
                                    key={card.id}
                                    onClick={() => handleFlip(card.id)}
                                    style={{
                                        width: '100%',
                                        aspectRatio: '1',
                                        fontSize: '2rem',
                                        borderRadius: '12px',
                                        border: card.matched
                                            ? '2px solid rgba(99,102,241,0.5)'
                                            : '2px solid rgba(255,255,255,0.1)',
                                        background: card.flipped || card.matched
                                            ? 'rgba(99,102,241,0.25)'
                                            : 'rgba(30,30,60,0.8)',
                                        cursor: card.matched ? 'default' : 'pointer',
                                        transition: 'all 0.2s ease',
                                        opacity: card.matched ? 0.5 : 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    aria-label={card.flipped || card.matched ? card.emoji : 'Hidden card'}
                                >
                                    {card.flipped || card.matched ? card.emoji : '🂠'}
                                </button>
                            ))}
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <button onClick={restart} style={{
                                padding: '0.5rem 1.5rem', borderRadius: '8px',
                                background: 'rgba(255,255,255,0.1)', color: 'white',
                                border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '0.875rem'
                            }}>↺ Restart</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
