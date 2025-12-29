'use client';

import { useState } from 'react';
import Link from 'next/link';

// Pizza Maker - customize and build pizza
const TOPPINGS = [
    { id: 'pepperoni', emoji: '🍕', name: 'Pepperoni' },
    { id: 'mushroom', emoji: '🍄', name: 'Mushrooms' },
    { id: 'olive', emoji: '🫒', name: 'Olives' },
    { id: 'pepper', emoji: '🫑', name: 'Peppers' },
    { id: 'onion', emoji: '🧅', name: 'Onions' },
    { id: 'tomato', emoji: '🍅', name: 'Tomatoes' },
    { id: 'cheese', emoji: '🧀', name: 'Extra Cheese' },
    { id: 'pineapple', emoji: '🍍', name: 'Pineapple' },
];

const SAUCES = [
    { id: 'tomato', name: 'Tomato', color: '#DC2626' },
    { id: 'bbq', name: 'BBQ', color: '#7C2D12' },
    { id: 'white', name: 'White', color: '#F5F5DC' },
    { id: 'pesto', name: 'Pesto', color: '#22C55E' },
];

interface PlacedTopping {
    id: string;
    toppingId: string;
    x: number;
    y: number;
    rotation: number;
}

export default function PizzaMakerGame() {
    const [sauce, setSauce] = useState(SAUCES[0]);
    const [toppings, setToppings] = useState<PlacedTopping[]>([]);
    const [isCooked, setIsCooked] = useState(false);
    const [cooking, setCooking] = useState(false);

    const addRandomTopping = (toppingId: string) => {
        // Add topping at random position on pizza
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 35; // Keep within pizza
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);

        setToppings(prev => [...prev, {
            id: Date.now().toString(),
            toppingId,
            x,
            y,
            rotation: Math.random() * 360
        }]);
    };

    const clearPizza = () => {
        setToppings([]);
        setIsCooked(false);
    };

    const cookPizza = () => {
        if (cooking || isCooked) return;
        setCooking(true);

        setTimeout(() => {
            setCooking(false);
            setIsCooked(true);
        }, 3000);
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Pizza Maker</h1>
                    <button onClick={clearPizza} className="px-3 py-1 bg-rose-600 rounded text-sm">🗑️ New Pizza</button>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
                    {/* Pizza */}
                    <div className="relative">
                        {/* Plate/Oven */}
                        <div className={`
                            w-72 h-72 rounded-full flex items-center justify-center
                            ${cooking ? 'bg-orange-600 animate-pulse' : 'bg-amber-200'}
                            transition-colors duration-500
                        `}>
                            {cooking && (
                                <div className="absolute inset-0 flex items-center justify-center text-6xl animate-bounce">
                                    🔥
                                </div>
                            )}

                            {/* Pizza base */}
                            <div
                                className={`
                                    relative w-64 h-64 rounded-full shadow-xl transition-all duration-500
                                    ${isCooked ? 'brightness-90' : ''}
                                `}
                                style={{
                                    background: `radial-gradient(circle, ${sauce.color} 0%, ${sauce.color}dd 70%, #D97706 90%)`,
                                }}
                            >
                                {/* Crust */}
                                <div className="absolute inset-0 rounded-full border-[16px] border-amber-600" />

                                {/* Cheese base */}
                                {!cooking && (
                                    <div className="absolute inset-4 rounded-full bg-yellow-200/30" />
                                )}

                                {/* Toppings */}
                                {!cooking && toppings.map(topping => {
                                    const toppingData = TOPPINGS.find(t => t.id === topping.toppingId);
                                    return (
                                        <div
                                            key={topping.id}
                                            className="absolute text-2xl select-none"
                                            style={{
                                                left: `${topping.x}%`,
                                                top: `${topping.y}%`,
                                                transform: `translate(-50%, -50%) rotate(${topping.rotation}deg)`
                                            }}
                                        >
                                            {toppingData?.emoji}
                                        </div>
                                    );
                                })}

                                {/* Slice lines when cooked */}
                                {isCooked && (
                                    <>
                                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-amber-800/30" />
                                        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-amber-800/30" />
                                        <div className="absolute top-0 bottom-0 left-0 right-0" style={{
                                            background: 'linear-gradient(45deg, transparent 48%, rgba(146, 64, 14, 0.2) 50%, transparent 52%)'
                                        }} />
                                        <div className="absolute top-0 bottom-0 left-0 right-0" style={{
                                            background: 'linear-gradient(-45deg, transparent 48%, rgba(146, 64, 14, 0.2) 50%, transparent 52%)'
                                        }} />
                                    </>
                                )}
                            </div>
                        </div>

                        {isCooked && (
                            <div className="text-center mt-4 text-2xl animate-bounce">
                                🍕 Delicious! Ready to eat!
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="bg-slate-800 rounded-xl p-4 min-w-[250px]">
                        {/* Sauce */}
                        <div className="mb-4">
                            <p className="text-sm text-slate-400 mb-2">Choose Sauce:</p>
                            <div className="flex gap-2 flex-wrap">
                                {SAUCES.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => { setSauce(s); setIsCooked(false); }}
                                        disabled={cooking}
                                        className={`
                                            px-3 py-1 rounded text-sm
                                            ${sauce.id === s.id ? 'ring-2 ring-white' : ''}
                                        `}
                                        style={{ backgroundColor: s.color, color: s.id === 'white' ? 'black' : 'white' }}
                                    >
                                        {s.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Toppings */}
                        <div className="mb-4">
                            <p className="text-sm text-slate-400 mb-2">Add Toppings:</p>
                            <div className="grid grid-cols-4 gap-2">
                                {TOPPINGS.map(topping => (
                                    <button
                                        key={topping.id}
                                        onClick={() => { addRandomTopping(topping.id); setIsCooked(false); }}
                                        disabled={cooking}
                                        className="text-2xl p-2 bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-50"
                                        title={topping.name}
                                    >
                                        {topping.emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Cook button */}
                        <button
                            onClick={cookPizza}
                            disabled={cooking || toppings.length === 0}
                            className={`
                                w-full py-3 rounded-lg font-bold text-lg
                                ${cooking ? 'bg-orange-600 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-500'}
                                disabled:opacity-50
                            `}
                        >
                            {cooking ? '🔥 Cooking...' : isCooked ? '✅ Cooked!' : '👨‍🍳 Cook Pizza'}
                        </button>

                        <p className="text-xs text-slate-500 mt-2 text-center">
                            Toppings: {toppings.length}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
