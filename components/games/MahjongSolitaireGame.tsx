'use client';

import TileMatchingEngine from '@/components/engines/TileMatchingEngine';

// Mahjong Solitaire configuration
const mahjongConfig = {
    title: 'Mahjong Solitaire',
    tiles: [
        { id: '1', icon: '🀄' },
        { id: '2', icon: '🀅' },
        { id: '3', icon: '🀆' },
        { id: '4', icon: '🀇' },
        { id: '5', icon: '🀈' },
        { id: '6', icon: '🀉' },
        { id: '7', icon: '🀊' },
        { id: '8', icon: '🀋' },
    ],
    gridSize: 4,
    timeLimit: 120,
};

export default function MahjongSolitaire() {
    return <TileMatchingEngine config={mahjongConfig} />;
}
