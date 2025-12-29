'use client';

import { useState } from 'react';
import Link from 'next/link';

// Music Maker - tap instruments to make music
const INSTRUMENTS = [
    { id: 'piano', emoji: '🎹', sound: 'piano', notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
    { id: 'drum', emoji: '🥁', sound: 'drum', notes: ['Kick', 'Snare', 'Hi-Hat', 'Tom'] },
    { id: 'guitar', emoji: '🎸', sound: 'guitar', notes: ['E', 'A', 'D', 'G', 'B', 'E'] },
    { id: 'trumpet', emoji: '🎺', sound: 'trumpet', notes: ['Do', 'Re', 'Mi', 'Fa', 'Sol'] },
];

export default function MusicMakerGame() {
    const [currentInstrument, setCurrentInstrument] = useState(INSTRUMENTS[0]);
    const [playingNotes, setPlayingNotes] = useState<string[]>([]);
    const [recording, setRecording] = useState<{ note: string, time: number }[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [recordStart, setRecordStart] = useState(0);

    const playNote = (note: string) => {
        // Visual feedback
        setPlayingNotes(prev => [...prev, note]);
        setTimeout(() => {
            setPlayingNotes(prev => prev.filter((n, i) => i !== 0));
        }, 300);

        // Record if recording
        if (isRecording) {
            setRecording(prev => [...prev, { note, time: Date.now() - recordStart }]);
        }

        // Create audio feedback using Web Audio API
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            // Different frequencies for different instruments/notes
            const baseFreq = currentInstrument.id === 'drum' ? 100 :
                currentInstrument.id === 'trumpet' ? 400 :
                    currentInstrument.id === 'guitar' ? 200 : 262;

            const noteIndex = currentInstrument.notes.indexOf(note);
            oscillator.frequency.value = baseFreq * Math.pow(2, noteIndex / 12);

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Audio not supported');
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            setIsRecording(false);
        } else {
            setRecording([]);
            setRecordStart(Date.now());
            setIsRecording(true);
        }
    };

    const playRecording = () => {
        if (recording.length === 0) return;

        recording.forEach(({ note, time }) => {
            setTimeout(() => playNote(note), time);
        });
    };

    const noteColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500'];

    return (
        <div className="game-container">
            <div className="game-canvas-wrapper">
                <div className="game-header">
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Back</Link>
                    <h1 className="game-title">Music Maker</h1>
                    <div className="text-4xl">{currentInstrument.emoji}</div>
                </div>

                {/* Instrument selector */}
                <div className="flex justify-center gap-4 mb-6">
                    {INSTRUMENTS.map(inst => (
                        <button
                            key={inst.id}
                            onClick={() => setCurrentInstrument(inst)}
                            className={`
                                text-4xl p-4 rounded-xl transition-all
                                ${currentInstrument.id === inst.id
                                    ? 'bg-indigo-600 scale-110 shadow-lg'
                                    : 'bg-slate-700 hover:bg-slate-600'}
                            `}
                        >
                            {inst.emoji}
                        </button>
                    ))}
                </div>

                {/* Notes/Keys */}
                <div className="flex justify-center gap-2 flex-wrap max-w-md mx-auto mb-6">
                    {currentInstrument.notes.map((note, i) => (
                        <button
                            key={note}
                            onClick={() => playNote(note)}
                            className={`
                                w-16 h-24 rounded-xl font-bold text-xl shadow-lg
                                transition-all duration-100 active:scale-95
                                ${noteColors[i % noteColors.length]}
                                ${playingNotes.includes(note) ? 'scale-110 brightness-125' : ''}
                            `}
                        >
                            {note}
                        </button>
                    ))}
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4 mb-4">
                    <button
                        onClick={toggleRecording}
                        className={`
                            px-6 py-3 rounded-lg font-bold text-lg
                            ${isRecording ? 'bg-red-600 animate-pulse' : 'bg-slate-700'}
                        `}
                    >
                        {isRecording ? '⏹️ Stop' : '⏺️ Record'}
                    </button>
                    <button
                        onClick={playRecording}
                        disabled={recording.length === 0}
                        className="px-6 py-3 bg-emerald-600 rounded-lg font-bold text-lg disabled:opacity-50"
                    >
                        ▶️ Play ({recording.length} notes)
                    </button>
                </div>

                {/* Visual feedback area */}
                <div className="h-32 bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
                    <div className="flex gap-2">
                        {playingNotes.map((note, i) => (
                            <div
                                key={i}
                                className="text-4xl animate-bounce"
                            >
                                🎵
                            </div>
                        ))}
                        {playingNotes.length === 0 && (
                            <p className="text-slate-500">Tap the keys to make music! 🎶</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
