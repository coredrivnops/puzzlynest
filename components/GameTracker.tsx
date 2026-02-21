'use client';

import { useEffect } from 'react';
import { trackGameStart } from '@/lib/analytics';

interface GameTrackerProps {
    gameId: string;
    gameName: string;
}

/**
 * Side-effect-only component — renders nothing.
 * Fires a GA4 game_start event when mounted (i.e. when the game page is loaded).
 * Place inside the GamePlayer component so it fires for every game.
 */
export default function GameTracker({ gameId, gameName }: GameTrackerProps) {
    useEffect(() => {
        trackGameStart(gameId, gameName);
        // No cleanup needed — we intentionally fire once on mount
    }, [gameId, gameName]);

    return null;
}
