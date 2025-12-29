'use client';

import { useState } from 'react';
import Link from 'next/link';

// Sticker Scene - place stickers on a background
const BACKGROUNDS = [
    { id: 'farm', name: 'Farm', emoji: '🏡', color: 'bg-emerald-200' },
    { id: 'space', name: 'Space', emoji: '🚀', color: 'bg-indigo-900' },
    { id: 'ocean', name: 'Ocean', emoji: '🌊', color: 'bg-blue-400' },
    { id: 'forest', name: 'Forest', emoji: '🌲', color: 'bg-green-700' },
];

const STICKER_PACKS = {
    farm: ['🐄', '🐷', '🐔', '🐴', '🐑', '🌻', '🌾', '🚜', '🏠', '☀️'],
    space: ['🚀', '🛸', '⭐', '🌟', '🌙', '🪐', '👽', '🛰️', '☄️', '🌌'],
    ocean: ['🐠', '🐙', '🦀', '🐬', '🐳', '🦈', '🐚', '🦐', '🌊', '⚓'],
    forest: ['🌲', '🦌', '🐻', '🦊', '🐿️', '🦉', '🍄', '🌸', '🦋', '🐦'],
};

interface PlacedSticker {
    id: string;
    emoji: string;
    x: number;
    y: number;
    scale: number;
    rotation: number;
}

export default function StickerSceneGame() {
    const [background, setBackground] = useState(BACKGROUNDS[0]);
    const [stickers, setStickers] = useState<PlacedSticker[]>([]);
    const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
    const [stickerSize, setStickerSize] = useState(1);

    const addSticker = (x: number, y: number) => {
        if (!selectedSticker) return;

        setStickers(prev => [...prev, {
            id: Date.now().toString(),
            emoji: selectedSticker,
            x,
            y,
            scale: stickerSize,
            rotation: Math.random() * 30 - 15 // Slight random rotation
        }]);
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        addSticker(x, y);
    };

    const removeSticker = (id: string) => {
        setStickers(prev => prev.filter(s => s.id !== id));
    };

    const clearScene = () => {
        setStickers([]);
    };

    const currentPack = STICKER_PACKS[background.id as keyof typeof STICKER_PACKS];

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Sticker Scenes</h1>
                    <button
                        onClick={clearScene}
                        className="px-3 py-1 bg-rose-600 rounded text-sm"
                    >
                        🗑️ Clear
                    </button>
                </div>

                {/* Background selector */}
                <div className="flex justify-center gap-2 mb-4">
                    {BACKGROUNDS.map(bg => (
                        <button
                            key={bg.id}
                            onClick={() => { setBackground(bg); setStickers([]); }}
                            className={`
                                px-4 py-2 rounded-lg flex items-center gap-2
                                ${background.id === bg.id ? 'ring-2 ring-white bg-slate-600' : 'bg-slate-700'}
                            `}
                        >
                            {bg.emoji} {bg.name}
                        </button>
                    ))}
                </div>

                {/* Sticker palette */}
                <div className="flex justify-center gap-1 mb-4 flex-wrap">
                    {currentPack.map(sticker => (
                        <button
                            key={sticker}
                            onClick={() => setSelectedSticker(sticker)}
                            className={`
                                text-3xl p-2 rounded-lg transition-all
                                ${selectedSticker === sticker
                                    ? 'bg-indigo-600 scale-110 ring-2 ring-white'
                                    : 'bg-slate-700 hover:bg-slate-600'}
                            `}
                        >
                            {sticker}
                        </button>
                    ))}
                </div>

                {/* Size control */}
                <div className="flex justify-center items-center gap-4 mb-4">
                    <span className="text-sm text-slate-400">Size:</span>
                    <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={stickerSize}
                        onChange={(e) => setStickerSize(parseFloat(e.target.value))}
                        className="w-32"
                    />
                    <span className="text-2xl" style={{ transform: `scale(${stickerSize})` }}>
                        {selectedSticker || '🎯'}
                    </span>
                </div>

                {/* Canvas/Scene */}
                <div
                    className={`
                        relative w-full h-[400px] rounded-xl overflow-hidden cursor-crosshair
                        ${background.color}
                    `}
                    onClick={handleCanvasClick}
                >
                    {/* Placed stickers */}
                    {stickers.map(sticker => (
                        <div
                            key={sticker.id}
                            className="absolute cursor-pointer hover:scale-110 transition-transform"
                            style={{
                                left: `${sticker.x}%`,
                                top: `${sticker.y}%`,
                                fontSize: `${sticker.scale * 3}rem`,
                                transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`
                            }}
                            onDoubleClick={(e) => {
                                e.stopPropagation();
                                removeSticker(sticker.id);
                            }}
                        >
                            {sticker.emoji}
                        </div>
                    ))}

                    {/* Hint text */}
                    {stickers.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-white/50 text-xl">
                                Select a sticker and tap to place!
                            </p>
                        </div>
                    )}
                </div>

                <p className="text-center text-slate-400 mt-4 text-sm">
                    Click to place • Double-click to remove • {stickers.length} stickers placed
                </p>
            </div>
        </div>
    );
}
