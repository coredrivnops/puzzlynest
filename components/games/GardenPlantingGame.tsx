'use client';

import { useState } from 'react';
import Link from 'next/link';

// Garden Planting Game - plant seeds and watch them grow
const PLANTS = [
    { id: 'sunflower', emoji: '🌻', stages: ['🌱', '🌿', '🌻'], growTime: 3 },
    { id: 'tulip', emoji: '🌷', stages: ['🌱', '🌿', '🌷'], growTime: 2 },
    { id: 'rose', emoji: '🌹', stages: ['🌱', '🌿', '🌹'], growTime: 4 },
    { id: 'tree', emoji: '🌳', stages: ['🌱', '🪴', '🌳'], growTime: 5 },
    { id: 'cactus', emoji: '🌵', stages: ['🌱', '🌿', '🌵'], growTime: 3 },
    { id: 'cherry', emoji: '🌸', stages: ['🌱', '🌿', '🌸'], growTime: 4 },
];

interface PlantedItem {
    id: string;
    plantId: string;
    stage: number; // 0, 1, 2
    needsWater: boolean;
    growthTimer: number;
}

export default function GardenPlantingGame() {
    const [selectedSeed, setSelectedSeed] = useState(PLANTS[0]);
    const [garden, setGarden] = useState<(PlantedItem | null)[]>(Array(12).fill(null));
    const [score, setScore] = useState(0);
    const [wateringCan, setWateringCan] = useState(5);

    const plantSeed = (index: number) => {
        if (garden[index]) return;

        setGarden(prev => {
            const newGarden = [...prev];
            newGarden[index] = {
                id: Date.now().toString(),
                plantId: selectedSeed.id,
                stage: 0,
                needsWater: false,
                growthTimer: 0
            };
            return newGarden;
        });
    };

    const waterPlant = (index: number) => {
        if (!garden[index] || wateringCan <= 0) return;

        setWateringCan(w => w - 1);

        setGarden(prev => {
            const newGarden = [...prev];
            const plant = newGarden[index];
            if (plant && plant.stage < 2) {
                const plantData = PLANTS.find(p => p.id === plant.plantId);
                newGarden[index] = {
                    ...plant,
                    needsWater: false,
                    stage: plant.stage + 1
                };

                if (plant.stage + 1 === 2) {
                    setScore(s => s + 10);
                }
            }
            return newGarden;
        });
    };

    const harvestPlant = (index: number) => {
        const plant = garden[index];
        if (!plant || plant.stage < 2) return;

        setScore(s => s + 20);
        setWateringCan(w => Math.min(10, w + 2)); // Bonus water

        setGarden(prev => {
            const newGarden = [...prev];
            newGarden[index] = null;
            return newGarden;
        });
    };

    const refillWater = () => {
        setWateringCan(10);
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Garden Game</h1>
                    <div className="flex gap-4">
                        <span className="text-yellow-400 font-bold">🌟 {score}</span>
                        <span className="text-blue-400 font-bold">💧 {wateringCan}</span>
                    </div>
                </div>

                {/* Seed selection */}
                <div className="flex justify-center gap-2 mb-4 flex-wrap">
                    {PLANTS.map(plant => (
                        <button
                            key={plant.id}
                            onClick={() => setSelectedSeed(plant)}
                            className={`
                                text-3xl p-2 rounded-lg transition-all
                                ${selectedSeed.id === plant.id
                                    ? 'bg-emerald-600 scale-110 shadow-lg'
                                    : 'bg-slate-700 hover:bg-slate-600'}
                            `}
                        >
                            {plant.emoji}
                        </button>
                    ))}
                    <button
                        onClick={refillWater}
                        className="text-3xl p-2 bg-blue-600 rounded-lg hover:bg-blue-500"
                        title="Refill water"
                    >
                        🚿
                    </button>
                </div>

                {/* Garden grid */}
                <div className="bg-gradient-to-b from-sky-300 to-sky-400 rounded-xl p-4">
                    <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                        {garden.map((plot, index) => {
                            const plantData = plot ? PLANTS.find(p => p.id === plot.plantId) : null;
                            const currentEmoji = plantData?.stages[plot?.stage || 0];

                            return (
                                <div
                                    key={index}
                                    className="relative aspect-square bg-amber-700 rounded-lg border-4 border-amber-800 flex items-center justify-center cursor-pointer hover:brightness-110 transition"
                                    onClick={() => {
                                        if (!plot) {
                                            plantSeed(index);
                                        } else if (plot.stage < 2) {
                                            waterPlant(index);
                                        } else {
                                            harvestPlant(index);
                                        }
                                    }}
                                >
                                    {/* Soil texture */}
                                    <div className="absolute inset-1 bg-amber-900/30 rounded" />

                                    {plot ? (
                                        <div className="text-4xl animate-bounce" style={{ animationDuration: '2s' }}>
                                            {currentEmoji}
                                        </div>
                                    ) : (
                                        <div className="text-2xl opacity-30">🌱</div>
                                    )}

                                    {/* Water indicator */}
                                    {plot && plot.stage < 2 && (
                                        <div className="absolute bottom-0 right-0 text-sm bg-blue-500 rounded-tl px-1">
                                            💧
                                        </div>
                                    )}

                                    {/* Harvest indicator */}
                                    {plot && plot.stage >= 2 && (
                                        <div className="absolute -top-1 -right-1 text-xl animate-pulse">
                                            ✨
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Grass decoration */}
                    <div className="h-8 bg-emerald-500 mt-2 rounded-b-xl flex items-center justify-center gap-4">
                        <span className="text-xl">🌿</span>
                        <span className="text-xl">🦋</span>
                        <span className="text-xl">🌿</span>
                        <span className="text-xl">🐝</span>
                        <span className="text-xl">🌿</span>
                    </div>
                </div>

                <div className="text-center mt-4 text-slate-400 text-sm">
                    <p>🌱 Tap empty plot to plant • 💧 Tap growing plant to water • ✨ Tap grown plant to harvest</p>
                </div>
            </div>
        </div>
    );
}
