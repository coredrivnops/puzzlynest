'use client';

import { useState } from 'react';
import Link from 'next/link';

// Silly Face Maker - drag and drop facial features
const FEATURES = {
    eyes: ['👁️', '👀', '🥹', '😍', '🤪', '😎', '🥺', '😴'],
    noses: ['👃', '🔴', '🍓', '🥕', '⭐'],
    mouths: ['👄', '😊', '😮', '😬', '😛', '🤐', '😁'],
    extras: ['👓', '🎀', '👒', '🎩', '👑', '🧔', '💄', '✨']
};

interface FaceFeature {
    id: string;
    emoji: string;
    x: number;
    y: number;
    scale: number;
}

export default function FaceMakerGame() {
    const [features, setFeatures] = useState<FaceFeature[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<keyof typeof FEATURES>('eyes');
    const [dragging, setDragging] = useState<string | null>(null);
    const [faceColor, setFaceColor] = useState('#FFEAA7');

    const addFeature = (emoji: string) => {
        const newFeature: FaceFeature = {
            id: Date.now().toString(),
            emoji,
            x: 50,
            y: 50,
            scale: 1
        };
        setFeatures(prev => [...prev, newFeature]);
    };

    const updateFeaturePosition = (id: string, x: number, y: number) => {
        setFeatures(prev => prev.map(f =>
            f.id === id ? { ...f, x, y } : f
        ));
    };

    const removeFeature = (id: string) => {
        setFeatures(prev => prev.filter(f => f.id !== id));
    };

    const clearFace = () => {
        setFeatures([]);
    };

    const randomFace = () => {
        clearFace();
        const newFeatures: FaceFeature[] = [];

        // Add eyes
        newFeatures.push({
            id: '1',
            emoji: FEATURES.eyes[Math.floor(Math.random() * FEATURES.eyes.length)],
            x: 35,
            y: 35,
            scale: 1
        });
        newFeatures.push({
            id: '2',
            emoji: FEATURES.eyes[Math.floor(Math.random() * FEATURES.eyes.length)],
            x: 65,
            y: 35,
            scale: 1
        });

        // Add nose
        newFeatures.push({
            id: '3',
            emoji: FEATURES.noses[Math.floor(Math.random() * FEATURES.noses.length)],
            x: 50,
            y: 55,
            scale: 1
        });

        // Add mouth
        newFeatures.push({
            id: '4',
            emoji: FEATURES.mouths[Math.floor(Math.random() * FEATURES.mouths.length)],
            x: 50,
            y: 75,
            scale: 1
        });

        setFeatures(newFeatures);
    };

    const faceColors = ['#FFEAA7', '#FAD7A0', '#F5B7B1', '#D7BDE2', '#AED6F1', '#A9DFBF'];

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Silly Face Maker</h1>
                    <div className="flex gap-2">
                        <button onClick={randomFace} className="px-3 py-1 bg-indigo-600 rounded text-sm">🎲 Random</button>
                        <button onClick={clearFace} className="px-3 py-1 bg-rose-600 rounded text-sm">🗑️ Clear</button>
                    </div>
                </div>

                <div className="flex gap-4 justify-center flex-wrap">
                    {/* Face canvas */}
                    <div
                        className="relative w-64 h-64 rounded-full shadow-xl"
                        style={{ backgroundColor: faceColor }}
                    >
                        {features.map(feature => (
                            <div
                                key={feature.id}
                                className="absolute text-4xl cursor-move select-none hover:scale-110 transition-transform"
                                style={{
                                    left: `${feature.x}%`,
                                    top: `${feature.y}%`,
                                    transform: `translate(-50%, -50%) scale(${feature.scale})`
                                }}
                                draggable
                                onDragStart={() => setDragging(feature.id)}
                                onDragEnd={(e) => {
                                    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                                    if (rect) {
                                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                                        updateFeaturePosition(feature.id, Math.max(0, Math.min(100, x)), Math.max(0, Math.min(100, y)));
                                    }
                                    setDragging(null);
                                }}
                                onDoubleClick={() => removeFeature(feature.id)}
                            >
                                {feature.emoji}
                            </div>
                        ))}

                        {features.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                                Tap features below!
                            </div>
                        )}
                    </div>

                    {/* Controls panel */}
                    <div className="bg-slate-800 rounded-xl p-4 min-w-[200px]">
                        {/* Face color */}
                        <div className="mb-4">
                            <p className="text-sm text-slate-400 mb-2">Face Color:</p>
                            <div className="flex gap-2 flex-wrap">
                                {faceColors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setFaceColor(color)}
                                        className={`w-8 h-8 rounded-full border-2 ${faceColor === color ? 'border-white' : 'border-transparent'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Category tabs */}
                        <div className="flex gap-1 mb-3">
                            {(Object.keys(FEATURES) as (keyof typeof FEATURES)[]).map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-2 py-1 rounded text-xs capitalize ${selectedCategory === cat ? 'bg-indigo-600' : 'bg-slate-700'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Features grid */}
                        <div className="grid grid-cols-4 gap-2">
                            {FEATURES[selectedCategory].map(emoji => (
                                <button
                                    key={emoji}
                                    onClick={() => addFeature(emoji)}
                                    className="text-2xl p-2 bg-slate-700 rounded hover:bg-slate-600 transition"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="text-center text-slate-400 mt-4 text-sm">
                    Tap to add • Drag to move • Double-tap to remove
                </p>
            </div>
        </div>
    );
}
