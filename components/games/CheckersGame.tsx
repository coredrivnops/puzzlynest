'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { soundManager } from '@/lib/soundManager';
import { achievementManager } from '@/lib/achievements';
import AchievementPopup from '@/components/AchievementPopup';
import type { Achievement } from '@/lib/achievements';

interface CheckersBoard {
    pieces: (null | 'red' | 'black' | 'red-king' | 'black-king')[];
    selectedPiece: number | null;
    validMoves: number[];
    currentPlayer: 'red' | 'black';
}

const BOARD_SIZE = 8;

const createInitialBoard = (): (null | 'red' | 'black')[] => {
    const board: (null | 'red' | 'black')[] = Array(64).fill(null);

    // Place black pieces (top 3 rows)
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 === 1) {
                board[row * 8 + col] = 'black';
            }
        }
    }

    // Place red pieces (bottom 3 rows)
    for (let row = 5; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 === 1) {
                board[row * 8 + col] = 'red';
            }
        }
    }

    return board;
};

const getValidMoves = (board: (null | string)[], index: number, mustCapture: boolean): number[] => {
    const piece = board[index];
    if (!piece) return [];

    const isKing = piece.includes('king');
    const isRed = piece.includes('red');
    const row = Math.floor(index / 8);
    const col = index % 8;

    const directions = isKing
        ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
        : isRed
            ? [[-1, -1], [-1, 1]] // Red moves up
            : [[1, -1], [1, 1]];   // Black moves down

    const moves: number[] = [];
    const captures: number[] = [];

    for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;

        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const newIndex = newRow * 8 + newCol;

            if (board[newIndex] === null) {
                if (!mustCapture) moves.push(newIndex);
            } else if (isRed ? board[newIndex]?.includes('black') : board[newIndex]?.includes('red')) {
                // Can capture
                const jumpRow = row + dr * 2;
                const jumpCol = col + dc * 2;
                if (jumpRow >= 0 && jumpRow < 8 && jumpCol >= 0 && jumpCol < 8) {
                    const jumpIndex = jumpRow * 8 + jumpCol;
                    if (board[jumpIndex] === null) {
                        captures.push(jumpIndex);
                    }
                }
            }
        }
    }

    return captures.length > 0 ? captures : moves;
};

