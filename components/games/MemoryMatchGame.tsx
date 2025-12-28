'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface MemoryCard {
    id: number;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
}

const EMOJIS = ['🌟', '🎈', '🌈', '🦋', '🌸', '🍎', '🚀', '🎨'];

export default function MemoryMatchGame() {
    const [cards, setCards] = useState<MemoryCard[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);
    const [gameWon, setGameWon] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    const initializeGame = useCallback(() => {
        const shuffledCards = [...EMOJIS, ...EMOJIS]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({
                id: index,
                emoji,
                isFlipped: false,
                isMatched: false,
            }));
        setCards(shuffledCards);
        setFlippedCards([]);
        setMoves(0);
        setMatches(0);
        setGameWon(false);
    }, []);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    const handleCardClick = (cardId: number) => {
        if (isChecking) return;
        if (flippedCards.length === 2) return;
        if (cards[cardId].isFlipped || cards[cardId].isMatched) return;

        const newCards = [...cards];
        newCards[cardId].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedCards, cardId];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            setIsChecking(true);

            const [first, second] = newFlipped;
            if (cards[first].emoji === cards[second].emoji) {
                // Match found!
                setTimeout(() => {
                    const matchedCards = [...cards];
                    matchedCards[first].isMatched = true;
                    matchedCards[second].isMatched = true;
                    setCards(matchedCards);
                    setMatches(m => m + 1);
                    setFlippedCards([]);
                    setIsChecking(false);

                    if (matches + 1 === EMOJIS.length) {
                        setGameWon(true);
                    }
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    const resetCards = [...cards];
                    resetCards[first].isFlipped = false;
                    resetCards[second].isFlipped = false;
                    setCards(resetCards);
                    setFlippedCards([]);
                    setIsChecking(false);
                }, 1000);
            }
        }
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                        ← Back
                    </Link>
                    <h1 className="game-title">Memory Match</h1>
                    <div className="game-score">
                        Moves: {moves} | Matches: {matches}/{EMOJIS.length}
                    </div>
                </div>

                {gameWon ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                        <h2 style={{ marginBottom: '1rem' }}>Congratulations!</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
                            You completed the game in {moves} moves!
                        </p>
                        <button className="btn btn-primary" onClick={initializeGame}>
                            Play Again
                        </button>
                    </div>
                ) : (
                    <>
                        <div
                            className="memory-grid"
                            style={{ gridTemplateColumns: 'repeat(4, 1fr)', maxWidth: '400px', margin: '0 auto' }}
                        >
                            {cards.map(card => (
                                <div
                                    key={card.id}
                                    className={`memory-card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
                                    onClick={() => handleCardClick(card.id)}
                                >
                                    <div className="memory-card-inner">
                                        <div className="memory-card-back">❓</div>
                                        <div className="memory-card-front">{card.emoji}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                            <button className="btn btn-ghost" onClick={initializeGame}>
                                🔄 New Game
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
