'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { soundManager } from '@/lib/soundManager';
import { achievementManager } from '@/lib/achievements';
import AchievementPopup from '@/components/AchievementPopup';
import type { Achievement } from '@/lib/achievements';

interface Obstacle {
    id: number;
    x: number;
    height: number;
    passed: boolean;
}

const GRAVITY = 0.5;
const JUMP_STRENGTH = -10;
const OBSTACLE_WIDTH = 50;
const GAP_HEIGHT = 150;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 400;

export default function FlappyGame() {
    const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
    const [birdVelocity, setBirdVelocity] = useState(0);
    const [obstacles, setObstacles] = useState<Obstacle[]>([]);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
    const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

    const gameLoopRef = useRef<number | null>(null);
    const lastObstacleRef = useRef(0);

    useEffect(() => {
        const saved = localStorage.getItem('flappy-highscore');
        if (saved) setHighScore(parseInt(saved));
    }, []);

    const jump = useCallback(() => {
        if (gameState === 'idle') {
            setGameState('playing');
            setBirdVelocity(JUMP_STRENGTH);
            soundManager.play('click');
        } else if (gameState === 'playing') {
            setBirdVelocity(JUMP_STRENGTH);
            soundManager.play('click');
        }
    }, [gameState]);

    const resetGame = () => {
        setBirdY(GAME_HEIGHT / 2);
        setBirdVelocity(0);
        setObstacles([]);
        setScore(0);
        setGameState('idle');
    };

    // Game loop
    useEffect(() => {
        if (gameState !== 'playing') return;

        const gameLoop = () => {
            // Update bird
            setBirdVelocity(v => v + GRAVITY);
            setBirdY(y => {
                const newY = y + birdVelocity;

                // Check ceiling/floor collision
                if (newY < 0 || newY > GAME_HEIGHT - 30) {
                    endGame();
                    return y;
                }
                return newY;
            });

            // Update obstacles
            setObstacles(prev => {
                const now = Date.now();
                let newObstacles = prev.map(obs => ({ ...obs, x: obs.x - 3 }))
                    .filter(obs => obs.x > -OBSTACLE_WIDTH);

                // Add new obstacle
                if (now - lastObstacleRef.current > 2000) {
                    const height = Math.random() * (GAME_HEIGHT - GAP_HEIGHT - 100) + 50;
                    newObstacles.push({
                        id: now,
                        x: GAME_WIDTH,
                        height,
                        passed: false,
                    });
                    lastObstacleRef.current = now;
                }

                // Check for scoring
                newObstacles = newObstacles.map(obs => {
                    if (!obs.passed && obs.x + OBSTACLE_WIDTH < 50) {
                        setScore(s => s + 1);
                        soundManager.play('coin');
                        return { ...obs, passed: true };
                    }
                    return obs;
                });

                return newObstacles;
            });

            gameLoopRef.current = requestAnimationFrame(gameLoop);
        };

        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        };
    }, [gameState, birdVelocity]);

    // Collision detection
    useEffect(() => {
        if (gameState !== 'playing') return;

        const birdLeft = 50;
        const birdRight = 80;
        const birdTop = birdY;
        const birdBottom = birdY + 30;

        for (const obs of obstacles) {
            const obsLeft = obs.x;
            const obsRight = obs.x + OBSTACLE_WIDTH;
            const topPipeBottom = obs.height;
            const bottomPipeTop = obs.height + GAP_HEIGHT;

            // Check horizontal overlap
            if (birdRight > obsLeft && birdLeft < obsRight) {
                // Check vertical collision
                if (birdTop < topPipeBottom || birdBottom > bottomPipeTop) {
                    endGame();
                    return;
                }
            }
        }
    }, [birdY, obstacles, gameState]);

    const endGame = () => {
        setGameState('gameover');
        soundManager.play('lose');

        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('flappy-highscore', score.toString());
        }

        const achievements = achievementManager.recordGamePlayed(false, 1, false);
        if (achievements.length > 0) {
            const ach = achievementManager.getAchievement(achievements[0]);
            if (ach) setCurrentAchievement(ach);
        }
    };

    // Keyboard/touch controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                jump();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [jump]);

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
                    <h1 className="game-title">Flappy Bird</h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <span className="game-score">Score: {score}</span>
                        <span className="game-score" style={{ opacity: 0.6 }}>Best: {highScore}</span>
                    </div>
                </div>

                <div
                    onClick={jump}
                    style={{
                        position: 'relative',
                        width: `${GAME_WIDTH}px`,
                        height: `${GAME_HEIGHT}px`,
                        margin: '0 auto',
                        background: 'linear-gradient(180deg, #87CEEB 0%, #E0F6FF 100%)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        userSelect: 'none',
                    }}
                >
                    {/* Ground */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        height: '20px',
                        background: '#8B4513',
                    }} />

                    {/* Bird */}
                    <div style={{
                        position: 'absolute',
                        left: '50px',
                        top: `${birdY}px`,
                        width: '30px',
                        height: '30px',
                        fontSize: '24px',
                        transform: `rotate(${Math.min(birdVelocity * 3, 90)}deg)`,
                        transition: 'transform 0.1s ease',
                    }}>
                        🐦
                    </div>

                    {/* Obstacles (pipes) */}
                    {obstacles.map(obs => (
                        <div key={obs.id}>
                            {/* Top pipe */}
                            <div style={{
                                position: 'absolute',
                                left: `${obs.x}px`,
                                top: 0,
                                width: `${OBSTACLE_WIDTH}px`,
                                height: `${obs.height}px`,
                                background: 'linear-gradient(90deg, #228B22, #32CD32, #228B22)',
                                borderRadius: '0 0 8px 8px',
                                boxShadow: 'inset -5px 0 10px rgba(0,0,0,0.2)',
                            }} />
                            {/* Top pipe cap */}
                            <div style={{
                                position: 'absolute',
                                left: `${obs.x - 5}px`,
                                top: `${obs.height - 20}px`,
                                width: `${OBSTACLE_WIDTH + 10}px`,
                                height: '20px',
                                background: 'linear-gradient(90deg, #228B22, #32CD32, #228B22)',
                                borderRadius: '4px',
                            }} />

                            {/* Bottom pipe */}
                            <div style={{
                                position: 'absolute',
                                left: `${obs.x}px`,
                                top: `${obs.height + GAP_HEIGHT}px`,
                                width: `${OBSTACLE_WIDTH}px`,
                                height: `${GAME_HEIGHT - obs.height - GAP_HEIGHT}px`,
                                background: 'linear-gradient(90deg, #228B22, #32CD32, #228B22)',
                                borderRadius: '8px 8px 0 0',
                                boxShadow: 'inset -5px 0 10px rgba(0,0,0,0.2)',
                            }} />
                            {/* Bottom pipe cap */}
                            <div style={{
                                position: 'absolute',
                                left: `${obs.x - 5}px`,
                                top: `${obs.height + GAP_HEIGHT}px`,
                                width: `${OBSTACLE_WIDTH + 10}px`,
                                height: '20px',
                                background: 'linear-gradient(90deg, #228B22, #32CD32, #228B22)',
                                borderRadius: '4px',
                            }} />
                        </div>
                    ))}

                    {/* Start message */}
                    {gameState === 'idle' && (
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            color: '#333',
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🐦</div>
                            <p style={{ fontWeight: 'bold' }}>Tap or Press Space to Start</p>
                        </div>
                    )}

                    {/* Game over */}
                    {gameState === 'gameover' && (
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            background: 'rgba(0,0,0,0.8)',
                            padding: '2rem',
                            borderRadius: '16px',
                            color: 'white',
                        }}>
                            <h2 style={{ marginBottom: '1rem' }}>Game Over!</h2>
                            <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Score: {score}</p>
                            <button className="btn btn-primary" onClick={resetGame}>
                                Try Again
                            </button>
                        </div>
                    )}
                </div>

                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginTop: '1rem' }}>
                    Click or press Space to fly
                </p>
            </div>
        </div>
    );
}
