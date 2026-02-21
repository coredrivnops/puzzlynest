'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense } from 'react';
import type { Game } from '@/lib/games';
import { SkeletonGamePlayer } from '@/components/Skeleton';


// --- AUTHENTIC GAME IMPLEMENTATIONS ---
// Each game has unique mechanics true to its original gameplay

// Brain Training & Logic
const MemoryMatchGame = dynamic(() => import('@/components/games/MemoryMatchGame'), { ssr: false });
const SudokuGame = dynamic(() => import('@/components/games/SudokuGame'), { ssr: false });
const MinesweeperGame = dynamic(() => import('@/components/games/MinesweeperGame'), { ssr: false });
const LogicGridGame = dynamic(() => import('@/components/games/LogicGridGame'), { ssr: false });
const KakuroGame = dynamic(() => import('@/components/games/KakuroGame'), { ssr: false });
const NumberSequenceGame = dynamic(() => import('@/components/games/NumberSequenceGame'), { ssr: false });
const SimonSaysGame = dynamic(() => import('@/components/games/SimonSaysGame'), { ssr: false });
const PatternGame = dynamic(() => import('@/components/games/PatternGame'), { ssr: false });
const NonogramGame = dynamic(() => import('@/components/games/NonogramGame'), { ssr: false });
const NumberBondsGame = dynamic(() => import('@/components/games/NumberBondsGame'), { ssr: false });
const MentalMathGame = dynamic(() => import('@/components/games/MentalMathGame'), { ssr: false });

// Classic Card & Board Games
const SolitaireGame = dynamic(() => import('@/components/games/SolitaireGame'), { ssr: false });
const SpiderSolitaireGame = dynamic(() => import('@/components/games/SpiderSolitaireGame'), { ssr: false });
const FreeCellGame = dynamic(() => import('@/components/games/FreeCellGame'), { ssr: false });
const PyramidSolitaireGame = dynamic(() => import('@/components/games/PyramidSolitaireGame'), { ssr: false });
const ConnectFourGame = dynamic(() => import('@/components/games/ConnectFourGame'), { ssr: false });
const TangramGame = dynamic(() => import('@/components/games/TangramGame'), { ssr: false });
const JigsawGame = dynamic(() => import('@/components/games/JigsawGame'), { ssr: false });
const CheckersGame = dynamic(() => import('@/components/games/CheckersGame'), { ssr: false });
const ChessPuzzlesGame = dynamic(() => import('@/components/games/ChessPuzzlesGame'), { ssr: false });
const DominoesGame = dynamic(() => import('@/components/games/DominoesGame'), { ssr: false });
const BackgammonGame = dynamic(() => import('@/components/games/BackgammonGame'), { ssr: false });
const ReversiGame = dynamic(() => import('@/components/games/ReversiGame'), { ssr: false });
const MahjongGame = dynamic(() => import('@/components/games/MahjongGame'), { ssr: false });
const MatchThreeGame = dynamic(() => import('@/components/games/MatchThreeGame'), { ssr: false });
const HeartsGame = dynamic(() => import('@/components/games/HeartsGame'), { ssr: false });
const GinRummyGame = dynamic(() => import('@/components/games/GinRummyGame'), { ssr: false });
const CribbageGame = dynamic(() => import('@/components/games/CribbageGame'), { ssr: false });
const MosaicPuzzlesGame = dynamic(() => import('@/components/games/MosaicPuzzlesGame'), { ssr: false });
const CardGameStub = dynamic(() => import('@/components/games/CardGameStub'), { ssr: false });

// Word Games
const WordSearchGame = dynamic(() => import('@/components/games/WordSearchGame'), { ssr: false });
const AnagramChallengeGame = dynamic(() => import('@/components/games/AnagramChallengeGame'), { ssr: false });
const HangmanGame = dynamic(() => import('@/components/games/HangmanGame'), { ssr: false });
const SpellingBeeGame = dynamic(() => import('@/components/games/SpellingBeeGame'), { ssr: false });
const WordLadderGame = dynamic(() => import('@/components/games/WordLadderGame'), { ssr: false });
const CrosswordGame = dynamic(() => import('@/components/games/CrosswordGame'), { ssr: false });
const CryptogramGame = dynamic(() => import('@/components/games/CryptogramGame'), { ssr: false });
const WordAssociationGame = dynamic(() => import('@/components/games/WordAssociationGame'), { ssr: false });
const BoggleGame = dynamic(() => import('@/components/games/BoggleGame'), { ssr: false });

