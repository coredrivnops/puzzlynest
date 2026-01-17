
import SudokuSolver from "@/components/tools/SudokuSolver";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Smart Sudoku Solver & Logic Explainer | PuzzlyNest",
    description: "Stuck on a Sudoku? Use our free Smart Solver to find the next move with logical explanations. Not just an answer key—learn how to solve difficult puzzles!",
    alternates: {
        canonical: 'https://puzzlynest.com/tools/sudoku-solver',
    },
    openGraph: {
        title: "Smart Sudoku Solver with Logic Hints",
        description: "Get logical explanations for your next Sudoku move - free online solver",
        url: 'https://puzzlynest.com/tools/sudoku-solver',
        siteName: 'PuzzlyNest',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function SudokuSolverPage() {
    return (
        <>
            <Navigation />

            {/* Dark background wrapper */}
            <main style={{
                background: 'linear-gradient(135deg, #0a0a1a 0%, #0f0f2d 50%, #0a0a1a 100%)',
                minHeight: '100vh',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Animated background orbs */}
                <div style={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '-5%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                }} />

                <div className="container" style={{
                    paddingTop: '2rem',
                    paddingBottom: '4rem',
                    maxWidth: '900px',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    {/* Breadcrumb */}
                    <nav style={{ marginBottom: '1.5rem' }}>
                        <Link href="/tools" style={{
                            color: 'rgba(255,255,255,0.5)',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                        }}>
                            ← Back to Solvers
                        </Link>
                    </nav>

                    <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                            fontWeight: 800,
                            marginBottom: '0.75rem',
                            background: 'linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #a5b4fc 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            🧩 Smart Sudoku Solver
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
                            Enter your puzzle below and let our logic engine explain the next step.
                        </p>
                    </header>

                    <section style={{
                        padding: '1.5rem',
                        marginBottom: '2rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '20px',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                    }}>
                        <SudokuSolver />
                    </section>

                    {/* SEO Rich Content */}
                    <article style={{
                        padding: '2rem',
                        marginBottom: '2rem',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.08)',
                    }}>
                        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: '#fff' }}>How to use this Sudoku Solver</h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, marginBottom: '1rem' }}>
                            Unlike standard solvers that simply fill in the blank squares, the PuzzlyNest <strong style={{ color: '#c7d2fe' }}>Smart Sudoku Solver</strong> is designed to be a teaching tool.
                            We believe the joy of Sudoku is in the <em>deduction</em>, not just the completion.
                        </p>
                        <ol style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}><strong>Input your specific puzzle:</strong> Click on the cells in the grid above and type the numbers exactly as they appear in your newspaper, book, or app.</li>
                            <li style={{ marginBottom: '0.5rem' }}><strong>Get a Hint:</strong> If you are stuck, click the &quot;Get Hint&quot; button. Our engine will analyze the board and find the most logical next move, explaining <em>why</em> that number belongs there.</li>
                            <li><strong>Solve All:</strong> Just want the answers? Click &quot;Solve Complete Board&quot; to instantly fill the entire grid.</li>
                        </ol>
                    </article>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        <section style={{
                            padding: '1.5rem',
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}>
                            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem', color: '#fff' }}>Top 3 Sudoku Strategies</h3>
                            <ul style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '0.75rem' }}>
                                    <strong style={{ color: '#c7d2fe' }}>1. Scanning:</strong> Look at the 3x3 boxes. If a row has a 7, and the row below has a 7, the 7 in the third box <em>must</em> be in the remaining row.
                                </li>
                                <li style={{ marginBottom: '0.75rem' }}>
                                    <strong style={{ color: '#c7d2fe' }}>2. Naked Singles:</strong> Sometimes, a specific cell can only possibly contain one number because every other number exists in its row, column, or box.
                                </li>
                                <li>
                                    <strong style={{ color: '#c7d2fe' }}>3. Pencil Marks:</strong> For harder puzzles, write down small candidate numbers in corners to spot &quot;Pairs&quot; and &quot;Triplets&quot;.
                                </li>
                            </ul>
                        </section>
                        <section style={{
                            padding: '1.5rem',
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}>
                            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem', color: '#fff' }}>Why use a solver?</h3>
                            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                                Getting completely stuck can be frustrating. A specific hint acts as a &quot;nudge&quot; to get your brain moving again.
                                By understanding the logic behind a specific move, you actually become a better player over time.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
