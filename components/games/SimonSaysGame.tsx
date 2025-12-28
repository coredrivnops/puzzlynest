'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { soundManager } from '@/lib/soundManager';
import { achievementManager } from '@/lib/achievements';
import AchievementPopup from '@/components/AchievementPopup';
import type { Achievement } from '@/lib/achievements';

const COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#eab308'];

export default function SimonGame() {
    const [sequence, setSequence] = useState<number[]>([]);
    const [playerSequence, setPlayerSequence] = useState<number[]>([]);
    const [isShowingSequence, setIsShowingSequence] = useState(false);
    const [activeButton, setActiveButton] = useState<number | null>(null);
    const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'gameover'>('idle');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('simon-highscore');
        if (saved) setHighScore(parseInt(saved));
    }, []);

    const playSound = (index: number) => {
        // Different frequency for each color
        const frequencies = [261, 329, 392, 523]; // C, E, G, high C
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = frequencies[index];
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    };

    const showSequence = useCallback(async (seq: number[]) => {
        setIsShowingSequence(true);
        setGameState('showing');

        for (let i = 0; i < seq.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 600));
            setActiveButton(seq[i]);
            playSound(seq[i]);
            await new Promise(resolve => setTimeout(resolve, 400));
            setActiveButton(null);
        }

        setIsShowingSequence(false);
        setGameState('playing');
        setPlayerSequence([]);
    }, []);

    const startGame = () => {
        const firstColor = Math.floor(Math.random() * 4);
        setSequence([firstColor]);
        setScore(0);
        setGameState('showing');
        setStartTime(new Date());
        soundManager.play('click');

        setTimeout(() => showSequence([firstColor]), 500);
    };

    const handleButtonClick = (index: number) => {
        if (gameState !== 'playing') return;

        playSound(index);
        setActiveButton(index);
        setTimeout(() => setActiveButton(null), 200);

        const newPlayerSequence = [...playerSequence, index];
        setPlayerSequence(newPlayerSequence);

        // Check if wrong
        if (sequence[newPlayerSequence.length - 1] !== index) {
            // Game over
            setGameState('gameover');
            soundManager.play('lose');

            if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('simon-highscore', score.toString());
            }

            if (startTime) {
                const playTime = Math.floor((new Date().getTime() - startTime.getTime()) / 60000);
                const achievements = achievementManager.recordGamePlayed(false, playTime, false);
                if (achievements.length > 0) {
                    const ach = achievementManager.getAchievement(achievements[0]);
                    if (ach) setCurrentAchievement(ach);
                }
            }
            return;
        }

        // Check if completed sequence
        if (newPlayerSequence.length === sequence.length) {
            setScore(score + 1);
            soundManager.play('success');

            // Add new color to sequence
            const newSequence = [...sequence, Math.floor(Math.random() * 4)];
            setSequence(newSequence);

            setTimeout(() => showSequence(newSequence), 1000);
        }
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
                    <h1 className="game-title">Simon Says</h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <span className="game-score">Score: {score}</span>
                        <span className="game-score" style={{ opacity: 0.6 }}>Best: {highScore}</span>
                    </div>
                </div>

                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    {/* Game status */}
                    <p style={{
                        color: 'rgba(255,255,255,0.7)',
                        marginBottom: '2rem',
                        minHeight: '24px',
                    }}>
                        {gameState === 'idle' && 'Press Start to begin!'}
                        {gameState === 'showing' && 'Watch the sequence...'}
                        {gameState === 'playing' && 'Your turn! Repeat the sequence'}
                        {gameState === 'gameover' && `Game Over! You reached level ${score}`}
                    </p>

                    {/* Simon board */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '12px',
                        maxWidth: '280px',
                        margin: '0 auto 2rem',
                    }}>
                        {COLORS.map((color, index) => (
                            <button
                                key={index}
                                onClick={() => handleButtonClick(index)}
                                disabled={gameState !== 'playing'}
                                style={{
                                    aspectRatio: '1',
                                    background: color,
                                    border: 'none',
                                    borderRadius: index === 0 ? '100% 0 0 0'
                                        : index === 1 ? '0 100% 0 0'
                                            : index === 2 ? '0 0 0 100%'
                                                : '0 0 100% 0',
                                    cursor: gameState === 'playing' ? 'pointer' : 'default',
                                    opacity: activeButton === index ? 1 : 0.6,
                                    transform: activeButton === index ? 'scale(0.95)' : 'scale(1)',
                                    transition: 'all 0.1s ease',
                                    boxShadow: activeButton === index
                                        ? `0 0 30px ${color}, inset 0 0 20px rgba(255,255,255,0.5)`
                                        : `0 4px 15px ${color}40`,
                                }}
                            />
                        ))}
                    </div>

                    {/* Center circle with level */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: '#1e293b',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                        zIndex: 10,
                    }}>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>LEVEL</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{score + 1}</span>
                    </div>

                    {/* Controls */}
                    {(gameState === 'idle' || gameState === 'gameover') && (
                        <button className="btn btn-primary" onClick={startGame}>
                            {gameState === 'idle' ? 'Start Game' : 'Play Again'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
