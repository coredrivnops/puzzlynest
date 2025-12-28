'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { soundManager } from '@/lib/soundManager';
import { achievementManager } from '@/lib/achievements';
import AchievementPopup from '@/components/AchievementPopup';
import type { Achievement } from '@/lib/achievements';

// Pattern types: shapes, colors, or numbers
interface PatternItem {
    type: 'shape' | 'color' | 'number';
    value: string;
}

const SHAPES = ['⭐', '🔵', '🔴', '🟢', '🔷', '⬛', '🟡', '💜'];
const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

const generatePattern = (difficulty: 'easy' | 'medium' | 'hard'): { pattern: PatternItem[], answer: PatternItem, options: PatternItem[] } => {
    const patternLength = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;

    // Simple repeating pattern
    const basePattern = SHAPES.slice(0, difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4);
    const pattern: PatternItem[] = [];

    for (let i = 0; i < patternLength; i++) {
        pattern.push({
            type: 'shape',
            value: basePattern[i % basePattern.length],
        });
    }

    // The answer is the next in sequence
    const answer: PatternItem = {
        type: 'shape',
        value: basePattern[patternLength % basePattern.length],
    };

    // Generate options (including correct answer)
    const optionsSet = new Set<string>([answer.value]);
    while (optionsSet.size < 4) {
        optionsSet.add(SHAPES[Math.floor(Math.random() * SHAPES.length)]);
    }

    const options = Array.from(optionsSet).map(v => ({ type: 'shape' as const, value: v }));
    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    return { pattern, answer, options };
};

export default function PatternGame() {
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
    const [pattern, setPattern] = useState<PatternItem[]>([]);
    const [answer, setAnswer] = useState<PatternItem | null>(null);
    const [options, setOptions] = useState<PatternItem[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

    const totalRounds = 10;

    const loadNewPattern = useCallback(() => {
        const { pattern: p, answer: a, options: o } = generatePattern(difficulty);
        setPattern(p);
        setAnswer(a);
        setOptions(o);
        setSelected(null);
        setIsCorrect(null);
    }, [difficulty]);

    useEffect(() => {
        loadNewPattern();
    }, [loadNewPattern]);

    const handleSelect = (value: string) => {
        if (selected !== null) return;

        setSelected(value);
        const correct = value === answer?.value;
        setIsCorrect(correct);

        if (correct) {
            soundManager.play('success');
            setScore(s => s + 10);
        } else {
            soundManager.play('error');
        }

        setTimeout(() => {
            if (round >= totalRounds) {
                soundManager.play('win');
                const achievements = achievementManager.recordGamePlayed(true, 3, score >= 80);
                if (achievements.length > 0) {
                    const ach = achievementManager.getAchievement(achievements[0]);
                    if (ach) setCurrentAchievement(ach);
                }
            } else {
                setRound(r => r + 1);
                loadNewPattern();
            }
        }, 1000);
    };

    const resetGame = () => {
        setScore(0);
        setRound(1);
        loadNewPattern();
        soundManager.play('click');
    };

    const isGameOver = round > totalRounds;

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
                    <h1 className="game-title">Pattern Fun</h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <span className="game-score">Score: {score}</span>
                        <span className="game-score">{Math.min(round, totalRounds)}/{totalRounds}</span>
                    </div>
                </div>

                {!isGameOver ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        {/* Difficulty selector */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            {(['easy', 'medium', 'hard'] as const).map(d => (
                                <button
                                    key={d}
                                    onClick={() => { setDifficulty(d); loadNewPattern(); }}
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

                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>
                            What comes next in this pattern?
                        </p>

                        {/* Pattern display */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            marginBottom: '2rem',
                            flexWrap: 'wrap',
                        }}>
                            {pattern.map((item, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2.5rem',
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        animation: `scaleIn 0.3s ease ${i * 0.1}s both`,
                                    }}
                                >
                                    {item.value}
                                </div>
                            ))}
                            <div style={{
                                width: '60px',
                                height: '60px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                background: 'rgba(245, 158, 11, 0.3)',
                                borderRadius: '12px',
                                border: '2px dashed rgba(245, 158, 11, 0.5)',
                            }}>
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
                            {options.map((option, i) => {
                                let bg = 'rgba(255,255,255,0.1)';
                                let border = 'rgba(255,255,255,0.2)';

                                if (selected !== null) {
                                    if (option.value === answer?.value) {
                                        bg = 'rgba(16, 185, 129, 0.3)';
                                        border = '#10b981';
                                    } else if (option.value === selected) {
                                        bg = 'rgba(239, 68, 68, 0.3)';
                                        border = '#ef4444';
                                    }
                                }

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleSelect(option.value)}
                                        disabled={selected !== null}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            fontSize: '3rem',
                                            background: bg,
                                            border: `2px solid ${border}`,
                                            borderRadius: '16px',
                                            cursor: selected !== null ? 'default' : 'pointer',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        {option.value}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
                        <h2 style={{ marginBottom: '1rem' }}>Great Job!</h2>
                        <p style={{ fontSize: '1.5rem', color: 'var(--accent)', marginBottom: '2rem' }}>
                            Final Score: {score}
                        </p>
                        <button className="btn btn-primary" onClick={resetGame}>
                            Play Again
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
        </div>
    );
}
