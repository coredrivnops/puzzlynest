'use client';

import React, { useState, useEffect } from 'react';
import type { Game } from '@/lib/games';

// Generic Quiz Engine for Learning Games
// Supports: Image->Text, Text->Text, Text->Image (using emojis/urls)

interface Question {
    q: string; // Question text
    image?: string; // Optional image/emoji
    options: string[]; // Options
    answer: string; // Correct match
}

const QUIZ_DATA: Record<string, Question[]> = {
    'shape-matching': [
        { q: 'Which one is a Circle?', options: ['●', '■', '▲', '★'], answer: '●' },
        { q: 'Find the Square', options: ['●', '■', '▲', '★'], answer: '■' },
        { q: 'Where is the Triangle?', options: ['●', '■', '▲', '♦'], answer: '▲' },
        { q: 'Find the Star', options: ['●', '■', '🌙', '★'], answer: '★' },
        { q: 'Which is a Rectangle?', options: ['●', '▬', '▲', '★'], answer: '▬' },
    ],
    'color-learning': [
        { q: 'Click the RED circle', options: ['🔴', '🔵', '🟢', '🟡'], answer: '🔴' },
        { q: 'Which heart is BLUE?', options: ['💙', '❤️', '💚', '💛'], answer: '💙' },
        { q: 'Find the GREEN apple', options: ['🍎', '🍏', '🍊', '🍋'], answer: '🍏' },
        { q: 'Show me YELLOW', options: ['🔴', '⚫', '🟢', '🟡'], answer: '🟡' },
        { q: 'Where is PURPLE?', options: ['🟣', '🔵', '🟢', '🟠'], answer: '🟣' },
    ],
    'rhyming-words': [
        { q: 'What rhymes with CAT?', options: ['Dog', 'Bat', 'Pig', 'Pen'], answer: 'Bat' },
        { q: 'What rhymes with MOON?', options: ['Sun', 'Spoon', 'Star', 'Car'], answer: 'Spoon' },
        { q: 'What rhymes with RED?', options: ['Bed', 'Blue', 'Sad', 'Bad'], answer: 'Bed' },
        { q: 'What rhymes with FISH?', options: ['Dish', 'Shark', 'Fin', 'Swim'], answer: 'Dish' },
        { q: 'What rhymes with STAR?', options: ['Car', 'Moon', 'Sky', 'Far'], answer: 'Car' },
    ],
    'animal-sounds': [
        { q: 'Who says "Meow"?', options: ['🐶', '🐱', '🐮', '🐷'], answer: '🐱' },
        { q: 'Who says "Woof"?', options: ['🐶', '🐱', '🐭', '🦆'], answer: '🐶' },
        { q: 'Who says "Moo"?', options: ['🐴', '🐮', '🐑', '🐔'], answer: '🐮' },
        { q: 'Who says "Quack"?', options: ['🦆', '🦅', '🦉', '🐸'], answer: '🦆' },
        { q: 'Who says "Oink"?', options: ['🐷', '🐮', '🐭', '🦁'], answer: '🐷' },
    ],
    'seasons-weather': [
        { q: 'When does it SNOW?', options: ['Summer', 'Winter', 'Spring', 'Fall'], answer: 'Winter' },
        { q: 'When do flowers BLOOM?', options: ['Winter', 'Spring', 'Fall', 'Summer'], answer: 'Spring' },
        { q: 'When is it very HOT?', options: ['Winter', 'Summer', 'Spring', 'Fall'], answer: 'Summer' },
        { q: 'When do leaves FALL?', options: ['Spring', 'Summer', 'Autumn', 'Winter'], answer: 'Autumn' },
        { q: 'You need an UMBRELLA for...', options: ['Sun', 'Rain', 'Wind', 'Cloud'], answer: 'Rain' },
    ],
    'body-parts': [
        { q: 'You see with your...', options: ['👀', '👂', '👃', '👄'], answer: '👀' },
        { q: 'You hear with your...', options: ['👀', '👂', '👃', '✋'], answer: '👂' },
        { q: 'You smell with your...', options: ['👀', '👂', '👃', '🦶'], answer: '👃' },
        { q: 'You walk with your...', options: ['✋', '👀', '🦶', '👂'], answer: '🦶' },
        { q: 'You clap with your...', options: ['✋', '🦶', '👂', '👄'], answer: '✋' },
    ],
    'money-counting': [
        { q: 'Which is One Cent?', options: ['1¢', '5¢', '10¢', '$1'], answer: '1¢' },
        { q: 'Which is a Dollar?', options: ['10¢', '25¢', '$1', '50¢'], answer: '$1' },
        { q: '5¢ + 5¢ = ?', options: ['5¢', '10¢', '20¢', '1¢'], answer: '10¢' },
        { q: 'Who is on the $1 bill?', options: ['Lincoln', 'Washington', 'Franklin', 'Hamilton'], answer: 'Washington' },
    ],
    'sight-words': [
        { q: 'Find "THE"', options: ['AND', 'THE', 'YOU', 'FOR'], answer: 'THE' },
        { q: 'Find "AND"', options: ['THE', 'IS', 'AND', 'IT'], answer: 'AND' },
        { q: 'Find "IS"', options: ['IN', 'IT', 'IS', 'IF'], answer: 'IS' },
        { q: 'Find "YOU"', options: ['ME', 'YOU', 'WE', 'HE'], answer: 'YOU' },
    ],
    'phonics-sounds': [
        { q: 'A is for...', options: ['🍎', '🍌', '🥕', '🐕'], answer: '🍎' },
        { q: 'B is for...', options: ['🍎', '🍌', '🐱', '🥚'], answer: '🍌' },
        { q: 'C is for...', options: ['🐶', '🐱', '🐮', '🐷'], answer: '🐱' },
        { q: 'D is for...', options: ['🐶', '🐱', '🦆', '🐰'], answer: '🐶' },
    ],
    'vocabulary-builder': [
        { q: 'Opposite of BIG', options: ['Small', 'Huge', 'Large', 'Tall'], answer: 'Small' },
        { q: 'Opposite of FAST', options: ['Quick', 'Slow', 'Run', 'Speed'], answer: 'Slow' },
        { q: 'Opposite of HAPPY', options: ['Sad', 'Glad', 'Joy', 'Smile'], answer: 'Sad' },
        { q: 'Opposite of HOT', options: ['Cold', 'Warm', 'Fire', 'Sun'], answer: 'Cold' },
    ]
};

