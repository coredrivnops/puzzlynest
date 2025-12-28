'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { soundManager } from '@/lib/soundManager';
import { achievementManager } from '@/lib/achievements';
import AchievementPopup from '@/components/AchievementPopup';
import type { Achievement } from '@/lib/achievements';

// Number sequence patterns
const generateSequence = (difficulty: 'easy' | 'medium' | 'hard'): { sequence: number[], answer: number, rule: string } => {
    const patterns = {
        easy: [
            // Add 1, 2, 3, etc.
            () => {
                const start = Math.floor(Math.random() * 5) + 1; const step = Math.floor(Math.random() * 3) + 1;
                const seq = Array.from({ length: 5 }, (_, i) => start + step * i);
                return { sequence: seq.slice(0, 4), answer: seq[4], rule: `Add ${step}` };
            },
            // Multiply by 2
            () => {
                const start = Math.floor(Math.random() * 3) + 1;
                const seq = [start, start * 2, start * 4, start * 8, start * 16];
                return { sequence: seq.slice(0, 4), answer: seq[4], rule: 'Multiply by 2' };
            },
        ],
        medium: [
            // Fibonacci-like
            () => {
                const a = Math.floor(Math.random() * 3) + 1; const b = Math.floor(Math.random() * 3) + 2;
                const seq = [a, b, a + b, b + (a + b), (a + b) + (b + (a + b))];
                return { sequence: seq.slice(0, 4), answer: seq[4], rule: 'Add previous two' };
            },
            // Square numbers
            () => {
                const start = Math.floor(Math.random() * 2) + 1;
                const seq = Array.from({ length: 5 }, (_, i) => Math.pow(start + i, 2));
                return { sequence: seq.slice(0, 4), answer: seq[4], rule: 'Square numbers' };
            },
            // Add increasing amounts
            () => {
                const start = Math.floor(Math.random() * 5) + 1;
                const seq = [start, start + 1, start + 1 + 2, start + 1 + 2 + 3, start + 1 + 2 + 3 + 4];
                return { sequence: seq.slice(0, 4), answer: seq[4], rule: 'Add 1, then 2, then 3...' };
            },
        ],
        hard: [
            // Prime numbers
            () => {
                const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23];
                const start = Math.floor(Math.random() * 4);
                const seq = primes.slice(start, start + 5);
                return { sequence: seq.slice(0, 4), answer: seq[4], rule: 'Prime numbers' };
            },
            // Triangular numbers
            () => {
                const triangular = [1, 3, 6, 10, 15, 21, 28, 36];
                const start = Math.floor(Math.random() * 3);
                const seq = triangular.slice(start, start + 5);
                return { sequence: seq.slice(0, 4), answer: seq[4], rule: 'Triangular numbers' };
            },
        ],
    };

    const patternList = patterns[difficulty];
    const patternFn = patternList[Math.floor(Math.random() * patternList.length)];
    return patternFn();
};

const generateOptions = (answer: number): number[] => {
    const options = new Set<number>([answer]);
    while (options.size < 4) {
        const offset = Math.floor(Math.random() * 10) - 5;
        if (offset !== 0) options.add(answer + offset);
    }
    return Array.from(options).sort((a, b) => a - b);
};

