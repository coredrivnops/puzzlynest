// Achievement System - Track user progress and unlockables
import { trackAchievementUnlock } from '@/lib/analytics';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    requirement: number; // Number needed to unlock
    category: 'games' | 'wins' | 'streak' | 'perfect' | 'time' | 'special';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    points: number;
}

export interface UserProgress {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    bestStreak: number;
    perfectGames: number;
    totalPlayTime: number; // minutes
    achievements: string[]; // Achievement IDs unlocked
    dailyChallenges: {
        date: string;
        completed: string[];
    };
    lastPlayed: string;
}

export interface DailyChallenge {
    id: string;
    date: string;
    gameId: string;
    objective: string;
    target: number;
    reward: {
        points: number;
        achievement?: string;
    };
}

// Achievement Definitions
export const ACHIEVEMENTS: Achievement[] = [
    // Games Played
    {
        id: 'first-game',
        name: 'First Steps',
        description: 'Play your first game',
        icon: '🎮',
        requirement: 1,
        category: 'games',
        rarity: 'common',
        points: 10,
    },
    {
        id: 'casual-player',
        name: 'Casual Player',
        description: 'Play 10 games',
        icon: '🎯',
        requirement: 10,
        category: 'games',
        rarity: 'common',
        points: 25,
    },
    {
        id: 'dedicated-gamer',
        name: 'Dedicated Gamer',
        description: 'Play 50 games',
        icon: '🏆',
        requirement: 50,
        category: 'games',
        rarity: 'rare',
        points: 100,
    },
    {
        id: 'veteran',
        name: 'Veteran',
        description: 'Play 100 games',
        icon: '👑',
        requirement: 100,
        category: 'games',
        rarity: 'epic',
        points: 250,
    },

    // Wins
    {
        id: 'first-win',
        name: 'Champion',
        description: 'Win your first game',
        icon: '🏅',
        requirement: 1,
        category: 'wins',
        rarity: 'common',
        points: 15,
    },
    {
        id: 'winner',
        name: 'Serial Winner',
        description: 'Win 25 games',
        icon: '🥇',
        requirement: 25,
        category: 'wins',
        rarity: 'rare',
        points: 100,
    },
    {
        id: 'champion',
        name: 'Ultimate Champion',
        description: 'Win 100 games',
        icon: '🔥',
        requirement: 100,
        category: 'wins',
        rarity: 'legendary',
        points: 500,
    },

    // Streaks
    {
        id: 'streak-3',
        name: 'Hot Streak',
        description: 'Win 3 games in a row',
        icon: '⚡',
        requirement: 3,
        category: 'streak',
        rarity: 'common',
        points: 30,
    },
    {
        id: 'streak-5',
        name: 'On Fire',
        description: 'Win 5 games in a row',
        icon: '🔥',
        requirement: 5,
        category: 'streak',
        rarity: 'rare',
        points: 75,
    },
    {
        id: 'streak-10',
        name: 'Unstoppable',
        description: 'Win 10 games in a row',
        icon: '💥',
        requirement: 10,
        category: 'streak',
        rarity: 'legendary',
        points: 200,
    },

    // Perfect Games
    {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Complete a perfect game',
        icon: '💎',
        requirement: 1,
        category: 'perfect',
        rarity: 'rare',
        points: 50,
    },
    {
        id: 'flawless-master',
        name: 'Flawless Master',
        description: 'Complete 10 perfect games',
        icon: '✨',
        requirement: 10,
        category: 'perfect',
        rarity: 'epic',
        points: 200,
    },

    // Time-based
    {
        id: 'speed-demon',
        name: 'Speed Demon',
        description: 'Complete any game in under 1 minute',
        icon: '⚡',
        requirement: 1,
        category: 'time',
        rarity: 'rare',
        points: 50,
    },
    {
        id: 'marathon',
        name: 'Marathon Runner',
        description: 'Play for 60 minutes total',
        icon: '🏃',
        requirement: 60,
        category: 'time',
        rarity: 'epic',
        points: 150,
    },

    // Special
    {
        id: 'daily-challenger',
        name: 'Daily Challenger',
        description: 'Complete a daily challenge',
        icon: '📅',
        requirement: 1,
        category: 'special',
        rarity: 'common',
        points: 25,
    },
    {
        id: 'week-warrior',
        name: 'Week Warrior',
        description: 'Complete daily challenges 7 days in a row',
        icon: '🗓️',
        requirement: 7,
        category: 'special',
        rarity: 'epic',
        points: 200,
    },
    {
        id: 'explorer',
        name: 'Explorer',
        description: 'Play 20 different games',
        icon: '🗺️',
        requirement: 20,
        category: 'special',
        rarity: 'rare',
        points: 100,
    },
];

// Achievement Manager Class
class AchievementManager {
    private storageKey = 'puzzlynest_progress';
    private legacyKey = 'playzen_progress';