export default function QuizGame({ game }: { game: Game }) {
    const questions = QUIZ_DATA[game.id] || QUIZ_DATA['shape-matching']; // Fallback
    const [qIndex, setQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string>('');

    const currentQ = questions[qIndex];

    const handleAnswer = (opt: string) => {
        if (selected) return; // Prevent double click
        setSelected(opt);

        if (opt === currentQ.answer) {
            setScore(s => s + 1);
            setFeedback('Correct! 🎉');
            setTimeout(next, 1000);
        } else {
            setFeedback('Oops! Try again next time.');
            setTimeout(next, 1500);
        }
    };

    const next = () => {
        setSelected(null);
        setFeedback('');
        if (qIndex + 1 < questions.length) {
            setQIndex(i => i + 1);
        } else {
            setFinished(true);
        }
    };

    const restart = () => {
        setQIndex(0);
        setScore(0);
        setFinished(false);
        setSelected(null);
        setFeedback('');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-2xl mx-auto p-4 select-none">
            <div className="game-header w-full mb-8 flex justify-between items-center text-white">
                <h1 className="text-2xl font-bold">{game.name}</h1>
                <div className="text-xl">Score: {score}/{questions.length}</div>
            </div>

            {finished ? (
                <div className="text-center animate-bounce bg-slate-800 p-8 rounded-2xl shadow-xl">
                    <div className="text-6xl mb-4">🏆</div>
                    <h2 className="text-4xl font-bold text-white mb-4">Great Job!</h2>
                    <p className="text-xl text-slate-300 mb-6">You got {score} out of {questions.length} correct!</p>
                    <button
                        onClick={restart}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg transform transition active:scale-95"
                    >
                        Play Again
                    </button>
                </div>
            ) : (
                <div className="w-full max-w-lg">
                    {/* Question Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-xl mb-6 text-center">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">{currentQ.q}</h2>
                        {currentQ.image && <div className="text-6xl mb-4">{currentQ.image}</div>}
                        <div className={`h-8 font-bold ${feedback.includes('Correct') ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {feedback}
                        </div>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {currentQ.options.map((opt, i) => {
                            let btnClass = "bg-indigo-600 hover:bg-indigo-500";
                            if (selected) {
                                if (opt === currentQ.answer) btnClass = "bg-emerald-500 ring-4 ring-emerald-300";
                                else if (opt === selected) btnClass = "bg-rose-500 ring-4 ring-rose-300";
                                else btnClass = "bg-slate-400 opacity-50";
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(opt)}
                                    disabled={!!selected}
                                    className={`
                                        p-6 rounded-xl text-2xl font-bold text-white shadow-lg transition-all transform
                                        ${btnClass}
                                        ${!selected ? 'hover:scale-105 active:scale-95' : ''}
                                    `}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-8 w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-400 transition-all duration-500"
                            style={{ width: `${((qIndex) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
}
