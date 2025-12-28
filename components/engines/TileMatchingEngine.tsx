'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { soundManager } from '@/lib/soundManager';
import { achievementManager } from '@/lib/achievements';
import AchievementPopup from '@/components/AchievementPopup';
import type { Achievement } from '@/lib/achievements';

export interface TileMatchingConfig {
    title: string;
    tiles: { id: string; icon: string }[];
    gridSize: number; // e.g., 4 for 4x4
    timeLimit?: number; // seconds, optional
}

interface TileMatchingGameProps {
    config: TileMatchingConfig;
}

interface Tile {
    id: string;
    icon: string;
    matched: boolean;
}

export default function TileMatchingEngine({ config }: TileMatchingGameProps) {
    const [tiles, setTiles] = useState<Tile[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matched, setMatched] = useState<number>();
    const [moves, setMoves] = useState(0);
    const [timeLeft, setTimeLeft] = useState(config.timeLimit || 0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [newAchievements, setNewAchievements] = useState<string[]>([]);
    const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);

    const initializeGame = () => {
        // Duplicate tiles and shuffle
        const gameTiles = [...config.tiles, ...config.tiles]
            .map(tile => ({ ...tile, matched: false }))
            .sort(() => Math.random() - 0.5);

        setTiles(gameTiles);
        setFlipped([]);
        setMatched(0);
        setMoves(0);
        setTimeLeft(config.timeLimit || 0);
        setIsPlaying(true);
        setGameWon(false);
        setStartTime(new Date());
    };

    const handleTileClick = (index: number) => {
        if (!isPlaying || flipped.length >= 2 || flipped.includes(index) || tiles[index].matched) {
            return;
        }

        soundManager.play('click');
        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(moves + 1);

            if (tiles[newFlipped[0]].id === tiles[newFlipped[1]].id) {
                // Match!
                soundManager.play('match');
                const newTiles = [...tiles];
                newTiles[newFlipped[0]].matched = true;
                newTiles[newFlipped[1]].matched = true;
                setTiles(newTiles);
                setMatched((matched || 0) + 1);
                setFlipped([]);

                // Check win condition
                if (newTiles.every(t => t.matched)) {
                    handleWin();
                }
            } else {
                // No match
                soundManager.play('error');
                setTimeout(() => setFlipped([]), 800);
            }
        }
    };

    const handleWin = () => {
        setIsPlaying(false);
        setGameWon(true);
        soundManager.play('win');

        if (startTime) {
            const playTime = Math.floor((new Date().getTime() - startTime.getTime()) / 60000);
            const perfect = moves === config.tiles.length;
            const achievements = achievementManager.recordGamePlayed(true, playTime, perfect);

            if (achievements.length > 0) {
                setNewAchievements(achievements);
                const firstAchievement = achievementManager.getAchievement(achievements[0]);
                if (firstAchievement) {
                    setCurrentAchievement(firstAchievement);
                }
            }
        }
    };

    // Timer
    useEffect(() => {
        if (!isPlaying || !config.timeLimit) return;

        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setIsPlaying(false);
                    soundManager.play('lose');
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isPlaying, config.timeLimit]);

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
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <span className="game-score">Moves: {moves}</span>
                        {config.timeLimit && isPlaying && (
                            <span style={{
                                padding: '0.5rem 1rem',
                                background: timeLeft <= 10 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(99, 102, 241, 0.3)',
                                borderRadius: '100px',
                                color: timeLeft <= 10 ? '#fca5a5' : '#a5b4fc',
                            }}>
                                ⏱ {timeLeft}s
                            </span>
                        )}
                    </div>
                </div>

                {gameWon ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
                        <h2 style={{ marginBottom: '1rem' }}>Victory!</h2>
                        <p style={{ fontSize: '1.5rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>
                            {moves} Moves
                        </p>
                        {moves === config.tiles.length && (
                            <p style={{ color: 'var(--success)', marginBottom: '1rem' }}>
                                ✨ Perfect Game!
                            </p>
                        )}
                        <button className="btn btn-primary" onClick={initializeGame}>
                            Play Again
                        </button>
                    </div>
                ) : !isPlaying && tiles.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🃏</div>
                        <h2 style={{ marginBottom: '1rem' }}>{config.title}</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
                            Match all pairs of tiles!
                        </p>
                        <button className="btn btn-accent" onClick={initializeGame}>
                            Start Game
                        </button>
                    </div>
                ) : timeLeft === 0 && config.timeLimit ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏰</div>
                        <h2 style={{ marginBottom: '1rem' }}>Time's Up!</h2>
                        <button className="btn btn-primary" onClick={initializeGame}>
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${config.gridSize}, 1fr)`,
                        gap: '1rem',
                        maxWidth: '500px',
                        margin: '0 auto',
                        padding: '1rem',
                    }}>
                        {tiles.map((tile, index) => (
                            <button
                                key={index}
                                onClick={() => handleTileClick(index)}
                                disabled={!isPlaying}
                                style={{
                                    aspectRatio: '1',
                                    fontSize: '2.5rem',
                                    background: tile.matched
                                        ? 'rgba(16, 185, 129, 0.3)'
                                        : flipped.includes(index)
                                            ? 'rgba(99, 102, 241, 0.5)'
                                            : 'rgba(255, 255, 255, 0.1)',
                                    border: '2px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    cursor: isPlaying && !tile.matched ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.3s ease',
                                    transform: flipped.includes(index) || tile.matched ? 'scale(1.05)' : 'scale(1)',
                                }}
                            >
                                {(flipped.includes(index) || tile.matched) ? tile.icon : '?'}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