export default function CheckersGame() {
    const [board, setBoard] = useState<(null | string)[]>(createInitialBoard());
    const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
    const [validMoves, setValidMoves] = useState<number[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<'red' | 'black'>('red');
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [message, setMessage] = useState('Your turn (Red)');
    const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
    const [startTime] = useState(new Date());

    // Check for captures available
    const canCapture = useCallback((player: 'red' | 'black'): boolean => {
        for (let i = 0; i < 64; i++) {
            const piece = board[i];
            if (piece?.includes(player)) {
                const moves = getValidMoves(board, i, true);
                if (moves.length > 0) {
                    // Check if any move is a capture (distance of 2)
                    for (const move of moves) {
                        const startRow = Math.floor(i / 8);
                        const endRow = Math.floor(move / 8);
                        if (Math.abs(endRow - startRow) === 2) return true;
                    }
                }
            }
        }
        return false;
    }, [board]);

    const handleSquareClick = (index: number) => {
        if (gameState !== 'playing' || currentPlayer !== 'red') return;

        const piece = board[index];

        // If clicking on own piece, select it
        if (piece?.includes('red')) {
            const mustCapture = canCapture('red');
            const moves = getValidMoves(board, index, mustCapture);

            if (moves.length > 0) {
                setSelectedPiece(index);
                setValidMoves(moves);
                soundManager.play('click');
            }
            return;
        }

        // If a piece is selected and clicking on valid move
        if (selectedPiece !== null && validMoves.includes(index)) {
            const newBoard = [...board];
            const piece = newBoard[selectedPiece];
            newBoard[selectedPiece] = null;

            // Check for capture
            const startRow = Math.floor(selectedPiece / 8);
            const endRow = Math.floor(index / 8);
            const startCol = selectedPiece % 8;
            const endCol = index % 8;

            if (Math.abs(endRow - startRow) === 2) {
                // Capture happened
                const capturedIndex = ((startRow + endRow) / 2) * 8 + (startCol + endCol) / 2;
                newBoard[capturedIndex] = null;
                soundManager.play('pop');
            } else {
                soundManager.play('click');
            }

            // King promotion
            if (endRow === 0 && piece === 'red') {
                newBoard[index] = 'red-king';
            } else {
                newBoard[index] = piece;
            }

            setBoard(newBoard);
            setSelectedPiece(null);
            setValidMoves([]);

            // Check for win
            const blackPieces = newBoard.filter(p => p?.includes('black')).length;
            if (blackPieces === 0) {
                setGameState('won');
                soundManager.play('win');
                const playTime = Math.floor((new Date().getTime() - startTime.getTime()) / 60000);
                const achievements = achievementManager.recordGamePlayed(true, playTime, false);
                if (achievements.length > 0) {
                    const ach = achievementManager.getAchievement(achievements[0]);
                    if (ach) setCurrentAchievement(ach);
                }
                return;
            }

            // AI turn
            setCurrentPlayer('black');
            setMessage('AI thinking...');

            setTimeout(() => makeAIMove(newBoard), 500);
        }
    };

    const makeAIMove = (currentBoard: (null | string)[]) => {
        // Simple AI: prefer captures, then random move
        const blackPieces = currentBoard.map((p, i) => p?.includes('black') ? i : -1).filter(i => i !== -1);

        // Check for captures first
        for (const pieceIndex of blackPieces) {
            const moves = getValidMoves(currentBoard, pieceIndex, true);
            for (const move of moves) {
                const startRow = Math.floor(pieceIndex / 8);
                const endRow = Math.floor(move / 8);
                if (Math.abs(endRow - startRow) === 2) {
                    // Make capture
                    executeAIMove(currentBoard, pieceIndex, move);
                    return;
                }
            }
        }

        // No captures, make random move
        const allMoves: { from: number; to: number }[] = [];
        for (const pieceIndex of blackPieces) {
            const moves = getValidMoves(currentBoard, pieceIndex, false);
            for (const move of moves) {
                allMoves.push({ from: pieceIndex, to: move });
            }
        }

        if (allMoves.length === 0) {
            // AI has no moves, player wins
            setGameState('won');
            soundManager.play('win');
            return;
        }

        const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
        executeAIMove(currentBoard, randomMove.from, randomMove.to);
    };

    const executeAIMove = (currentBoard: (null | string)[], from: number, to: number) => {
        const newBoard = [...currentBoard];
        const piece = newBoard[from];
        newBoard[from] = null;

        // Check for capture
        const startRow = Math.floor(from / 8);
        const endRow = Math.floor(to / 8);
        const startCol = from % 8;
        const endCol = to % 8;

        if (Math.abs(endRow - startRow) === 2) {
            const capturedIndex = ((startRow + endRow) / 2) * 8 + (startCol + endCol) / 2;
            newBoard[capturedIndex] = null;
            soundManager.play('pop');
        } else {
            soundManager.play('click');
        }

        // King promotion
        if (endRow === 7 && piece === 'black') {
            newBoard[to] = 'black-king';
        } else {
            newBoard[to] = piece;
        }

        setBoard(newBoard);

        // Check for loss
        const redPieces = newBoard.filter(p => p?.includes('red')).length;
        if (redPieces === 0) {
            setGameState('lost');
            soundManager.play('lose');
            return;
        }

        setCurrentPlayer('red');
        setMessage('Your turn (Red)');
    };

    const resetGame = () => {
        setBoard(createInitialBoard());
        setSelectedPiece(null);
        setValidMoves([]);
        setCurrentPlayer('red');
        setGameState('playing');
        setMessage('Your turn (Red)');
        soundManager.play('click');
    };

    return (
        <div className="game-container">
            {currentAchievement && (
                <AchievementPopup
                    achievement={currentAchievement}
                    onClose={() => setCurrentAchievement(null)}
                />
            )}

            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                        ← Back
                    </Link>
                    <h1 className="game-title">Checkers</h1>
                    <span className="game-score">{message}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(8, 1fr)',
                        border: '4px solid #8B4513',
                        borderRadius: '4px',
                    }}>
                        {board.map((piece, index) => {
                            const row = Math.floor(index / 8);
                            const col = index % 8;
                            const isDark = (row + col) % 2 === 1;
                            const isSelected = selectedPiece === index;
                            const isValidMove = validMoves.includes(index);

                            return (
                                <div
                                    key={index}
                                    onClick={() => handleSquareClick(index)}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        background: isDark ? '#8B4513' : '#DEB887',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: (piece?.includes('red') || isValidMove) && gameState === 'playing' ? 'pointer' : 'default',
                                        boxShadow: isSelected ? 'inset 0 0 0 3px #fbbf24' : isValidMove ? 'inset 0 0 0 3px rgba(34, 197, 94, 0.7)' : 'none',
                                    }}
                                >
                                    {piece && (
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: piece.includes('red')
                                                ? 'radial-gradient(circle at 30% 30%, #ef4444, #b91c1c)'
                                                : 'radial-gradient(circle at 30% 30%, #374151, #111827)',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.4), inset 0 -4px 6px rgba(0,0,0,0.3)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.25rem',
                                        }}>
                                            {piece.includes('king') && '👑'}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {gameState !== 'playing' && (
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                            {gameState === 'won' ? '🏆' : '😢'}
                        </div>
                        <h2 style={{ marginBottom: '1rem' }}>
                            {gameState === 'won' ? 'You Win!' : 'You Lose'}
                        </h2>
                        <button className="btn btn-primary" onClick={resetGame}>
                            Play Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
