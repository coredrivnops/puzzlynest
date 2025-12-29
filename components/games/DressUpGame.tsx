'use client';

import { useState } from 'react';
import Link from 'next/link';

// Dress Up Game - dress up a character with clothes and accessories
const CATEGORIES = {
    body: {
        name: 'Character',
        items: [
            { id: 'girl1', emoji: '👧', name: 'Girl' },
            { id: 'boy1', emoji: '👦', name: 'Boy' },
            { id: 'person1', emoji: '🧑', name: 'Person' },
        ]
    },
    hair: {
        name: 'Hair',
        items: [
            { id: 'none', emoji: '❌', name: 'None' },
            { id: 'crown', emoji: '👑', name: 'Crown' },
            { id: 'bow', emoji: '🎀', name: 'Bow' },
            { id: 'hat', emoji: '🎩', name: 'Top Hat' },
            { id: 'cap', emoji: '🧢', name: 'Cap' },
            { id: 'tiara', emoji: '👸', name: 'Tiara' },
        ]
    },
    top: {
        name: 'Top',
        items: [
            { id: 'none', emoji: '❌', name: 'None' },
            { id: 'shirt', emoji: '👕', name: 'Shirt' },
            { id: 'dress', emoji: '👗', name: 'Dress' },
            { id: 'jacket', emoji: '🧥', name: 'Jacket' },
            { id: 'sweater', emoji: '🧶', name: 'Sweater' },
        ]
    },
    bottom: {
        name: 'Bottom',
        items: [
            { id: 'none', emoji: '❌', name: 'None' },
            { id: 'pants', emoji: '👖', name: 'Pants' },
            { id: 'shorts', emoji: '🩳', name: 'Shorts' },
            { id: 'skirt', emoji: '🩱', name: 'Skirt' },
        ]
    },
    shoes: {
        name: 'Shoes',
        items: [
            { id: 'none', emoji: '❌', name: 'None' },
            { id: 'sneakers', emoji: '👟', name: 'Sneakers' },
            { id: 'boots', emoji: '👢', name: 'Boots' },
            { id: 'heels', emoji: '👠', name: 'Heels' },
            { id: 'sandals', emoji: '🩴', name: 'Sandals' },
        ]
    },
    accessory: {
        name: 'Accessory',
        items: [
            { id: 'none', emoji: '❌', name: 'None' },
            { id: 'glasses', emoji: '👓', name: 'Glasses' },
            { id: 'sunglasses', emoji: '🕶️', name: 'Sunglasses' },
            { id: 'bag', emoji: '👜', name: 'Bag' },
            { id: 'watch', emoji: '⌚', name: 'Watch' },
            { id: 'necklace', emoji: '📿', name: 'Necklace' },
        ]
    },
};

const BACKGROUNDS = ['🌈', '🌅', '🏰', '🌸', '❄️', '🌴', '🎪', '🌙'];

export default function DressUpGame() {
    const [outfit, setOutfit] = useState({
        body: CATEGORIES.body.items[0],
        hair: CATEGORIES.hair.items[0],
        top: CATEGORIES.top.items[1],
        bottom: CATEGORIES.bottom.items[1],
        shoes: CATEGORIES.shoes.items[1],
        accessory: CATEGORIES.accessory.items[0],
    });
    const [activeCategory, setActiveCategory] = useState<keyof typeof CATEGORIES>('body');
    const [background, setBackground] = useState('🌈');

    const selectItem = (item: typeof CATEGORIES.body.items[0]) => {
        setOutfit(prev => ({ ...prev, [activeCategory]: item }));
    };

    const randomOutfit = () => {
        const randomItem = (items: any[]) => items[Math.floor(Math.random() * items.length)];
        setOutfit({
            body: randomItem(CATEGORIES.body.items),
            hair: randomItem(CATEGORIES.hair.items),
            top: randomItem(CATEGORIES.top.items),
            bottom: randomItem(CATEGORIES.bottom.items),
            shoes: randomItem(CATEGORIES.shoes.items),
            accessory: randomItem(CATEGORIES.accessory.items),
        });
        setBackground(BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)]);
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Dress Up Fun</h1>
                    <button
                        onClick={randomOutfit}
                        className="px-3 py-1 bg-indigo-600 rounded"
                    >
                        🎲 Random
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                    {/* Character display */}
                    <div className="relative">
                        {/* Background selector */}
                        <div className="flex gap-1 mb-2 justify-center">
                            {BACKGROUNDS.map(bg => (
                                <button
                                    key={bg}
                                    onClick={() => setBackground(bg)}
                                    className={`text-2xl p-1 rounded ${background === bg ? 'ring-2 ring-white' : ''}`}
                                >
                                    {bg}
                                </button>
                            ))}
                        </div>

                        {/* Character stage */}
                        <div className="w-64 h-80 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-sky-300 to-sky-100">
                            {/* Background emoji */}
                            <div className="absolute inset-0 flex items-center justify-center text-[8rem] opacity-30">
                                {background}
                            </div>

                            {/* Character layers */}
                            <div className="relative z-10 flex flex-col items-center">
                                {/* Hair/Hat */}
                                {outfit.hair.id !== 'none' && (
                                    <div className="text-5xl -mb-4">{outfit.hair.emoji}</div>
                                )}

                                {/* Body/Face */}
                                <div className="text-7xl">{outfit.body.emoji}</div>

                                {/* Top */}
                                {outfit.top.id !== 'none' && (
                                    <div className="text-5xl -mt-2">{outfit.top.emoji}</div>
                                )}

                                {/* Bottom */}
                                {outfit.bottom.id !== 'none' && (
                                    <div className="text-4xl -mt-2">{outfit.bottom.emoji}</div>
                                )}

                                {/* Shoes */}
                                {outfit.shoes.id !== 'none' && (
                                    <div className="text-3xl -mt-1">{outfit.shoes.emoji}</div>
                                )}

                                {/* Accessory */}
                                {outfit.accessory.id !== 'none' && (
                                    <div className="absolute top-12 right-0 text-3xl">{outfit.accessory.emoji}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="bg-slate-800 rounded-xl p-4 min-w-[250px]">
                        {/* Category tabs */}
                        <div className="flex flex-wrap gap-1 mb-4">
                            {(Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[]).map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`
                                        px-3 py-1 rounded text-sm
                                        ${activeCategory === cat ? 'bg-indigo-600' : 'bg-slate-700'}
                                    `}
                                >
                                    {CATEGORIES[cat].name}
                                </button>
                            ))}
                        </div>

                        {/* Items grid */}
                        <div className="grid grid-cols-3 gap-2">
                            {CATEGORIES[activeCategory].items.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => selectItem(item)}
                                    className={`
                                        p-3 rounded-lg text-3xl transition-all
                                        ${outfit[activeCategory].id === item.id
                                            ? 'bg-indigo-600 ring-2 ring-white scale-105'
                                            : 'bg-slate-700 hover:bg-slate-600'}
                                    `}
                                    title={item.name}
                                >
                                    {item.emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
