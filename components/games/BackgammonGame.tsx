'use client';

import Link from 'next/link';

export default function BackgammonGame() {
    return (
        <div className="game-container">
            <div className="game-canvas-wrapper flex flex-col items-center justify-center">
                <div className="game-header w-full absolute top-0 left-0 p-4">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                </div>

                <div className="text-center p-8 bg-slate-800 rounded-2xl shadow-xl border border-slate-700">
                    <div className="text-6xl mb-4">🎲</div>
                    <h1 className="text-4xl font-bold text-white mb-4">Backgammon</h1>
                    <p className="text-slate-300 text-lg mb-6">
                        This expert game is currently under development. <br />
                        Our team is crafting the perfect AI opponent for you!
                    </p>
                    <p className="text-indigo-400 font-bold">Coming in the next update.</p>
                    <Link href="/" className="mt-8 inline-block px-8 py-3 bg-emerald-600 rounded-lg text-white font-bold hover:bg-emerald-500 transition">
                        Choose Another Game
                    </Link>
                </div>
            </div>
        </div>
    );
}
