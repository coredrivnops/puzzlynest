'use client';

import PuzzleGridEngine from '@/components/engines/PuzzleGridEngine';

// Anagram challenge configuration
const anagramConfig = {
    title: 'Anagram Master',
    gridSize: { rows: 8, cols: 8 },
    words: ['PLANET', 'OCEAN', 'FOREST', 'RIVER', 'MOUNTAIN'],
    difficulty: 'medium' as const,
};

export default function AnagramChallengeGame() {
    return <PuzzleGridEngine config={anagramConfig} />;
}
