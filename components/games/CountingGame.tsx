'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface CountingItem {
    emoji: string;
    count: number;
    options: number[];
}

const ITEMS: CountingItem[] = [
    { emoji: '🍎', count: 3, options: [2, 3, 4, 5] },
    { emoji: '⭐', count: 5, options: [4, 5, 6, 7] },
    { emoji: '🌈', count: 2, options: [1, 2, 3, 4] },
    { emoji: '🎈', count: 7, options: [5, 6, 7, 8] },
    { emoji: '🐶', count: 4, options: [3, 4, 5, 6] },
    { emoji: '🌸', count: 6, options: [4, 5, 6, 7] },
    { emoji: '🍕', count: 8, options: [6, 7, 8, 9] },
    { emoji: '🦋', count: 1, options: [1, 2, 3, 4] },
    { emoji: '🚗', count: 9, options: [7, 8, 9, 10] },
    { emoji: '🏀', count: 10, options: [8, 9, 10, 11] },
];

export default function CountingGame() {
    const [currentItem, setCurrentItem] = useState<CountingItem | null>(null);
    const [score, setScore] = useState(0);
    const [total, setTotal] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [gameComplete, setGameComplete] = useState(false);

    const getRandomItem = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * ITEMS.length);
        return { ...ITEMS[randomIndex], options: shuffle(ITEMS[randomIndex].options) };
    }, []);

    const startGame = useCallback(() => {
        setCurrentItem(getRandomItem());
        setScore(0);
        setTotal(0);
        setGameComplete(false);
        setFeedback(null);
    }, [getRandomItem]);

    useEffect(() => {
        startGame();
    }, [startGame]);

    const handleAnswer = (answer: number) => {
        if (!currentItem || feedback) return;

        const isCorrect = answer === currentItem.count;
        setFeedback(isCorrect ? 'correct' : 'wrong');

        if (isCorrect) {
            setScore(s => s + 1);
        }
        setTotal(t => t + 1);

        setTimeout(() => {
            setFeedback(null);
            if (total + 1 >= 10) {
                setGameComplete(true);
            } else {
                setCurrentItem(getRandomItem());
            }
        }, 1500);
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                        ← Back
                    </Link>
                    <h1 className="game-title">Counting Fun!</h1>
                    <div className="game-score">
                        {score}/{total}
                    </div>
                </div>

                {gameComplete ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                            {score >= 8 ? '🌟' : score >= 5 ? '😊' : '💪'}
                        </div>
                        <h2 style={{ marginBottom: '0.5rem' }}>
                            {score >= 8 ? 'Amazing!' : score >= 5 ? 'Good job!' : 'Keep practicing!'}
                        </h2>
                        <p style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '2rem' }}>
                            Score: {score}/10
                        </p>
                        <button className="btn btn-accent" onClick={startGame}>
                            Play Again
                        </button>
                    </div>
                ) : currentItem && (
                    <>
                        {/* Display items to count */}
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem',
                            marginBottom: '1rem',
                        }}>
                            <p style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>
                                How many {currentItem.emoji} do you see?
                            </p>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                maxWidth: '300px',
                                margin: '0 auto',
                                fontSize: '3rem',
                                padding: '1.5rem',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '16px',
                            }}>
                                {Array.from({ length: currentItem.count }).map((_, i) => (
                                    <span key={i} style={{ animation: 'bounce-subtle 0.5s ease-in-out' }}>
                                        {currentItem.emoji}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Feedback */}
                        {feedback && (
                            <div style={{
                                textAlign: 'center',
                                padding: '1rem',
                                marginBottom: '1rem',
                                background: feedback === 'correct' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                borderRadius: '12px',
                            }}>
                                <span style={{ fontSize: '2rem' }}>
                                    {feedback === 'correct' ? '✅ Correct!' : `❌ The answer is ${currentItem.count}`}
                                </span>
                            </div>
                        )}

                        {/* Answer options */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '1rem',
                            maxWidth: '300px',
                            margin: '0 auto',
                        }}>
                            {currentItem.options.map(option => (
                                <button
                                    key={option}
                                    onClick={() => handleAnswer(option)}
                                    className="btn"
                                    style={{
                                        fontSize: '2rem',
                                        padding: '1.5rem',
                                        background: feedback
                                            ? option === currentItem.count
                                                ? 'rgba(16, 185, 129, 0.5)'
                                                : 'rgba(255,255,255,0.1)'
                                            : 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                                        border: '2px solid rgba(255,255,255,0.2)',
                                    }}
                                    disabled={feedback !== null}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        {/* Progress */}
                        <div style={{
                            marginTop: '2rem',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '100px',
                            height: '8px',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                width: `${(total / 10) * 100}%`,
                                height: '100%',
                                background: 'var(--accent)',
                                transition: 'width 0.3s ease',
                            }} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
