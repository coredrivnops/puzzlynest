'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// ABC Letter Tracing Game - trace letters with finger/mouse
export default function ABCTracingGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentLetter, setCurrentLetter] = useState('A');
    const [isDrawing, setIsDrawing] = useState(false);
    const [completed, setCompleted] = useState<string[]>([]);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;
        setCtx(context);

        drawTemplate(context, currentLetter);
    }, [currentLetter]);

    const drawTemplate = (context: CanvasRenderingContext2D, letter: string) => {
        const canvas = context.canvas;
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw dotted letter template
        context.font = 'bold 300px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.strokeStyle = '#94a3b8';
        context.lineWidth = 2;
        context.setLineDash([10, 10]);
        context.strokeText(letter, canvas.width / 2, canvas.height / 2);
        context.setLineDash([]);
    };

    const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        if (!ctx) return;

        const { x, y } = getCoords(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.setLineDash([]);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || !ctx) return;

        const { x, y } = getCoords(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        if (ctx) ctx.closePath();
    };

    const clearCanvas = () => {
        if (!ctx) return;
        drawTemplate(ctx, currentLetter);
    };

    const nextLetter = () => {
        if (!completed.includes(currentLetter)) {
            setCompleted(prev => [...prev, currentLetter]);
        }

        const currentIndex = letters.indexOf(currentLetter);
        if (currentIndex < letters.length - 1) {
            setCurrentLetter(letters[currentIndex + 1]);
        }
    };

    const prevLetter = () => {
        const currentIndex = letters.indexOf(currentLetter);
        if (currentIndex > 0) {
            setCurrentLetter(letters[currentIndex - 1]);
        }
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">ABC Tracing</h1>
                    <div className="text-emerald-400 font-bold">{completed.length}/26 Complete</div>
                </div>

                {/* Letter display */}
                <div className="text-center mb-4">
                    <span className="text-6xl font-bold text-white">{currentLetter}</span>
                    <span className="text-2xl text-slate-400 ml-4">is for {getWordForLetter(currentLetter)}</span>
                </div>

                {/* Canvas */}
                <div className="flex justify-center">
                    <canvas
                        ref={canvasRef}
                        width={350}
                        height={400}
                        className="bg-white rounded-xl shadow-xl cursor-crosshair touch-none"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={prevLetter}
                        disabled={currentLetter === 'A'}
                        className="px-6 py-3 bg-slate-700 rounded-lg text-xl disabled:opacity-50"
                    >
                        ← Prev
                    </button>
                    <button
                        onClick={clearCanvas}
                        className="px-6 py-3 bg-rose-600 rounded-lg text-xl"
                    >
                        🗑️ Clear
                    </button>
                    <button
                        onClick={nextLetter}
                        className="px-6 py-3 bg-emerald-600 rounded-lg text-xl"
                    >
                        Next →
                    </button>
                </div>

                {/* Progress */}
                <div className="flex flex-wrap justify-center gap-1 mt-6 max-w-md mx-auto">
                    {letters.map(letter => (
                        <div
                            key={letter}
                            onClick={() => setCurrentLetter(letter)}
                            className={`
                                w-8 h-8 flex items-center justify-center rounded cursor-pointer text-sm font-bold
                                ${letter === currentLetter ? 'bg-blue-500 text-white' :
                                    completed.includes(letter) ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'}
                            `}
                        >
                            {letter}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function getWordForLetter(letter: string): string {
    const words: Record<string, string> = {
        A: 'Apple 🍎', B: 'Ball ⚽', C: 'Cat 🐱', D: 'Dog 🐕', E: 'Elephant 🐘',
        F: 'Fish 🐟', G: 'Giraffe 🦒', H: 'House 🏠', I: 'Ice Cream 🍦', J: 'Juice 🧃',
        K: 'Kite 🪁', L: 'Lion 🦁', M: 'Moon 🌙', N: 'Nest 🪺', O: 'Orange 🍊',
        P: 'Penguin 🐧', Q: 'Queen 👑', R: 'Rainbow 🌈', S: 'Sun ☀️', T: 'Tree 🌳',
        U: 'Umbrella ☂️', V: 'Violin 🎻', W: 'Whale 🐋', X: 'Xylophone 🎵', Y: 'Yacht ⛵',
        Z: 'Zebra 🦓'
    };
    return words[letter] || letter;
}
