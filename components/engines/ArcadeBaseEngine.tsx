'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { soundManager } from '@/lib/soundManager';
import { achievementManager } from '@/lib/achievements';
import AchievementPopup from '@/components/AchievementPopup';
import type { Achievement } from '@/lib/achievements';

export interface ArcadeConfig {
    title: string;
    gameType: 'clicker' | 'reaction' | 'avoid';
    targetEmoji?: string;
    avoidEmoji?: string;
    duration?: number; // seconds
}

interface ArcadeGameProps {
    config: ArcadeConfig;
}

interface GameObject {
    id: number;
    x: number;
    y: number;
    emoji: string;
    isTarget: boolean;
    velocity: { x: number; y: number };
    scale: number;
}

export default function ArcadeBaseEngine({ config }: ArcadeGameProps) {
    const [objects, setObjects] = useState<GameObject[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(config.duration || 30);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const [newAchievements, setNewAchievements] = useState<string[]>([]);
    const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const lastSpawnTime = useRef(0);

    const startGame = () => {
        setScore(0);
        setTimeLeft(config.duration || 30);
        setObjects([]);
        setIsPlaying(true);
        setGameWon(false);
        setGameOver(false);
        setStartTime(new Date());
        soundManager.play('click');
    };

    const spawnObject = () => {
        const isTarget = config.gameType === 'avoid'
            ? Math.random() > 0.3 // 70% bad stuff in avoid mode
            : true; // 100% good stuff in clicker mode (unless mixed)

        const emoji = isTarget
            ? (config.targetEmoji || '🎯')
            : (config.avoidEmoji || '💣');

        const newObj: GameObject = {
            id: Date.now() + Math.random(),
            x: Math.random() * 80 + 10, // 10% to 90%
            y: -10,
            emoji,
            isTarget,
            velocity: {
                x: (Math.random() - 0.5) * 1,
                y: Math.random() * 1 + 0.5
            },
            scale: 1,
        };

        setObjects(prev => [...prev, newObj]);
    };

    const handleObjectClick = (id: number, isTarget: boolean) => {
        if (!isPlaying) return;

        if (isTarget) {
            soundManager.play('pop');
            setScore(prev => prev + 10);
            setObjects(prev => prev.filter(o => o.id !== id));
        } else {
            soundManager.play('error');
            setScore(prev => Math.max(0, prev - 20));
            // In avoid mode, clicking bad thing might be instant game over
            if (config.gameType === 'avoid') {
                endGame(false);
            }
        }
    };

    const endGame = (win: boolean) => {
        setIsPlaying(false);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

        if (win) {
            setGameWon(true);
            soundManager.play('win');
        } else {
            setGameOver(true);
            soundManager.play('lose');
        }

        if (startTime) {
            const playTime = Math.floor((new Date().getTime() - startTime.getTime()) / 60000);
            const achievements = achievementManager.recordGamePlayed(win, playTime, false);

            if (achievements.length > 0) {
                setNewAchievements(achievements);
                const firstAchievement = achievementManager.getAchievement(achievements[0]);
                if (firstAchievement) {
                    setCurrentAchievement(firstAchievement);
                }
            }
        }
    };

    // Game Loop
    useEffect(() => {
        if (!isPlaying) return;

        let lastTime = performance.now();

        const loop = (time: number) => {
            const delta = time - lastTime;
            lastTime = time;

            // Spawn logic
            if (time - lastSpawnTime.current > 800) { // Spawn every 800ms
                spawnObject();
                lastSpawnTime.current = time;
            }

            // Update positions
            setObjects(prev => {
                const next = prev.map(obj => ({
                    ...obj,
                    x: obj.x + obj.velocity.x,
                    y: obj.y + obj.velocity.y
                })).filter(obj => obj.y < 110); // Remove if fell off screen

                return next;
            });

            animationFrameRef.current = requestAnimationFrame(loop);
        };

        animationFrameRef.current = requestAnimationFrame(loop);

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [isPlaying, config]);

    // Timer
    useEffect(() => {
        if (!isPlaying) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    endGame(true); // Time survived!
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isPlaying]);

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
                        <span className="game-score">Score: {score}</span>
                        <span style={{
                            padding: '0.5rem 1rem',
                            background: timeLeft <= 5 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(99, 102, 241, 0.3)',
                            borderRadius: '100px',
                            color: timeLeft <= 5 ? '#fca5a5' : '#a5b4fc',
                        }}>
                            ⏱ {timeLeft}s
                        </span>
                    </div>
                </div>

                {gameWon || gameOver ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
                            {gameWon ? '🏆' : '💥'}
                        </div>
                        <h2 style={{ marginBottom: '1rem' }}>
                            {gameWon ? 'Level Complete!' : 'Game Over'}
                        </h2>
                        <p style={{ fontSize: '1.5rem', color: 'var(--accent)', marginBottom: '2rem' }}>
                            Final Score: {score}
                        </p>
                        <button className="btn btn-primary" onClick={startGame}>
                            Play Again
                        </button>
                    </div>
                ) : !isPlaying ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                            {config.targetEmoji || '🎮'}
                        </div>
                        <h2 style={{ marginBottom: '1rem' }}>{config.title}</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
                            {config.gameType === 'avoid' ? 'Avoid the bad items!' : 'Catch the targets!'}
                        </p>
                        <button className="btn btn-accent" onClick={startGame}>
                            Start Game
                        </button>
                    </div>
                ) : (
                    <div
                        ref={containerRef}
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '400px',
                            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.5), rgba(30, 41, 59, 0.5))',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            cursor: 'crosshair',
                        }}
                    >
                        {objects.map(obj => (
                            <button
                                key={obj.id}
                                onMouseDown={() => handleObjectClick(obj.id, obj.isTarget)}
                                style={{
                                    position: 'absolute',
                                    left: `${obj.x}%`,
                                    top: `${obj.y}%`,
                                    fontSize: '2.5rem',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transform: `scale(${obj.scale})`,
                                    userSelect: 'none',
                                }}
                            >
                                {obj.emoji}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
