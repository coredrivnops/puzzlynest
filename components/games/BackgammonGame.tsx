'use client';

import React, { useState, useCallback } from 'react';

type Color = 'white' | 'black';

interface Point {
    checkers: number;
    color: Color | null;
}

interface GameState {
    points: Point[];
    bar: { white: number; black: number };
    bearOff: { white: number; black: number };
    currentPlayer: Color;
    dice: [number, number];
    diceUsed: boolean[];
    phase: 'roll' | 'move' | 'gameOver';
    message: string;
}

const POINT_COUNT = 24;

// Create initial board setup
const createInitialBoard = (): Point[] => {
    const points: Point[] = Array(POINT_COUNT).fill(null).map(() => ({ checkers: 0, color: null }));

    // White checkers (moving from point 1 to 24)
    points[0] = { checkers: 2, color: 'white' };
    points[11] = { checkers: 5, color: 'white' };
    points[16] = { checkers: 3, color: 'white' };
    points[18] = { checkers: 5, color: 'white' };

    // Black checkers (moving from point 24 to 1)
    points[23] = { checkers: 2, color: 'black' };
    points[12] = { checkers: 5, color: 'black' };
    points[7] = { checkers: 3, color: 'black' };
    points[5] = { checkers: 5, color: 'black' };

    return points;
};

