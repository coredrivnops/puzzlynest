
"use client";

import { useState, useEffect } from "react";
import { loadDictionary, findPatternMatches } from "@/lib/dictionary";

export default function CrosswordHelper() {
    const [pattern, setPattern] = useState("");
    const [matches, setMatches] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadDictionary().then((stats) => {
            if (stats.loaded) setIsLoaded(true);
        });
    }, []);

    const handleSearch = () => {
        if (!pattern.trim()) return;
        setIsSearching(true);
        setTimeout(() => {
            const results = findPatternMatches(pattern);
            setMatches(results.slice(0, 100)); // Limit for performance
            setIsSearching(false);
        }, 50);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                    Crossword Pattern
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400, display: 'block', fontSize: '0.875rem' }}>
                        Use &apos;?&apos; for unknown letters (e.g. C?T)
                    </span>
                </label>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="e.g. C?T"
                        style={{
                            flex: 1,
                            padding: '1rem',
                            fontSize: '1.5rem',
                            fontFamily: 'monospace',
                            textTransform: 'uppercase',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            color: '#fff',
                            outline: 'none',
                        }}
                    />
                    <button
                        onClick={handleSearch}
                        disabled={!isLoaded}
                        className="btn btn-primary"
                        style={{ padding: '1rem 1.5rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}
                    >
                        Search
                    </button>
                </div>
            </div>

            <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                padding: '1rem',
                minHeight: '100px',
                maxHeight: '300px',
                overflowY: 'auto'
            }}>
                {matches.length > 0 ? (
                    <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem' }}>
                        {matches.map(word => (
                            <li key={word} style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                fontWeight: 700,
                                color: '#fff',
                                textTransform: 'uppercase',
                                textAlign: 'center',
                                listStyle: 'none'
                            }}>
                                {word}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '2rem' }}>
                        {isSearching ? "Searching dictionary..." : (pattern ? "No matches found." : "Enter a pattern to see matches.")}
                    </div>
                )}
            </div>
        </div>
    );
}
