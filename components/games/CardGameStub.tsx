'use client';

import Link from 'next/link';

export default function CardGameStub({ game }: { game: any }) {
    return (
        <div className="game-container">
            <div className="game-canvas-wrapper flex flex-col items-center justify-center">
                <div className="game-header w-full absolute top-0 left-0 p-4">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                </div>

                <div className="text-center p-8 bg-slate-800 rounded-2xl shadow-xl border border-slate-700">
                    <div className="text-6xl mb-4">🃏</div>
                    <h1 className="text-4xl font-bold text-white mb-4">{game.name}</h1>
                    <p className="text-slate-300 text-lg mb-6">
                        Our developers are currently refining the AI strategy for this classic card game.
                        <br />We want to ensure a challenging and fair opponent for you!
                    </p>
                    <p className="text-indigo-400 font-bold">Coming Soon.</p>
                </div>
            </div>
        </div>
    );
}
