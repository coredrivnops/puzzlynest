'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ACHIEVEMENTS, achievementManager } from '@/lib/achievements';
import type { UserProgress } from '@/lib/achievements';
import Link from 'next/link';

export default function AchievementsPage() {
    const [progress, setProgress] = useState<UserProgress | null>(null);

    useEffect(() => {
        setProgress(achievementManager.getProgress());
    }, []);

    if (!progress) {
        return (
            <>
                <Navigation />
                <main style={{
                    background: 'linear-gradient(135deg, #0a0a1a 0%, #0f0f2d 50%, #0a0a1a 100%)',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <div style={{ color: 'rgba(255,255,255,0.7)' }}>Loading...</div>
                </main>
                <Footer />
            </>
        );
    }

    const totalPoints = achievementManager.getTotalPoints();
    const completionPercentage = achievementManager.getCompletionPercentage();
    const dailyChallenge = achievementManager.getDailyChallenge();

    const rarityColors = {
        common: '#10b981',
        rare: '#3b82f6',
        epic: '#8b5cf6',
        legendary: '#f59e0b',
    };

    return (
        <>
            <Navigation />

            {/* Dark background wrapper with animated effects */}
            <main style={{
                background: 'linear-gradient(135deg, #0a0a1a 0%, #0f0f2d 50%, #0a0a1a 100%)',
                minHeight: '100vh',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Animated background orbs */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '5%',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    animation: 'float 20s ease-in-out infinite',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '20%',
                    right: '10%',
                    width: '350px',
                    height: '350px',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    animation: 'float 25s ease-in-out infinite reverse',
                    pointerEvents: 'none',
                }} />

                <div className="container" style={{
                    paddingTop: '2rem',
                    paddingBottom: '4rem',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    {/* Hero Stats Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(139, 92, 246, 0.08))',
                        borderRadius: '24px',
                        padding: '3rem 2rem',
                        marginBottom: '3rem',
                        textAlign: 'center',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        backdropFilter: 'blur(10px)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        {/* Decorative glow */}
                        <div style={{
                            position: 'absolute',
                            top: '-100px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '300px',
                            height: '200px',
                            background: 'radial-gradient(ellipse, rgba(245, 158, 11, 0.2) 0%, transparent 70%)',
                            pointerEvents: 'none',
                        }} />

                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            marginBottom: '0.75rem',
                            position: 'relative',
                        }}>
                            🏆 Achievements
                        </h1>
                        <p style={{
                            fontSize: '1.15rem',
                            color: 'rgba(255,255,255,0.7)',
                            marginBottom: '2.5rem',
                            position: 'relative',
                        }}>
                            Track your gaming progress and unlock rewards!
                        </p>

                        {/* Stats Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                            gap: '1.25rem',
                            maxWidth: '700px',
                            margin: '0 auto 2rem',
                            position: 'relative',
                        }}>
                            {[
                                { icon: '🎮', value: progress.gamesPlayed, label: 'Games Played', color: '#f59e0b' },
                                { icon: '🏅', value: progress.gamesWon, label: 'Games Won', color: '#10b981' },
                                { icon: '⚡', value: progress.currentStreak, label: 'Current Streak', color: '#6366f1' },
                                { icon: '⭐', value: totalPoints, label: 'Total Points', color: '#f59e0b' },
                            ].map((stat, i) => (
                                <div key={i} style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '16px',
                                    padding: '1.25rem 1rem',
                                }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: stat.color }}>
                                        {stat.value}
                                    </div>
                                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Progress Bar */}
                        <div style={{ maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Overall Progress</span>
                                <span style={{ color: '#f59e0b', fontWeight: 600 }}>{completionPercentage}%</span>
                            </div>
                            <div style={{
                                height: '12px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '100px',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${completionPercentage}%`,
                                    background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                                    borderRadius: '100px',
                                    transition: 'width 0.5s ease',
                                    boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)',
                                }} />
                            </div>
                        </div>
                    </div>

                    {/* Daily Challenge */}
                    {dailyChallenge && (
                        <div style={{
                            padding: '2rem',
                            marginBottom: '3rem',
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
                            borderRadius: '20px',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                        }}>
                            <h2 style={{
                                fontSize: '1.5rem',
                                marginBottom: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#fff',
                            }}>
                                📅 Daily Challenge
                            </h2>
                            <p style={{ fontSize: '1.15rem', marginBottom: '0.75rem', color: '#fff' }}>
                                {dailyChallenge.objective}
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
                                Reward: <span style={{ color: '#f59e0b', fontWeight: 600 }}>+{dailyChallenge.reward.points} points</span>
                            </p>
                            <Link
                                href={`/play/${dailyChallenge.gameId}`}
                                style={{
                                    display: 'inline-block',
                                    padding: '0.75rem 2rem',
                                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                    color: '#fff',
                                    borderRadius: '100px',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                                }}
                            >
                                Play Now →
                            </Link>
                        </div>
                    )}

                    {/* Achievements Grid */}
                    <h2 style={{
                        fontSize: '1.75rem',
                        marginBottom: '1.5rem',
                        color: '#fff',
                    }}>
                        All Achievements
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '1.25rem',
                    }}>
                        {ACHIEVEMENTS.map(achievement => {
                            const unlocked = progress.achievements.includes(achievement.id);
                            const color = rarityColors[achievement.rarity];

                            return (
                                <div
                                    key={achievement.id}
                                    style={{
                                        padding: '1.5rem',
                                        opacity: unlocked ? 1 : 0.6,
                                        background: unlocked
                                            ? `linear-gradient(135deg, ${color}10, ${color}05)`
                                            : 'rgba(255,255,255,0.02)',
                                        border: unlocked
                                            ? `2px solid ${color}50`
                                            : '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: '16px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {unlocked && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '12px',
                                            right: '12px',
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            background: color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.9rem',
                                            fontWeight: 700,
                                            color: '#fff',
                                        }}>
                                            ✓
                                        </div>
                                    )}

                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
                                        {unlocked ? achievement.icon : '🔒'}
                                    </div>

                                    <div style={{
                                        display: 'inline-block',
                                        padding: '0.2rem 0.6rem',
                                        background: `${color}20`,
                                        border: `1px solid ${color}50`,
                                        borderRadius: '100px',
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        color: color,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        marginBottom: '0.75rem',
                                    }}>
                                        {achievement.rarity}
                                    </div>

                                    <h3 style={{
                                        fontSize: '1.15rem',
                                        marginBottom: '0.5rem',
                                        color: '#fff',
                                    }}>
                                        {achievement.name}
                                    </h3>
                                    <p style={{
                                        fontSize: '0.875rem',
                                        color: 'rgba(255,255,255,0.6)',
                                        marginBottom: '0.75rem',
                                        lineHeight: 1.5,
                                    }}>
                                        {achievement.description}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.9rem',
                                    }}>
                                        <span style={{ color: '#f59e0b', fontWeight: 600 }}>
                                            +{achievement.points} pts
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
