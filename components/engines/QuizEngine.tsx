'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { soundManager } from '@/lib/soundManager';
import { achievementManager } from '@/lib/achievements';
import AchievementPopup from '@/components/AchievementPopup';
import type { Achievement } from '@/lib/achievements';

interface Question {
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface QuizConfig {
    title: string;
    description?: string;
    questions: Question[];
    difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizGameProps {
    config: QuizConfig;
}

export default function QuizEngine({ config }: QuizGameProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [streak, setStreak] = useState(0);
    const [startTime, setStartTime] = useState<Date | null>(null);

    // Achievement state
    const [newAchievements, setNewAchievements] = useState<string[]>([]);
    const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

    useEffect(() => {
        setStartTime(new Date());
    }, []);

    const handleAnswerClick = (answer: string) => {
        if (selectedAnswer !== null) return; // Prevent double clicking

        setSelectedAnswer(answer);
        const correct = answer === config.questions[currentQuestionIndex].correctAnswer;
        setIsCorrect(correct);

        if (correct) {
            soundManager.play('success');
            setScore(score + 1);
            setStreak(streak + 1);
        } else {
            soundManager.play('error');
            setStreak(0);
        }

        // Next question delay
        setTimeout(() => {
            if (currentQuestionIndex < config.questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedAnswer(null);
                setIsCorrect(null);
            } else {
                handleGameComplete(correct ? score + 1 : score);
            }
        }, 1500);
    };

    const handleGameComplete = (finalScore: number) => {
        setShowResult(true);
        soundManager.play('win');

        if (startTime) {
            const playTime = Math.floor((new Date().getTime() - startTime.getTime()) / 60000);
            const isWin = finalScore >= Math.ceil(config.questions.length * 0.7); // 70% to win
            const perfect = finalScore === config.questions.length;

            const achievements = achievementManager.recordGamePlayed(isWin, playTime, perfect);
            if (achievements.length > 0) {
                setNewAchievements(achievements);
                const firstAchievement = achievementManager.getAchievement(achievements[0]);
                if (firstAchievement) {
                    setCurrentAchievement(firstAchievement);
                }
            }
        }
    };

    const resetGame = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResult(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setStreak(0);
        setStartTime(new Date());
    };

    const currentQuestion = config.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / config.questions.length) * 100;

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
                    <div className="game-score">Score: {score}/{config.questions.length}</div>
                </div>

                {showResult ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
                            {score === config.questions.length ? '🏆' : score > config.questions.length / 2 ? '🎉' : '🤔'}
                        </div>
                        <h2 style={{ marginBottom: '1rem' }}>
                            {score === config.questions.length ? 'Perfect Score!' : 'Game Complete!'}
                        </h2>
                        <p style={{ fontSize: '1.5rem', color: 'var(--accent)', marginBottom: '2rem' }}>
                            You got {score} out of {config.questions.length} correct
                        </p>
                        <button className="btn btn-primary" onClick={resetGame}>
                            Play Again
                        </button>
                    </div>
                ) : (
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        {/* Progress Bar */}
                        <div style={{
                            height: '8px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '100px',
                            marginBottom: '2rem',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${progress}%`,
                                background: 'var(--primary)',
                                transition: 'width 0.3s ease'
                            }} />
                        </div>

                        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
                                {currentQuestion.question}
                            </h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                            {currentQuestion.options.map((option, index) => {
                                let backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                let borderColor = 'rgba(255, 255, 255, 0.2)';

                                if (selectedAnswer === option) {
                                    if (isCorrect === true) {
                                        backgroundColor = 'rgba(16, 185, 129, 0.3)';
                                        borderColor = '#10b981';
                                    } else if (isCorrect === false) {
                                        backgroundColor = 'rgba(239, 68, 68, 0.3)';
                                        borderColor = '#ef4444';
                                    } else {
                                        backgroundColor = 'rgba(99, 102, 241, 0.3)';
                                        borderColor = '#6366f1';
                                    }
                                } else if (selectedAnswer !== null && option === currentQuestion.correctAnswer) {
                                    // Show correct answer if wrong one was picked
                                    backgroundColor = 'rgba(16, 185, 129, 0.1)';
                                    borderColor = 'rgba(16, 185, 129, 0.5)';
                                }

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerClick(option)}
                                        disabled={selectedAnswer !== null}
                                        style={{
                                            padding: '1.5rem',
                                            background: backgroundColor,
                                            border: `2px solid ${borderColor}`,
                                            borderRadius: '12px',
                                            color: 'white',
                                            fontSize: '1.2rem',
                                            cursor: selectedAnswer !== null ? 'default' : 'pointer',
                                            transition: 'all 0.2s ease',
                                            textAlign: 'left',
                                            position: 'relative',
                                        }}
                                    >
                                        <span style={{
                                            display: 'inline-block',
                                            width: '30px',
                                            opacity: 0.5,
                                            marginRight: '1rem'
                                        }}>
                                            {String.fromCharCode(65 + index)}.
                                        </span>
                                        {option}

                                        {selectedAnswer === option && isCorrect && (
                                            <span style={{ position: 'absolute', right: '1.5rem' }}>✅</span>
                                        )}
                                        {selectedAnswer === option && !isCorrect && (
                                            <span style={{ position: 'absolute', right: '1.5rem' }}>❌</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
