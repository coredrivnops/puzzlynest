'use client';

import React, { useState, useEffect, useCallback } from 'react';

// Card types
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

interface Card {
    suit: Suit;
    rank: Rank;
    value: number;
}

interface Player {
    name: string;
    cards: Card[];
    tricks: Card[][];
    score: number;
    isAI: boolean;
}

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const RANK_VALUES: Record<Rank, number> = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 11, 'Q': 12, 'K': 13, 'A': 14
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

const calculatePoints = (tricks: Card[][]): number => {
    let points = 0;
    for (const trick of tricks) {
        for (const card of trick) {
            if (card.suit === 'hearts') points += 1;
            if (card.suit === 'spades' && card.rank === 'Q') points += 13;
        }
    }
    return points;
};

export default function HeartsGame() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [currentTrick, setCurrentTrick] = useState<(Card | null)[]>([null, null, null, null]);
    const [leadPlayer, setLeadPlayer] = useState(0);
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [heartsBroken, setHeartsBroken] = useState(false);
    const [gamePhase, setGamePhase] = useState<'dealing' | 'playing' | 'trickComplete' | 'roundOver' | 'gameOver'>('dealing');
    const [roundScores, setRoundScores] = useState<number[]>([0, 0, 0, 0]);
    const [message, setMessage] = useState('');

    // Initialize game
    const initGame = useCallback(() => {
        const deck = shuffleDeck(createDeck());
        const newPlayers: Player[] = [
            { name: 'You', cards: [], tricks: [], score: 0, isAI: false },
            { name: 'West', cards: [], tricks: [], score: 0, isAI: true },
            { name: 'North', cards: [], tricks: [], score: 0, isAI: true },
            { name: 'East', cards: [], tricks: [], score: 0, isAI: true },
        ];

        // Deal 13 cards to each player
        for (let i = 0; i < 52; i++) {
            newPlayers[i % 4].cards.push(deck[i]);
        }

        // Sort each player's hand
        newPlayers.forEach(player => {
            player.cards.sort((a, b) => {
                const suitOrder = { clubs: 0, diamonds: 1, spades: 2, hearts: 3 };
                if (suitOrder[a.suit] !== suitOrder[b.suit]) {
                    return suitOrder[a.suit] - suitOrder[b.suit];
                }
                return a.value - b.value;
            });
        });

        // Find player with 2 of clubs
        let startPlayer = 0;
        for (let i = 0; i < 4; i++) {
            if (newPlayers[i].cards.some(c => c.suit === 'clubs' && c.rank === '2')) {
                startPlayer = i;
                break;
            }
        }

        setPlayers(newPlayers);
        setCurrentTrick([null, null, null, null]);
        setLeadPlayer(startPlayer);
        setCurrentPlayer(startPlayer);
        setHeartsBroken(false);
        setGamePhase('playing');
        setMessage(startPlayer === 0 ? 'Your turn! Lead with 2♣' : `${newPlayers[startPlayer].name} leads`);
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    // Check if card can be played
    const canPlayCard = (card: Card, playerIndex: number): boolean => {
        const player = players[playerIndex];
        const leadSuit = currentTrick[leadPlayer]?.suit;

        // First trick must lead 2 of clubs
        if (currentTrick.every(c => c === null) && leadPlayer === currentPlayer) {
            if (players.every(p => p.tricks.length === 0)) {
                return card.suit === 'clubs' && card.rank === '2';
            }
        }

        // Must follow suit if possible
        if (leadSuit) {
            const hasSuit = player.cards.some(c => c.suit === leadSuit);
            if (hasSuit && card.suit !== leadSuit) return false;
        }

        // Can't lead hearts until broken (unless only hearts left)
        if (!leadSuit && card.suit === 'hearts' && !heartsBroken) {
            const hasNonHearts = player.cards.some(c => c.suit !== 'hearts');
            if (hasNonHearts) return false;
        }

        // Can't play hearts or queen of spades on first trick
        if (players.every(p => p.tricks.length === 0)) {
            if (card.suit === 'hearts') return false;
            if (card.suit === 'spades' && card.rank === 'Q') return false;
        }

        return true;
    };

    // Play a card
    const playCard = (card: Card, playerIndex: number) => {
        if (playerIndex !== currentPlayer || gamePhase !== 'playing') return;
        if (!canPlayCard(card, playerIndex)) return;

        // Remove card from hand
        const newPlayers = [...players];
        const cardIndex = newPlayers[playerIndex].cards.findIndex(
            c => c.suit === card.suit && c.rank === card.rank
        );
        newPlayers[playerIndex].cards.splice(cardIndex, 1);

        // Add to trick
        const newTrick = [...currentTrick];
        newTrick[playerIndex] = card;

        // Check if hearts broken
        if (card.suit === 'hearts' && !heartsBroken) {
            setHeartsBroken(true);
        }

        setPlayers(newPlayers);
        setCurrentTrick(newTrick);

        // Check if trick is complete
        if (newTrick.every(c => c !== null)) {
            setGamePhase('trickComplete');
            setTimeout(() => completeTrick(newTrick as Card[], newPlayers), 1000);
        } else {
            // Next player
            const next = (playerIndex + 1) % 4;
            setCurrentPlayer(next);
            if (newPlayers[next].isAI) {
                setTimeout(() => aiPlay(next, newPlayers, newTrick), 500);
            }
        }
    };

    // AI plays a card
    const aiPlay = (playerIndex: number, currentPlayers: Player[], trick: (Card | null)[]) => {
        const player = currentPlayers[playerIndex];
        const playableCards = player.cards.filter(c => {
            // Simplified check for AI
            const leadSuit = trick[leadPlayer]?.suit;
            if (leadSuit) {
                const hasSuit = player.cards.some(card => card.suit === leadSuit);
                if (hasSuit) return c.suit === leadSuit;
            }
            return true;
        });

        if (playableCards.length > 0) {
            // Simple AI: play lowest card, avoid points
            const sortedPlayable = [...playableCards].sort((a, b) => {
                // Prioritize getting rid of high spades and hearts
                if (a.suit === 'spades' && a.rank === 'Q') return -1;
                if (b.suit === 'spades' && b.rank === 'Q') return 1;
                if (a.suit === 'hearts' && b.suit !== 'hearts') return -1;
                if (b.suit === 'hearts' && a.suit !== 'hearts') return 1;
                return a.value - b.value;
            });
            playCard(sortedPlayable[0], playerIndex);
        }
    };

    // Complete a trick
    const completeTrick = (trick: Card[], currentPlayers: Player[]) => {
        const leadSuit = trick[leadPlayer].suit;
        let winnerIndex = leadPlayer;
        let highestValue = 0;

        // Find winner (highest card of lead suit)
        for (let i = 0; i < 4; i++) {
            if (trick[i].suit === leadSuit && trick[i].value > highestValue) {
                highestValue = trick[i].value;
                winnerIndex = i;
            }
        }

        // Add trick to winner
        const newPlayers = [...currentPlayers];
        newPlayers[winnerIndex].tricks.push(trick);
        setPlayers(newPlayers);

        // Check if round is over
        if (newPlayers[0].cards.length === 0) {
            endRound(newPlayers);
        } else {
            // Next trick
            setCurrentTrick([null, null, null, null]);
            setLeadPlayer(winnerIndex);
            setCurrentPlayer(winnerIndex);
            setGamePhase('playing');
            setMessage(`${newPlayers[winnerIndex].name} wins the trick!`);

            if (newPlayers[winnerIndex].isAI) {
                setTimeout(() => aiPlay(winnerIndex, newPlayers, [null, null, null, null]), 500);
            }
        }
    };

    // End round
    const endRound = (finalPlayers: Player[]) => {
        const points = finalPlayers.map(p => calculatePoints(p.tricks));

        // Check for shooting the moon
        const moonShooter = points.findIndex(p => p === 26);
        if (moonShooter !== -1) {
            points[moonShooter] = 0;
            for (let i = 0; i < 4; i++) {
                if (i !== moonShooter) points[i] = 26;
            }
            setMessage(`${finalPlayers[moonShooter].name} shot the moon! 🌙`);
        }

        const newScores = roundScores.map((s, i) => s + points[i]);
        setRoundScores(newScores);

        // Check for game over (100 points)
        if (newScores.some(s => s >= 100)) {
            setGamePhase('gameOver');
            const winner = newScores.indexOf(Math.min(...newScores));
            setMessage(`Game Over! ${finalPlayers[winner].name} wins!`);
        } else {
            setGamePhase('roundOver');
            setMessage(`Round over! Points: You: ${points[0]}, West: ${points[1]}, North: ${points[2]}, East: ${points[3]}`);
        }
    };

    // Start new round
    const startNewRound = () => {
        const newPlayers = players.map(p => ({
            ...p,
            cards: [],
            tricks: []
        }));
        setPlayers(newPlayers);
        initGame();
    };

    // Render card
    const renderCard = (card: Card, onClick?: () => void, isPlayable?: boolean) => (
        <button
            key={`${card.rank}-${card.suit}`}
            onClick={onClick}
            disabled={!onClick}
            style={{
                width: '50px',
                height: '70px',
                background: 'white',
                border: `2px solid ${isPlayable ? '#6366f1' : '#e2e8f0'}`,
                borderRadius: '6px',
                cursor: onClick ? 'pointer' : 'default',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: getSuitColor(card.suit),
                boxShadow: isPlayable ? '0 0 10px rgba(99, 102, 241, 0.5)' : '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                margin: '-10px',
            }}
        >
            <span>{card.rank}</span>
            <span style={{ fontSize: '1.2rem' }}>{getSuitSymbol(card.suit)}</span>
        </button>
    );

    if (players.length === 0) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
            {/* Scores */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginBottom: '1rem',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '8px'
            }}>
                {players.map((p, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold', color: i === 0 ? '#10b981' : 'white' }}>
                            {p.name}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                            {roundScores[i]} pts
                        </div>
                    </div>
                ))}
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

            {/* Game table */}
            <div style={{
                background: '#1a472a',
                borderRadius: '12px',
                padding: '1rem',
                minHeight: '300px',
                position: 'relative',
                border: '4px solid #0d3320'
            }}>
                {/* North (AI) */}
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                        North ({players[2].cards.length} cards)
                    </div>
                    {currentTrick[2] && renderCard(currentTrick[2])}
                </div>

                {/* West and East */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                            West ({players[1].cards.length})
                        </div>
                        {currentTrick[1] && renderCard(currentTrick[1])}
                    </div>

                    {/* Center trick area */}
                    <div style={{
                        width: '120px',
                        height: '90px',
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255,255,255,0.3)',
                        fontSize: '0.8rem'
                    }}>
                        {heartsBroken ? '♥ Broken' : 'Play Area'}
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                            East ({players[3].cards.length})
                        </div>
                        {currentTrick[3] && renderCard(currentTrick[3])}
                    </div>
                </div>

                {/* South (You) played card */}
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    {currentTrick[0] && renderCard(currentTrick[0])}
                </div>
            </div>

            {/* Your hand */}
            <div style={{ marginTop: '1rem' }}>
                <div style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    Your Hand ({players[0].cards.length} cards):
                </div>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    padding: '0.5rem',
                    background: 'rgba(30, 30, 60, 0.5)',
                    borderRadius: '8px',
                    gap: '2px',
                    paddingLeft: '12px'
                }}>
                    {players[0].cards.map(card => {
                        const isPlayable = currentPlayer === 0 && gamePhase === 'playing' && canPlayCard(card, 0);
                        return renderCard(
                            card,
                            isPlayable ? () => playCard(card, 0) : undefined,
                            isPlayable
                        );
                    })}
                </div>
            </div>

            {/* Round over / Game over buttons */}
            {(gamePhase === 'roundOver' || gamePhase === 'gameOver') && (
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <button
                        onClick={gamePhase === 'gameOver' ? initGame : startNewRound}
                        className="btn btn-primary"
                    >
                        {gamePhase === 'gameOver' ? 'New Game' : 'Next Round'}
                    </button>
                </div>
            )}

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
                    <li>Avoid taking hearts (1 pt each) and Queen of Spades (13 pts)</li>
                    <li>2♣ leads the first trick</li>
                    <li>Must follow suit if possible</li>
                    <li>Can't lead hearts until "broken"</li>
                    <li>Take all 26 points = "Shoot the Moon" (opponents get 26!)</li>
                </ul>
            </div>
        </div>
    );
}
