'use client';

import { useState } from 'react';
import Link from 'next/link';

// Logic Grid Puzzle (Einstein/Zebra Puzzle Lite)
// 3 Categories: Person, Pet, Drink.
// 3 Items each.
// Grid interactions: X (False) or O (True).

// Data
const ITEMS = {
    Person: ['Alice', 'Bob', 'Charlie'],
    Pet: ['Cat', 'Dog', 'Fish'],
    Drink: ['Tea', 'Coffee', 'Juice']
};

const CLUES = [
    'Alice drinks Tea.',
    'Bob owns a Dog.',
    'The Coffee drinker owns a Fish.',
    'Charlie does not own a Cat.'
];

// Solution:
// Alice: Tea. (Pet?)
// Bob: Dog. (Drink?)
// Charlie: (Drink? Pet?)
// Coffee -> Fish.
// If Alice=Tea, Bob=Dog.
// Remaining Drink: Coffee, Juice.
// Remaining Pet: Cat, Fish.
// If Coffee -> Fish, then who drinks Coffee?
// Can't be Alice (Tea). 
// Can be Bob? If Bob=Coffee, Bob=Fish. But Bob=Dog. Contradiction.
// So Bob drinks Juice?
// Then Charlie drinks Coffee.
// If Charlie=Coffee, Charlie=Fish.
// Checks out: Charlie != Cat (Clue 4).
// So:
// Alice: Tea, Cat.
// Bob: Juice, Dog.
// Charlie: Coffee, Fish.

const SOLUTION = {
    'Alice-Tea': true, 'Alice-Coffee': false, 'Alice-Juice': false,
    'Bob-Tea': false, 'Bob-Coffee': false, 'Bob-Juice': true,
    'Charlie-Tea': false, 'Charlie-Coffee': true, 'Charlie-Juice': false,

    'Alice-Cat': true, 'Alice-Dog': false, 'Alice-Fish': false,
    'Bob-Cat': false, 'Bob-Dog': true, 'Bob-Fish': false,
    // ... complete mapping is tedious for hardcoded check.
    // Simpler: Just check specific True interactions.
};

const TRUTH = [
    ['Alice', 'Tea'], ['Alice', 'Cat'],
    ['Bob', 'Juice'], ['Bob', 'Dog'],
    ['Charlie', 'Coffee'], ['Charlie', 'Fish'],
    ['Tea', 'Cat'], ['Juice', 'Dog'], ['Coffee', 'Fish']
];

export default function LogicGridGame() {
    // State: Record "PairString" -> 'O' | 'X' | null
    // Pairs: "Alice-Cat", "Cat-Alice" (normalized sort)
    const [gridState, setGridState] = useState<Record<string, 'O' | 'X' | null>>({});
    const [won, setWon] = useState(false);

    const getPairKey = (a: string, b: string) => [a, b].sort().join('-');
    const getValue = (a: string, b: string) => gridState[getPairKey(a, b)];

    const cycleValue = (a: string, b: string) => {
        const key = getPairKey(a, b);
        const current = gridState[key];
        let next: 'O' | 'X' | null = 'X';
        if (current === 'X') next = 'O';
        else if (current === 'O') next = null;

        const newState = { ...gridState, [key]: next };
        setGridState(newState);
        checkWin(newState);
    };

    const checkWin = (state: Record<string, 'O' | 'X' | null>) => {
        // Check if all Truths are 'O' and no False 'O's?
        // Or just if all Truths are 'O'.
        let correct = true;
        for (const [a, b] of TRUTH) {
            if (state[getPairKey(a, b)] !== 'O') {
                correct = false;
                break;
            }
        }

        // Also ensure no contradictions? 
        // Just checking positive correctness is enough for "You Found It!"
        if (correct) setWon(true);
    };

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper flex flex-col items-center">
                <div className="game-header w-full">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Logic Grid</h1>
                </div>

                {won && <div className="text-emerald-400 text-3xl font-bold mb-4 animate-bounce">Puzzle Solved!</div>}

                <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl bg-white p-4 rounded-xl text-black overflow-auto">
                    {/* Clues */}
                    <div className="min-w-[200px]">
                        <h3 className="font-bold border-b border-black mb-2">Clues</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            {CLUES.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                    </div>

                    {/* Grid */}
                    <div className="flex-1">
                        {/* Headers */}
                        <div className="flex">
                            <div className="w-24"></div> {/* Corner */}
                            <div className="flex">
                                <CategoryHeader label="Pet" items={ITEMS.Pet} />
                                <CategoryHeader label="Drink" items={ITEMS.Drink} />
                            </div>
                        </div>

                        {/* Rows: Person */}
                        <div className="flex">
                            <div className="w-24 flex flex-col justify-end">
                                {ITEMS.Person.map(p => (
                                    <div key={p} className="h-10 flex items-center justify-end pr-2 font-bold">{p}</div>
                                ))}
                            </div>
                            <div className="flex">
                                <GridBlock rows={ITEMS.Person} cols={ITEMS.Pet} onValues={cycleValue} getVal={getValue} />
                                <GridBlock rows={ITEMS.Person} cols={ITEMS.Drink} onValues={cycleValue} getVal={getValue} />
                            </div>
                        </div>

                        {/* Rows: Pet vs Drink (Optional intersection) */}
                        <div className="flex">
                            <div className="w-24 flex flex-col justify-end">
                                {ITEMS.Pet.map(p => (
                                    <div key={p} className="h-10 flex items-center justify-end pr-2 font-bold">{p}</div>
                                ))}
                            </div>
                            <div className="flex">
                                {/* Triangle/Staircase layout usually excludes self-intersection */}
                                {/* Just Pet vs Drink needed */}
                                <div className="w-[124px]"></div> {/* Spacer for Pet-Pet? No */}
                                {/* Actually standard grid layout is staircase. 
                                     Top: Pet, Drink.
                                     Side: Person, Pet.
                                     
                                     Person x Pet
                                     Person x Drink
                                     Pet x Drink
                                 */}
                                <GridBlock rows={ITEMS.Pet} cols={ITEMS.Drink} onValues={cycleValue} getVal={getValue} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CategoryHeader({ label, items }: { label: string, items: string[] }) {
    return (
        <div className="flex flex-col">
            <div className="text-center font-bold border-b border-black">{label}</div>
            <div className="flex">
                {items.map(item => (
                    <div key={item} className="w-10 h-24 flex items-end justify-center pb-2 border-l border-black writing-vertical transform -rotate-180" style={{ writingMode: 'vertical-rl' }}>
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}

function GridBlock({ rows, cols, onValues, getVal }: any) {
    return (
        <div className="border-r-2 border-b-2 border-black">
            {rows.map((r: string) => (
                <div key={r} className="flex">
                    {cols.map((c: string) => {
                        const val = getVal(r, c);
                        return (
                            <button
                                key={c}
                                onClick={() => onValues(r, c)}
                                className={`
                                    w-10 h-10 border-l border-t border-slate-400 flex items-center justify-center text-xl font-bold select-none
                                    ${val === 'O' ? 'text-emerald-600 bg-emerald-100' : val === 'X' ? 'text-rose-600' : 'hover:bg-slate-100'}
                                `}
                            >
                                {val}
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
