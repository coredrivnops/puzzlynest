'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { soundManager } from '@/lib/soundManager';
import { achievementManager } from '@/lib/achievements';
import AchievementPopup from '@/components/AchievementPopup';
import type { Achievement } from '@/lib/achievements';

const COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function ColoringBookGame() {
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [canvasData, setCanvasData] = useState<{ [key: string]: string }>({});
    const [currentPage, setCurrentPage] = useState(0);
    const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

    // Simple coloring regions (paths/shapes to color)
    const coloringPages = [
        {
            name: 'Butterfly',
            regions: [
                { id: 'wing1', d: 'M 50 100 Q 20 50 80 50 Q 120 50 100 100 Z', defaultColor: '#e5e7eb' },
                { id: 'wing2', d: 'M 150 100 Q 180 50 120 50 Q 80 50 100 100 Z', defaultColor: '#e5e7eb' },
                { id: 'wing3', d: 'M 50 100 Q 20 150 80 150 Q 120 150 100 100 Z', defaultColor: '#e5e7eb' },
                { id: 'wing4', d: 'M 150 100 Q 180 150 120 150 Q 80 150 100 100 Z', defaultColor: '#e5e7eb' },
                { id: 'body', d: 'M 95 40 L 105 40 L 105 160 L 95 160 Z', defaultColor: '#e5e7eb' },
            ],
        },
        {
            name: 'House',
            regions: [
                { id: 'roof', d: 'M 50 100 L 100 50 L 150 100 Z', defaultColor: '#e5e7eb' },
                { id: 'wall', d: 'M 60 100 L 140 100 L 140 180 L 60 180 Z', defaultColor: '#e5e7eb' },
                { id: 'door', d: 'M 85 130 L 115 130 L 115 180 L 85 180 Z', defaultColor: '#e5e7eb' },
                { id: 'window1', d: 'M 65 110 L 80 110 L 80 125 L 65 125 Z', defaultColor: '#e5e7eb' },
                { id: 'window2', d: 'M 120 110 L 135 110 L 135 125 L 120 125 Z', defaultColor: '#e5e7eb' },
            ],
        },
        {
            name: 'Flower',
            regions: [
                { id: 'petal1', d: 'M 100 80 Q 70 60 100 40 Q 130 60 100 80 Z', defaultColor: '#e5e7eb' },
                { id: 'petal2', d: 'M 100 80 Q 120 50 140 80 Q 120 110 100 80 Z', defaultColor: '#e5e7eb' },
                { id: 'petal3', d: 'M 100 80 Q 130 100 100 120 Q 70 100 100 80 Z', defaultColor: '#e5e7eb' },
                { id: 'petal4', d: 'M 100 80 Q 80 110 60 80 Q 80 50 100 80 Z', defaultColor: '#e5e7eb' },
                { id: 'center', d: 'M 100 80 m -15 0 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0', defaultColor: '#e5e7eb' },
                { id: 'stem', d: 'M 95 95 L 105 95 L 105 180 L 95 180 Z', defaultColor: '#e5e7eb' },
                { id: 'leaf', d: 'M 100 130 Q 130 120 120 140 Q 100 150 100 130 Z', defaultColor: '#e5e7eb' },
            ],
        },
    ];

    const page = coloringPages[currentPage];

    const handleRegionClick = (regionId: string) => {
        const key = `${currentPage}-${regionId}`;
        setCanvasData(prev => ({
            ...prev,
            [key]: selectedColor,
        }));
        soundManager.play('pop');
    };

    const getRegionColor = (regionId: string) => {
        const key = `${currentPage}-${regionId}`;
        return canvasData[key] || page.regions.find(r => r.id === regionId)?.defaultColor || '#e5e7eb';
    };

    const clearPage = () => {
        const newData = { ...canvasData };
        page.regions.forEach(r => {
            delete newData[`${currentPage}-${r.id}`];
        });
        setCanvasData(newData);
        soundManager.play('click');
    };

    const nextPage = () => {
        setCurrentPage((currentPage + 1) % coloringPages.length);
        soundManager.play('click');
    };

    const prevPage = () => {
        setCurrentPage((currentPage - 1 + coloringPages.length) % coloringPages.length);
        soundManager.play('click');
    };

    const saveArt = () => {
        soundManager.play('success');
        const achievements = achievementManager.recordGamePlayed(true, 5, false);
        if (achievements.length > 0) {
            const ach = achievementManager.getAchievement(achievements[0]);
            if (ach) setCurrentAchievement(ach);
        }
    };

    return (
        <div className="game-container">
            {currentAchievement && (
                <AchievementPopup
                    achievement={currentAchievement}
                    onClose={() => setCurrentAchievement(null)}
                />
            )}

            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                        ← Back
                    </Link>
                    <h1 className="game-title">Coloring Book</h1>
                    <span className="game-score">{page.name}</span>
                </div>

                <div style={{ padding: '1rem' }}>
                    {/* Color palette */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem',
                    }}>
                        {COLORS.map(color => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: color,
                                    border: selectedColor === color ? '3px solid white' : '3px solid transparent',
                                    cursor: 'pointer',
                                    boxShadow: selectedColor === color ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                                }}
                            />
                        ))}
                    </div>

                    {/* Canvas */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                    }}>
                        <svg
                            width="300"
                            height="250"
                            style={{
                                background: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                            }}
                        >
                            {page.regions.map(region => (
                                <path
                                    key={region.id}
                                    d={region.d}
                                    fill={getRegionColor(region.id)}
                                    stroke="#333"
                                    strokeWidth="2"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleRegionClick(region.id)}
                                />
                            ))}
                        </svg>
                    </div>

                    {/* Controls */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button className="btn btn-ghost" onClick={prevPage}>
                            ← Previous
                        </button>
                        <button className="btn btn-ghost" onClick={clearPage}>
                            🗑️ Clear
                        </button>
                        <button className="btn btn-primary" onClick={saveArt}>
                            💾 Save Art
                        </button>
                        <button className="btn btn-ghost" onClick={nextPage}>
                            Next →
                        </button>
                    </div>

                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginTop: '1rem', fontSize: '0.875rem' }}>
                        Click on a color, then click on a region to fill it!
                    </p>
                </div>
            </div>
        </div>
    );
}
