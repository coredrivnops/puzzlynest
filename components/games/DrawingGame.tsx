'use client';

import React, { useRef, useState, useEffect } from 'react';

const COLORS = ['#000000', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#ffffff'];

export default function DrawingGame({ game }: { game: any }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Resize canvas to parent
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;

            // Fill white background
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }

        // Handle Resize? For now fixed init.
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) ctx.beginPath(); // Reset path
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let x, y;

        if ('touches' in e) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = (e as React.MouseEvent).clientX - rect.left;
            y = (e as React.MouseEvent).clientY - rect.top;
        }

        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    };

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `my-drawing-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4">
            <div className="flex justify-between w-full mb-4 items-center">
                <h1 className="text-2xl font-bold text-white shadow-sm">{game?.name || 'Drawing Pad'}</h1>
                <div className="flex gap-2">
                    <button onClick={clearCanvas} className="px-4 py-2 bg-rose-600 text-white rounded shadow hover:bg-rose-500">Clear</button>
                    <button onClick={downloadImage} className="px-4 py-2 bg-emerald-600 text-white rounded shadow hover:bg-emerald-500">Save</button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full h-[600px] bg-slate-800 p-4 rounded-xl shadow-2xl border border-slate-700">
                {/* Visual Toolbar on Left/Top */}
                <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible p-2 bg-slate-900/50 rounded-lg">
                    {COLORS.map(c => (
                        <button
                            key={c}
                            onClick={() => setColor(c)}
                            style={{ backgroundColor: c }}
                            className={`
                                w-8 h-8 md:w-10 md:h-10 rounded-full border-2 shadow-sm
                                ${color === c ? 'border-white scale-110 ring-2 ring-indigo-500' : 'border-transparent'}
                            `}
                        />
                    ))}
                    <div className="w-px h-8 md:w-8 md:h-px bg-slate-600 my-2"></div>
                    {/* Size Selector */}
                    {[2, 5, 10, 20].map(size => (
                        <button
                            key={size}
                            onClick={() => { setBrushSize(size); setColor(color === '#ffffff' ? '#000000' : color); }} // If using eraser, switch back to black? No.
                            className={`
                                w-8 h-8 md:w-10 md:h-10 rounded bg-slate-700 flex items-center justify-center
                                ${brushSize === size && color !== '#ffffff' ? 'ring-2 ring-indigo-400' : ''}
                            `}
                        >
                            <div style={{ width: size, height: size, backgroundColor: 'white', borderRadius: '50%' }}></div>
                        </button>
                    ))}
                    {/* Eraser */}
                    <button
                        onClick={() => { setColor('#ffffff'); setBrushSize(20); }}
                        className={`
                            px-2 py-1 bg-slate-700 text-white text-xs rounded mt-2
                            ${color === '#ffffff' ? 'bg-indigo-600' : ''}
                        `}
                    >
                        Eraser
                    </button>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 bg-white rounded-lg overflow-hidden relative cursor-crosshair touch-none">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseUp={stopDrawing}
                        onMouseOut={stopDrawing}
                        onMouseMove={draw}
                        onTouchStart={startDrawing}
                        onTouchEnd={stopDrawing}
                        onTouchMove={draw}
                        className="w-full h-full"
                    />
                </div>
            </div>

            <div className="mt-4 text-slate-400 text-sm">
                Draw, paint, and create! Use the save button to keep your masterpiece.
            </div>
        </div>
    );
}