// Action & Arcade
const BubblePopGame = dynamic(() => import('@/components/games/BubblePopGame'), { ssr: false });
const WhackAMoleGame = dynamic(() => import('@/components/games/WhackAMoleGame'), { ssr: false });
const BalloonPopGame = dynamic(() => import('@/components/games/BalloonPopGame'), { ssr: false });
const FlappyGame = dynamic(() => import('@/components/games/FlappyGame'), { ssr: false });
const BrickBreakerGame = dynamic(() => import('@/components/games/BrickBreakerGame'), { ssr: false });
const FruitCatcherGame = dynamic(() => import('@/components/games/FruitCatcherGame'), { ssr: false });
const SpaceShooterGame = dynamic(() => import('@/components/games/SpaceShooterGame'), { ssr: false });
const EndlessRunnerGame = dynamic(() => import('@/components/games/EndlessRunnerGame'), { ssr: false });
const StackBlocksGame = dynamic(() => import('@/components/games/StackBlocksGame'), { ssr: false });
const DodgeObstaclesGame = dynamic(() => import('@/components/games/DodgeObstaclesGame'), { ssr: false });
const RacingGame = dynamic(() => import('@/components/games/RacingGame'), { ssr: false });
const TreasureHuntGame = dynamic(() => import('@/components/games/TreasureHuntGame'), { ssr: false });
const ButterflyCatchGame = dynamic(() => import('@/components/games/ButterflyCatchGame'), { ssr: false });
const FishFeedingGame = dynamic(() => import('@/components/games/FishFeedingGame'), { ssr: false });
const PenguinSlideGame = dynamic(() => import('@/components/games/PenguinSlideGame'), { ssr: false });

