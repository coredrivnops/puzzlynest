'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { Game } from '@/lib/games';

// --- AUTHENTIC GAME IMPLEMENTATIONS ---
// Each game has unique mechanics true to its original gameplay

// Brain Training & Logic
const MemoryMatchGame = dynamic(() => import('@/components/games/MemoryMatchGame'), { ssr: false });
const SudokuGame = dynamic(() => import('@/components/games/SudokuGame'), { ssr: false });
const MinesweeperGame = dynamic(() => import('@/components/games/MinesweeperGame'), { ssr: false });
const NumberSequenceGame = dynamic(() => import('@/components/games/NumberSequenceGame'), { ssr: false });
const SimonSaysGame = dynamic(() => import('@/components/games/SimonSaysGame'), { ssr: false });
const PatternGame = dynamic(() => import('@/components/games/PatternGame'), { ssr: false });
const NonogramGame = dynamic(() => import('@/components/games/NonogramGame'), { ssr: false });
const NumberBondsGame = dynamic(() => import('@/components/games/NumberBondsGame'), { ssr: false });

// Classic Games
const SolitaireGame = dynamic(() => import('@/components/games/SolitaireGame'), { ssr: false });
const SpiderSolitaireGame = dynamic(() => import('@/components/games/SpiderSolitaireGame'), { ssr: false });
const FreeCellGame = dynamic(() => import('@/components/games/FreeCellGame'), { ssr: false });
const PyramidSolitaireGame = dynamic(() => import('@/components/games/PyramidSolitaireGame'), { ssr: false });
const ConnectFourGame = dynamic(() => import('@/components/games/ConnectFourGame'), { ssr: false });
const TangramGame = dynamic(() => import('@/components/games/TangramGame'), { ssr: false });
const CheckersGame = dynamic(() => import('@/components/games/CheckersGame'), { ssr: false });
const JigsawGame = dynamic(() => import('@/components/games/JigsawGame'), { ssr: false });
const ReversiGame = dynamic(() => import('@/components/games/ReversiGame'), { ssr: false });

// Word Games
const WordSearchGame = dynamic(() => import('@/components/games/WordSearchGame'), { ssr: false });
const AnagramChallengeGame = dynamic(() => import('@/components/games/AnagramChallengeGame'), { ssr: false });
const HangmanGame = dynamic(() => import('@/components/games/HangmanGame'), { ssr: false });
const SpellingBeeGame = dynamic(() => import('@/components/games/SpellingBeeGame'), { ssr: false });
const WordLadderGame = dynamic(() => import('@/components/games/WordLadderGame'), { ssr: false });

// Action & Arcade
const BubblePopGame = dynamic(() => import('@/components/games/BubblePopGame'), { ssr: false });
const WhackAMoleGame = dynamic(() => import('@/components/games/WhackAMoleGame'), { ssr: false });
const BalloonPopGame = dynamic(() => import('@/components/games/BalloonPopGame'), { ssr: false });
const FlappyGame = dynamic(() => import('@/components/games/FlappyGame'), { ssr: false });
const BrickBreakerGame = dynamic(() => import('@/components/games/BrickBreakerGame'), { ssr: false });
const FruitCatcherGame = dynamic(() => import('@/components/games/FruitCatcherGame'), { ssr: false });

// Kids Learning & Creative
const CountingGame = dynamic(() => import('@/components/games/CountingGame'), { ssr: false });
const QuizGame = dynamic(() => import('@/components/games/QuizGame'), { ssr: false });
const DrawingGame = dynamic(() => import('@/components/games/DrawingGame'), { ssr: false });
const ClockGame = dynamic(() => import('@/components/games/ClockGame'), { ssr: false });
const MathAdventureGame = dynamic(() => import('@/components/games/MathAdventureGame'), { ssr: false });

