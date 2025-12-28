'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { soundManager } from '@/lib/soundManager';
import { achievementManager } from '@/lib/achievements';
import AchievementPopup from '@/components/AchievementPopup';
import type { Achievement } from '@/lib/achievements';

// Word categories for variety
const WORD_CATEGORIES = {
    animals: ['ELEPHANT', 'GIRAFFE', 'PENGUIN', 'DOLPHIN', 'BUTTERFLY', 'KANGAROO', 'OCTOPUS', 'CROCODILE'],
    foods: ['PIZZA', 'HAMBURGER', 'SPAGHETTI', 'CHOCOLATE', 'SANDWICH', 'PANCAKES', 'STRAWBERRY'],
    places: ['MOUNTAIN', 'BEACH', 'FOREST', 'CASTLE', 'ISLAND', 'DESERT', 'VOLCANO'],
    objects: ['UMBRELLA', 'TELESCOPE', 'KEYBOARD', 'BICYCLE', 'RAINBOW', 'TREASURE'],
};

const HANGMAN_STAGES = [
    '', // 0 wrong - empty
    '😐', // 1 wrong - head
    '😐\n |', // 2 wrong - body
    '😐\n/|', // 3 wrong - left arm
    '😐\n/|\\', // 4 wrong - right arm
    '😐\n/|\\\n/', // 5 wrong - left leg
    '😰\n/|\\\n/ \\', // 6 wrong - right leg (game over)
];

export default function HangmanGame() {
    const [word, setWord] = useState('');
    const [category, setCategory] = useState('');
    const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);

    const maxWrongGuesses = 6;

    const startNewGame = () => {
        const categories = Object.keys(WORD_CATEGORIES) as (keyof typeof WORD_CATEGORIES)[];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const words = WORD_CATEGORIES[randomCategory];
        const randomWord = words[Math.floor(Math.random() * words.length)];

        setWord(randomWord);
        setCategory(randomCategory);
        setGuessedLetters(new Set());
        setWrongGuesses(0);
        setGameState('playing');
        setStartTime(new Date());
        soundManager.play('click');
    };

    useEffect(() => {
        startNewGame();
    }, []);

    const handleGuess = (letter: string) => {
        if (gameState !== 'playing' || guessedLetters.has(letter)) return;

        soundManager.play('click');
        const newGuessed = new Set(guessedLetters);
        newGuessed.add(letter);
        setGuessedLetters(newGuessed);

        if (word.includes(letter)) {
            soundManager.play('success');
            // Check for win
            const allLettersGuessed = word.split('').every(l => newGuessed.has(l));
            if (allLettersGuessed) {
                setGameState('won');
                soundManager.play('win');
                recordGameEnd(true);
            }
        } else {
            soundManager.play('error');
            const newWrongGuesses = wrongGuesses + 1;
            setWrongGuesses(newWrongGuesses);

            if (newWrongGuesses >= maxWrongGuesses) {
                setGameState('lost');
                soundManager.play('lose');
                recordGameEnd(false);
            }
        }
    };

    const recordGameEnd = (won: boolean) => {
        if (startTime) {
            const playTime = Math.floor((new Date().getTime() - startTime.getTime()) / 60000);
            const perfect = won && wrongGuesses === 0;
            const achievements = achievementManager.recordGamePlayed(won, playTime, perfect);
            if (achievements.length > 0) {
                const ach = achievementManager.getAchievement(achievements[0]);
                if (ach) setCurrentAchievement(ach);
            }
        }
    };

    const displayWord = word.split('').map(letter =>
        guessedLetters.has(letter) ? letter : '_'
    ).join(' ');

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

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
                    <h1 className="game-title">Hangman</h1>
                    <div className="game-score">Lives: {'❤️'.repeat(maxWrongGuesses - wrongGuesses)}</div>
                </div>

                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    {/* Category hint */}
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem', textTransform: 'capitalize' }}>
                        Category: {category}
                    </p>

                    {/* Hangman figure */}
                    <div style={{
                        fontSize: '3rem',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-line',
                        marginBottom: '2rem',
                        minHeight: '120px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {HANGMAN_STAGES[wrongGuesses]}
                    </div>

                    {/* Word display */}
                    <div style={{
                        fontSize: '2.5rem',
                        letterSpacing: '0.5rem',
                        fontWeight: 'bold',
                        marginBottom: '2rem',
                        fontFamily: 'monospace',
                    }}>
                        {displayWord}
                    </div>

                    {/* Game state messages */}
                    {gameState === 'won' && (
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
                            <h2 style={{ color: 'var(--success)' }}>You Won!</h2>
                            <p>The word was: <strong>{word}</strong></p>
                        </div>
                    )}

                    {gameState === 'lost' && (
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>😢</div>
                            <h2 style={{ color: 'var(--error)' }}>Game Over</h2>
                            <p>The word was: <strong>{word}</strong></p>
                        </div>
                    )}

                    {/* Keyboard */}
                    {gameState === 'playing' ? (
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            maxWidth: '500px',
                            margin: '0 auto',
                        }}>
                            {alphabet.map(letter => {
                                const isGuessed = guessedLetters.has(letter);
                                const isCorrect = isGuessed && word.includes(letter);
                                const isWrong = isGuessed && !word.includes(letter);

                                return (
                                    <button
                                        key={letter}
                                        onClick={() => handleGuess(letter)}
                                        disabled={isGuessed}
                                        style={{
                                            width: '45px',
                                            height: '45px',
                                            fontSize: '1.25rem',
                                            fontWeight: 'bold',
                                            border: '2px solid',
                                            borderColor: isCorrect ? '#10b981' : isWrong ? '#ef4444' : 'rgba(255,255,255,0.3)',
                                            borderRadius: '8px',
                                            background: isCorrect ? 'rgba(16, 185, 129, 0.3)'
                                                : isWrong ? 'rgba(239, 68, 68, 0.3)'
                                                    : 'rgba(255,255,255,0.1)',
                                            color: isGuessed ? 'rgba(255,255,255,0.5)' : 'white',
                                            cursor: isGuessed ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        {letter}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <button className="btn btn-primary" onClick={startNewGame}>
                            Play Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
