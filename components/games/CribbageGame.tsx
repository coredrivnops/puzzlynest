'use client';

import React, { useState, useCallback } from 'react';

// Card types
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

interface Card {
    suit: Suit;
    rank: Rank;
    value: number; // Face value for counting (1-10)
    order: number; // For runs (1-13)
}

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

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
    SUITS.forEach(suit => {
        RANKS.forEach((rank, idx) => {
            deck.push({
                suit,
                rank,
                value: Math.min(idx + 1, 10), // A=1, 2-10=face, J/Q/K=10
                order: idx + 1, // A=1 ... K=13
            });
        });
    });
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

// Calculate cribbage hand score
const calculateHandScore = (hand: Card[], cut: Card, isCrib: boolean = false): { total: number; breakdown: string[] } => {
    const allCards = [...hand, cut];
    const breakdown: string[] = [];
    let total = 0;

    // 15s (combinations that sum to 15)
    const findFifteens = (cards: Card[], target: number, start: number, current: Card[]): number => {
        const sum = current.reduce((acc, c) => acc + c.value, 0);
        if (sum === target) return 1;
        if (sum > target) return 0;

        let count = 0;
        for (let i = start; i < cards.length; i++) {
            count += findFifteens(cards, target, i + 1, [...current, cards[i]]);
        }
        return count;
    };

    const fifteens = findFifteens(allCards, 15, 0, []);
    if (fifteens > 0) {
        total += fifteens * 2;
        breakdown.push(`Fifteens: ${fifteens} × 2 = ${fifteens * 2}`);
    }

    // Pairs
    let pairs = 0;
    for (let i = 0; i < allCards.length; i++) {
        for (let j = i + 1; j < allCards.length; j++) {
            if (allCards[i].rank === allCards[j].rank) pairs++;
        }
    }
    if (pairs > 0) {
        total += pairs * 2;
        breakdown.push(`Pairs: ${pairs} × 2 = ${pairs * 2}`);
    }

    // Runs (sequences of 3+)
    const sorted = [...allCards].sort((a, b) => a.order - b.order);
    const findRuns = (): number => {
        let runPoints = 0;

        // Check all possible run lengths starting from 5 down to 3
        for (let len = 5; len >= 3; len--) {
            for (let start = 0; start <= sorted.length - len; start++) {
                const subset = sorted.slice(start, start + len);
                let isRun = true;
                for (let i = 1; i < subset.length; i++) {
                    if (subset[i].order - subset[i - 1].order !== 1) {
                        isRun = false;
                        break;
                    }
                }
                if (isRun) {
                    // Count duplicates for multiple runs
                    const rankCounts = new Map<number, number>();
                    allCards.forEach(c => {
                        if (c.order >= subset[0].order && c.order <= subset[subset.length - 1].order) {
                            rankCounts.set(c.order, (rankCounts.get(c.order) || 0) + 1);
                        }
                    });
                    let multiplier = 1;
                    rankCounts.forEach(count => multiplier *= count);
                    runPoints = len * multiplier;
                    return runPoints;
                }
            }
        }
        return runPoints;
    };

    const runPoints = findRuns();
    if (runPoints > 0) {
        total += runPoints;
        breakdown.push(`Runs: ${runPoints}`);
    }

    // Flush (4 cards same suit in hand, or 5 with cut)
    const handSuits = hand.map(c => c.suit);
    if (handSuits.every(s => s === handSuits[0])) {
        if (cut.suit === handSuits[0]) {
            total += 5;
            breakdown.push('Flush (5 cards): 5');
        } else if (!isCrib) {
            total += 4;
            breakdown.push('Flush (4 cards): 4');
        }
    }

    // Nobs (Jack of same suit as cut)
    const nobs = hand.find(c => c.rank === 'J' && c.suit === cut.suit);
    if (nobs) {
        total += 1;
        breakdown.push('Nobs (Jack): 1');
    }

    return { total, breakdown };
};

