'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Stack blocks as high as possible - timing game
export default function StackBlocksGame() {
    const [blocks, setBlocks] = useState<{ x: number, width: number }[]>([]);
    const [currentBlock, setCurrentBlock] = useState({ x: 0, width: 80, direction: 1 });
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    const dropBlock = useCallback(() => {
        if (gameOver) return;

        const lastBlock = blocks[blocks.length - 1];

        if (!lastBlock) {
            // First block - always succeeds
            setBlocks([{ x: currentBlock.x, width: currentBlock.width }]);
            setScore(1);
            setCurrentBlock({ x: 0, width: 80, direction: 1 });
            return;
        }

        // Calculate overlap
        const leftEdge = Math.max(currentBlock.x, lastBlock.x);
        const rightEdgeCurrent = currentBlock.x + currentBlock.width;
        const rightEdgeLast = lastBlock.x + lastBlock.width;
        const rightEdge = Math.min(rightEdgeCurrent, rightEdgeLast);
        const overlap = rightEdge - leftEdge;

        if (overlap <= 0) {
            // Missed completely
            setGameOver(true);
            if (score > highScore) setHighScore(score);
        } else {
            // Partial or full overlap
            const newBlock = { x: leftEdge, width: overlap };
            setBlocks(prev => [...prev, newBlock]);
            setScore(s => s + 1);
            setCurrentBlock({ x: 0, width: overlap, direction: 1 });
        }
    }, [currentBlock, blocks, gameOver, score, highScore]);

    // Move current block
    useEffect(() => {
        if (gameOver) return;

        const interval = setInterval(() => {
            setCurrentBlock(prev => {
                let newX = prev.x + prev.direction * 3;
                let newDir = prev.direction;

                if (newX + prev.width > 100) {
                    newX = 100 - prev.width;
                    newDir = -1;
                } else if (newX < 0) {
                    newX = 0;
                    newDir = 1;
                }

                return { ...prev, x: newX, direction: newDir };
            });
        }, 30);

        return () => clearInterval(interval);
    }, [gameOver]);

    // Keyboard
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === ' ') {
                e.preventDefault();
                dropBlock();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [dropBlock]);

    const startGame = () => {
        setBlocks([]);
        setCurrentBlock({ x: 0, width: 80, direction: 1 });
        setGameOver(false);
        setScore(0);
    };

    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500'];

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Stack Master</h1>
                    <div className="text-yellow-400 font-bold">Height: {score} | Best: {highScore}</div>
                </div>

                <div
                    className="relative w-full h-[500px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl overflow-hidden cursor-pointer"
                    onClick={dropBlock}
                >
                    {/* Stacked blocks */}
                    {blocks.map((block, i) => (
                        <div
                            key={i}
                            className={`absolute h-8 ${colors[i % colors.length]} rounded shadow-lg`}
                            style={{
                                left: `${block.x}%`,
                                width: `${block.width}%`,
                                bottom: `${i * 32}px`,
                            }}
                        />
                    ))}

                    {/* Current moving block */}
                    {!gameOver && (
                        <div
                            className={`absolute h-8 ${colors[blocks.length % colors.length]} rounded shadow-lg animate-pulse`}
                            style={{
                                left: `${currentBlock.x}%`,
                                width: `${currentBlock.width}%`,
                                bottom: `${blocks.length * 32}px`,
                            }}
                        />
                    )}

                    {/* Game over overlay */}
                    {gameOver && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                            <div className="text-4xl mb-4">🏗️ Tower Complete!</div>
                            <div className="text-2xl mb-4">Height: {score} blocks</div>
                            <button
                                onClick={startGame}
                                className="px-6 py-3 bg-emerald-600 rounded-lg text-white font-bold"
                            >
                                Build Again
                            </button>
                        </div>
                    )}

                    {/* Start prompt */}
                    {blocks.length === 0 && !gameOver && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-6xl mb-4">🧱</div>
                                <div className="text-xl text-white">Tap to drop blocks!</div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-center mt-4 text-slate-400">
                    Tap or press SPACE to drop the block. Align perfectly for maximum points!
                </div>
            </div>
        </div>
    );
}
