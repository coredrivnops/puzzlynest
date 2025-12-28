'use client';

import { useState } from 'react';
import Link from 'next/link';
import { soundManager } from '@/lib/soundManager';
import { achievementManager } from '@/lib/achievements';
import AchievementPopup from '@/components/AchievementPopup';
import type { Achievement } from '@/lib/achievements';

type Player = 'red' | 'yellow' | null;
type Board = Player[][];

const ROWS = 6;
const COLS = 7;

function createEmptyBoard(): Board {
    return Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
}

function checkWinner(board: Board, row: number, col: number, player: Player): boolean {
    if (!player) return false;

    const directions = [
        [0, 1],   // horizontal
        [1, 0],   // vertical
        [1, 1],   // diagonal down-right
        [1, -1],  // diagonal down-left
    ];

    for (const [dr, dc] of directions) {
        let count = 1;

        // Check in positive direction
        for (let i = 1; i < 4; i++) {
            const r = row + dr * i;
            const c = col + dc * i;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
                count++;
            } else break;
        }

        // Check in negative direction
        for (let i = 1; i < 4; i++) {
            const r = row - dr * i;
            const c = col - dc * i;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
                count++;
            } else break;
        }

        if (count >= 4) return true;
    }

    return false;
}

function getAIMove(board: Board): number {
    // Simple AI: Try to win, then block, then random
    const availableCols = [];

    for (let col = 0; col < COLS; col++) {
        if (board[0][col] === null) {
            availableCols.push(col);

            // Find where piece would land
            let row = ROWS - 1;
            while (row >= 0 && board[row][col] !== null) row--;

            if (row >= 0) {
                // Check if AI can win
                const testBoard = board.map(r => [...r]);
                testBoard[row][col] = 'yellow';
                if (checkWinner(testBoard, row, col, 'yellow')) return col;

                // Check if need to block player
                testBoard[row][col] = 'red';
                if (checkWinner(testBoard, row, col, 'red')) return col;
            }
        }
    }

    // Prefer center columns
    const preferredOrder = [3, 2, 4, 1, 5, 0, 6];
    for (const col of preferredOrder) {
        if (availableCols.includes(col)) return col;
    }

    return availableCols[0] || 0;
}

export default function ConnectFourGame() {
    const [board, setBoard] = useState<Board>(createEmptyBoard());
    const [currentPlayer, setCurrentPlayer] = useState<'red' | 'yellow'>('red');
    const [winner, setWinner] = useState<Player>(null);
    const [isDraw, setIsDraw] = useState(false);
    const [isAITurn, setIsAITurn] = useState(false);
    const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
    const [startTime] = useState<Date>(new Date());

    const dropPiece = (col: number) => {
        if (winner || isDraw || isAITurn || board[0][col] !== null) return;

        soundManager.play('click');

        // Find lowest empty row
        let row = ROWS - 1;
        while (row >= 0 && board[row][col] !== null) row--;

        if (row < 0) return;

        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);

        if (checkWinner(newBoard, row, col, currentPlayer)) {
            setWinner(currentPlayer);
            soundManager.play('win');
            const playTime = Math.floor((new Date().getTime() - startTime.getTime()) / 60000);
            const achievements = achievementManager.recordGamePlayed(true, playTime, false);
            if (achievements.length > 0) {
                const ach = achievementManager.getAchievement(achievements[0]);
                if (ach) setCurrentAchievement(ach);
            }
            return;
        }

        // Check for draw
        if (newBoard[0].every(cell => cell !== null)) {
            setIsDraw(true);
            return;
        }

        // AI turn
        setCurrentPlayer('yellow');
        setIsAITurn(true);

        setTimeout(() => {
            const aiCol = getAIMove(newBoard);
            let aiRow = ROWS - 1;
            while (aiRow >= 0 && newBoard[aiRow][aiCol] !== null) aiRow--;

            if (aiRow >= 0) {
                newBoard[aiRow][aiCol] = 'yellow';
                setBoard([...newBoard.map(r => [...r])]);
                soundManager.play('click');

                if (checkWinner(newBoard, aiRow, aiCol, 'yellow')) {
                    setWinner('yellow');
                    soundManager.play('lose');
                } else if (newBoard[0].every(cell => cell !== null)) {
                    setIsDraw(true);
                }
            }

            setCurrentPlayer('red');
            setIsAITurn(false);
        }, 500);
    };

    const resetGame = () => {
        setBoard(createEmptyBoard());
        setCurrentPlayer('red');
        setWinner(null);
        setIsDraw(false);
        setIsAITurn(false);
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
                    <h1 className="game-title">Connect Four</h1>
                    <div className="game-score">
                        {winner ? `${winner === 'red' ? '🔴 You' : '🟡 AI'} Win!`
                            : isDraw ? 'Draw!'
                                : isAITurn ? '🟡 AI thinking...'
                                    : '🔴 Your turn'}
                    </div>
                </div>

                <div style={{ textAlign: 'center', padding: '1rem' }}>
                    {/* Column drop buttons */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                        gap: '4px',
                        maxWidth: '400px',
                        margin: '0 auto 0.5rem',
                    }}>
                        {Array(COLS).fill(null).map((_, col) => (
                            <button
                                key={col}
                                onClick={() => dropPiece(col)}
                                disabled={!!winner || isDraw || isAITurn}
                                style={{
                                    padding: '0.5rem',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    borderRadius: '8px 8px 0 0',
                                    color: 'white',
                                    cursor: winner || isDraw || isAITurn ? 'not-allowed' : 'pointer',
                                    fontSize: '1.5rem',
                                }}
                            >
                                ⬇️
                            </button>
                        ))}
                    </div>

                    {/* Game board */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                        gap: '4px',
                        background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                        padding: '8px',
                        borderRadius: '12px',
                        maxWidth: '400px',
                        margin: '0 auto',
                    }}>
                        {board.map((row, rowIndex) =>
                            row.map((cell, colIndex) => (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    style={{
                                        aspectRatio: '1',
                                        background: '#1e3a8a',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {cell && (
                                        <div
                                            style={{
                                                width: '85%',
                                                height: '85%',
                                                borderRadius: '50%',
                                                background: cell === 'red'
                                                    ? 'radial-gradient(circle at 30% 30%, #ef4444, #b91c1c)'
                                                    : 'radial-gradient(circle at 30% 30%, #fbbf24, #d97706)',
                                                boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.3)',
                                                animation: 'dropIn 0.3s ease-out',
                                            }}
                                        />
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Game over state */}
                    {(winner || isDraw) && (
                        <div style={{ marginTop: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                                {winner === 'red' ? '🏆' : winner === 'yellow' ? '😢' : '🤝'}
                            </div>
                            <button className="btn btn-primary" onClick={resetGame}>
                                Play Again
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        @keyframes dropIn {
          from { transform: translateY(-200%); }
          to { transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
