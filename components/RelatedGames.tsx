'use client';

import Link from 'next/link';
import type { Game } from '@/lib/games';

// Category metadata for display labels and colors
const CATEGORY_META: Record<string, { label: string; emoji: string; color: string }> = {
    'brain-training': { label: 'Brain Training', emoji: '🧠', color: '#6366f1' },
    'classic-games': { label: 'Classic Games', emoji: '🎴', color: '#8b5cf6' },
    'word-games': { label: 'Word Games', emoji: '📝', color: '#ec4899' },
    'learning-fun': { label: 'Learning & Fun', emoji: '🎓', color: '#f59e0b' },
    'action-arcade': { label: 'Action & Arcade', emoji: '🎮', color: '#10b981' },
    'creative-play': { label: 'Creative Play', emoji: '🎨', color: '#3b82f6' },
};

const DIFFICULTY_STARS: Record<string, string> = {
    easy: '⭐',
    medium: '⭐⭐',
    hard: '⭐⭐⭐',
};

interface RelatedGamesProps {
    games: Game[];
    currentCategory: string;
}

export default function RelatedGames({ games, currentCategory }: RelatedGamesProps) {
    if (!games || games.length === 0) return null;

    const meta = CATEGORY_META[currentCategory] ?? { label: currentCategory.replace(/-/g, ' '), emoji: '🎮', color: '#6366f1' };

    return (
        <section
            aria-label="Related games"
            style={{ marginBottom: '2rem' }}
        >
            {/* Section header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                flexWrap: 'wrap',
                gap: '0.5rem',
            }}>
                <h2 style={{
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                }}>
                    <span>{meta.emoji}</span>
                    More {meta.label} Games
                </h2>
                <Link
                    href={`/category/${currentCategory}`}
                    style={{
                        fontSize: '0.875rem',
                        color: meta.color,
                        textDecoration: 'none',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.4rem 0.85rem',
                        borderRadius: '100px',
                        background: `${meta.color}18`,
                        border: `1px solid ${meta.color}30`,
                        transition: 'all 0.2s',
                    }}
                    aria-label={`View all ${meta.label} games`}
                >
                    View all →
                </Link>
            </div>

            {/* Cards grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem',
            }}>
                {games.map((game) => (
                    <Link
                        key={game.id}
                        href={`/play/${game.id}`}
                        id={`related-game-${game.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                        aria-label={`Play ${game.name}`}
                    >
                        <article
                            style={{
                                background: 'rgba(30,30,60,0.6)',
                                backdropFilter: 'blur(12px)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                padding: '1.25rem',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                                transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.transform = 'translateY(-4px)';
                                el.style.background = 'rgba(99,102,241,0.15)';
                                el.style.borderColor = `${meta.color}40`;
                                el.style.boxShadow = `0 12px 32px ${meta.color}25`;
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.transform = 'translateY(0)';
                                el.style.background = 'rgba(30,30,60,0.6)';
                                el.style.borderColor = 'rgba(255,255,255,0.08)';
                                el.style.boxShadow = 'none';
                            }}
                        >
                            {/* Category badge + difficulty */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    color: meta.color,
                                    background: `${meta.color}18`,
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '100px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                }}>
                                    {meta.label}
                                </span>
                                <span
                                    style={{ fontSize: '0.75rem' }}
                                    title={`Difficulty: ${game.difficulty}`}
                                    aria-label={`Difficulty: ${game.difficulty}`}
                                >
                                    {DIFFICULTY_STARS[game.difficulty]}
                                </span>
                            </div>

                            {/* Game name */}
                            <h3 style={{
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: '#fff',
                                lineHeight: 1.3,
                                margin: 0,
                            }}>
                                {game.name}
                            </h3>

                            {/* Description */}
                            <p style={{
                                fontSize: '0.825rem',
                                color: 'rgba(255,255,255,0.55)',
                                lineHeight: 1.5,
                                flex: 1,
                                margin: 0,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            } as React.CSSProperties}>
                                {game.description}
                            </p>

                            {/* Footer: play time + play button */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: '0.5rem',
                                borderTop: '1px solid rgba(255,255,255,0.06)',
                                marginTop: 'auto',
                            }}>
                                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                                    ⏱ {game.estimatedPlayTime} min
                                </span>
                                <span style={{
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    color: meta.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                }}>
                                    Play ▶
                                </span>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </section>
    );
}
