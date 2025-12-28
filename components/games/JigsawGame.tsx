'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { soundManager } from '@/lib/soundManager';
import { achievementManager } from '@/lib/achievements';
import AchievementPopup from '@/components/AchievementPopup';
import type { Achievement } from '@/lib/achievements';

// Jigsaw piece with position
interface Piece {
    id: number;
    currentX: number;
    currentY: number;
    targetX: number;
    targetY: number;
    isPlaced: boolean;
}

// Simple 3x3 or 4x4 jigsaw
const IMAGES = [
    { src: '🏔️🌲🏠', name: 'Mountain Scene' },
    { src: '🌊🏖️🌴', name: 'Beach Paradise' },
    { src: '🌸🦋🌺', name: 'Garden' },
];

export default function JigsawGame() {
    const [pieces, setPieces] = useState<Piece[]>([]);
    const [gridSize, setGridSize] = useState(3);
    const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
    const [completed, setCompleted] = useState(false);
    const [moves, setMoves] = useState(0);
    const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

    const pieceSize = 80;
    const boardWidth = gridSize * pieceSize;

    const initPuzzle = useCallback(() => {
        const newPieces: Piece[] = [];
        for (let i = 0; i < gridSize * gridSize; i++) {
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            newPieces.push({
                id: i,
                targetX: col * pieceSize,
                targetY: row * pieceSize,
                // Scrambled positions
                currentX: (i % gridSize) * pieceSize + (Math.random() - 0.5) * 20,
                currentY: Math.floor(i / gridSize) * pieceSize + boardWidth + 50 + (Math.random() - 0.5) * 20,
                isPlaced: false,
            });
        }
        // Shuffle
        newPieces.sort(() => Math.random() - 0.5);
        // Reposition to tray area
        newPieces.forEach((p, i) => {
            p.currentX = (i % gridSize) * (pieceSize + 10) + 10;
            p.currentY = boardWidth + 80;
        });
        setPieces(newPieces);
        setCompleted(false);
        setMoves(0);
        soundManager.play('click');
    }, [gridSize, boardWidth, pieceSize]);

    useEffect(() => {
        initPuzzle();
    }, [initPuzzle]);

    const handlePieceClick = (pieceId: number) => {
        if (completed) return;

        if (selectedPiece === null) {
            setSelectedPiece(pieceId);
            soundManager.play('click');
        } else if (selectedPiece === pieceId) {
            setSelectedPiece(null);
        } else {
            // Swap pieces
            setPieces(prev => {
                const newPieces = [...prev];
                const piece1 = newPieces.find(p => p.id === selectedPiece)!;
                const piece2 = newPieces.find(p => p.id === pieceId)!;

                [piece1.currentX, piece2.currentX] = [piece2.currentX, piece1.currentX];
                [piece1.currentY, piece2.currentY] = [piece2.currentY, piece1.currentY];

                return newPieces;
            });
            setSelectedPiece(null);
            setMoves(m => m + 1);
            soundManager.play('pop');
        }
    };

    const handleTargetClick = (targetX: number, targetY: number) => {
        if (completed || selectedPiece === null) return;

        setPieces(prev => {
            const newPieces = [...prev];
            const piece = newPieces.find(p => p.id === selectedPiece);
            if (piece) {
                piece.currentX = targetX;
                piece.currentY = targetY;

                // Check if correctly placed
                if (piece.currentX === piece.targetX && piece.currentY === piece.targetY) {
                    piece.isPlaced = true;
                    soundManager.play('success');
                }

                // Check for completion
                if (newPieces.every(p => p.isPlaced)) {
                    setCompleted(true);
                    soundManager.play('win');
                    const achievements = achievementManager.recordGamePlayed(true, 5, moves < gridSize * gridSize * 2);
                    if (achievements.length > 0) {
                        const ach = achievementManager.getAchievement(achievements[0]);
                        if (ach) setCurrentAchievement(ach);
                    }
                }
            }
            return newPieces;
        });

        setSelectedPiece(null);
        setMoves(m => m + 1);
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
                    <h1 className="game-title">Jigsaw Puzzle</h1>
                    <span className="game-score">Moves: {moves}</span>
                </div>

                <div style={{ padding: '1rem' }}>
                    {/* Size selector */}
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        {[3, 4, 5].map(size => (
                            <button
                                key={size}
                                onClick={() => setGridSize(size)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    margin: '0 0.25rem',
                                    background: gridSize === size ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    cursor: 'pointer',
                                }}
                            >
                                {size}x{size}
                            </button>
                        ))}
                    </div>

                    {/* Puzzle board */}
                    <div style={{
                        position: 'relative',
                        width: `${boardWidth}px`,
                        height: `${boardWidth + 150}px`,
                        margin: '0 auto',
                    }}>
                        {/* Target grid */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: `${boardWidth}px`,
                            height: `${boardWidth}px`,
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            border: '2px dashed rgba(255,255,255,0.3)',
                            display: 'grid',
                            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                        }}>
                            {Array(gridSize * gridSize).fill(null).map((_, i) => {
                                const row = Math.floor(i / gridSize);
                                const col = i % gridSize;
                                const targetX = col * pieceSize;
                                const targetY = row * pieceSize;

                                return (
                                    <div
                                        key={i}
                                        onClick={() => handleTargetClick(targetX, targetY)}
                                        style={{
                                            width: `${pieceSize}px`,
                                            height: `${pieceSize}px`,
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: selectedPiece !== null ? 'pointer' : 'default',
                                            fontSize: '0.75rem',
                                            color: 'rgba(255,255,255,0.2)',
                                        }}
                                    >
                                        {i + 1}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Puzzle pieces */}
                        {pieces.map(piece => {
                            const row = Math.floor(piece.id / gridSize);
                            const col = piece.id % gridSize;
                            // Generate unique gradients/emojis per piece
                            const hue = (piece.id * 360 / (gridSize * gridSize)) % 360;

                            return (
                                <div
                                    key={piece.id}
                                    onClick={() => handlePieceClick(piece.id)}
                                    style={{
                                        position: 'absolute',
                                        left: piece.currentX,
                                        top: piece.currentY,
                                        width: `${pieceSize - 4}px`,
                                        height: `${pieceSize - 4}px`,
                                        background: `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${hue + 30}, 70%, 40%))`,
                                        borderRadius: '8px',
                                        border: selectedPiece === piece.id ? '3px solid #fbbf24' : '2px solid rgba(255,255,255,0.3)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        color: 'white',
                                        boxShadow: piece.isPlaced ? '0 0 10px rgba(16, 185, 129, 0.5)' : '0 4px 10px rgba(0,0,0,0.3)',
                                        transition: 'all 0.2s ease',
                                        zIndex: selectedPiece === piece.id ? 10 : 1,
                                    }}
                                >
                                    {piece.id + 1}
                                </div>
                            );
                        })}
                    </div>

                    {completed && (
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
                            <h2 style={{ marginBottom: '0.5rem' }}>Puzzle Complete!</h2>
                            <p style={{ marginBottom: '1rem' }}>Solved in {moves} moves</p>
                            <button className="btn btn-primary" onClick={initPuzzle}>
                                New Puzzle
                            </button>
                        </div>
                    )}

                    {!completed && (
                        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginTop: '1rem', fontSize: '0.875rem' }}>
                            Click a piece to select it, then click where you want to place it
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
