'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Game } from '@/lib/games';

interface GameCardProps {
    game: Game;
}

const categoryColors: Record<string, string> = {
    'brain-training': '#6366f1',
    'classic-games': '#8b5cf6',
    'word-games': '#ec4899',
    'learning-fun': '#f59e0b',
    'action-arcade': '#10b981',
    'creative-play': '#3b82f6',
};

// Game-specific icons with animations
const gameIcons: Record<string, string> = {
    // Brain Training
    'sudoku-classic': '🔢',
    'sudoku-mini': '🧮',
    'memory-match': '🃏',
    'pattern-master': '🔷',
    'number-sequence': '1️⃣2️⃣3️⃣',
    'spot-difference': '👀',
    'logic-grid': '📊',
    'mental-math': '➕',
    'memory-cards-advanced': '🎴',
    'kakuro': '🔢',
    'nonogram': '🖼️',
    'brain-teasers': '🤔',
    'color-match': '🌈',
    'number-bonds': '🔗',
    'spatial-reasoning': '🧊',

    // Classic Games
    'solitaire-klondike': '🂡',
    'solitaire-spider': '🕷️',
    'solitaire-freecell': '🎴',
    'mahjong-solitaire': '🀄',
    'checkers': '⚫',
    'chess-puzzles': '♟️',
    'dominoes': '🀱',
    'backgammon': '🎲',
    'reversi': '⚫⚪',
    'connect-four': '🔴🟡',
    'minesweeper': '💣',
    'hearts': '❤️',
    'gin-rummy': '🃏',
    'cribbage': '🎯',
    'pyramid-solitaire': '🔺',

    // Word Games
    'word-search': '🔍',
    'crossword-easy': '📝',
    'anagram-challenge': '🔤',
    'word-ladder': '🪜',
    'hangman': '👨‍⚖️',
    'spelling-bee': '🐝',
    'boggle': '🔠',
    'cryptogram': '🔐',
    'word-association': '💭',
    'vocabulary-builder': '📚',

    // Kids Learning
    'counting-fun': '🔢',
    'abc-tracing': '✏️',
    'shape-matching': '⭐',
    'color-learning': '🎨',
    'basic-math-addition': '➕',
    'basic-math-subtraction': '➖',
    'clock-reading': '🕐',
    'money-counting': '💰',
    'rhyming-words': '🎵',
    'sight-words': '👁️',
    'phonics-sounds': '🔊',
    'pattern-completion': '🧩',
    'animal-sounds': '🐶',
    'seasons-weather': '☀️',
    'body-parts': '🙋',

    // Action & Arcade
    'bubble-pop': '🫧',
    'whack-a-mole': '🐹',
    'catch-the-fruit': '🍎',
    'jump-adventure': '🦘',
    'balloon-pop': '🎈',
    'endless-runner': '🏃',
    'space-shooter-kids': '🚀',
    'dodge-obstacles': '⚡',
    'stack-blocks': '🧱',
    'flying-game': '🐦',
    'treasure-hunt': '💎',
    'racing-simple': '🏎️',
    'candy-collect': '🍬',
    'animal-memory': '🐻',
    'simon-says': '🔴🟡🟢🔵',
    'tap-the-mole': '👆',
    'break-the-bricks': '🧱',
    'fish-feeding': '🐠',
    'penguin-slide': '🐧',
    'butterfly-catch': '🦋',

    // Creative Play
    'coloring-book': '🖍️',
    'drawing-pad': '🎨',
    'sticker-scene': '🌟',
    'dress-up': '👗',
    'music-maker': '🎹',
    'pixel-art': '🎮',
    'face-maker': '😀',
    'room-decorator': '🏠',
    'cake-decorator': '🎂',
    'pet-salon': '🐕',
    'garden-planting': '🌱',
    'pizza-maker': '🍕',
    'band-creator': '🎸',
    'stamp-art': '✉️',
    'pattern-designer': '🌀',

    // Relaxation
    'jigsaw-easy': '🧩',
    'jigsaw-medium': '🧩',
    'jigsaw-hard': '🧩',
    'coloring-mandala': '🕉️',
    'tangram': '📐',
    'match-three-zen': '💎',
    'tile-matching': '🀄',
    'hidden-objects': '🔍',
    'mosaic-puzzles': '🎨',
    'dot-connect': '⚫',
};

const difficultyColors: Record<string, string> = {
    easy: '#10b981',
    medium: '#f59e0b',
    hard: '#ef4444',
};