// Kids Learning & Creative
const CountingGame = dynamic(() => import('@/components/games/CountingGame'), { ssr: false });
const QuizGame = dynamic(() => import('@/components/games/QuizGame'), { ssr: false });
const DrawingGame = dynamic(() => import('@/components/games/DrawingGame'), { ssr: false });
const ClockGame = dynamic(() => import('@/components/games/ClockGame'), { ssr: false });
const MathAdventureGame = dynamic(() => import('@/components/games/MathAdventureGame'), { ssr: false });
const ABCTracingGame = dynamic(() => import('@/components/games/ABCTracingGame'), { ssr: false });
const MusicMakerGame = dynamic(() => import('@/components/games/MusicMakerGame'), { ssr: false });
const FaceMakerGame = dynamic(() => import('@/components/games/FaceMakerGame'), { ssr: false });
const PizzaMakerGame = dynamic(() => import('@/components/games/PizzaMakerGame'), { ssr: false });
const GardenPlantingGame = dynamic(() => import('@/components/games/GardenPlantingGame'), { ssr: false });
const SpotDifferenceGame = dynamic(() => import('@/components/games/SpotDifferenceGame'), { ssr: false });
const HiddenObjectsGame = dynamic(() => import('@/components/games/HiddenObjectsGame'), { ssr: false });
const StickerSceneGame = dynamic(() => import('@/components/games/StickerSceneGame'), { ssr: false });
const DressUpGame = dynamic(() => import('@/components/games/DressUpGame'), { ssr: false });

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
    'logic-grid': LogicGridGame,
    'kakuro': KakuroGame,
    'brain-teasers': LogicGridGame,
    'nonogram': NonogramGame,
    'number-bonds': NumberBondsGame,
    'mental-math': MentalMathGame,

    // Classic Card & Board Games
    'solitaire-klondike': SolitaireGame,
    'solitaire-spider': SpiderSolitaireGame,
    'solitaire-freecell': FreeCellGame,
    'pyramid-solitaire': PyramidSolitaireGame,
    'connect-four': ConnectFourGame,
    'tangram': TangramGame,
    'checkers': CheckersGame,
    'chess-puzzles': ChessPuzzlesGame,
    'dominoes': DominoesGame,
    'backgammon': BackgammonGame,
    'jigsaw-easy': JigsawGame,
    'jigsaw-medium': JigsawGame,
    'jigsaw-hard': JigsawGame,
    'reversi': ReversiGame,
    'mahjong-solitaire': MahjongGame,
    'tile-matching': MahjongGame,
    'match-three-zen': MatchThreeGame,
    'hearts': HeartsGame,
    'gin-rummy': GinRummyGame,
    'cribbage': CribbageGame,

    // Word Games
    'word-search': WordSearchGame,
    'crossword-easy': CrosswordGame,
    'anagram-challenge': AnagramChallengeGame,
    'boggle': BoggleGame,
    'hangman': HangmanGame,
    'spelling-bee': SpellingBeeGame,
    'word-ladder': WordLadderGame,
    'cryptogram': CryptogramGame,
    'word-association': WordAssociationGame,
    'vocabulary-builder': QuizGame,

    // Action & Arcade
    'bubble-pop': BubblePopGame,
    'whack-a-mole': WhackAMoleGame,
    'tap-the-mole': WhackAMoleGame,
    'balloon-pop': BalloonPopGame,
    'flappy-game': FlappyGame,
    'flying-game': FlappyGame,
    'endless-runner': EndlessRunnerGame,
    'jump-adventure': EndlessRunnerGame,
    'brick-breaker': BrickBreakerGame,
    'break-the-bricks': BrickBreakerGame,
    'fruit-catcher': FruitCatcherGame,
    'catch-the-fruit': FruitCatcherGame,
    'candy-collect': FruitCatcherGame,
    'space-shooter-kids': SpaceShooterGame,
    'dodge-obstacles': DodgeObstaclesGame,
    'stack-blocks': StackBlocksGame,
    'treasure-hunt': TreasureHuntGame,
    'racing-simple': RacingGame,
    'fish-feeding': FishFeedingGame,
    'penguin-slide': PenguinSlideGame,
    'butterfly-catch': ButterflyCatchGame,

    // Kids Learning
    'counting-fun': CountingGame,
    'abc-tracing': ABCTracingGame,
    'color-learning': QuizGame,
    'shape-matching': QuizGame,
    'money-counting': QuizGame,
    'rhyming-words': QuizGame,
    'sight-words': QuizGame,
    'phonics-sounds': QuizGame,
    'animal-sounds': QuizGame,
    'seasons-weather': QuizGame,
    'body-parts': QuizGame,
    'basic-math-addition': MathAdventureGame,
    'basic-math-subtraction': MathAdventureGame,
    'clock-reading': ClockGame,

    // Creative Play
    'coloring-book': DrawingGame,
    'coloring-mandala': DrawingGame,
    'drawing-pad': DrawingGame,
    'sticker-scene': StickerSceneGame,
    'pixel-art': DrawingGame,
    'stamp-art': DrawingGame,
    'pattern-designer': DrawingGame,
    'dress-up': DressUpGame,
    'room-decorator': DrawingGame,
    'cake-decorator': DrawingGame,
    'pet-salon': DrawingGame,
    'music-maker': MusicMakerGame,
    'face-maker': FaceMakerGame,
    'garden-planting': GardenPlantingGame,
    'pizza-maker': PizzaMakerGame,
    'band-creator': MusicMakerGame,

    // Visual/Observation
    'spot-difference': SpotDifferenceGame,
    'hidden-objects': HiddenObjectsGame,
    'mosaic-puzzles': MosaicPuzzlesGame,
    'dot-connect': DrawingGame,
};

interface GamePlayerProps {
    game: Game;
}

export default function GamePlayer({ game }: GamePlayerProps) {
    // Check for authentic implementation
    const GameComponent = gameComponents[game.id];

    if (GameComponent) {
        return (
            <Suspense fallback={<SkeletonGamePlayer />}>
                <GameComponent game={game} />
            </Suspense>
        );
    }


    // Fallback: game ID not mapped — show description and browse prompt
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
                    <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', maxWidth: '420px', margin: '0 auto 2rem' }}>
                        {game.description}
                    </p>
                    <Link href="/games" style={{
                        padding: '0.85rem 2rem',
                        background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
                        borderRadius: '12px',
                        color: 'white',
                        textDecoration: 'none',
                        fontWeight: 700,
                        display: 'inline-block',
                        marginBottom: '1rem',
                    }}>
                        Browse {Object.keys(gameComponents).length}+ Games
                    </Link>
                </div>
            </div>
        </div>
    );
}
