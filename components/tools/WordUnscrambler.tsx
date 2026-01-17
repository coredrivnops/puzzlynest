
"use client";

import { useState, useEffect } from "react";
import { loadDictionary, solveAnagram, type AnagramResult } from "@/lib/dictionary";

export default function WordUnscrambler() {
    const [input, setInput] = useState("");
    const [results, setResults] = useState<AnagramResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [dictionaryStatus, setDictionaryStatus] = useState("Loading dictionary...");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadDictionary().then((stats) => {
            if (stats.loaded) {
                setDictionaryStatus(`Ready (${Math.floor(stats.totalWords / 1000)}k words)`);
                setIsLoaded(true);
            } else {
                setDictionaryStatus("Error loading dictionary.");
            }
        });
    }, []);

    const handleSearch = () => {
        if (!input.trim()) return;
        setIsSearching(true);
        setTimeout(() => {
            const matches = solveAnagram(input);
            setResults(matches);
            setIsSearching(false);
        }, 50);
    };

    const groupedResults = results.reduce((acc, result) => {
        const len = result.word.length;
        if (!acc[len]) acc[len] = [];
        acc[len].push(result);
        return acc;
    }, {} as Record<number, AnagramResult[]>);

    const sortedLengths = Object.keys(groupedResults).map(Number).sort((a, b) => b - a);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Input Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                    Enter your letters
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400, display: 'block', fontSize: '0.875rem' }}>
                        Use &apos;?&apos; for wildcards (blank tiles)
                    </span>
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="e.g. PU?ZLE"
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
                        maxLength={15}
                    />
                    <button
                        onClick={handleSearch}
                        disabled={!isLoaded || isSearching}
                        className="btn btn-primary"
                        style={{ padding: '1rem 1.5rem' }}
                    >
                        {isSearching ? "..." : "Find Words"}
                    </button>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                    {dictionaryStatus}
                </div>
            </div>

            {/* Results */}
            <div style={{ minHeight: '150px' }}>
                {results.length > 0 ? (
                    sortedLengths.map(len => (
                        <div key={len} style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{
                                fontSize: '1rem',
                                fontWeight: 600,
                                color: '#818cf8',
                                marginBottom: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <span style={{ background: 'rgba(129, 140, 248, 0.2)', padding: '2px 10px', borderRadius: '8px' }}>
                                    {len} letters
                                </span>
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {groupedResults[len].map((res) => (
                                    <div
                                        key={res.word}
                                        style={{
                                            padding: '0.5rem 0.75rem',
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                        }}
                                        title={`Score: ${res.score}`}
                                    >
                                        <span style={{ fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{res.word}</span>
                                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '4px' }}>{res.score}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    input && !isSearching && results.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                            No valid dictionary words found for &quot;{input}&quot;.
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
