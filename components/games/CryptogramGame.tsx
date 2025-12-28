'use client';

import React, { useState, useEffect } from 'react';

const QUOTES = [
    { text: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG", author: "Pangram" },
    { text: "TO BE OR NOT TO BE THAT IS THE QUESTION", author: "Shakespeare" },
    { text: "I THINK THEREFORE I AM", author: "Descartes" },
    { text: "KNOWLEDGE IS POWER", author: "Francis Bacon" },
    { text: "MAY THE FORCE BE WITH YOU", author: "Star Wars" },
    { text: "LIFE IS LIKE A BOX OF CHOCOLATES", author: "Forrest Gump" },
    { text: "KEEP CALM AND CARRY ON", author: "Poster" },
    { text: "THE ONLY THING WE HAVE TO FEAR IS FEAR ITSELF", author: "FDR" },
];

export default function CryptogramGame() {
    const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0);
    const [cipher, setCipher] = useState<Record<string, string>>({});
    const [userMap, setUserMap] = useState<Record<string, string>>({});
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [completed, setCompleted] = useState(false);

    const quote = QUOTES[currentQuoteIdx];

    useEffect(() => {
        setupGame();
    }, [currentQuoteIdx]);

    const setupGame = () => {
        // Generate Cipher
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const shuffled = [...alphabet].sort(() => Math.random() - 0.5);
        const map: Record<string, string> = {}; // Plain -> Cipher

        // Ensure no fixed points (A->A)
        // Simple shuffle usually enough? 
        alphabet.forEach((char, i) => {
            map[char] = shuffled[i];
        });

        setCipher(map);
        setUserMap({});
        setSelectedLetter(null);
        setCompleted(false);
        setMessage('Decode the message!');
    };

    const handleCellClick = (encryptedChar: string) => {
        if (!/[A-Z]/.test(encryptedChar)) return;
        setSelectedLetter(encryptedChar);
    };

    const handleKeyInput = (e: React.KeyboardEvent) => {
        if (!selectedLetter || completed) return;

        const key = e.key.toUpperCase();
        if (/[A-Z]/.test(key) && key.length === 1) {
            setUserMap(prev => ({
                ...prev,
                [selectedLetter]: key
            }));
            // Auto advance? No, logic is tricky since same letter appears multiple times.
        } else if (key === 'BACKSPACE' || key === 'DELETE') {
            const newMap = { ...userMap };
            delete newMap[selectedLetter];
            setUserMap(newMap);
        }
    };

    // Check completion
    useEffect(() => {
        if (Object.keys(userMap).length === 0) return;

        const plainText = quote.text.toUpperCase();
        let correct = true;
        let filled = true;

        for (const char of plainText) {
            if (/[A-Z]/.test(char)) {
                // Determine encrypted char
                const encrypted = cipher[char];
                // Check user guess
                if (userMap[encrypted] !== char) {
                    correct = false;
                }
                if (!userMap[encrypted]) filled = false;
            }
        }

        if (filled && correct) {
            setCompleted(true);
            setMessage('Decoded! 🎉');
        } else if (filled && !correct) {
            setMessage('Something is wrong...');
        }
    }, [userMap, cipher, quote]);

    const nextQuote = () => {
        setCurrentQuoteIdx(prev => (prev + 1) % QUOTES.length);
    };

    // Calculate display
    const words = quote.text.split(' ');

    return (
        <div
            className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-4xl mx-auto p-4 focus:outline-none"
            onKeyDown={handleKeyInput}
            tabIndex={0}
        >
            <div className="flex justify-between w-full max-w-2xl mb-8">
                <button
                    onClick={setupGame}
                    className="px-4 py-2 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition"
                >
                    Reset
                </button>
                <div className="text-xl font-bold text-indigo-400">{completed ? 'Success!' : 'Cryptogram'}</div>
                <button
                    onClick={nextQuote}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition"
                >
                    Next
                </button>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-6 justify-center max-w-3xl">
                {words.map((word, wIdx) => (
                    <div key={wIdx} className="flex gap-1">
                        {word.split('').map((char, cIdx) => {
                            const encrypted = cipher[char] || char; // Should always exist for A-Z
                            const userChar = userMap[encrypted] || '';
                            const isSelected = selectedLetter === encrypted;

                            return (
                                <div key={cIdx} className="flex flex-col items-center">
                                    <div
                                        onClick={() => handleCellClick(encrypted)}
                                        className={`
                                            w-8 h-10 sm:w-10 sm:h-12 border-b-4 flex items-center justify-center text-xl font-bold cursor-pointer transition-colors
                                            ${isSelected ? 'bg-indigo-600/30 border-indigo-500' : 'border-slate-500'}
                                            ${userChar ? 'text-white' : 'text-transparent'}
                                            ${completed ? 'text-emerald-400 border-emerald-500' : ''}
                                        `}
                                    >
                                        {userChar}
                                    </div>
                                    <div
                                        className={`
                                            mt-1 text-sm font-medium
                                            ${isSelected ? 'text-indigo-300' : 'text-slate-500'}
                                        `}
                                    >
                                        {encrypted}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className={`mt-12 text-center transition-opacity duration-500 ${completed ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-slate-400 italic mb-2">- {quote.author}</div>
                <button
                    onClick={nextQuote}
                    className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg animate-bounce"
                >
                    Next Quote
                </button>
            </div>

            <div className="mt-8 text-slate-500 text-sm">
                Click a letter code (bottom) and type the replacement letter on your keyboard!
            </div>

            {/* Virtual Keyboard for Mobile */}
            <div className="mt-8 grid grid-cols-10 gap-1 sm:hidden w-full max-w-md">
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(char => (
                    <button
                        key={char}
                        onClick={() => {
                            if (selectedLetter) setUserMap(prev => ({ ...prev, [selectedLetter]: char }));
                        }} // Simulated key press
                        className="p-2 bg-slate-700 rounded text-white font-bold active:bg-indigo-600"
                    >
                        {char}
                    </button>
                ))}
                <button
                    onClick={() => {
                        if (selectedLetter) {
                            const newMap = { ...userMap };
                            delete newMap[selectedLetter];
                            setUserMap(newMap);
                        }
                    }}
                    className="col-span-2 p-2 bg-rose-900/50 text-rose-300 rounded"
                >
                    Del
                </button>
            </div>

        </div>
    );
}
