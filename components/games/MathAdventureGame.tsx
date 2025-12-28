'use client';

import React, { useState, useEffect } from 'react';

type Operation = '+' | '-' | 'x';

export default function MathAdventureGame() {
    const [problem, setProblem] = useState({ a: 0, b: 0, op: '+' as Operation });
    const [options, setOptions] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [message, setMessage] = useState('Solve the problem!');

    useEffect(() => {
        newProblem();
    }, []);

    const newProblem = () => {
        // Difficulty scaling based on score?
        const opIdx = Math.random() > 0.6 ? 1 : 0; // mostly + and -
        const op = opIdx === 0 ? '+' : '-';

        let a = Math.floor(Math.random() * 10) + 1;
        let b = Math.floor(Math.random() * 10) + 1;

        if (op === '-') {
            // Ensure positive result for kids
            if (a < b) [a, b] = [b, a];
        }

        const answer = op === '+' ? a + b : a - b;

        // Generate Options
        const opts = new Set<number>();
        opts.add(answer);
        while (opts.size < 3) {
            let fake = answer + Math.floor(Math.random() * 5) - 2;
            if (fake >= 0 && fake !== answer) opts.add(fake);
            // fallback if stuck loop
            if (opts.size < 3) opts.add(Math.floor(Math.random() * 20));
        }

        setProblem({ a, b, op });
        setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
        setMessage('Solve!');
    };

    const handleAnswer = (ans: number) => {
        const correct = problem.op === '+' ? problem.a + problem.b : problem.a - problem.b;
        if (ans === correct) {
            setScore(s => s + 10 + streak);
            setStreak(s => s + 1);
            setMessage('Correct! 🎉');
            setTimeout(newProblem, 1000);
        } else {
            setStreak(0);
            setMessage('Try Again ❌');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-xl mx-auto p-4 select-none">

            <div className="flex justify-between w-full mb-8 bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700">
                <div className="flex flex-col">
                    <span className="text-slate-400 text-sm">Streak</span>
                    <span className="text-xl font-bold text-orange-400">🔥 {streak}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-slate-400 text-sm">Score</span>
                    <span className="text-2xl font-bold text-emerald-400">{score}</span>
                </div>
            </div>

            {/* Problem Card */}
            <div className="bg-white text-slate-900 rounded-3xl p-8 shadow-2xl mb-8 flex items-center justify-center gap-4 text-6xl font-black w-full relative overflow-hidden">
                <div className="absolute top-0 w-full h-4 bg-indigo-500"></div>
                <span className="animate-in fade-in slide-in-from-left duration-500">{problem.a}</span>
                <span className="text-indigo-600">{problem.op}</span>
                <span className="animate-in fade-in slide-in-from-right duration-500">{problem.b}</span>
                <span className="text-slate-400">=</span>
                <span className="text-indigo-600">?</span>
            </div>

            {/* Message */}
            <div className="h-8 mb-6 text-xl font-bold text-white">{message}</div>

            {/* Multi Choice Options */}
            <div className="grid grid-cols-3 gap-4 w-full">
                {options.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        className="aspect-square bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-2xl text-4xl font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95 border-b-8 border-indigo-800"
                    >
                        {opt}
                    </button>
                ))}
            </div>

        </div>
    );
}
