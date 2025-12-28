'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { soundManager } from '@/lib/soundManager';
import { achievementManager } from '@/lib/achievements';
import AchievementPopup from '@/components/AchievementPopup';
import type { Achievement } from '@/lib/achievements';

export interface PuzzleGridConfig {
    title: string;
    gridSize: { rows: number; cols: number };
    words: string[];
    difficulty: 'easy' | 'medium' | 'hard';
}

interface PuzzleGridGameProps {
    config: PuzzleGridConfig;
}

export default function PuzzleGridEngine({ config }: PuzzleGridGameProps) {
    const [grid, setGrid] = useState<string[][]>([]);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [selecting, setSelecting] = useState<{ row: number; col: number }[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
    const [newAchievements, setNewAchievements] = useState<string[]>([]);
    const [startTime, setStartTime] = useState<Date | null>(null);

    const generateGrid = () => {
        const { rows, cols } = config.gridSize;
        const newGrid = Array(rows).fill(null).map(() =>
            Array(cols).fill('')
        );

        // Place words (simplified - horizontal only for this example)
        config.words.forEach((word, idx) => {
            const row = Math.floor(Math.random() * rows);
            const col = Math.floor(Math.random() * (cols - word.length + 1));

            for (let i = 0; i < word.length; i++) {
                newGrid[row][col + i] = word[i].toUpperCase();
            }
        });

        // Fill empty cells with random letters
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (!newGrid[r][c]) {
                    newGrid[r][c] = letters[Math.floor(Math.random() * letters.length)];
                }
            }
        }

        setGrid(newGrid);
        setFoundWords([]);
        setSelecting([]);
        setIsPlaying(true);
        setGameWon(false);
        setStartTime(new Date());
    };

    const handleCellClick = (row: number, col: number) => {
        if (!isPlaying) return;

        soundManager.play('click');
        const newSelecting = [...selecting, { row, col }];
        setSelecting(newSelecting);

        // Check if selection forms a word
        if (newSelecting.length >= 3) {
            const word = newSelecting.map(pos => grid[pos.row][pos.col]).join('');

            if (config.words.some(w => w.toUpperCase() === word)) {
                soundManager.play('success');
                setFoundWords([...foundWords, word]);
                setSelecting([]);

                if (foundWords.length + 1 === config.words.length) {
                    handleWin();
                }
            }
        }
    };

    const handleWin = () => {
        setIsPlaying(false);
        setGameWon(true);
        soundManager.play('win');

        if (startTime) {
            const playTime = Math.floor((new Date().getTime() - startTime.getTime()) / 60000);
            const achievements = achievementManager.recordGamePlayed(true, playTime, false);

            if (achievements.length > 0) {
                setNewAchievements(achievements);
                const firstAchievement = achievementManager.getAchievement(achievements[0]);
                if (firstAchievement) {
                    setCurrentAchievement(firstAchievement);
                }
            }
        }
    };

    return (
        <div className="game-container">
            {currentAchievement && (
                <AchievementPopup
                    achievement={currentAchievement}
                    onClose={() => {
                        const nextIndex = newAchievements.indexOf(currentAchievement.id) + 1;
                        if (nextIndex < newAchievements.length) {
                            const nextAch = achievementManager.getAchievement(newAchievements[nextIndex]);
                            setCurrentAchievement(nextAch || null);
                        } else {
                            setCurrentAchievement(null);
                        }
                    }}
                />
            )}

            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                        ← Back
                    </Link>
                    <h1 className="game-title">{config.title}</h1>
                    <span className="game-score">Found: {foundWords.length}/{config.words.length}</span>
                </div>

                {gameWon ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
                        <h2 style={{ marginBottom: '1rem' }}>Complete!</h2>
                        <p style={{ fontSize: '1.5rem', color: 'var(--accent)', marginBottom: '2rem' }}>
                            All words found!
                        </p>
                        <button className="btn btn-primary" onClick={generateGrid}>
                            New Puzzle
                        </button>
                    </div>
                ) : !isPlaying ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
                        <h2 style={{ marginBottom: '1rem' }}>{config.title}</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
                            Find all hidden words!
                        </p>
                        < button className="btn btn-accent" onClick={generateGrid}>
                            Start Puzzle
                        </button>
                    </div>
                ) : (
                    <>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${config.gridSize.cols}, 1fr)`,
                            gap: '0.5rem',
                            maxWidth: '500px',
                            margin: '0 auto 2rem',
                        }}>
                            {grid.map((row, r) =>
                                row.map((letter, c) => (
                                    <button
                                        key={`${r}-${c}`}
                                        onClick={() => handleCellClick(r, c)}
                                        style={{
                                            aspectRatio: '1',
                                            fontSize: '1.25rem',
                                            fontWeight: 700,
                                            background: selecting.some(s => s.row === r && s.col === c)
                                                ? 'rgba(99, 102, 241, 0.5)'
                                                : 'rgba(255, 255, 255, 0.1)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            borderRadius: '8px',
                                            color: 'white',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        {letter}
                                    </button>
                                ))
                            )}
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Words to Find:</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                                {config.words.map(word => (
                                    <span
                                        key={word}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: foundWords.includes(word.toUpperCase())
                                                ? 'rgba(16, 185, 129, 0.3)'
                                                : 'rgba(255, 255, 255, 0.1)',
                                            borderRadius: '100px',
                                            textDecoration: foundWords.includes(word.toUpperCase()) ? 'line-through' : 'none',
                                            color: 'white',
                                        }}
                                    >
                                        {word}
                                    </span>
                                ))}
                            </div>

                            {selecting.length > 0 && (
                                <button
                                    onClick={() => {
                                        setSelecting([]);
                                        soundManager.play('click');
                                    }}
                                    className="btn btn-ghost"
                                    style={{ marginTop: '1rem' }}
                                >
                                    Clear Selection
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
