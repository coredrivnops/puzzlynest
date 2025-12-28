'use client';

import { useState, useEffect } from 'react';
import { soundManager } from '@/lib/soundManager';

export default function SoundControl() {
    const [volume, setVolume] = useState(0.5);
    const [muted, setMuted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setVolume(soundManager.getVolume());
        setMuted(soundManager.isMuted());
    }, []);

    const handleVolumeChange = (value: number) => {
        setVolume(value);
        soundManager.setVolume(value);
        soundManager.play('click');
    };

    const handleToggleMute = () => {
        const newMuted = soundManager.toggleMute();
        setMuted(newMuted);
        if (!newMuted) {
            soundManager.play('click');
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    soundManager.play('click');
                }}
                style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                className="hover-lift"
            >
                {muted ? '🔇' : volume > 0.5 ? '🔊' : volume > 0 ? '🔉' : '🔈'}
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '60px',
                    right: 0,
                    background: 'rgba(30, 30, 60, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    minWidth: '200px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    zIndex: 1000,
                }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>
                        Sound Settings
                    </h3>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            color: 'rgba(255,255,255,0.7)',
                            marginBottom: '0.5rem',
                        }}>
                            Volume
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                            disabled={muted}
                            style={{
                                width: '100%',
                                accentColor: 'var(--primary)',
                            }}
                        />
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '0.75rem',
                            color: 'rgba(255,255,255,0.5)',
                            marginTop: '0.25rem',
                        }}>
                            <span>0%</span>
                            <span>{Math.round(volume * 100)}%</span>
                            <span>100%</span>
                        </div>
                    </div>

                    <button
                        onClick={handleToggleMute}
                        className="btn btn-ghost"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '0.875rem',
                        }}
                    >
                        {muted ? '🔇 Unmute' : '🔊 Mute'}
                    </button>

                    <button
                        onClick={() => {
                            soundManager.play('success');
                        }}
                        className="btn btn-ghost"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '0.875rem',
                            marginTop: '0.5rem',
                        }}
                    >
                        🎵 Test Sound
                    </button>
                </div>
            )}
        </div>
    );
}
