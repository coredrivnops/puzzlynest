'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function ClockGame() {
    const [targetTime, setTargetTime] = useState({ h: 9, m: 0 }); // Target: 9:00
    const [currentTime, setCurrentTime] = useState({ h: 12, m: 0 }); // Current Hands
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState('Set the time!');
    const [isDragging, setIsDragging] = useState<'hour' | 'minute' | null>(null);
    const clockRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        newRound();
    }, []);

    const newRound = () => {
        // Generate random time (5 minute intervals for simplicity)
        const h = Math.floor(Math.random() * 12) + 1; // 1-12
        const m = Math.floor(Math.random() * 12) * 5; // 0, 5, ... 55
        setTargetTime({ h, m });
        setCurrentTime({ h: 12, m: 0 }); // Reset hands
        setMessage(`Set time to ${h}:${m.toString().padStart(2, '0')}`);
    };

    const handleMouseDown = (hand: 'hour' | 'minute') => {
        setIsDragging(hand);
    };

    const handleMouseUp = () => {
        setIsDragging(null);
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !clockRef.current) return;

        // Calculate angle relative to center
        const rect = clockRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Handle Touch or Mouse
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        const dx = clientX - centerX;
        const dy = clientY - centerY;

        // Atan2 returns angle in radians from -PI to PI
        // -PI/2 is top (12 o'clock)
        let angle = Math.atan2(dy, dx) + Math.PI / 2;
        if (angle < 0) angle += Math.PI * 2;

        // Angle 0 -> 12 o'clock, PI -> 6 o'clock
        const degrees = (angle * 180) / Math.PI;

        if (isDragging === 'minute') {
            // Snap to 6 degrees (1 minute) or 30 degrees (5 mins)
            // 360 degrees = 60 minutes. 1 min = 6 deg.
            const rawMinutes = Math.round(degrees / 6);
            const minutes = rawMinutes === 60 ? 0 : rawMinutes;
            setCurrentTime(prev => ({ ...prev, m: minutes }));
        } else {
            // Hour hand
            // 360 deg = 12 hours. 1 hr = 30 deg.
            let rawHours = Math.round(degrees / 30);
            if (rawHours === 0) rawHours = 12;
            setCurrentTime(prev => ({ ...prev, h: rawHours }));
        }
    };

    const checkTime = () => {
        // Allow a bit of leeway for hour hand if we implemented continuous movement
        // But here we snap integers.
        // Special case: Hour hand usually moves with minute hand? 
        // For simple kids game, Hour hand points strictly to Hour? 
        // Let's assume strict equality for now. 
        // 12 -> 0 in modulo logic? 

        // Handle 12 vs 0 ambiguity if any
        let cH = currentTime.h;
        let cM = currentTime.m;

        if (cH === targetTime.h && cM === targetTime.m) {
            setScore(s => s + 100);
            setMessage('Correct! 🎉');
            setTimeout(newRound, 1500);
        } else {
            setMessage('Try again!');
        }
    };

    // Derived Rotations
    const minuteRot = currentTime.m * 6; // 6 deg per minute
    // Hour rotation: pure hour snap (30 deg per hour) + minute offset?
    // Let's do pure snap for simplicity of input, but visuals might look weird?
    // Kids clocks often have strict hour numbers. Let's keep strict.
    const hourRot = (currentTime.h % 12) * 30; // + (currentTime.m / 2); 

    return (
        <div
            className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-2xl mx-auto p-4 select-none touch-none"
            onMouseUp={handleMouseUp}
            onTouchEnd={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchMove={handleMouseMove}
        >
            <div className="text-3xl font-bold text-white mb-8 bg-indigo-900/50 px-8 py-4 rounded-2xl border border-indigo-500/30">
                {message}
            </div>

            <div
                ref={clockRef}
                className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-white shadow-2xl border-8 border-slate-700 mx-auto"
            >
                {/* Clock Face Numbers */}
                {[...Array(12)].map((_, i) => {
                    const num = i + 1;
                    const angle = (num * 30 - 90) * (Math.PI / 180);
                    const r = 40; // percent radius? No pixels. 
                    // 50% is center. 
                    return (
                        <div
                            key={num}
                            className="absolute font-bold text-2xl text-slate-700"
                            style={{
                                left: `${50 + 38 * Math.cos(angle)}%`,
                                top: `${50 + 38 * Math.sin(angle)}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            {num}
                        </div>
                    );
                })}

                {/* Minute Ticks (Optional) */}

                {/* Hour Hand */}
                <div
                    onMouseDown={() => handleMouseDown('hour')}
                    onTouchStart={() => handleMouseDown('hour')}
                    className="absolute bg-slate-800 rounded-full cursor-pointer hover:bg-slate-600 transition-colors"
                    style={{
                        width: '8px',
                        height: '25%',
                        left: 'calc(50% - 4px)',
                        bottom: '50%',
                        transformOrigin: 'bottom center',
                        transform: `rotate(${hourRot}deg)`
                    }}
                ></div>

                {/* Minute Hand */}
                <div
                    onMouseDown={() => handleMouseDown('minute')}
                    onTouchStart={() => handleMouseDown('minute')}
                    className="absolute bg-indigo-600 rounded-full cursor-pointer hover:bg-indigo-500 transition-colors"
                    style={{
                        width: '6px',
                        height: '35%',
                        left: 'calc(50% - 3px)',
                        bottom: '50%',
                        transformOrigin: 'bottom center',
                        transform: `rotate(${minuteRot}deg)`
                    }}
                ></div>

                {/* Center Cap */}
                <div className="absolute w-4 h-4 bg-slate-800 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="mt-8 flex gap-4">
                <button
                    onClick={checkTime}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xl shadow-lg transition-transform active:scale-95"
                >
                    Check Time
                </button>
            </div>

            <div className="mt-4 text-slate-500 text-sm">
                Drag the hands to set the time!
            </div>
        </div>
    );
}
