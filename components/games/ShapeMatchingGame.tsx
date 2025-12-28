'use client';

import TileMatchingEngine from '@/components/engines/TileMatchingEngine';

// Shape Matching configuration for kids
const shapeConfig = {
    title: 'Shape Match',
    tiles: [
        { id: '1', icon: '⭐' },
        { id: '2', icon: '🔷' },
        { id: '3', icon: '🔺' },
        { id: '4', icon: '⬛' },
        { id: '5', icon: '🔴' },
        { id: '6', icon: '💚' },
    ],
    gridSize: 4,
};

export default function ShapeMatchingGame() {
    return <TileMatchingEngine config={shapeConfig} />;
}
