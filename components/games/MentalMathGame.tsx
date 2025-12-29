'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Mental Math - timed arithmetic with multiple operations
export default function MentalMathGame() {
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [question, setQuestion] = useState({ num1: 0, num2: 0, operation: '+', answer: 0 });
    const [options, setOptions] = useState<number[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

    const generateQuestion = useCallback(() => {
        let num1: number, num2: number, operation: string, answer: number;

        const maxNum = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 25 : 50;
        const ops = difficulty === 'easy' ? ['+', '-'] : ['+', '-', '×'];

        operation = ops[Math.floor(Math.random() * ops.length)];

        if (operation === '+') {
            num1 = Math.floor(Math.random() * maxNum) + 1;
            num2 = Math.floor(Math.random() * maxNum) + 1;
            answer = num1 + num2;
        } else if (operation === '-') {
            num1 = Math.floor(Math.random() * maxNum) + 10;
            num2 = Math.floor(Math.random() * Math.min(num1, maxNum)) + 1;
            answer = num1 - num2;
        } else {
            num1 = Math.floor(Math.random() * 12) + 1;
            num2 = Math.floor(Math.random() * 12) + 1;
            answer = num1 * num2;
        }

        // Generate options
        const wrongAnswers = new Set<number>();
        while (wrongAnswers.size < 3) {
            const offset = Math.floor(Math.random() * 10) - 5;
            const wrong = answer + (offset === 0 ? 1 : offset);
            if (wrong !== answer && wrong > 0) {
                wrongAnswers.add(wrong);
            }
        }

        const allOptions = [answer, ...wrongAnswers];
        // Shuffle
        for (let i = allOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
        }

        setQuestion({ num1, num2, operation, answer });
        setOptions(allOptions);
        setFeedback(null);
    }, [difficulty]);

    useEffect(() => {
        if (gameStarted) {
            generateQuestion();
        }
    }, [gameStarted, generateQuestion]);

    // Timer
    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setGameOver(true);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameStarted, gameOver]);

    const handleAnswer = (selected: number) => {
        if (feedback) return;

        if (selected === question.answer) {
            setFeedback('correct');
            const points = 10 + streak * 2;
            setScore(s => s + points);
            setStreak(st => st + 1);
            setTimeLeft(t => Math.min(60, t + 2)); // Bonus time
        } else {
            setFeedback('wrong');
            setStreak(0);
        }

        setTimeout(() => {
            generateQuestion();
        }, 800);
    };

    const startGame = (diff: 'easy' | 'medium' | 'hard') => {
        setDifficulty(diff);
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setStreak(0);
        setTimeLeft(60);
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Mental Math</h1>
                    <div className="flex gap-4">
                        <span className="text-yellow-400 font-bold">🏆 {score}</span>
                        <span className={`font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                            ⏱️ {timeLeft}s
                        </span>
                    </div>
                </div>

                {!gameStarted ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-6">🧮</div>
                        <h2 className="text-2xl font-bold mb-6">Choose Difficulty</h2>
                        <div className="flex justify-center gap-4 flex-wrap">
                            <button
                                onClick={() => startGame('easy')}
                                className="px-8 py-4 bg-emerald-600 rounded-xl text-xl font-bold hover:bg-emerald-500"
                            >
                                Easy<br /><span className="text-sm opacity-70">+/- up to 10</span>
                            </button>
                            <button
                                onClick={() => startGame('medium')}
                                className="px-8 py-4 bg-yellow-600 rounded-xl text-xl font-bold hover:bg-yellow-500"
                            >
                                Medium<br /><span className="text-sm opacity-70">+/-/× up to 25</span>
                            </button>
                            <button
                                onClick={() => startGame('hard')}
                                className="px-8 py-4 bg-red-600 rounded-xl text-xl font-bold hover:bg-red-500"
                            >
                                Hard<br /><span className="text-sm opacity-70">+/-/× up to 50</span>
                            </button>
                        </div>
                    </div>
                ) : gameOver ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🏆</div>
                        <h2 className="text-3xl font-bold mb-2">Time's Up!</h2>
                        <p className="text-2xl text-yellow-400 mb-6">Final Score: {score}</p>
                        <p className="text-slate-400 mb-6">Best Streak: {streak} in a row</p>
                        <button
                            onClick={() => setGameStarted(false)}
                            className="px-8 py-4 bg-indigo-600 rounded-xl font-bold"
                        >
                            Play Again
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        {/* Streak indicator */}
                        {streak > 0 && (
                            <div className="text-orange-400 text-lg mb-2 animate-pulse">
                                🔥 {streak} streak! (+{streak * 2} bonus)
                            </div>
                        )}

                        {/* Question */}
                        <div className={`
                            text-6xl font-bold py-8 rounded-xl mb-6
                            ${feedback === 'correct' ? 'bg-emerald-600/30' :
                                feedback === 'wrong' ? 'bg-red-600/30' : 'bg-slate-800'}
                        `}>
                            {question.num1} {question.operation} {question.num2} = ?
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                            {options.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(opt)}
                                    disabled={feedback !== null}
                                    className={`
                                        py-6 text-3xl font-bold rounded-xl transition-all
                                        ${feedback !== null && opt === question.answer
                                            ? 'bg-emerald-600 scale-105'
                                            : feedback === 'wrong' && opt !== question.answer
                                                ? 'bg-slate-700 opacity-50'
                                                : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95'}
                                    `}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
