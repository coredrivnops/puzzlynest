// Sound Manager - Global audio control with volume persistence

class SoundManager {
    private sounds: Map<string, HTMLAudioElement> = new Map();
    private volume: number = 0.5;
    private muted: boolean = false;

    constructor() {
        // Load volume from localStorage
        if (typeof window !== 'undefined') {
            const savedVolume = localStorage.getItem('puzzlynest_volume');
            const savedMuted = localStorage.getItem('puzzlynest_muted');

            if (savedVolume) this.volume = parseFloat(savedVolume);
            if (savedMuted) this.muted = savedMuted === 'true';
        }
    }

    // Create sound effect programmatically
    private createBeep(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer | null {
        if (typeof window === 'undefined') return null;

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const sampleRate = audioContext.sampleRate;
        const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            if (type === 'sine') {
                data[i] = Math.sin(2 * Math.PI * frequency * t);
            } else if (type === 'square') {
                data[i] = Math.sin(2 * Math.PI * frequency * t) > 0 ? 0.3 : -0.3;
            }
            // Fade out
            data[i] *= Math.max(0, 1 - t / duration);
        }

        return buffer;
    }

    // Play sound effect
    play(soundId: string) {
        if (this.muted || typeof window === 'undefined') return;

        const soundMap: Record<string, { freq: number; duration: number; type?: OscillatorType }> = {
            'click': { freq: 800, duration: 0.1, type: 'sine' },
            'success': { freq: 1200, duration: 0.3, type: 'sine' },
            'error': { freq: 200, duration: 0.2, type: 'square' },
            'match': { freq: 1000, duration: 0.2, type: 'sine' },
            'pop': { freq: 600, duration: 0.15, type: 'sine' },
            'win': { freq: 1500, duration: 0.5, type: 'sine' },
            'lose': { freq: 150, duration: 0.4, type: 'square' },
            'whoosh': { freq: 400, duration: 0.3, type: 'sine' },
            'achievement': { freq: 1400, duration: 0.4, type: 'sine' },
            'coin': { freq: 900, duration: 0.2, type: 'sine' },
            'level-up': { freq: 1600, duration: 0.4, type: 'sine' },
        };

        const config = soundMap[soundId];
        if (!config) return;

        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const buffer = this.createBeep(config.freq, config.duration, config.type);

            if (buffer) {
                const source = audioContext.createBufferSource();
                const gainNode = audioContext.createGain();

                source.buffer = buffer;
                gainNode.gain.value = this.volume;

                source.connect(gainNode);
                gainNode.connect(audioContext.destination);
                source.start();
            }
        } catch (error) {
            console.warn('Sound playback failed:', error);
        }
    }

    setVolume(value: number) {
        this.volume = Math.max(0, Math.min(1, value));
        if (typeof window !== 'undefined') {
            localStorage.setItem('puzzlynest_volume', this.volume.toString());
        }
    }

    getVolume(): number {
        return this.volume;
    }

    toggleMute() {
        this.muted = !this.muted;
        if (typeof window !== 'undefined') {
            localStorage.setItem('puzzlynest_muted', this.muted.toString());
        }
        return this.muted;
    }

    isMuted(): boolean {
        return this.muted;
    }
}

// Export singleton instance
export const soundManager = new SoundManager();
