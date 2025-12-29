'use client';

import React, { useState, useEffect, useCallback } from 'react';

// Card types
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

interface Card {
    suit: Suit;
    rank: Rank;
    value: number;
}

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const RANK_VALUES: Record<Rank, number> = {
    'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 10, 'Q': 10, 'K': 10
};

const getSuitSymbol = (suit: Suit): string => {
    switch (suit) {
        case 'hearts': return '♥';
        case 'diamonds': return '♦';
        case 'clubs': return '♣';
        case 'spades': return '♠';
    }
};

const getSuitColor = (suit: Suit): string => {
    return suit === 'hearts' || suit === 'diamonds' ? '#ef4444' : '#1e293b';
};

const createDeck = (): Card[] => {
    const deck: Card[] = [];
    for (const suit of SUITS) {
        for (const rank of RANKS) {
            deck.push({ suit, rank, value: RANK_VALUES[rank] });
        }
    }
    return deck;
};

const shuffleDeck = (deck: Card[]): Card[] => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Check if cards form a valid set (same rank, different suits)
const isValidSet = (cards: Card[]): boolean => {
    if (cards.length < 3) return false;
    const rank = cards[0].rank;
    const suits = new Set(cards.map(c => c.suit));
    return cards.every(c => c.rank === rank) && suits.size === cards.length;
};

// Check if cards form a valid run (same suit, consecutive ranks)
const isValidRun = (cards: Card[]): boolean => {
    if (cards.length < 3) return false;
    const suit = cards[0].suit;
    if (!cards.every(c => c.suit === suit)) return false;

    const rankOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const indices = cards.map(c => rankOrder.indexOf(c.rank)).sort((a, b) => a - b);

    for (let i = 1; i < indices.length; i++) {
        if (indices[i] - indices[i - 1] !== 1) return false;
    }
    return true;
};

// Find all valid melds in a hand
const findMelds = (hand: Card[]): Card[][] => {
    const melds: Card[][] = [];

    // Find sets
    const rankGroups: Record<string, Card[]> = {};
    hand.forEach(card => {
        if (!rankGroups[card.rank]) rankGroups[card.rank] = [];
        rankGroups[card.rank].push(card);
    });

    Object.values(rankGroups).forEach(group => {
        if (group.length >= 3) {
            melds.push(group.slice(0, Math.min(group.length, 4)));
        }
    });

    // Find runs
    const suitGroups: Record<string, Card[]> = {};
    hand.forEach(card => {
        if (!suitGroups[card.suit]) suitGroups[card.suit] = [];
        suitGroups[card.suit].push(card);
    });

    Object.values(suitGroups).forEach(group => {
        const rankOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const sorted = [...group].sort((a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank));

        let run: Card[] = [sorted[0]];
        for (let i = 1; i < sorted.length; i++) {
            const prevIdx = rankOrder.indexOf(sorted[i - 1].rank);
            const currIdx = rankOrder.indexOf(sorted[i].rank);
            if (currIdx - prevIdx === 1) {
                run.push(sorted[i]);
            } else {
                if (run.length >= 3) melds.push([...run]);
                run = [sorted[i]];
            }
        }
        if (run.length >= 3) melds.push([...run]);
    });

    return melds;
};

// Calculate deadwood (unmelded cards value)
const calculateDeadwood = (hand: Card[]): number => {
    const melds = findMelds(hand);
    const meldedCards = new Set(melds.flat().map(c => `${c.rank}-${c.suit}`));

    let deadwood = 0;
    hand.forEach(card => {
        if (!meldedCards.has(`${card.rank}-${card.suit}`)) {
            deadwood += card.value;
        }
    });

    return deadwood;
};

