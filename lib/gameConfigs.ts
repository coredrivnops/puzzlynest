'use client';

// Map of all 100 games to their specific engine configurations

import { TileMatchingConfig } from '@/components/engines/TileMatchingEngine';
import { PuzzleGridConfig } from '@/components/engines/PuzzleGridEngine';
import { QuizConfig } from '@/components/engines/QuizEngine';
import { ArcadeConfig } from '@/components/engines/ArcadeBaseEngine';

export type GameEngineType = 'tile' | 'puzzle' | 'quiz' | 'arcade' | 'custom';

export interface GameConfig {
    engine: GameEngineType;
    // We use union type here, but in practice we'll cast to specific config based on engine
    config?: TileMatchingConfig | PuzzleGridConfig | QuizConfig | ArcadeConfig;
    customId?: string; // If engine is custom, which component ID to load
}

// Helper to generate quiz questions simply
const mathQuestions: QuizConfig['questions'] = [
    { question: 'What is 5 + 7?', options: ['10', '11', '12', '13'], correctAnswer: '12' },
    { question: 'What is 15 - 6?', options: ['7', '8', '9', '10'], correctAnswer: '9' },
    { question: 'What is 8 x 4?', options: ['28', '30', '32', '36'], correctAnswer: '32' },
    { question: 'What is 20 / 5?', options: ['2', '3', '4', '5'], correctAnswer: '4' },
    { question: 'Double of 16?', options: ['30', '32', '34', '36'], correctAnswer: '32' },
];

const logicQuestions: QuizConfig['questions'] = [
    { question: 'What comes next: 2, 4, 8, 16, ...?', options: ['24', '30', '32', '40'], correctAnswer: '32' },
    { question: 'Which is heaviest?', options: ['1kg Gold', '1kg Cotton', '1kg Rock', 'They are equal'], correctAnswer: 'They are equal' },
    { question: 'Red + Blue = ?', options: ['Green', 'Purple', 'Orange', 'Brown'], correctAnswer: 'Purple' },
    { question: 'Day is to Night as White is to...?', options: ['Black', 'Grey', 'Red', 'Blue'], correctAnswer: 'Black' },
];