export default function BackgammonGame() {
    const [gameState, setGameState] = useState<GameState>(() => ({
        points: createInitialBoard(),
        bar: { white: 0, black: 0 },
        bearOff: { white: 0, black: 0 },
        currentPlayer: 'white',
        dice: [0, 0],
        diceUsed: [false, false],
        phase: 'roll',
        message: 'Roll the dice to start!'
    }));

    const [selectedPoint, setSelectedPoint] = useState<number | null>(null);

    // Roll dice
    const rollDice = () => {
        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;

        setGameState(prev => ({
            ...prev,
            dice: [die1, die2],
            diceUsed: die1 === die2 ? [false, false, false, false] : [false, false],
            phase: 'move',
            message: `Rolled ${die1} and ${die2}. Select a checker to move.`
        }));
        setSelectedPoint(null);
    };

    // Get valid moves for a point
    const getValidMoves = useCallback((fromPoint: number, dice: number[], diceUsed: boolean[]): number[] => {
        const { points, bar, currentPlayer } = gameState;
        const moves: number[] = [];

        // Must move from bar first
        if (bar[currentPlayer] > 0 && fromPoint !== -1) {
            return [];
        }

        const point = fromPoint === -1 ? { checkers: bar[currentPlayer], color: currentPlayer } : points[fromPoint];
        if (!point || point.checkers === 0 || point.color !== currentPlayer) {
            return [];
        }

        for (let i = 0; i < dice.length; i++) {
            if (diceUsed[i]) continue;

            const die = dice[i % 2]; // Handle doubles
            let toPoint: number;

            if (fromPoint === -1) {
                // Moving from bar
                toPoint = currentPlayer === 'white' ? die - 1 : 24 - die;
            } else {
                toPoint = currentPlayer === 'white' ? fromPoint + die : fromPoint - die;
            }

            // Check if bearing off
            if (toPoint >= 24 || toPoint < 0) {
                // Can only bear off if all checkers in home board
                const homeStart = currentPlayer === 'white' ? 18 : 0;
                const homeEnd = currentPlayer === 'white' ? 24 : 6;
                let allHome = bar[currentPlayer] === 0;
                for (let p = 0; p < 24; p++) {
                    if (points[p].color === currentPlayer) {
                        if (currentPlayer === 'white' && p < 18) allHome = false;
                        if (currentPlayer === 'black' && p >= 6) allHome = false;
                    }
                }
                if (allHome) {
                    moves.push(toPoint >= 24 ? 24 : -1);
                }
                continue;
            }

            const targetPoint = points[toPoint];
            // Can move if: empty, own color, or only 1 opponent (hit)
            if (!targetPoint.color ||
                targetPoint.color === currentPlayer ||
                targetPoint.checkers === 1) {
                if (!moves.includes(toPoint)) {
                    moves.push(toPoint);
                }
            }
        }

        return moves;
    }, [gameState]);

    // Make a move
    const makeMove = (toPoint: number) => {
        if (selectedPoint === null) return;

        const { points, bar, bearOff, currentPlayer, dice, diceUsed } = gameState;
        const newPoints = points.map(p => ({ ...p }));
        const newBar = { ...bar };
        const newBearOff = { ...bearOff };
        const newDiceUsed = [...diceUsed];

        // Calculate which die was used
        const fromPoint = selectedPoint;
        let dieUsed = -1;

        for (let i = 0; i < dice.length; i++) {
            if (newDiceUsed[i]) continue;
            const die = dice[i % 2];
            let expectedTo: number;

            if (fromPoint === -1) {
                expectedTo = currentPlayer === 'white' ? die - 1 : 24 - die;
            } else {
                expectedTo = currentPlayer === 'white' ? fromPoint + die : fromPoint - die;
            }

            if (expectedTo === toPoint || (toPoint === 24 && expectedTo >= 24) || (toPoint === -1 && expectedTo < 0)) {
                dieUsed = i;
                break;
            }
        }

        if (dieUsed === -1) return;
        newDiceUsed[dieUsed] = true;

        // Remove checker from source
        if (fromPoint === -1) {
            newBar[currentPlayer]--;
        } else {
            newPoints[fromPoint].checkers--;
            if (newPoints[fromPoint].checkers === 0) {
                newPoints[fromPoint].color = null;
            }
        }

        // Add checker to destination
        if (toPoint === 24 || toPoint === -1) {
            // Bearing off
            newBearOff[currentPlayer]++;
        } else {
            // Hit opponent if single checker
            if (newPoints[toPoint].color && newPoints[toPoint].color !== currentPlayer && newPoints[toPoint].checkers === 1) {
                const opponent = currentPlayer === 'white' ? 'black' : 'white';
                newBar[opponent]++;
                newPoints[toPoint].checkers = 0;
            }
            newPoints[toPoint].checkers++;
            newPoints[toPoint].color = currentPlayer;
        }

        // Check for win
        if (newBearOff[currentPlayer] === 15) {
            setGameState({
                ...gameState,
                points: newPoints,
                bar: newBar,
                bearOff: newBearOff,
                phase: 'gameOver',
                message: `${currentPlayer === 'white' ? 'You' : 'Black'} wins! 🎉`
            });
            setSelectedPoint(null);
            return;
        }

        // Check if turn is over
        const allDiceUsed = newDiceUsed.every(u => u);

        if (allDiceUsed) {
            const nextPlayer = currentPlayer === 'white' ? 'black' : 'white';
            setGameState({
                ...gameState,
                points: newPoints,
                bar: newBar,
                bearOff: newBearOff,
                currentPlayer: nextPlayer,
                dice: [0, 0],
                diceUsed: [false, false],
                phase: 'roll',
                message: `${nextPlayer === 'white' ? 'Your' : "Black's"} turn. Roll the dice!`
            });

            // AI plays if black's turn
            if (nextPlayer === 'black') {
                setTimeout(() => aiTurn(), 500);
            }
        } else {
            setGameState({
                ...gameState,
                points: newPoints,
                bar: newBar,
                bearOff: newBearOff,
                diceUsed: newDiceUsed,
                message: 'Continue moving...'
            });
        }

        setSelectedPoint(null);
    };

    // Simple AI turn
    const aiTurn = () => {
        // AI rolls dice
        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;

        setGameState(prev => {
            let state = {
                ...prev,
                dice: [die1, die2] as [number, number],
                diceUsed: die1 === die2 ? [false, false, false, false] : [false, false],
                phase: 'move' as const,
                message: `Black rolled ${die1} and ${die2}`
            };

            // AI makes moves (simplified)
            const newPoints = state.points.map(p => ({ ...p }));
            const newBar = { ...state.bar };
            const newBearOff = { ...state.bearOff };
            const newDiceUsed = [...state.diceUsed];

            // Try to use each die
            for (let d = 0; d < state.dice.length; d++) {
                if (newDiceUsed[d]) continue;

                // Find a movable piece
                for (let p = 23; p >= 0; p--) {
                    if (newPoints[p].color === 'black' && newPoints[p].checkers > 0) {
                        const die = state.dice[d % 2];
                        const toPoint = p - die;

                        if (toPoint >= 0 && toPoint < 24) {
                            const target = newPoints[toPoint];
                            if (!target.color || target.color === 'black' || target.checkers <= 1) {
                                // Make the move
                                if (target.color === 'white' && target.checkers === 1) {
                                    newBar.white++;
                                    newPoints[toPoint].checkers = 0;
                                }
                                newPoints[p].checkers--;
                                if (newPoints[p].checkers === 0) newPoints[p].color = null;
                                newPoints[toPoint].checkers++;
                                newPoints[toPoint].color = 'black';
                                newDiceUsed[d] = true;
                                break;
                            }
                        }
                    }
                }
            }

            return {
                ...state,
                points: newPoints,
                bar: newBar,
                bearOff: newBearOff,
                currentPlayer: 'white',
                dice: [0, 0],
                diceUsed: [false, false],
                phase: 'roll',
                message: 'Your turn! Roll the dice.'
            };
        });
    };

    // Handle point click
    const handlePointClick = (pointIndex: number) => {
        if (gameState.phase !== 'move') return;
        if (gameState.currentPlayer !== 'white') return;

        if (selectedPoint === null) {
            const point = pointIndex === -1
                ? { checkers: gameState.bar.white, color: 'white' as Color }
                : gameState.points[pointIndex];

            if (point.color === 'white' && point.checkers > 0) {
                const validMoves = getValidMoves(pointIndex, gameState.dice, gameState.diceUsed);
                if (validMoves.length > 0) {
                    setSelectedPoint(pointIndex);
                    setGameState(prev => ({
                        ...prev,
                        message: `Selected. Click destination to move.`
                    }));
                }
            }
        } else {
            const validMoves = getValidMoves(selectedPoint, gameState.dice, gameState.diceUsed);
            if (validMoves.includes(pointIndex)) {
                makeMove(pointIndex);
            } else {
                setSelectedPoint(null);
            }
        }
    };

    // Render a single point
    const renderPoint = (index: number, isTop: boolean) => {
        const point = gameState.points[index];
        const isSelected = selectedPoint === index;
        const validMoves = selectedPoint !== null
            ? getValidMoves(selectedPoint, gameState.dice, gameState.diceUsed)
            : [];
        const isValidTarget = validMoves.includes(index);

        return (
            <div
                key={index}
                onClick={() => handlePointClick(index)}
                style={{
                    width: '40px',
                    height: '150px',
                    display: 'flex',
                    flexDirection: isTop ? 'column' : 'column-reverse',
                    alignItems: 'center',
                    gap: '2px',
                    padding: '4px 0',
                    cursor: point.checkers > 0 || isValidTarget ? 'pointer' : 'default',
                    background: index % 2 === 0
                        ? 'linear-gradient(to bottom, #8b4513, #654321)'
                        : 'linear-gradient(to bottom, #d2691e, #a0522d)',
                    borderRadius: isTop ? '0 0 20px 20px' : '20px 20px 0 0',
                    border: isSelected ? '2px solid #fbbf24' : isValidTarget ? '2px solid #10b981' : 'none',
                    boxShadow: isSelected ? '0 0 10px #fbbf24' : isValidTarget ? '0 0 10px #10b981' : 'none',
                }}
            >
                {Array.from({ length: Math.min(point.checkers, 5) }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: point.color === 'white'
                                ? 'linear-gradient(135deg, #fff, #ddd)'
                                : 'linear-gradient(135deg, #333, #111)',
                            border: point.color === 'white' ? '2px solid #999' : '2px solid #555',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        }}
                    />
                ))}
                {point.checkers > 5 && (
                    <span style={{
                        fontSize: '0.7rem',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>
                        +{point.checkers - 5}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div style={{ padding: '1rem', maxWidth: '700px', margin: '0 auto' }}>
            {/* Status */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '8px'
            }}>
                <div>
                    <span style={{ color: gameState.currentPlayer === 'white' ? '#10b981' : '#f59e0b' }}>
                        ● {gameState.currentPlayer === 'white' ? 'Your' : "Black's"} turn
                    </span>
                </div>
                <div style={{ fontSize: '0.9rem' }}>
                    <span>You: {gameState.bearOff.white}/15</span>
                    <span style={{ margin: '0 1rem' }}>|</span>
                    <span>Black: {gameState.bearOff.black}/15</span>
                </div>
            </div>

            {/* Dice and Roll Button */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem'
            }}>
                {gameState.phase === 'roll' && gameState.currentPlayer === 'white' ? (
                    <button onClick={rollDice} className="btn btn-primary">
                        🎲 Roll Dice
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {gameState.dice.map((die, i) => (
                            <div
                                key={i}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    background: gameState.diceUsed[i] ? '#666' : 'white',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: gameState.diceUsed[i] ? '#999' : '#1e293b',
                                    textDecoration: gameState.diceUsed[i] ? 'line-through' : 'none'
                                }}
                            >
                                {die || '?'}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Message */}
            <div style={{
                textAlign: 'center',
                padding: '0.5rem',
                marginBottom: '1rem',
                background: 'rgba(99, 102, 241, 0.2)',
                borderRadius: '8px',
                color: '#a5b4fc',
                fontSize: '0.9rem'
            }}>
                {gameState.message}
            </div>

            {/* Board */}
            <div style={{
                background: '#654321',
                padding: '0.5rem',
                borderRadius: '12px',
                border: '4px solid #3d2817'
            }}>
                {/* Top half (points 12-23) */}
                <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                        {[12, 13, 14, 15, 16, 17].map(i => renderPoint(i, true))}
                    </div>
                    <div style={{ width: '30px' }} /> {/* Bar */}
                    <div style={{ display: 'flex', gap: '2px' }}>
                        {[18, 19, 20, 21, 22, 23].map(i => renderPoint(i, true))}
                    </div>
                </div>

                {/* Bar in middle */}
                {(gameState.bar.white > 0 || gameState.bar.black > 0) && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '1rem',
                        padding: '0.5rem',
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: '4px',
                        marginBottom: '1rem'
                    }}>
                        {gameState.bar.white > 0 && (
                            <div
                                onClick={() => handlePointClick(-1)}
                                style={{
                                    cursor: 'pointer',
                                    padding: '0.25rem 0.5rem',
                                    background: selectedPoint === -1 ? 'rgba(251, 191, 36, 0.3)' : 'transparent',
                                    borderRadius: '4px'
                                }}
                            >
                                ⚪ Bar: {gameState.bar.white}
                            </div>
                        )}
                        {gameState.bar.black > 0 && (
                            <div>⚫ Bar: {gameState.bar.black}</div>
                        )}
                    </div>
                )}

                {/* Bottom half (points 11-0, reversed display) */}
                <div style={{ display: 'flex', gap: '2px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                        {[11, 10, 9, 8, 7, 6].map(i => renderPoint(i, false))}
                    </div>
                    <div style={{ width: '30px' }} /> {/* Bar */}
                    <div style={{ display: 'flex', gap: '2px' }}>
                        {[5, 4, 3, 2, 1, 0].map(i => renderPoint(i, false))}
                    </div>
                </div>
            </div>

            {/* New Game */}
            {gameState.phase === 'gameOver' && (
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <button
                        onClick={() => setGameState({
                            points: createInitialBoard(),
                            bar: { white: 0, black: 0 },
                            bearOff: { white: 0, black: 0 },
                            currentPlayer: 'white',
                            dice: [0, 0],
                            diceUsed: [false, false],
                            phase: 'roll',
                            message: 'Roll the dice to start!'
                        })}
                        className="btn btn-primary"
                    >
                        New Game
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
                    <li>White (you) moves checkers counterclockwise to home (bottom right)</li>
                    <li>Roll dice and click checkers to move</li>
                    <li>Land on single opponent checker to send it to the bar</li>
                    <li>Get all 15 checkers home and bear them off to win</li>
                </ul>
            </div>
        </div>
    );
}