export default function CribbageGame() {
    const [phase, setPhase] = useState<'deal' | 'discard' | 'pegging' | 'counting' | 'gameOver'>('deal');
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    const [opponentHand, setOpponentHand] = useState<Card[]>([]);
    const [crib, setCrib] = useState<Card[]>([]);
    const [cut, setCut] = useState<Card | null>(null);
    const [playerScore, setPlayerScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
    const [isPlayerDealer, setIsPlayerDealer] = useState(false);
    const [message, setMessage] = useState('');
    const [scoreBreakdown, setScoreBreakdown] = useState<string[]>([]);
    const [deck, setDeck] = useState<Card[]>([]);

    const initGame = useCallback(() => {
        const newDeck = shuffleDeck(createDeck());
        const pHand = newDeck.splice(0, 6);
        const oHand = newDeck.splice(0, 6);

        setDeck(newDeck);
        setPlayerHand(pHand);
        setOpponentHand(oHand);
        setCrib([]);
        setCut(null);
        setSelectedCards(new Set());
        setPhase('discard');
        setIsPlayerDealer(prev => !prev);
        setMessage('Select 2 cards to discard to the crib.');
        setScoreBreakdown([]);
    }, []);

    // Start new game
    const startNewGame = () => {
        setPlayerScore(0);
        setOpponentScore(0);
        initGame();
    };

    // Toggle card selection
    const toggleCard = (card: Card) => {
        if (phase !== 'discard') return;

        const cardKey = `${card.rank}-${card.suit}`;
        const newSelected = new Set(selectedCards);

        if (newSelected.has(cardKey)) {
            newSelected.delete(cardKey);
        } else if (newSelected.size < 2) {
            newSelected.add(cardKey);
        }

        setSelectedCards(newSelected);
    };

    // Confirm discard to crib
    const confirmDiscard = () => {
        if (selectedCards.size !== 2) return;

        const discarded: Card[] = [];
        const kept: Card[] = [];

        playerHand.forEach(card => {
            const key = `${card.rank}-${card.suit}`;
            if (selectedCards.has(key)) {
                discarded.push(card);
            } else {
                kept.push(card);
            }
        });

        // Opponent discards 2 cards (simple AI - discard highest values)
        const sortedOpp = [...opponentHand].sort((a, b) => b.value - a.value);
        const oppDiscards = sortedOpp.slice(0, 2);
        const oppKept = sortedOpp.slice(2);

        setPlayerHand(kept);
        setOpponentHand(oppKept);
        setCrib([...discarded, ...oppDiscards]);
        setSelectedCards(new Set());

        // Cut the deck
        const cutCard = deck[Math.floor(Math.random() * deck.length)];
        setCut(cutCard);

        // Check for His Heels (Jack as cut)
        if (cutCard.rank === 'J') {
            const dealerBonus = isPlayerDealer ? 2 : 0;
            if (isPlayerDealer) {
                setPlayerScore(prev => prev + 2);
                setMessage(`Cut: ${cutCard.rank}${getSuitSymbol(cutCard.suit)} - His Heels! Dealer gets 2 points.`);
            } else {
                setOpponentScore(prev => prev + 2);
                setMessage(`Cut: ${cutCard.rank}${getSuitSymbol(cutCard.suit)} - His Heels! Dealer gets 2 points.`);
            }
        } else {
            setMessage(`Cut: ${cutCard.rank}${getSuitSymbol(cutCard.suit)}`);
        }

        // Skip pegging for simplicity, go to counting
        setTimeout(() => {
            countHands(kept, oppKept, [...discarded, ...oppDiscards], cutCard);
        }, 1500);
    };

    // Count hands
    const countHands = (pHand: Card[], oHand: Card[], cribCards: Card[], cutCard: Card) => {
        setPhase('counting');

        // Non-dealer counts first
        const nonDealerHand = isPlayerDealer ? oHand : pHand;
        const dealerHand = isPlayerDealer ? pHand : oHand;

        const nonDealerScore = calculateHandScore(nonDealerHand, cutCard);
        const dealerScore = calculateHandScore(dealerHand, cutCard);
        const cribScore = calculateHandScore(cribCards, cutCard, true);

        const breakdown: string[] = [];

        if (isPlayerDealer) {
            breakdown.push(`Opponent: ${nonDealerScore.total} points`);
            breakdown.push(...nonDealerScore.breakdown.map(s => `  ${s}`));
            setOpponentScore(prev => prev + nonDealerScore.total);

            breakdown.push(`Your hand: ${dealerScore.total} points`);
            breakdown.push(...dealerScore.breakdown.map(s => `  ${s}`));
            setPlayerScore(prev => prev + dealerScore.total);

            breakdown.push(`Your crib: ${cribScore.total} points`);
            breakdown.push(...cribScore.breakdown.map(s => `  ${s}`));
            setPlayerScore(prev => prev + cribScore.total);
        } else {
            breakdown.push(`Your hand: ${nonDealerScore.total} points`);
            breakdown.push(...nonDealerScore.breakdown.map(s => `  ${s}`));
            setPlayerScore(prev => prev + nonDealerScore.total);

            breakdown.push(`Opponent: ${dealerScore.total} points`);
            breakdown.push(...dealerScore.breakdown.map(s => `  ${s}`));
            setOpponentScore(prev => prev + dealerScore.total);

            breakdown.push(`Opponent crib: ${cribScore.total} points`);
            breakdown.push(...cribScore.breakdown.map(s => `  ${s}`));
            setOpponentScore(prev => prev + cribScore.total);
        }

        setScoreBreakdown(breakdown);
        setMessage('Round complete! Check the scoring breakdown.');

        // Check for win (121 points)
        setTimeout(() => {
            if (playerScore >= 121) {
                setPhase('gameOver');
                setMessage('🎉 You win the game!');
            } else if (opponentScore >= 121) {
                setPhase('gameOver');
                setMessage('Opponent wins! 😔');
            }
        }, 500);
    };

    // Render card
    const renderCard = (card: Card, onClick?: () => void, isSelected?: boolean, isHidden?: boolean) => (
        <button
            key={isHidden ? Math.random() : `${card.rank}-${card.suit}`}
            onClick={onClick}
            disabled={!onClick}
            style={{
                width: '50px',
                height: '70px',
                background: isHidden ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' : 'white',
                border: `2px solid ${isSelected ? '#10b981' : isHidden ? '#7c3aed' : '#e2e8f0'}`,
                borderRadius: '6px',
                cursor: onClick ? 'pointer' : 'default',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: isHidden ? 'white' : getSuitColor(card.suit),
                boxShadow: isSelected ? '0 0 15px rgba(16, 185, 129, 0.6)' : '0 2px 4px rgba(0,0,0,0.1)',
                transform: isSelected ? 'translateY(-8px)' : 'translateY(0)',
                transition: 'all 0.2s',
                margin: '-8px',
            }}
        >
            {!isHidden && (
                <>
                    <span>{card.rank}</span>
                    <span style={{ fontSize: '1.1rem' }}>{getSuitSymbol(card.suit)}</span>
                </>
            )}
            {isHidden && <span style={{ fontSize: '1.5rem' }}>🂠</span>}
        </button>
    );

    // Render peg board (simplified visual)
    const renderPegBoard = () => (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            padding: '0.75rem',
            background: '#5c4033',
            borderRadius: '8px',
            border: '2px solid #3d2817'
        }}>
            <div>
                <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    You: {playerScore}/121
                </div>
                <div style={{
                    width: `${Math.min((playerScore / 121) * 150, 150)}px`,
                    height: '8px',
                    background: '#10b981',
                    borderRadius: '4px',
                    transition: 'width 0.5s'
                }} />
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    Opp: {opponentScore}/121
                </div>
                <div style={{
                    width: `${Math.min((opponentScore / 121) * 150, 150)}px`,
                    height: '8px',
                    background: '#f59e0b',
                    borderRadius: '4px',
                    marginLeft: 'auto',
                    transition: 'width 0.5s'
                }} />
            </div>
        </div>
    );

    return (
        <div style={{ padding: '1rem', maxWidth: '700px', margin: '0 auto' }}>
            {/* Peg Board */}
            {renderPegBoard()}

            {/* Message */}
            <div style={{
                textAlign: 'center',
                padding: '0.5rem',
                marginBottom: '1rem',
                background: 'rgba(99, 102, 241, 0.2)',
                borderRadius: '8px',
                color: '#a5b4fc'
            }}>
                {message || (phase === 'deal' ? 'Click "Deal" to start' : '')}
                {isPlayerDealer && phase !== 'gameOver' && (
                    <span style={{ marginLeft: '0.5rem', color: '#f59e0b' }}>(You deal)</span>
                )}
            </div>

            {/* Cut card */}
            {cut && (
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                        Cut Card
                    </div>
                    {renderCard(cut)}
                </div>
            )}

            {/* Opponent's hand */}
            {opponentHand.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                        Opponent ({opponentHand.length} cards)
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', paddingLeft: '10px' }}>
                        {opponentHand.map((card, i) =>
                            renderCard(card, undefined, false, phase === 'discard')
                        )}
                    </div>
                </div>
            )}

            {/* Player's hand */}
            {playerHand.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                        Your Hand ({playerHand.length} cards)
                        {phase === 'discard' && (
                            <span style={{ color: '#f59e0b', marginLeft: '0.5rem' }}>
                                - Select 2 to discard
                            </span>
                        )}
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '0.75rem',
                        paddingLeft: '12px',
                        background: 'rgba(30, 30, 60, 0.5)',
                        borderRadius: '8px',
                    }}>
                        {playerHand.map(card => {
                            const cardKey = `${card.rank}-${card.suit}`;
                            return renderCard(
                                card,
                                phase === 'discard' ? () => toggleCard(card) : undefined,
                                selectedCards.has(cardKey)
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Crib */}
            {crib.length > 0 && phase === 'counting' && (
                <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                    <div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                        Crib ({isPlayerDealer ? 'Yours' : "Opponent's"})
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', paddingLeft: '10px' }}>
                        {crib.map(card => renderCard(card))}
                    </div>
                </div>
            )}

            {/* Score Breakdown */}
            {scoreBreakdown.length > 0 && (
                <div style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    fontSize: '0.85rem'
                }}>
                    <strong style={{ color: '#a5b4fc' }}>Scoring:</strong>
                    {scoreBreakdown.map((line, i) => (
                        <div
                            key={i}
                            style={{
                                color: line.startsWith('  ') ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.8)',
                                marginTop: line.startsWith('  ') ? '0' : '0.5rem'
                            }}
                        >
                            {line}
                        </div>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                {phase === 'deal' && (
                    <button onClick={initGame} className="btn btn-primary">
                        Deal Cards
                    </button>
                )}
                {phase === 'discard' && selectedCards.size === 2 && (
                    <button onClick={confirmDiscard} className="btn btn-primary">
                        Discard to Crib
                    </button>
                )}
                {phase === 'counting' && (
                    <button onClick={initGame} className="btn btn-primary">
                        Next Round
                    </button>
                )}
                {phase === 'gameOver' && (
                    <button onClick={startNewGame} className="btn btn-primary">
                        New Game
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
                    <li>Discard 2 cards to the crib (dealer gets crib points)</li>
                    <li><strong>15s:</strong> 2 pts for each combo totaling 15</li>
                    <li><strong>Pairs:</strong> 2 pts each pair</li>
                    <li><strong>Runs:</strong> 1 pt per card in sequence</li>
                    <li><strong>Flush:</strong> 4-5 pts for same suit</li>
                    <li>First to 121 points wins!</li>
                </ul>
            </div>
        </div>
    );
}
