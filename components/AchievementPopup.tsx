'use client';

import { useEffect, useState } from 'react';
import type { Achievement } from '@/lib/achievements';
import { soundManager } from '@/lib/soundManager';

interface AchievementPopupProps {
    achievement: Achievement;
    onClose: () => void;
}

export default function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        soundManager.play('achievement');
        setIsVisible(true);

        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const rarityColors = {
        common: '#10b981',
        rare: '#3b82f6',
        epic: '#8b5cf6',
        legendary: '#f59e0b',
    };

    const rarityColor = rarityColors[achievement.rarity];

    return (
        <div style={{
            position: 'fixed',
            top: '100px',
            right: isVisible ? '20px' : '-400px',
            width: '350px',
            background: 'rgba(30, 30, 60, 0.98)',
            backdropFilter: 'blur(20px)',
            border: `2px solid ${rarityColor}`,
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: `0 20px 60px ${rarityColor}60, 0 0 40px ${rarityColor}40`,
            zIndex: 10000,
            transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            animation: isVisible ? 'achievement-bounce 0.6s ease' : 'none',
        }}>
            {/* Confetti Effect */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                borderRadius: '16px',
            }}>
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            width: '8px',
                            height: '8px',
                            background: i % 2 === 0 ? rarityColor : '#fbbf24',
                            borderRadius: '50%',
                            top: '50%',
                            left: '50%',
                            animation: `confetti-burst 1s ease-out ${i * 0.1}s`,
                            transform: `rotate(${i * 36}deg) translateY(-100px)`,
                            opacity: 0,
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{
                    fontSize: '4rem',
                    marginBottom: '0.5rem',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                    animation: 'pulse-scale 2s ease-in-out infinite',
                }}>
                    {achievement.icon}
                </div>

                <div style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    background: `${rarityColor}30`,
                    border: `1px solid ${rarityColor}`,
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: rarityColor,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.5rem',
                }}>
                    {achievement.rarity}
                </div>
            </div>

            {/* Content */}
            <div style={{ textAlign: 'center' }}>
                <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    color: 'white',
                }}>
                    Achievement Unlocked!
                </h3>

                <p style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: rarityColor,
                    marginBottom: '0.5rem',
                }}>
                    {achievement.name}
                </p>

                <p style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.7)',
                    marginBottom: '1rem',
                }}>
                    {achievement.description}
                </p>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1rem',
                }}>
                    <div style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '100px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                    }}>
                        +{achievement.points} Points
                    </div>
                </div>
            </div>

            {/* Close Button */}
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }}
                style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
            >
                ×
            </button>
        </div>
    );
}
