'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { soundManager } from '@/lib/soundManager';
import { achievementManager } from '@/lib/achievements';
import AchievementPopup from '@/components/AchievementPopup';
import type { Achievement } from '@/lib/achievements';

// Tangram shape definitions (simplified polygons)
interface TangramPiece {
    id: string;
    name: string;
    color: string;
    shape: string; // CSS clip-path
    width: number;
    height: number;
    rotation: number;
    x: number;
    y: number;
}

const INITIAL_PIECES: TangramPiece[] = [
    { id: 'large-tri-1', name: 'Large Triangle', color: '#ef4444', shape: 'polygon(0 0, 100% 100%, 0 100%)', width: 100, height: 100, rotation: 0, x: 50, y: 350 },
    { id: 'large-tri-2', name: 'Large Triangle', color: '#f97316', shape: 'polygon(0 0, 100% 100%, 0 100%)', width: 100, height: 100, rotation: 0, x: 160, y: 350 },
    { id: 'medium-tri', name: 'Medium Triangle', color: '#eab308', shape: 'polygon(0 0, 100% 100%, 0 100%)', width: 70, height: 70, rotation: 0, x: 270, y: 350 },
    { id: 'small-tri-1', name: 'Small Triangle', color: '#22c55e', shape: 'polygon(0 0, 100% 100%, 0 100%)', width: 50, height: 50, rotation: 0, x: 350, y: 350 },
    { id: 'small-tri-2', name: 'Small Triangle', color: '#14b8a6', shape: 'polygon(0 0, 100% 100%, 0 100%)', width: 50, height: 50, rotation: 0, x: 410, y: 350 },
    { id: 'square', name: 'Square', color: '#3b82f6', shape: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', width: 50, height: 50, rotation: 0, x: 470, y: 350 },
    { id: 'parallelogram', name: 'Parallelogram', color: '#8b5cf6', shape: 'polygon(25% 0, 100% 0, 75% 100%, 0 100%)', width: 80, height: 40, rotation: 0, x: 530, y: 350 },
];

// Target silhouettes (simplified)
const PUZZLES = [
    { name: 'Square', hint: 'Arrange all pieces into a perfect square' },
    { name: 'Cat', hint: 'Create a sitting cat shape' },
    { name: 'House', hint: 'Build a simple house with roof' },
    { name: 'Boat', hint: 'Make a sailboat' },
    { name: 'Arrow', hint: 'Form an arrow pointing right' },
];

export default function TangramGame() {
    const [pieces, setPieces] = useState<TangramPiece[]>([]);
    const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
    const [currentPuzzle, setCurrentPuzzle] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        resetPuzzle();
    }, []);

    const resetPuzzle = () => {
        setPieces(INITIAL_PIECES.map(p => ({ ...p })));
        setSelectedPiece(null);
        setCompleted(false);
        soundManager.play('click');
    };

    const handleMouseDown = (e: React.MouseEvent, pieceId: string) => {
        const piece = pieces.find(p => p.id === pieceId);
        if (!piece) return;

        setSelectedPiece(pieceId);
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - piece.x,
            y: e.clientY - piece.y,
        });
        soundManager.play('click');
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !selectedPiece) return;

        setPieces(prev => prev.map(p => {
            if (p.id === selectedPiece) {
                return {
                    ...p,
                    x: e.clientX - dragOffset.x,
                    y: e.clientY - dragOffset.y,
                };
            }
            return p;
        }));
    }, [isDragging, selectedPiece, dragOffset]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    const rotatePiece = (pieceId: string) => {
        setPieces(prev => prev.map(p => {
            if (p.id === pieceId) {
                return { ...p, rotation: (p.rotation + 45) % 360 };
            }
            return p;
        }));
        soundManager.play('click');
    };

    const markComplete = () => {
        setCompleted(true);
        soundManager.play('win');
        const achievements = achievementManager.recordGamePlayed(true, 5, false);
        if (achievements.length > 0) {
            const ach = achievementManager.getAchievement(achievements[0]);
            if (ach) setCurrentAchievement(ach);
        }
    };

    const nextPuzzle = () => {
        setCurrentPuzzle((currentPuzzle + 1) % PUZZLES.length);
        resetPuzzle();
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
                    <h1 className="game-title">Tangram</h1>
                    <button className="btn btn-ghost" onClick={resetPuzzle}>Reset</button>
                </div>

                <div style={{ padding: '1rem' }}>
                    {/* Puzzle info */}
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '1rem',
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                    }}>
                        <h3 style={{ marginBottom: '0.5rem' }}>
                            Puzzle: {PUZZLES[currentPuzzle].name}
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                            {PUZZLES[currentPuzzle].hint}
                        </p>
                    </div>

                    {/* Workspace */}
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '400px',
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8))',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '2px dashed rgba(255,255,255,0.2)',
                    }}>
                        {/* Target area */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '200px',
                            height: '200px',
                            border: '2px dashed rgba(99, 102, 241, 0.5)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'rgba(99, 102, 241, 0.5)',
                            fontSize: '0.875rem',
                        }}>
                            Target Area
                        </div>

                        {/* Tangram pieces */}
                        {pieces.map(piece => (
                            <div
                                key={piece.id}
                                onMouseDown={(e) => handleMouseDown(e, piece.id)}
                                onDoubleClick={() => rotatePiece(piece.id)}
                                style={{
                                    position: 'absolute',
                                    left: piece.x,
                                    top: piece.y,
                                    width: piece.width,
                                    height: piece.height,
                                    background: piece.color,
                                    clipPath: piece.shape,
                                    transform: `rotate(${piece.rotation}deg)`,
                                    cursor: 'grab',
                                    opacity: selectedPiece === piece.id ? 0.8 : 1,
                                    boxShadow: selectedPiece === piece.id ? '0 8px 20px rgba(0,0,0,0.4)' : '0 4px 10px rgba(0,0,0,0.3)',
                                    transition: 'box-shadow 0.2s ease',
                                    zIndex: selectedPiece === piece.id ? 100 : 1,
                                }}
                            />
                        ))}
                    </div>

                    {/* Instructions */}
                    <p style={{
                        textAlign: 'center',
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '0.875rem',
                        marginTop: '1rem',
                    }}>
                        Drag pieces to move • Double-click to rotate
                    </p>

                    {/* Complete button */}
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        {!completed ? (
                            <button className="btn btn-primary" onClick={markComplete}>
                                I'm Done! ✓
                            </button>
                        ) : (
                            <div>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉 Great job!</div>
                                <button className="btn btn-accent" onClick={nextPuzzle}>
                                    Next Puzzle →
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
