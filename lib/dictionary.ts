
export interface DictionaryStats {
    totalWords: number;
    loaded: boolean;
}

let wordList: string[] = [];
let wordSet: Set<string> = new Set();
let isLoaded = false;

export async function loadDictionary(): Promise<DictionaryStats> {
    if (isLoaded) {
        return { totalWords: wordList.length, loaded: true };
    }

    try {
        const response = await fetch('/dictionary.txt');
        const text = await response.text();
        // Split by lines and remove empty strings/whitespace
        wordList = text.split('\n').map(w => w.trim().toLowerCase()).filter(w => w.length > 0);
        wordSet = new Set(wordList);
        isLoaded = true;
        console.log(`Dictionary loaded: ${wordList.length} words`);
        return { totalWords: wordList.length, loaded: true };
    } catch (error) {
        console.error("Failed to load dictionary:", error);
        return { totalWords: 0, loaded: false };
    }
}

export function findPatternMatches(pattern: string): string[] {
    if (!isLoaded) return [];

    // Pattern: "c?t" -> regex "^c.t$"
    const regexStr = "^" + pattern.toLowerCase().replace(/\?/g, ".") + "$";
    const regex = new RegExp(regexStr);

    return wordList.filter(word => regex.test(word));
}

export interface AnagramResult {
    word: string;
    score: number;
}

const SCRABBLE_SCORES: Record<string, number> = {
    'a': 1, 'b': 3, 'c': 3, 'd': 2, 'e': 1, 'f': 4, 'g': 2, 'h': 4, 'i': 1, 'j': 8, 'k': 5, 'l': 1, 'm': 3,
    'n': 1, 'o': 1, 'p': 3, 'q': 10, 'r': 1, 's': 1, 't': 1, 'u': 1, 'v': 4, 'w': 4, 'x': 8, 'y': 4, 'z': 10
};

function calculateScore(word: string): number {
    return word.split('').reduce((sum, char) => sum + (SCRABBLE_SCORES[char] || 0), 0);
}

export function solveAnagram(letters: string): AnagramResult[] {
    if (!isLoaded) return [];

    const inputChars = letters.toLowerCase().replace(/[^a-z?]/g, "").split("");
    const matches: AnagramResult[] = [];

    // Filter words that can be made from inputChars
    // This is a naive implementation; for millions of words, a trie or frequency map is better.
    // Given client-side execution on ~300k words, simple looping is usually "fast enough" (<200ms) for moden JS engines.

    // Optimization: Pre-filter by length
    const maxLen = inputChars.length;
    const candidates = wordList.filter(w => w.length <= maxLen && w.length >= 2);

    for (const word of candidates) {
        if (canMakeWord(word, [...inputChars])) {
            matches.push({
                word,
                score: calculateScore(word)
            });
        }
    }

    // Sort by score (desc), then length (asc)
    return matches.sort((a, b) => b.score - a.score || a.word.length - b.word.length);
}

function canMakeWord(word: string, availableChars: string[]): boolean {
    // Need to handle wildcards '?'
    const chars = [...availableChars]; // Copy

    for (const char of word) {
        const idx = chars.indexOf(char);
        if (idx !== -1) {
            chars.splice(idx, 1);
        } else {
            // Try using a wildcard
            const wildIdx = chars.indexOf('?');
            if (wildIdx !== -1) {
                chars.splice(wildIdx, 1);
            } else {
                return false;
            }
        }
    }
    return true;
}
