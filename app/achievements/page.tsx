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
        return <div>Loading...</div>;
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

            <main className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                {/* Hero Stats */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.1))',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: '3rem',
                    marginBottom: '3rem',
                    textAlign: 'center',
                }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆 Achievements</h1>
                    <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
                        Track your gaming progress and unlock rewards!
                    </p>

                    {/* Stats Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '1.5rem',
                        maxWidth: '800px',
                        margin: '0 auto',
                    }}>
                        <div className="feature-box">
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎮</div>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>
                                {progress.gamesPlayed}
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.6)' }}>Games Played</div>
                        </div>

                        <div className="feature-box">
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏅</div>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>
                                {progress.gamesWon}
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.6)' }}>Games Won</div>
                        </div>

                        <div className="feature-box">
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚡</div>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
                                {progress.currentStreak}
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.6)' }}>Current Streak</div>
                        </div>

                        <div className="feature-box">
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⭐</div>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>
                                {totalPoints}
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.6)' }}>Total Points</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginTop: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Overall Progress</span>
                            <span>{completionPercentage}%</span>
                        </div>
                        <div style={{
                            height: '24px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '100px',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${completionPercentage}%`,
                                background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                                transition: 'width 0.5s ease',
                            }} />
                        </div>
                    </div>
                </div>

                {/* Daily Challenge */}
                {dailyChallenge && (
                    <div className="card" style={{ padding: '2rem', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            📅 Daily Challenge
                        </h2>
                        <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
                            {dailyChallenge.objective}
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>
                            Reward: <span style={{ color: 'var(--accent)', fontWeight: 600 }}>+{dailyChallenge.reward.points} points</span>
                        </p>
                        <Link href={`/play/${dailyChallenge.gameId}`} className="btn btn-primary">
                            Play Now →
                        </Link>
                    </div>
                )}

                {/* Achievements Grid */}
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>All Achievements</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1.5rem',
                }}>
                    {ACHIEVEMENTS.map(achievement => {
                        const unlocked = progress.achievements.includes(achievement.id);
                        const color = rarityColors[achievement.rarity];

                        return (
                            <div
                                key={achievement.id}
                                className="card"
                                style={{
                                    padding: '1.5rem',
                                    opacity: unlocked ? 1 : 0.5,
                                    border: unlocked ? `2px solid ${color}` : '1px solid rgba(255, 255, 255, 0.1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                {unlocked && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.25rem',
                                    }}>
                                        ✓
                                    </div>
                                )}

                                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                                    {unlocked ? achievement.icon : '🔒'}
                                </div>

                                <div style={{
                                    display: 'inline-block',
                                    padding: '0.25rem 0.75rem',
                                    background: `${color}30`,
                                    border: `1px solid ${color}`,
                                    borderRadius: '100px',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    color: color,
                                    textTransform: 'uppercase',
                                    marginBottom: '0.75rem',
                                }}>
                                    {achievement.rarity}
                                </div>

                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                                    {achievement.name}
                                </h3>
                                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem' }}>
                                    {achievement.description}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                                        +{achievement.points} pts
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            <Footer />
        </>
    );
}