export default function NumberSequenceGame() {
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
    const [sequence, setSequence] = useState<number[]>([]);
    const [answer, setAnswer] = useState<number>(0);
    const [rule, setRule] = useState<string>('');
    const [options, setOptions] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [selected, setSelected] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showRule, setShowRule] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
    const [startTime, setStartTime] = useState<Date>(new Date());

    const totalRounds = 10;

    const loadNewSequence = useCallback(() => {
        const { sequence: seq, answer: ans, rule: r } = generateSequence(difficulty);
        setSequence(seq);
        setAnswer(ans);
        setRule(r);
        setOptions(generateOptions(ans));
        setSelected(null);
        setIsCorrect(null);
        setShowRule(false);
    }, [difficulty]);

    useEffect(() => {
        loadNewSequence();
        setStartTime(new Date());
    }, [loadNewSequence]);

    const handleSelect = (num: number) => {
        if (selected !== null) return;

        setSelected(num);
        const correct = num === answer;
        setIsCorrect(correct);

        if (correct) {
            soundManager.play('success');
            setScore(score + (difficulty === 'hard' ? 30 : difficulty === 'medium' ? 20 : 10));
        } else {
            soundManager.play('error');
            setShowRule(true);
        }

        setTimeout(() => {
            if (round >= totalRounds) {
                setGameOver(true);
                soundManager.play('win');
                const playTime = Math.floor((new Date().getTime() - startTime.getTime()) / 60000);
                const achievements = achievementManager.recordGamePlayed(true, playTime, score >= (totalRounds * 10 * 0.7));
                if (achievements.length > 0) {
                    const ach = achievementManager.getAchievement(achievements[0]);
                    if (ach) setCurrentAchievement(ach);
                }
            } else {
                setRound(round + 1);
                loadNewSequence();
            }
        }, 1500);
    };

    const resetGame = () => {
        setScore(0);
        setRound(1);
        setGameOver(false);
        loadNewSequence();
        setStartTime(new Date());
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
                    <h1 className="game-title">Number Sequence</h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <span className="game-score">Score: {score}</span>
                        <span className="game-score">{round}/{totalRounds}</span>
                    </div>
                </div>

                {!gameOver ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        {/* Difficulty selector */}
                        <div style={{ marginBottom: '2rem' }}>
                            {(['easy', 'medium', 'hard'] as const).map(d => (
                                <button
                                    key={d}
                                    onClick={() => { setDifficulty(d); loadNewSequence(); }}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        margin: '0 0.25rem',
                                        background: difficulty === d ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>

                        {/* Question */}
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
                            What comes next in this sequence?
                        </p>

                        {/* Sequence display */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '1rem',
                            marginBottom: '2rem',
                            flexWrap: 'wrap',
                        }}>
                            {sequence.map((num, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        background: 'rgba(99, 102, 241, 0.3)',
                                        borderRadius: '12px',
                                        border: '2px solid rgba(99, 102, 241, 0.5)',
                                    }}
                                >
                                    {num}
                                </div>
                            ))}
                            <div
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    background: 'rgba(245, 158, 11, 0.3)',
                                    borderRadius: '12px',
                                    border: '2px dashed rgba(245, 158, 11, 0.5)',
                                }}
                            >
                                ?
                            </div>
                        </div>

                        {/* Options */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '1rem',
                            flexWrap: 'wrap',
                        }}>
                            {options.map((num) => {
                                let bg = 'rgba(255,255,255,0.1)';
                                let border = 'rgba(255,255,255,0.2)';

                                if (selected !== null) {
                                    if (num === answer) {
                                        bg = 'rgba(16, 185, 129, 0.3)';
                                        border = '#10b981';
                                    } else if (num === selected) {
                                        bg = 'rgba(239, 68, 68, 0.3)';
                                        border = '#ef4444';
                                    }
                                }

                                return (
                                    <button
                                        key={num}
                                        onClick={() => handleSelect(num)}
                                        disabled={selected !== null}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            fontSize: '1.5rem',
                                            fontWeight: 'bold',
                                            background: bg,
                                            border: `2px solid ${border}`,
                                            borderRadius: '12px',
                                            color: 'white',
                                            cursor: selected !== null ? 'default' : 'pointer',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        {num}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Show rule on wrong answer */}
                        {showRule && (
                            <p style={{ marginTop: '1.5rem', color: 'rgba(255,255,255,0.7)' }}>
                                Pattern: <strong style={{ color: 'var(--accent)' }}>{rule}</strong>
                            </p>
                        )}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
                        <h2 style={{ marginBottom: '1rem' }}>Game Complete!</h2>
                        <p style={{ fontSize: '1.5rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>
                            Final Score: {score}
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
                            {score >= totalRounds * 10 * 0.8 ? 'Excellent!' : score >= totalRounds * 10 * 0.5 ? 'Good job!' : 'Keep practicing!'}
                        </p>
                        <button className="btn btn-primary" onClick={resetGame}>
                            Play Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
