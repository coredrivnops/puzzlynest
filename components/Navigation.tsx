'use client';

import Link from 'next/link';
import SoundControl from './SoundControl';

export default function Navigation() {
    return (
        <nav className="nav">
            <Link href="/" className="nav-logo">
                🧩 PuzzlyNest
            </Link>

            <div className="nav-links">
                <Link href="/games/kids" className="nav-link">
                    👶 Kids
                </Link>
                <Link href="/games/seniors" className="nav-link">
                    🧠 Brain Training
                </Link>
                <Link href="/games" className="nav-link">
                    🎯 All Games
                </Link>
                <Link href="/achievements" className="nav-link">
                    🏆 Achievements
                </Link>
                <SoundControl />
            </div>
        </nav>
    );
}