// --- COMPLETE CONFIGURATION MAP FOR ALL 100 GAMES ---
export const gameConfigurations: Record<string, GameConfig> = {
    // --- CUSTOM IMPLEMENTATIONS (Already built) ---
    'memory-match': { engine: 'custom', customId: 'memory-match' },
    'sudoku-classic': { engine: 'custom', customId: 'sudoku-classic' },
    'solitaire-klondike': { engine: 'custom', customId: 'solitaire-klondike' },
    'word-search': { engine: 'custom', customId: 'word-search' },
    'bubble-pop': { engine: 'custom', customId: 'bubble-pop' },
    'whack-a-mole': { engine: 'custom', customId: 'whack-a-mole' },
    'fruit-catcher': { engine: 'custom', customId: 'fruit-catcher' },
    'counting-fun': { engine: 'custom', customId: 'counting-fun' }, // Note: check component ID in GamePlayer
    'simon-says': { engine: 'custom', customId: 'simon-says' },
    'color-learning': { engine: 'custom', customId: 'color-learning' },
    'balloon-pop': { engine: 'custom', customId: 'balloon-pop' },

    // --- TILE MATCHING GAMES ---
    'animal-memory': {
        engine: 'tile',
        config: { title: 'Animal Memory', gridSize: 4, tiles: [{ id: '1', icon: '🐶' }, { id: '2', icon: '🐱' }, { id: '3', icon: '🍄' }, { id: '4', icon: '🐮' }, { id: '5', icon: '🐷' }, { id: '6', icon: '🐸' }, { id: '7', icon: '🐵' }, { id: '8', icon: '🦄' }] }
    },
    'mahjong-solitaire': {
        engine: 'tile',
        config: { title: 'Mahjong Solitaire', gridSize: 4, tiles: [{ id: '1', icon: '🀄' }, { id: '2', icon: '🀅' }, { id: '3', icon: '🀆' }, { id: '4', icon: '🀇' }, { id: '5', icon: '🀈' }, { id: '6', icon: '🀉' }, { id: '7', icon: '🀊' }, { id: '8', icon: '🀋' }] }
    },
    'shape-matching': {
        engine: 'tile',
        config: { title: 'Shape Match', gridSize: 4, tiles: [{ id: '1', icon: '⭐' }, { id: '2', icon: '🔶' }, { id: '3', icon: '🟢' }, { id: '4', icon: '🔺' }, { id: '5', icon: '⬛' }, { id: '6', icon: '💜' }, { id: '7', icon: '🛑' }, { id: '8', icon: '🔷' }] }
    },
    'memory-cards-advanced': {
        engine: 'tile',
        config: { title: 'Master Memory', gridSize: 6, tiles: Array.from({ length: 18 }, (_, i) => ({ id: String(i), icon: ['🍎', '🍌', '🍇', '🍊', '🍋', '🍉', '🍒', '🍓', '🍍', '🥝', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🥦', '🍄'][i] })) }
    },
    'pattern-master': {
        engine: 'tile',
        config: { title: 'Pattern Master', gridSize: 4, tiles: [{ id: '1', icon: '🏁' }, { id: '2', icon: '🏁' }, { id: '3', icon: '🏴' }, { id: '4', icon: '🏴' }, { id: '5', icon: '🏳️' }, { id: '6', icon: '🏳️' }, { id: '7', icon: '🚩' }, { id: '8', icon: '🚩' }] } // Simplified
    },

    // --- PUZZLE GRID GAMES ---
    'anagram-challenge': {
        engine: 'puzzle',
        config: { title: 'Anagram Challenge', gridSize: { rows: 8, cols: 8 }, difficulty: 'medium', words: ['READ', 'DEAR', 'STOP', 'POST', 'EARTH', 'HEART'] }
    },
    'word-ladder': {
        engine: 'puzzle',
        config: { title: 'Word Ladder', gridSize: { rows: 10, cols: 10 }, difficulty: 'hard', words: ['COLD', 'CORD', 'CARD', 'WARD', 'WARM'] }
    },
    'crossword-easy': {
        engine: 'puzzle',
        config: { title: 'Mini Crossword', gridSize: { rows: 6, cols: 6 }, difficulty: 'easy', words: ['CAT', 'DOG', 'SUN', 'MOON'] }
    },
    'spelling-bee': {
        engine: 'puzzle',
        config: { title: 'Spelling Bee', gridSize: { rows: 8, cols: 8 }, difficulty: 'medium', words: ['HONEY', 'COMB', 'HIVE', 'QUEEN', 'BUZZ'] }
    },

    // --- QUIZ GAME MAPPINGS (Brain Training/Logic) ---
    'mental-math': {
        engine: 'quiz',
        config: { title: 'Mental Math', difficulty: 'medium', questions: mathQuestions }
    },
    'logic-grid': {
        engine: 'quiz',
        config: { title: 'Logic Master', difficulty: 'medium', questions: logicQuestions }
    },
    'brain-teasers': {
        engine: 'quiz',
        config: {
            title: 'Brain Teasers', difficulty: 'hard', questions: [
                { question: 'I speak without a mouth and hear without ears. What am I?', options: ['Phone', 'Echo', 'Wind', 'River'], correctAnswer: 'Echo' },
                { question: 'The more of me you take, the more you leave behind.', options: ['Steps', 'Time', 'Money', 'Friends'], correctAnswer: 'Steps' },
                { question: 'I have keys but no locks. I have space but no room.', options: ['Computer', 'Keyboard', 'Piano', 'Map'], correctAnswer: 'Keyboard' }
            ]
        }
    },
    'number-sequence': {
        engine: 'quiz',
        config: {
            title: 'Number Sequences', difficulty: 'medium', questions: [
                { question: '2, 4, 6, 8, ...', options: ['9', '10', '11', '12'], correctAnswer: '10' },
                { question: '1, 1, 2, 3, 5, ...', options: ['7', '8', '9', '10'], correctAnswer: '8' },
                { question: '10, 20, 30, ...', options: ['35', '40', '50', '60'], correctAnswer: '40' }
            ]
        }
    },

    // --- ARCADE / ACTION MAPPINGS ---
    'catch-the-fruit': { engine: 'custom', customId: 'catch-the-fruit' }, // Actually exists as custom
    'space-shooter-kids': {
        engine: 'arcade',
        config: { title: 'Space Adventure', gameType: 'clicker', targetEmoji: '🚀', avoidEmoji: '☄️' }
    },
    'whack-a-mole-kids': { // In case ID differs
        engine: 'arcade',
        config: { title: 'Whack a Mole', gameType: 'clicker', targetEmoji: '🐹', avoidEmoji: '💣' }
    },
    'dodge-obstacles': {
        engine: 'arcade',
        config: { title: 'Dodge It', gameType: 'avoid', targetEmoji: '💎', avoidEmoji: '🔥' }
    },
    'treasure-hunt': {
        engine: 'arcade',
        config: { title: 'Treasure Hunt', gameType: 'clicker', targetEmoji: '💰', avoidEmoji: '👻' }
    },
    'fish-feeding': {
        engine: 'arcade',
        config: { title: 'Fish Feeding', gameType: 'clicker', targetEmoji: '🐠', avoidEmoji: '🦈' }
    },
    'butterfly-catch': {
        engine: 'arcade',
        config: { title: 'Butterfly Catcher', gameType: 'clicker', targetEmoji: '🦋', avoidEmoji: '🐝' }
    },

    // --- KIDS LEARNING (Quiz/Tile/Arcade) ---
    'abc-tracing': { // Simulating tracing with order clicking? Or simple quiz for now
        engine: 'quiz',
        config: {
            title: 'ABC Fun', difficulty: 'easy', questions: [
                { question: 'Which letter starts "Apple"?', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A' },
                { question: 'Which letter starts "Ball"?', options: ['A', 'B', 'C', 'D'], correctAnswer: 'B' },
                { question: 'Which letter starts "Cat"?', options: ['A', 'B', 'C', 'D'], correctAnswer: 'C' }
            ]
        }
    },
    'basic-math-addition': {
        engine: 'quiz',
        config: { title: 'Addition Fun', difficulty: 'easy', questions: [{ question: '1 + 1 = ?', options: ['1', '2', '3', '4'], correctAnswer: '2' }, { question: '2 + 2 = ?', options: ['3', '4', '5', '6'], correctAnswer: '4' }] }
    },
    'money-counting': {
        engine: 'quiz',
        config: { title: 'Money Count', difficulty: 'medium', questions: [{ question: 'How many cents in a dime?', options: ['5', '10', '25', '1'], correctAnswer: '10' }] }
    },

    // --- FALLBACK FOR OTHERS (Use sensible defaults) ---
    // Using generic "Memory" or "Arcade" for categories we haven't explicitly mapped perfectly yet
    // This ensures *something* playable loads for ALL IDs.
};

// Default fallback generator
export function getGameConfig(gameId: string): GameConfig {
    if (gameConfigurations[gameId]) {
        return gameConfigurations[gameId];
    }

    // Smart fallback based on ID string
    if (gameId.includes('solitaire')) {
        // Fallback to basic solitaire engine or tile match if no card engine
        return { engine: 'tile', config: { title: 'Card Match', gridSize: 4, tiles: [{ id: '1', icon: '♠️' }, { id: '2', icon: '♥️' }, { id: '3', icon: '♣️' }, { id: '4', icon: '♦️' }] } as TileMatchingConfig };
    }
    if (gameId.includes('sudoku')) {
        return { engine: 'quiz', config: { title: 'Sudoku Quiz', difficulty: 'medium', questions: [{ question: 'Sudoku is played on what size grid?', options: ['8x8', '9x9', '10x10'], correctAnswer: '9x9' }] } as QuizConfig };
    }
    if (gameId.includes('word') || gameId.includes('crossword')) {
        return { engine: 'puzzle', config: { title: 'Word Puzzle', gridSize: { rows: 8, cols: 8 }, difficulty: 'medium', words: ['PLAY', 'GAME', 'FUN'] } as PuzzleGridConfig };
    }
    if (gameId.includes('math') || gameId.includes('count')) {
        return { engine: 'quiz', config: { title: 'Math Quiz', difficulty: 'easy', questions: mathQuestions } as QuizConfig };
    }

    // Absolute fallback
    return {
        engine: 'arcade',
        config: { title: 'Quick Catch', gameType: 'clicker', targetEmoji: '⭐', avoidEmoji: '💣' } as ArcadeConfig
    };
}