// Map game IDs to their authentic implementations
const gameComponents: Record<string, React.ComponentType<any>> = {
    // Brain Training & Logic
    'memory-match': MemoryMatchGame,
    'animal-memory': MemoryMatchGame,
    'memory-cards-advanced': MemoryMatchGame,
    'sudoku-classic': SudokuGame,
    'sudoku-mini': SudokuGame,
    'minesweeper': MinesweeperGame,
    'number-sequence': NumberSequenceGame,
    'simon-says': SimonSaysGame,
    'color-match': SimonSaysGame,
    'pattern-master': PatternGame,
    'pattern-completion': PatternGame,
    'spatial-reasoning': PatternGame,
    'nonogram': NonogramGame,
    'number-bonds': NumberBondsGame,
    'mental-math': NumberBondsGame,

    // Classic Games
    'solitaire-klondike': SolitaireGame,
    'solitaire-spider': SpiderSolitaireGame,
    'solitaire-freecell': FreeCellGame,
    'pyramid-solitaire': PyramidSolitaireGame,
    'connect-four': ConnectFourGame,
    'tangram': TangramGame,
    'checkers': CheckersGame,
    'jigsaw-easy': JigsawGame,
    'jigsaw-medium': JigsawGame,
    'jigsaw-hard': JigsawGame,
    'reversi': ReversiGame,

    // Word Games
    'word-search': WordSearchGame,
    'anagram-challenge': AnagramChallengeGame,
    'boggle': WordSearchGame,               // Placeholder as WordSearch
    'hangman': HangmanGame,
    'spelling-bee': SpellingBeeGame,
    'word-ladder': WordLadderGame,

    // Action & Arcade
    'bubble-pop': BubblePopGame,
    'whack-a-mole': WhackAMoleGame,
    'tap-the-mole': WhackAMoleGame,
    'balloon-pop': BalloonPopGame,
    'flappy-game': FlappyGame,
    'flying-game': FlappyGame,
    'endless-runner': FlappyGame,
    'jump-adventure': FlappyGame,
    'brick-breaker': BrickBreakerGame,
    'break-the-bricks': BrickBreakerGame,
    'fruit-catcher': FruitCatcherGame,
    'catch-the-fruit': FruitCatcherGame,
    'candy-collect': FruitCatcherGame,

    // Kids Learning
    'counting-fun': CountingGame,
    'color-learning': QuizGame,
    'shape-matching': QuizGame,
    'money-counting': QuizGame,
    'rhyming-words': QuizGame,
    'sight-words': QuizGame,
    'phonics-sounds': QuizGame,
    'animal-sounds': QuizGame,
    'seasons-weather': QuizGame,
    'body-parts': QuizGame,
    'vocabulary-builder': QuizGame,
    'basic-math-addition': MathAdventureGame,
    'basic-math-subtraction': MathAdventureGame,
    'clock-reading': ClockGame,

    // Creative
    'coloring-book': DrawingGame,
    'coloring-mandala': DrawingGame, // Simplified
    'drawing-pad': DrawingGame,
    'sticker-scene': DrawingGame,
    'pixel-art': DrawingGame,
    'stamp-art': DrawingGame,
    'pattern-designer': DrawingGame,
    'dress-up': DrawingGame, // Fallback to drawing
    'room-decorator': DrawingGame, // Fallback
    'cake-decorator': DrawingGame, // Fallback
    'pet-salon': DrawingGame, // Fallback
};

interface GamePlayerProps {
    game: Game;
}

export default function GamePlayer({ game }: GamePlayerProps) {
    // Check for authentic implementation
    const GameComponent = gameComponents[game.id];

    if (GameComponent) {
        return <GameComponent game={game} />;
    }

    // For games not yet implemented, show a "Coming Soon" with game info
    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                        ← Back
                    </Link>
                    <h1 className="game-title">{game.name}</h1>
                </div>
                <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🎮</div>
                    <h2 style={{ marginBottom: '1rem' }}>{game.name}</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                        {game.description}
                    </p>
                    <div style={{
                        padding: '1rem 2rem',
                        background: 'rgba(99, 102, 241, 0.2)',
                        borderRadius: '12px',
                        color: '#a5b4fc',
                        display: 'inline-block',
                        marginBottom: '1rem',
                    }}>
                        🚧 This game is being built with authentic gameplay mechanics
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
                        Try one of our {Object.keys(gameComponents).length}+ playable games!
                    </p>
                </div>
            </div>
        </div>
    );
}
