'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { soundManager } from '@/lib/soundManager';
import { achievementManager } from '@/lib/achievements';
import AchievementPopup from '@/components/AchievementPopup';
import type { Achievement } from '@/lib/achievements';

interface Cell {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    adjacentMines: number;
}

const GRID_SIZE = 9;
const MINE_COUNT = 10;

function createBoard(): Cell[][] {
    const board: Cell[][] = Array(GRID_SIZE).fill(null).map(() =>
        Array(GRID_SIZE).fill(null).map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            adjacentMines: 0,
        }))
    );

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }

    // Calculate adjacent mine counts
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (board[r][c].isMine) continue;
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && board[nr][nc].isMine) {
                        count++;
                    }
                }
            }
            board[r][c].adjacentMines = count;
        }
    }

    return board;
}

export default function MinesweeperGame() {
    const [board, setBoard] = useState<Cell[][]>([]);
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [flagsLeft, setFlagsLeft] = useState(MINE_COUNT);
    const [time, setTime] = useState(0);
    const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);

    useEffect(() => {
        startNewGame();
    }, []);

    useEffect(() => {
        if (gameState !== 'playing') return;
        const timer = setInterval(() => setTime(t => t + 1), 1000);
        return () => clearInterval(timer);
    }, [gameState]);

    const startNewGame = () => {
        setBoard(createBoard());
        setGameState('playing');
        setFlagsLeft(MINE_COUNT);
        setTime(0);
        setStartTime(new Date());
        soundManager.play('click');
    };

    const revealCell = (row: number, col: number) => {
        if (gameState !== 'playing') return;

        const cell = board[row][col];
        if (cell.isRevealed || cell.isFlagged) return;

        soundManager.play('click');

        const newBoard = board.map(r => r.map(c => ({ ...c })));

        if (cell.isMine) {
            // Game over - reveal all mines
            for (let r = 0; r < GRID_SIZE; r++) {
                for (let c = 0; c < GRID_SIZE; c++) {
                    if (newBoard[r][c].isMine) {
                        newBoard[r][c].isRevealed = true;
                    }
                }
            }
            setBoard(newBoard);
            setGameState('lost');
            soundManager.play('lose');
            return;
        }

        // Flood fill reveal
        const reveal = (r: number, c: number) => {
            if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return;
            if (newBoard[r][c].isRevealed || newBoard[r][c].isFlagged || newBoard[r][c].isMine) return;

            newBoard[r][c].isRevealed = true;

            if (newBoard[r][c].adjacentMines === 0) {
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        reveal(r + dr, c + dc);
                    }
                }
            }
        };

        reveal(row, col);
        setBoard(newBoard);

        // Check win condition
        let unrevealedSafe = 0;
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (!newBoard[r][c].isRevealed && !newBoard[r][c].isMine) {
                    unrevealedSafe++;
                }
            }
        }

        if (unrevealedSafe === 0) {
            setGameState('won');
            soundManager.play('win');
            if (startTime) {
                const playTime = Math.floor((new Date().getTime() - startTime.getTime()) / 60000);
                const achievements = achievementManager.recordGamePlayed(true, playTime, false);
                if (achievements.length > 0) {
                    const ach = achievementManager.getAchievement(achievements[0]);
                    if (ach) setCurrentAchievement(ach);
                }
            }
        }
    };

    const toggleFlag = (e: React.MouseEvent, row: number, col: number) => {
        e.preventDefault();
        if (gameState !== 'playing') return;

        const cell = board[row][col];
        if (cell.isRevealed) return;

        const newBoard = board.map(r => r.map(c => ({ ...c })));
        newBoard[row][col].isFlagged = !cell.isFlagged;
        setBoard(newBoard);
        setFlagsLeft(flagsLeft + (cell.isFlagged ? 1 : -1));
        soundManager.play('click');
    };

    const getCellContent = (cell: Cell) => {
        if (cell.isFlagged) return '🚩';
        if (!cell.isRevealed) return '';
        if (cell.isMine) return '💣';
        if (cell.adjacentMines === 0) return '';
        return cell.adjacentMines;
    };

    const getCellColor = (count: number): string => {
        const colors = ['', '#3b82f6', '#22c55e', '#ef4444', '#7c3aed', '#dc2626', '#06b6d4', '#000', '#64748b'];
        return colors[count] || 'white';
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
                    <h1 className="game-title">Minesweeper</h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <span className="game-score">🚩 {flagsLeft}</span>
                        <span className="game-score">⏱ {time}s</span>
                    </div>
                </div>

                <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        Left-click to reveal • Right-click to flag
                    </p>

                    {/* Game board */}
                    <div style={{
                        display: 'inline-grid',
                        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                        gap: '2px',
                        background: 'rgba(0,0,0,0.3)',
                        padding: '4px',
                        borderRadius: '8px',
                    }}>
                        {board.map((row, r) =>
                            row.map((cell, c) => (
                                <button
                                    key={`${r}-${c}`}
                                    onClick={() => revealCell(r, c)}
                                    onContextMenu={(e) => toggleFlag(e, r, c)}
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: gameState === 'playing' && !cell.isRevealed ? 'pointer' : 'default',
                                        background: cell.isRevealed
                                            ? (cell.isMine ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255,255,255,0.15)')
                                            : 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
                                        color: getCellColor(cell.adjacentMines),
                                        transition: 'all 0.1s ease',
                                        boxShadow: cell.isRevealed ? 'none' : 'inset 2px 2px 4px rgba(255,255,255,0.1), inset -2px -2px 4px rgba(0,0,0,0.2)',
                                    }}
                                >
                                    {getCellContent(cell)}
                                </button>
                            ))
                        )}
                    </div>

                    {/* Game state messages */}
                    {(gameState === 'won' || gameState === 'lost') && (
                        <div style={{ marginTop: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                                {gameState === 'won' ? '🎉' : '💥'}
                            </div>
                            <h2 style={{ marginBottom: '1rem', color: gameState === 'won' ? 'var(--success)' : 'var(--error)' }}>
                                {gameState === 'won' ? 'You Won!' : 'Game Over!'}
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
                                Time: {time} seconds
                            </p>
                            <button className="btn btn-primary" onClick={startNewGame}>
                                Play Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
