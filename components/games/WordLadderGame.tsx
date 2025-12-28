'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { soundManager } from '@/lib/soundManager';
import { achievementManager } from '@/lib/achievements';
import AchievementPopup from '@/components/AchievementPopup';
import type { Achievement } from '@/lib/achievements';

// Word pairs for ladder
const WORD_LADDERS = [
    { start: 'CAT', end: 'DOG', steps: ['CAT', 'COT', 'COG', 'DOG'] },
    { start: 'HEAD', end: 'TAIL', steps: ['HEAD', 'HEAL', 'TEAL', 'TELL', 'TALL', 'TAIL'] },
    { start: 'COLD', end: 'WARM', steps: ['COLD', 'CORD', 'CARD', 'WARD', 'WARM'] },
    { start: 'LOVE', end: 'HATE', steps: ['LOVE', 'LAVE', 'HAVE', 'HATE'] },
    { start: 'SLOW', end: 'FAST', steps: ['SLOW', 'SLOT', 'SOOT', 'FOOT', 'FORT', 'FART', 'FAST'] },
];

export default function WordLadderGame() {
    const [currentPuzzle, setCurrentPuzzle] = useState(0);
    const [userSteps, setUserSteps] = useState<string[]>([]);
    const [currentWord, setCurrentWord] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [completed, setCompleted] = useState(false);
    const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

    const puzzle = WORD_LADDERS[currentPuzzle];

    useEffect(() => {
        setUserSteps([puzzle.start]);
        setCurrentWord('');
        setCompleted(false);
        setMessage('');
    }, [puzzle]);

    const isValidNextWord = (word: string): boolean => {
        if (word.length !== puzzle.start.length) return false;

        const lastWord = userSteps[userSteps.length - 1];
        let differences = 0;
        for (let i = 0; i < word.length; i++) {
            if (word[i] !== lastWord[i]) differences++;
        }
        return differences === 1;
    };

    const submitWord = () => {
        const word = currentWord.toUpperCase().trim();

        if (word.length !== puzzle.start.length) {
            setMessage(`Word must be ${puzzle.start.length} letters`);
            setMessageType('error');
            soundManager.play('error');
            return;
        }

        if (!isValidNextWord(word)) {
            setMessage('Change only one letter at a time!');
            setMessageType('error');
            soundManager.play('error');
            return;
        }

        if (userSteps.includes(word)) {
            setMessage('Word already used!');
            setMessageType('error');
            soundManager.play('error');
            return;
        }

        // Valid move
        setUserSteps([...userSteps, word]);
        setCurrentWord('');
        soundManager.play('success');

        if (word === puzzle.end) {
            setCompleted(true);
            soundManager.play('win');
            const isOptimal = userSteps.length + 1 <= puzzle.steps.length;
            const achievements = achievementManager.recordGamePlayed(true, 3, isOptimal);
            if (achievements.length > 0) {
                const ach = achievementManager.getAchievement(achievements[0]);
                if (ach) setCurrentAchievement(ach);
            }
            setMessage(`Solved in ${userSteps.length} steps! ${isOptimal ? '(Optimal!)' : ''}`);
            setMessageType('success');
        } else {
            setMessage('Good move!');
            setMessageType('success');
        }
    };

    const resetPuzzle = () => {
        setUserSteps([puzzle.start]);
        setCurrentWord('');
        setCompleted(false);
        setMessage('');
        soundManager.play('click');
    };

    const nextPuzzle = () => {
        setCurrentPuzzle((currentPuzzle + 1) % WORD_LADDERS.length);
        soundManager.play('click');
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(''), 2000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !completed) {
                submitWord();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentWord, completed]);

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
                    <h1 className="game-title">Word Ladder</h1>
                    <span className="game-score">Steps: {userSteps.length - 1}</span>
                </div>

                <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                    {/* Goal display */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '2rem',
                        marginBottom: '1.5rem',
                    }}>
                        <div style={{
                            padding: '1rem 2rem',
                            background: 'rgba(34, 197, 94, 0.2)',
                            borderRadius: '12px',
                            border: '2px solid rgba(34, 197, 94, 0.5)',
                        }}>
                            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>START</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '0.2em' }}>
                                {puzzle.start}
                            </div>
                        </div>
                        <div style={{ fontSize: '2rem' }}>→</div>
                        <div style={{
                            padding: '1rem 2rem',
                            background: 'rgba(239, 68, 68, 0.2)',
                            borderRadius: '12px',
                            border: '2px solid rgba(239, 68, 68, 0.5)',
                        }}>
                            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>GOAL</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '0.2em' }}>
                                {puzzle.end}
                            </div>
                        </div>
                    </div>

                    {/* Ladder visualization */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1.5rem',
                    }}>
                        {userSteps.map((step, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                            }}>
                                <span style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: step === puzzle.end ? '#22c55e' : 'rgba(255,255,255,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                }}>
                                    {i + 1}
                                </span>
                                <div style={{
                                    padding: '0.5rem 1.5rem',
                                    background: step === puzzle.end ? 'rgba(34, 197, 94, 0.3)' : 'rgba(99, 102, 241, 0.3)',
                                    borderRadius: '8px',
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold',
                                    letterSpacing: '0.3em',
                                    fontFamily: 'monospace',
                                }}>
                                    {step}
                                </div>
                            </div>
                        ))}

                        {!completed && (
                            <div style={{ marginTop: '0.5rem' }}>↓</div>
                        )}
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

                    {/* Input */}
                    {!completed ? (
                        <div style={{ marginBottom: '1rem' }}>
                            <input
                                type="text"
                                value={currentWord}
                                onChange={(e) => setCurrentWord(e.target.value.toUpperCase())}
                                maxLength={puzzle.start.length}
                                placeholder={`Enter ${puzzle.start.length}-letter word`}
                                style={{
                                    padding: '0.75rem 1rem',
                                    fontSize: '1.25rem',
                                    fontFamily: 'monospace',
                                    letterSpacing: '0.3em',
                                    textAlign: 'center',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    width: '200px',
                                    textTransform: 'uppercase',
                                }}
                            />
                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                <button className="btn btn-ghost" onClick={resetPuzzle}>Reset</button>
                                <button className="btn btn-primary" onClick={submitWord}>Submit</button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ marginTop: '1rem' }}>
                            <button className="btn btn-primary" onClick={nextPuzzle}>
                                Next Puzzle →
                            </button>
                        </div>
                    )}

                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginTop: '1rem' }}>
                        Change one letter at a time to get from {puzzle.start} to {puzzle.end}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                        Optimal solution: {puzzle.steps.length - 1} steps
                    </p>
                </div>
            </div>
        </div>
    );
}