    getProgress(): UserProgress {
        if (typeof window === 'undefined') {
            return this.getDefaultProgress();
        }

        // Migrate legacy key if it exists
        const legacy = localStorage.getItem(this.legacyKey);
        if (legacy) {
            localStorage.setItem(this.storageKey, legacy);
            localStorage.removeItem(this.legacyKey);
        }

        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            return JSON.parse(stored);
        }
        return this.getDefaultProgress();
    }

    private getDefaultProgress(): UserProgress {
        return {
            gamesPlayed: 0,
            gamesWon: 0,
            currentStreak: 0,
            bestStreak: 0,
            perfectGames: 0,
            totalPlayTime: 0,
            achievements: [],
            dailyChallenges: {
                date: new Date().toISOString().split('T')[0],
                completed: [],
            },
            lastPlayed: new Date().toISOString(),
        };
    }

    saveProgress(progress: UserProgress) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.storageKey, JSON.stringify(progress));
        }
    }

    recordGamePlayed(won: boolean, playTime: number, perfect: boolean = false): string[] {
        const progress = this.getProgress();
        const newAchievements: string[] = [];

        // Update stats
        progress.gamesPlayed++;
        progress.totalPlayTime += playTime;
        progress.lastPlayed = new Date().toISOString();

        if (won) {
            progress.gamesWon++;
            progress.currentStreak++;
            progress.bestStreak = Math.max(progress.bestStreak, progress.currentStreak);

            if (perfect) {
                progress.perfectGames++;
            }
        } else {
            progress.currentStreak = 0;
        }

        // Check for new achievements
        ACHIEVEMENTS.forEach(achievement => {
            if (progress.achievements.includes(achievement.id)) return;

            let unlocked = false;

            switch (achievement.category) {
                case 'games':
                    unlocked = progress.gamesPlayed >= achievement.requirement;
                    break;
                case 'wins':
                    unlocked = progress.gamesWon >= achievement.requirement;
                    break;
                case 'streak':
                    unlocked = progress.currentStreak >= achievement.requirement;
                    break;
                case 'perfect':
                    unlocked = progress.perfectGames >= achievement.requirement;
                    break;
                case 'time':
                    if (achievement.id === 'speed-demon') {
                        unlocked = playTime <= 1;
                    } else {
                        unlocked = progress.totalPlayTime >= achievement.requirement;
                    }
                    break;
            }

            if (unlocked) {
                progress.achievements.push(achievement.id);
                newAchievements.push(achievement.id);
                // Fire GA4 event immediately on unlock
                trackAchievementUnlock(achievement.id, achievement.name);
            }
        });

        this.saveProgress(progress);
        return newAchievements;
    }

    getAchievement(id: string): Achievement | undefined {
        return ACHIEVEMENTS.find(a => a.id === id);
    }

    getTotalPoints(): number {
        const progress = this.getProgress();
        return progress.achievements.reduce((total, id) => {
            const achievement = this.getAchievement(id);
            return total + (achievement?.points || 0);
        }, 0);
    }

    getCompletionPercentage(): number {
        const progress = this.getProgress();
        return Math.round((progress.achievements.length / ACHIEVEMENTS.length) * 100);
    }

    // Daily Challenges
    getDailyChallenge(): DailyChallenge | null {
        const today = new Date().toISOString().split('T')[0];
        const seed = this.dateSeed(today);

        // Simple rotation based on date
        const gameIds = [
            'memory-match', 'sudoku-classic', 'word-search', 'bubble-pop',
            'counting-fun', 'solitaire-klondike', 'simon-says', 'color-learning',
        ];

        const objectives = [
            { text: 'Win in under 2 minutes', target: 2 },
            { text: 'Complete with no mistakes', target: 0 },
            { text: 'Score 500+ points', target: 500 },
            { text: 'Win 3 times', target: 3 },
        ];

        const gameIndex = seed % gameIds.length;
        const objIndex = Math.floor(seed / gameIds.length) % objectives.length;

        return {
            id: `daily-${today}`,
            date: today,
            gameId: gameIds[gameIndex],
            objective: objectives[objIndex].text,
            target: objectives[objIndex].target,
            reward: {
                points: 50,
            },
        };
    }

    private dateSeed(dateStr: string): number {
        return dateStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    }

    completeDailyChallenge(challengeId: string) {
        const progress = this.getProgress();
        const today = new Date().toISOString().split('T')[0];

        if (progress.dailyChallenges.date !== today) {
            progress.dailyChallenges = { date: today, completed: [] };
        }

        if (!progress.dailyChallenges.completed.includes(challengeId)) {
            progress.dailyChallenges.completed.push(challengeId);
        }

        this.saveProgress(progress);
    }
}

export const achievementManager = new AchievementManager();