export default function GinRummyGame() {
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    const [opponentHand, setOpponentHand] = useState<Card[]>([]);
    const [deck, setDeck] = useState<Card[]>([]);
    const [discardPile, setDiscardPile] = useState<Card[]>([]);
    const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
    const [phase, setPhase] = useState<'draw' | 'discard' | 'opponentTurn' | 'gameOver'>('draw');
    const [playerScore, setPlayerScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [message, setMessage] = useState('');
    const [winner, setWinner] = useState<'player' | 'opponent' | null>(null);

    const initGame = useCallback(() => {
        const newDeck = shuffleDeck(createDeck());
        const pHand = newDeck.splice(0, 10);
        const oHand = newDeck.splice(0, 10);
        const discard = [newDeck.splice(0, 1)[0]];

        setPlayerHand(sortHand(pHand));
        setOpponentHand(oHand);
        setDeck(newDeck);
        setDiscardPile(discard);
        setPhase('draw');
        setMessage('Your turn! Draw from deck or discard pile.');
        setWinner(null);
        setSelectedCards(new Set());
    }, []);

    const sortHand = (hand: Card[]): Card[] => {
        const suitOrder: Record<Suit, number> = { clubs: 0, diamonds: 1, hearts: 2, spades: 3 };
        const rankOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        return [...hand].sort((a, b) => {
            if (suitOrder[a.suit] !== suitOrder[b.suit]) {
                return suitOrder[a.suit] - suitOrder[b.suit];
            }
            return rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank);
        });
    };

    useEffect(() => {
        initGame();
    }, [initGame]);

    // Draw from deck
    const drawFromDeck = () => {
        if (phase !== 'draw' || deck.length === 0) return;

        const card = deck[0];
        setDeck(prev => prev.slice(1));
        setPlayerHand(prev => sortHand([...prev, card]));
        setPhase('discard');
        setMessage('Now discard a card by clicking it.');
    };

    // Draw from discard pile
    const drawFromDiscard = () => {
        if (phase !== 'draw' || discardPile.length === 0) return;

        const card = discardPile[discardPile.length - 1];
        setDiscardPile(prev => prev.slice(0, -1));
        setPlayerHand(prev => sortHand([...prev, card]));
        setPhase('discard');
        setMessage('Now discard a card by clicking it.');
    };

    // Discard a card
    const discardCard = (card: Card) => {
        if (phase !== 'discard') return;

        const cardKey = `${card.rank}-${card.suit}`;
        setPlayerHand(prev => {
            const idx = prev.findIndex(c => `${c.rank}-${c.suit}` === cardKey);
            if (idx === -1) return prev;
            const newHand = [...prev];
            newHand.splice(idx, 1);
            return newHand;
        });
        setDiscardPile(prev => [...prev, card]);

        // Check for gin
        const newHand = playerHand.filter(c => `${c.rank}-${c.suit}` !== cardKey);
        const deadwood = calculateDeadwood(newHand);

        if (deadwood === 0) {
            setMessage('GIN! You win this round! 🎉');
            setPlayerScore(prev => prev + 25);
            setPhase('gameOver');
            setWinner('player');
            return;
        }

        setPhase('opponentTurn');
        setMessage("Opponent's turn...");

        // Opponent's turn
        setTimeout(() => opponentTurn(), 1000);
    };

    // Simple AI opponent turn
    const opponentTurn = () => {
        // Draw from deck (simplified AI)
        if (deck.length === 0) {
            setPhase('gameOver');
            setMessage("Deck empty! It's a draw.");
            return;
        }

        const drawnCard = deck[0];
        const newDeck = deck.slice(1);
        const newOpponentHand = [...opponentHand, drawnCard];

        // Find card with highest deadwood contribution
        let maxDeadwoodCard = newOpponentHand[0];
        let maxContribution = 0;

        newOpponentHand.forEach(card => {
            const withoutCard = newOpponentHand.filter(c => c !== card);
            const contribution = calculateDeadwood(newOpponentHand) - calculateDeadwood(withoutCard);
            if (contribution > maxContribution) {
                maxContribution = contribution;
                maxDeadwoodCard = card;
            }
        });

        // Discard the highest deadwood card
        const finalHand = newOpponentHand.filter(c => c !== maxDeadwoodCard);
        setOpponentHand(finalHand);
        setDeck(newDeck);
        setDiscardPile(prev => [...prev, maxDeadwoodCard]);

        // Check if opponent has gin
        const opponentDeadwood = calculateDeadwood(finalHand);
        if (opponentDeadwood === 0) {
            setMessage('Opponent got GIN! 😱');
            setOpponentScore(prev => prev + 25);
            setPhase('gameOver');
            setWinner('opponent');
            return;
        }

        setPhase('draw');
        setMessage('Your turn! Draw from deck or discard pile.');
    };

    // Knock (end round with 10 or less deadwood)
    const knock = () => {
        const deadwood = calculateDeadwood(playerHand);
        if (deadwood > 10) {
            setMessage('Cannot knock! Deadwood must be 10 or less.');
            return;
        }

        const opponentDeadwood = calculateDeadwood(opponentHand);

        if (deadwood < opponentDeadwood) {
            const points = opponentDeadwood - deadwood;
            setPlayerScore(prev => prev + points);
            setMessage(`You win with ${points} points!`);
            setWinner('player');
        } else {
            const points = deadwood - opponentDeadwood + 25; // Undercut bonus
            setOpponentScore(prev => prev + points);
            setMessage(`Undercut! Opponent wins ${points} points.`);
            setWinner('opponent');
        }
        setPhase('gameOver');
    };

    // Render card
    const renderCard = (card: Card, onClick?: () => void, isSelected?: boolean, isBack?: boolean) => (
        <button
            key={isBack ? Math.random() : `${card.rank}-${card.suit}`}
            onClick={onClick}
            disabled={!onClick}
            style={{
                width: '50px',
                height: '70px',
                background: isBack ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'white',
                border: `2px solid ${isSelected ? '#10b981' : isBack ? '#1e40af' : '#e2e8f0'}`,
                borderRadius: '6px',
                cursor: onClick ? 'pointer' : 'default',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: isBack ? 'white' : getSuitColor(card.suit),
                boxShadow: isSelected ? '0 0 15px rgba(16, 185, 129, 0.6)' : '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s',
                transform: isSelected ? 'translateY(-8px)' : 'translateY(0)',
                margin: '-8px',
            }}
        >
            {!isBack && (
                <>
                    <span>{card.rank}</span>
                    <span style={{ fontSize: '1.1rem' }}>{getSuitSymbol(card.suit)}</span>
                </>
            )}
            {isBack && <span>🂠</span>}
        </button>
    );

    const playerDeadwood = calculateDeadwood(playerHand);

    return (
        <div style={{ padding: '1rem', maxWidth: '700px', margin: '0 auto' }}>
            {/* Scores */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '8px'
            }}>
                <div>
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>You: {playerScore}</span>
                </div>
                <div>
                    <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>Opponent: {opponentScore}</span>
                </div>
            </div>

            {/* Message */}
            <div style={{
                textAlign: 'center',
                padding: '0.5rem',
                marginBottom: '1rem',
                background: 'rgba(99, 102, 241, 0.2)',
                borderRadius: '8px',
                color: '#a5b4fc'
            }}>
                {message}
            </div>

            {/* Opponent's hand (face down) */}
            <div style={{ marginBottom: '1rem' }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    Opponent ({opponentHand.length} cards)
                </div>
                <div style={{ display: 'flex', paddingLeft: '10px' }}>
                    {opponentHand.slice(0, 8).map((card, i) =>
                        renderCard(card, undefined, false, true)
                    )}
                    {opponentHand.length > 8 && (
                        <span style={{ color: 'rgba(255,255,255,0.5)', marginLeft: '1rem' }}>
                            +{opponentHand.length - 8}
                        </span>
                    )}
                </div>
            </div>

            {/* Deck and Discard */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                margin: '1.5rem 0',
                padding: '1rem',
                background: 'rgba(30, 30, 60, 0.5)',
                borderRadius: '12px',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', fontSize: '0.75rem' }}>
                        Deck ({deck.length})
                    </div>
                    <button
                        onClick={drawFromDeck}
                        disabled={phase !== 'draw'}
                        style={{
                            width: '60px',
                            height: '80px',
                            background: phase === 'draw'
                                ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                                : 'rgba(255,255,255,0.1)',
                            border: phase === 'draw' ? '2px solid #60a5fa' : '2px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            cursor: phase === 'draw' ? 'pointer' : 'default',
                            color: 'white',
                            fontSize: '1.5rem',
                        }}
                    >
                        🂠
                    </button>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', fontSize: '0.75rem' }}>
                        Discard
                    </div>
                    {discardPile.length > 0 ? (
                        <button
                            onClick={drawFromDiscard}
                            disabled={phase !== 'draw'}
                            style={{
                                width: '60px',
                                height: '80px',
                                background: 'white',
                                border: phase === 'draw' ? '2px solid #10b981' : '2px solid #e2e8f0',
                                borderRadius: '8px',
                                cursor: phase === 'draw' ? 'pointer' : 'default',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: getSuitColor(discardPile[discardPile.length - 1].suit),
                                fontWeight: 'bold',
                            }}
                        >
                            <span>{discardPile[discardPile.length - 1].rank}</span>
                            <span style={{ fontSize: '1.25rem' }}>
                                {getSuitSymbol(discardPile[discardPile.length - 1].suit)}
                            </span>
                        </button>
                    ) : (
                        <div style={{
                            width: '60px',
                            height: '80px',
                            border: '2px dashed rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                        }} />
                    )}
                </div>
            </div>

            {/* Player's hand */}
            <div style={{ marginBottom: '1rem' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                        Your Hand ({playerHand.length} cards)
                    </span>
                    <span style={{
                        color: playerDeadwood <= 10 ? '#10b981' : '#f59e0b',
                        fontSize: '0.85rem'
                    }}>
                        Deadwood: {playerDeadwood}
                    </span>
                </div>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    padding: '0.75rem',
                    paddingLeft: '12px',
                    background: 'rgba(30, 30, 60, 0.5)',
                    borderRadius: '8px',
                    gap: '2px',
                }}>
                    {playerHand.map(card => {
                        const cardKey = `${card.rank}-${card.suit}`;
                        return renderCard(
                            card,
                            phase === 'discard'
                                ? () => discardCard(card)
                                : undefined,
                            selectedCards.has(cardKey)
                        );
                    })}
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                {phase === 'discard' && playerDeadwood <= 10 && (
                    <button onClick={knock} className="btn btn-accent">
                        Knock! ({playerDeadwood} deadwood)
                    </button>
                )}
                {phase === 'gameOver' && (
                    <button onClick={initGame} className="btn btn-primary">
                        New Round
                    </button>
                )}
            </div>

            {/* Rules */}
            <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.6)'
            }}>
                <strong>How to Play:</strong>
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                    <li>Draw a card from deck or discard pile</li>
                    <li>Form sets (same rank) or runs (same suit, consecutive)</li>
                    <li>Discard one card to end your turn</li>
                    <li>Knock when deadwood ≤10, or go GIN with 0 deadwood!</li>
                </ul>
            </div>
        </div>
    );
}