export default function GameCard({ game }: GameCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const bgColor = categoryColors[game.category] || '#6366f1';
    const icon = gameIcons[game.id] || '🎮';
    const difficultyColor = difficultyColors[game.difficulty] || '#6366f1';

    return (
        <Link
            href={`/play/${game.id}`}
            className="game-card-premium"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                textDecoration: 'none',
                position: 'relative',
                display: 'block',
            }}
        >
            <div className="game-card-wrapper" style={{
                position: 'relative',
                background: `linear-gradient(135deg, ${bgColor}20 0%, ${bgColor}05 100%)`,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${bgColor}40`,
                borderRadius: 'var(--border-radius)',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transform: isHovered ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
                boxShadow: isHovered
                    ? `0 20px 60px ${bgColor}60, 0 0 0 1px ${bgColor}80`
                    : `0 4px 20px ${bgColor}20`,
                minHeight: '280px',
            }}>

                {/* Animated Background Gradient */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle at ${isHovered ? '50%' : '150%'} ${isHovered ? '50%' : '150%'}, ${bgColor}40, transparent 70%)`,
                    transition: 'all 0.6s ease',
                    zIndex: 0,
                }} />

                {/* Premium Badge for Featured Games */}
                {game.premium && (
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '100px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#0f0f23',
                        zIndex: 3,
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                        animation: 'pulse-scale 2s ease-in-out infinite',
                    }}>
                        ⭐ PREMIUM
                    </div>
                )}

                {/* Large Animated Icon */}
                <div style={{
                    position: 'relative',
                    padding: '2rem 2rem 1rem',
                    textAlign: 'center',
                    zIndex: 1,
                }}>
                    <div style={{
                        fontSize: '5rem',
                        lineHeight: 1,
                        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
                        transform: isHovered ? 'scale(1.2) rotate(5deg)' : 'scale(1) rotate(0deg)',
                        transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                        display: 'inline-block',
                    }}>
                        {icon}
                    </div>

                    {/* Floating Particles on Hover */}
                    {isHovered && (
                        <>
                            <div className="game-card-particle" style={{
                                position: 'absolute',
                                width: '8px',
                                height: '8px',
                                background: bgColor,
                                borderRadius: '50%',
                                top: '30%',
                                left: '20%',
                                animation: 'particle-float 2s ease-in-out infinite',
                                boxShadow: `0 0 10px ${bgColor}`,
                            }} />
                            <div className="game-card-particle" style={{
                                position: 'absolute',
                                width: '6px',
                                height: '6px',
                                background: difficultyColor,
                                borderRadius: '50%',
                                top: '40%',
                                right: '25%',
                                animation: 'particle-float 2.5s ease-in-out infinite',
                                animationDelay: '0.5s',
                                boxShadow: `0 0 8px ${difficultyColor}`,
                            }} />
                            <div className="game-card-particle" style={{
                                position: 'absolute',
                                width: '10px',
                                height: '10px',
                                background: '#fbbf24',
                                borderRadius: '50%',
                                bottom: '30%',
                                left: '30%',
                                animation: 'particle-float 3s ease-in-out infinite',
                                animationDelay: '1s',
                                boxShadow: '0 0 12px #fbbf24',
                            }} />
                        </>
                    )}
                </div>

                {/* Game Content */}
                <div style={{
                    position: 'relative',
                    padding: '0 1.5rem 1.5rem',
                    zIndex: 2,
                }}>
                    <h3 style={{
                        fontSize: '1.35rem',
                        fontWeight: 700,
                        marginBottom: '0.5rem',
                        color: 'white',
                        textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        transition: 'color 0.3s ease',
                    }}>
                        {game.name}
                    </h3>

                    <p style={{
                        fontSize: '0.9rem',
                        color: 'rgba(255,255,255,0.8)',
                        marginBottom: '1rem',
                        lineHeight: 1.5,
                    }}>
                        {game.description}
                    </p>

                    {/* Enhanced Badges */}
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}>
                        {/* Difficulty Badge with Color */}
                        <span style={{
                            padding: '0.35rem 0.9rem',
                            background: `${difficultyColor}30`,
                            border: `2px solid ${difficultyColor}80`,
                            borderRadius: '100px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: difficultyColor,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            boxShadow: `0 0 10px ${difficultyColor}40`,
                        }}>
                            {game.difficulty}
                        </span>

                        {/* Time Indicator with Icon */}
                        <span style={{
                            padding: '0.35rem 0.9rem',
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '100px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                        }}>
                            ⏱ {game.estimatedPlayTime} min
                        </span>

                        {/* Age Group Badge */}
                        <span style={{
                            padding: '0.35rem 0.9rem',
                            background: game.ageGroup === 'kids'
                                ? 'rgba(16, 185, 129, 0.2)'
                                : game.ageGroup === 'seniors'
                                    ? 'rgba(139, 92, 246, 0.2)'
                                    : 'rgba(99, 102, 241, 0.2)',
                            borderRadius: '100px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'white',
                        }}>
                            {game.ageGroup === 'kids' ? '👶' : game.ageGroup === 'seniors' ? '🧠' : '🎯'}
                        </span>
                    </div>
                </div>

                {/* Shine Effect on Hover */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: isHovered ? '100%' : '-100%',
                    width: '50%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                    transform: 'skewX(-20deg)',
                    transition: 'left 0.7s ease',
                    pointerEvents: 'none',
                    zIndex: 4,
                }} />
            </div>
        </Link>
    );
}
