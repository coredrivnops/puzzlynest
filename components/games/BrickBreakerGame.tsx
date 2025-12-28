'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { soundManager } from '@/lib/soundManager';
import { achievementManager } from '@/lib/achievements';
import AchievementPopup from '@/components/AchievementPopup';
import type { Achievement } from '@/lib/achievements';

interface Brick {
    id: number;
    x: number;
    y: number;
    color: string;
    alive: boolean;
}

const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 12;
const BALL_SIZE = 12;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_WIDTH = GAME_WIDTH / BRICK_COLS - 4;
const BRICK_HEIGHT = 20;

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

export default function BrickBreakerGame() {
    const [paddleX, setPaddleX] = useState(GAME_WIDTH / 2 - PADDLE_WIDTH / 2);
    const [ballX, setBallX] = useState(GAME_WIDTH / 2);
    const [ballY, setBallY] = useState(GAME_HEIGHT - 50);
    const [ballVelX, setBallVelX] = useState(4);
    const [ballVelY, setBallVelY] = useState(-4);
    const [bricks, setBricks] = useState<Brick[]>([]);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
    const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

    const gameRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);

    // Initialize bricks
    const initBricks = useCallback(() => {
        const newBricks: Brick[] = [];
        let id = 0;
        for (let row = 0; row < BRICK_ROWS; row++) {
            for (let col = 0; col < BRICK_COLS; col++) {
                newBricks.push({
                    id: id++,
                    x: col * (BRICK_WIDTH + 4) + 2,
                    y: row * (BRICK_HEIGHT + 4) + 40,
                    color: COLORS[row % COLORS.length],
                    alive: true,
                });
            }
        }
        setBricks(newBricks);
    }, []);

    useEffect(() => {
        initBricks();
    }, [initBricks]);

    const resetBall = () => {
        setBallX(GAME_WIDTH / 2);
        setBallY(GAME_HEIGHT - 50);
        setBallVelX((Math.random() > 0.5 ? 1 : -1) * 4);
        setBallVelY(-4);
    };

    const startGame = () => {
        initBricks();
        resetBall();
        setPaddleX(GAME_WIDTH / 2 - PADDLE_WIDTH / 2);
        setScore(0);
        setLives(3);
        setGameState('playing');
        soundManager.play('click');
    };

    // Game loop
    useEffect(() => {
        if (gameState !== 'playing') return;

        const gameLoop = () => {
            // Update ball position
            setBallX(x => {
                let newX = x + ballVelX;

                // Wall collision
                if (newX <= 0 || newX >= GAME_WIDTH - BALL_SIZE) {
                    setBallVelX(v => -v);
                    soundManager.play('pop');
                    newX = Math.max(0, Math.min(GAME_WIDTH - BALL_SIZE, newX));
                }

                return newX;
            });

            setBallY(y => {
                let newY = y + ballVelY;

                // Ceiling collision
                if (newY <= 0) {
                    setBallVelY(v => -v);
                    soundManager.play('pop');
                    newY = 0;
                }

                // Floor (lose life)
                if (newY >= GAME_HEIGHT) {
                    setLives(l => {
                        const newLives = l - 1;
                        if (newLives <= 0) {
                            setGameState('lost');
                            soundManager.play('lose');
                            const achievements = achievementManager.recordGamePlayed(false, 3, false);
                            if (achievements.length > 0) {
                                const ach = achievementManager.getAchievement(achievements[0]);
                                if (ach) setCurrentAchievement(ach);
                            }
                        } else {
                            resetBall();
                            soundManager.play('error');
                        }
                        return newLives;
                    });
                    return GAME_HEIGHT - 50;
                }

                return newY;
            });

            animationRef.current = requestAnimationFrame(gameLoop);
        };

        animationRef.current = requestAnimationFrame(gameLoop);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [gameState, ballVelX, ballVelY]);

    // Collision detection
    useEffect(() => {
        if (gameState !== 'playing') return;

        // Paddle collision
        if (
            ballY + BALL_SIZE >= GAME_HEIGHT - PADDLE_HEIGHT - 20 &&
            ballY + BALL_SIZE <= GAME_HEIGHT - 20 &&
            ballX + BALL_SIZE >= paddleX &&
            ballX <= paddleX + PADDLE_WIDTH
        ) {
            // Calculate bounce angle based on where ball hits paddle
            const hitPoint = (ballX + BALL_SIZE / 2 - paddleX) / PADDLE_WIDTH;
            const angle = (hitPoint - 0.5) * 2; // -1 to 1
            setBallVelX(angle * 6);
            setBallVelY(-Math.abs(ballVelY));
            soundManager.play('pop');
        }

        // Brick collision
        setBricks(prev => {
            let hit = false;
            const newBricks = prev.map(brick => {
                if (!brick.alive) return brick;

                if (
                    ballX + BALL_SIZE >= brick.x &&
                    ballX <= brick.x + BRICK_WIDTH &&
                    ballY + BALL_SIZE >= brick.y &&
                    ballY <= brick.y + BRICK_HEIGHT
                ) {
                    hit = true;
                    setScore(s => s + 10);
                    soundManager.play('success');
                    return { ...brick, alive: false };
                }
                return brick;
            });

            if (hit) {
                setBallVelY(v => -v);
            }

            // Check win
            if (newBricks.every(b => !b.alive)) {
                setGameState('won');
                soundManager.play('win');
                const achievements = achievementManager.recordGamePlayed(true, 5, false);
                if (achievements.length > 0) {
                    const ach = achievementManager.getAchievement(achievements[0]);
                    if (ach) setCurrentAchievement(ach);
                }
            }

            return newBricks;
        });
    }, [ballX, ballY, paddleX, gameState]);

    // Mouse/touch controls
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (gameState !== 'playing' || !gameRef.current) return;
        const rect = gameRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - PADDLE_WIDTH / 2;
        setPaddleX(Math.max(0, Math.min(GAME_WIDTH - PADDLE_WIDTH, x)));
    }, [gameState]);

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
                    <h1 className="game-title">Brick Breaker</h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <span className="game-score">Score: {score}</span>
                        <span className="game-score">Lives: {'❤️'.repeat(lives)}</span>
                    </div>
                </div>

                <div
                    ref={gameRef}
                    onMouseMove={handleMouseMove}
                    style={{
                        position: 'relative',
                        width: `${GAME_WIDTH}px`,
                        height: `${GAME_HEIGHT}px`,
                        margin: '0 auto',
                        background: 'linear-gradient(180deg, #0f172a, #1e293b)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: gameState === 'playing' ? 'none' : 'default',
                    }}
                >
                    {/* Bricks */}
                    {bricks.map(brick => brick.alive && (
                        <div
                            key={brick.id}
                            style={{
                                position: 'absolute',
                                left: brick.x,
                                top: brick.y,
                                width: BRICK_WIDTH,
                                height: BRICK_HEIGHT,
                                background: `linear-gradient(135deg, ${brick.color}, ${brick.color}dd)`,
                                borderRadius: '4px',
                                boxShadow: `0 2px 4px ${brick.color}40`,
                            }}
                        />
                    ))}

                    {/* Ball */}
                    <div style={{
                        position: 'absolute',
                        left: ballX,
                        top: ballY,
                        width: BALL_SIZE,
                        height: BALL_SIZE,
                        background: 'radial-gradient(circle at 30% 30%, white, #ddd)',
                        borderRadius: '50%',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    }} />

                    {/* Paddle */}
                    <div style={{
                        position: 'absolute',
                        left: paddleX,
                        bottom: 20,
                        width: PADDLE_WIDTH,
                        height: PADDLE_HEIGHT,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        borderRadius: '6px',
                        boxShadow: '0 4px 10px rgba(99, 102, 241, 0.5)',
                    }} />

                    {/* Start/Game over overlay */}
                    {gameState !== 'playing' && (
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(0,0,0,0.7)',
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                                {gameState === 'won' ? '🏆' : gameState === 'lost' ? '💥' : '🧱'}
                            </div>
                            <h2 style={{ marginBottom: '1rem' }}>
                                {gameState === 'won' ? 'You Win!' : gameState === 'lost' ? 'Game Over' : 'Brick Breaker'}
                            </h2>
                            {(gameState === 'won' || gameState === 'lost') && (
                                <p style={{ marginBottom: '1rem' }}>Final Score: {score}</p>
                            )}
                            <button className="btn btn-primary" onClick={startGame}>
                                {gameState === 'idle' ? 'Start Game' : 'Play Again'}
                            </button>
                        </div>
                    )}
                </div>

                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginTop: '1rem' }}>
                    Move mouse to control paddle
                </p>
            </div>
        </div>
    );
}
