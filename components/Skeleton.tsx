'use client';

import React from 'react';

// Base skeleton block with shimmer animation
const SkeletonBlock = ({
    width = '100%',
    height = '1rem',
    borderRadius = '0.5rem',
    className = ''
}: {
    width?: string;
    height?: string;
    borderRadius?: string;
    className?: string;
}) => (
    <div
        className={`skeleton-block ${className}`}
        style={{
            width,
            height,
            borderRadius,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
            backgroundSize: '200% 100%',
            animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
        }}
    />
);

// Skeleton for game cards
export function SkeletonGameCard() {
    return (
        <div
            className="card"
            style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                minHeight: '200px',
            }}
        >
            {/* Icon placeholder */}
            <SkeletonBlock width="4rem" height="4rem" borderRadius="1rem" />

            {/* Title placeholder */}
            <SkeletonBlock width="80%" height="1.25rem" />

            {/* Description placeholders */}
            <SkeletonBlock width="100%" height="0.875rem" />
            <SkeletonBlock width="60%" height="0.875rem" />

            {/* Tags/badges */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <SkeletonBlock width="4rem" height="1.5rem" borderRadius="1rem" />
                <SkeletonBlock width="3rem" height="1.5rem" borderRadius="1rem" />
            </div>
        </div>
    );
}

// Skeleton for game grid
export function SkeletonGameGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="game-grid">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonGameCard key={i} />
            ))}
        </div>
    );
}

// Skeleton for game player area
export function SkeletonGamePlayer() {
    return (
        <div
            className="container"
            style={{ paddingTop: '6rem' }}
        >
            {/* Back button */}
            <SkeletonBlock width="8rem" height="2.5rem" borderRadius="0.5rem" />

            {/* Game title */}
            <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                <SkeletonBlock width="60%" height="2rem" />
            </div>

            {/* Game description */}
            <div style={{ marginBottom: '1.5rem' }}>
                <SkeletonBlock width="100%" height="1rem" />
                <div style={{ marginTop: '0.5rem' }}>
                    <SkeletonBlock width="75%" height="1rem" />
                </div>
            </div>

            {/* Game area */}
            <div
                className="card"
                style={{
                    padding: '2rem',
                    minHeight: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                }}
            >
                <SkeletonBlock width="80%" height="300px" borderRadius="1rem" />
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <SkeletonBlock width="6rem" height="2.5rem" borderRadius="0.5rem" />
                    <SkeletonBlock width="6rem" height="2.5rem" borderRadius="0.5rem" />
                </div>
            </div>
        </div>
    );
}

// Skeleton for category/section header
export function SkeletonSectionHeader() {
    return (
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
            <SkeletonBlock width="12rem" height="1.75rem" />
            <SkeletonBlock width="8rem" height="2.5rem" borderRadius="0.5rem" />
        </div>
    );
}

// Full page skeleton
export function SkeletonPage() {
    return (
        <div className="container" style={{ paddingTop: '6rem' }}>
            <SkeletonSectionHeader />
            <SkeletonGameGrid count={6} />
        </div>
    );
}

// CSS keyframe animation (add to globals.css)
export const skeletonStyles = `
@keyframes skeleton-shimmer {
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
}

.skeleton-block {
    position: relative;
    overflow: hidden;
}
`;

export default SkeletonBlock;
