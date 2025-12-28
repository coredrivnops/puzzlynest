'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { soundManager } from '@/lib/soundManager';
import { achievementManager } from '@/lib/achievements';
import AchievementPopup from '@/components/AchievementPopup';
import type { Achievement } from '@/lib/achievements';

// Spelling Bee: Make words from 7 letters, one must be in every word (center letter)
const PUZZLES = [
    { letters: ['A', 'C', 'E', 'L', 'N', 'R', 'T'], center: 'A', words: ['CARE', 'RACE', 'TRACE', 'TEAR', 'LATE', 'RATE', 'CLEAR', 'ALERT', 'ALTER', 'LEARN', 'CENTRAL'] },
    { letters: ['G', 'H', 'I', 'L', 'N', 'T', 'S'], center: 'I', width: 1, words: ['LIGHT', 'SIGHT', 'NIGHT', 'THIN', 'THIS', 'THING', 'SLING', 'STING', 'SITTING', 'LISTING'] },
    { letters: ['A', 'B', 'E', 'K', 'M', 'R', 'T'], center: 'E', words: ['MAKE', 'TAKE', 'BREAK', 'BAKE', 'BEAM', 'TEAM', 'MATER', 'TAKER', 'MAKER', 'MARKET'] },
];

export default function SpellingBeeGame() {
    const [puzzleIndex, setPuzzleIndex] = useState(0);
    const [currentWord, setCurrentWord] = useState('');
    const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

    const puzzle = PUZZLES[puzzleIndex];

    const addLetter = (letter: string) => {
        if (currentWord.length < 15) {
            setCurrentWord(prev => prev + letter);
            soundManager.play('click');
        }
    };

    const deleteLetter = () => {
        setCurrentWord(prev => prev.slice(0, -1));
        soundManager.play('click');
    };

    const shuffleLetters = () => {
        // Visual shuffle (puzzle letters stay same but order changes)
        soundManager.play('whoosh');
    };

    const submitWord = useCallback(() => {
        if (currentWord.length < 4) {
            setMessage('Too short! (4+ letters)');
            setMessageType('error');
            soundManager.play('error');
            setCurrentWord('');
            return;
        }

        if (!currentWord.includes(puzzle.center)) {
            setMessage(`Must include center letter (${puzzle.center})`);
            setMessageType('error');
            soundManager.play('error');
            setCurrentWord('');
            return;
        }

        // Check if all letters are valid
        const validLetters = new Set(puzzle.letters);
        for (const letter of currentWord) {
            if (!validLetters.has(letter)) {
                setMessage('Invalid letters used');
                setMessageType('error');
                soundManager.play('error');
                setCurrentWord('');
                return;
            }
        }

        if (foundWords.has(currentWord)) {
            setMessage('Already found!');
            setMessageType('error');
            soundManager.play('error');
            setCurrentWord('');
            return;
        }

        // Check if it's a valid word
        if (puzzle.words.includes(currentWord)) {
            const wordScore = currentWord.length === 4 ? 1 : currentWord.length;
            const isPangram = puzzle.letters.every(l => currentWord.includes(l));
            const bonus = isPangram ? 7 : 0;

            setScore(prev => prev + wordScore + bonus);
            setFoundWords(prev => new Set([...prev, currentWord]));
            setMessage(isPangram ? '🎉 PANGRAM! +' + (wordScore + bonus) : 'Nice! +' + wordScore);
            setMessageType('success');
            soundManager.play('success');

            // Check achievements
            if (foundWords.size + 1 >= puzzle.words.length * 0.5) {
                const achievements = achievementManager.recordGamePlayed(true, 5, foundWords.size + 1 >= puzzle.words.length);
                if (achievements.length > 0) {
                    const ach = achievementManager.getAchievement(achievements[0]);
                    if (ach) setCurrentAchievement(ach);
                }
            }
        } else {
            setMessage('Not in word list');
            setMessageType('error');
            soundManager.play('error');
        }

        setCurrentWord('');
    }, [currentWord, foundWords, puzzle]);

    // Clear message after delay
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                submitWord();
            } else if (e.key === 'Backspace') {
                deleteLetter();
            } else if (/^[a-zA-Z]$/.test(e.key)) {
                const letter = e.key.toUpperCase();
                if (puzzle.letters.includes(letter)) {
                    addLetter(letter);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [puzzle.letters, submitWord]);

    const nextPuzzle = () => {
        setPuzzleIndex((puzzleIndex + 1) % PUZZLES.length);
        setFoundWords(new Set());
        setScore(0);
        setCurrentWord('');
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
                    <h1 className="game-title">Spelling Bee</h1>
                    <span className="game-score">Score: {score}</span>
                </div>

                <div style={{ textAlign: 'center', padding: '1rem' }}>
                    {/* Current word display */}
                    <div style={{
                        minHeight: '50px',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        letterSpacing: '0.1em',
                        marginBottom: '1rem',
                    }}>
                        {currentWord || <span style={{ opacity: 0.3 }}>Type a word...</span>}
                    </div>

                    {/* Message */}
                    {message && (
                        <div style={{
                            padding: '0.5rem 1rem',
                            marginBottom: '1rem',
                            borderRadius: '8px',
                            background: messageType === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: messageType === 'success' ? '#10b981' : '#ef4444',
                            display: 'inline-block',
                        }}>
                            {message}
                        </div>
                    )}

                    {/* Honeycomb letters */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '2rem',
                    }}>
                        {/* Top row (3 letters) */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {puzzle.letters.slice(0, 3).map((letter, i) => (
                                <button
                                    key={i}
                                    onClick={() => addLetter(letter)}
                                    style={{
                                        width: '55px',
                                        height: '55px',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.1s ease',
                                    }}
                                >
                                    {letter}
                                </button>
                            ))}
                        </div>

                        {/* Middle row with center (1 center + 1 side) */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => addLetter(puzzle.letters[3])}
                                style={{
                                    width: '55px',
                                    height: '55px',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    cursor: 'pointer',
                                }}
                            >
                                {puzzle.letters[3]}
                            </button>
                            <button
                                onClick={() => addLetter(puzzle.center)}
                                style={{
                                    width: '55px',
                                    height: '55px',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(135deg, #eab308, #f59e0b)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'black',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(234, 179, 8, 0.4)',
                                }}
                            >
                                {puzzle.center}
                            </button>
                            <button
                                onClick={() => addLetter(puzzle.letters[4])}
                                style={{
                                    width: '55px',
                                    height: '55px',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    cursor: 'pointer',
                                }}
                            >
                                {puzzle.letters[4]}
                            </button>
                        </div>

                        {/* Bottom row */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {puzzle.letters.slice(5, 7).map((letter, i) => (
                                <button
                                    key={i}
                                    onClick={() => addLetter(letter)}
                                    style={{
                                        width: '55px',
                                        height: '55px',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {letter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Control buttons */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <button className="btn btn-ghost" onClick={deleteLetter}>
                            Delete
                        </button>
                        <button className="btn btn-ghost" onClick={shuffleLetters}>
                            🔀 Shuffle
                        </button>
                        <button className="btn btn-primary" onClick={submitWord}>
                            Enter
                        </button>
                    </div>

                    {/* Found words */}
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        padding: '1rem',
                        maxHeight: '150px',
                        overflow: 'auto',
                    }}>
                        <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', opacity: 0.7 }}>
                            Found Words ({foundWords.size}/{puzzle.words.length})
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                            {Array.from(foundWords).sort().map(word => (
                                <span key={word} style={{
                                    padding: '0.25rem 0.75rem',
                                    background: 'rgba(16, 185, 129, 0.2)',
                                    borderRadius: '100px',
                                    fontSize: '0.875rem',
                                }}>
                                    {word}
                                </span>
                            ))}
                        </div>
                    </div>

                    <button className="btn btn-ghost" onClick={nextPuzzle} style={{ marginTop: '1rem' }}>
                        New Puzzle →
                    </button>
                </div>
            </div>
        </div>
    );
}
