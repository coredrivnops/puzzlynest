import { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getArticleSchema, getBreadcrumbSchema, stringifySchema } from '@/lib/structuredData';

export const metadata: Metadata = {
    title: 'Blog - PuzzlyNest | Puzzle Tips, Strategies & Brain Training',
    description: 'Learn puzzle strategies, brain training tips, and the fascinating history of logic games. Improve your skills with our expert guides.',
};

// 5 SEO-focused articles with full content (300-400 words each)
const ARTICLES = [
    {
        id: 'logic-puzzles-boost-brain',
        title: '5 Reasons Why Logic Puzzles Boost Your Brain Power',
        category: 'Brain Training',
        emoji: '🧠',
        readTime: '5 min read',
        excerpt: 'Discover the science-backed cognitive benefits of solving logic puzzles daily.',
        content: `
            Logic puzzles are more than just a fun way to pass the time—they are a proven workout for your brain. Research from leading neuroscience institutions has consistently shown that engaging in mentally challenging activities like Sudoku, crosswords, and pattern recognition games can significantly improve cognitive function.

            **1. Enhanced Memory Function**
            When you solve a logic puzzle, you actively engage your working memory. Remembering which numbers or patterns you have already considered strengthens the neural pathways associated with short-term recall. Over time, this leads to better memory retention in everyday life, from remembering shopping lists to recalling important dates.

            **2. Improved Concentration and Focus**
            Logic puzzles demand undivided attention. Unlike passive entertainment like watching videos, puzzles require you to actively concentrate on the task at hand. This focused mental engagement trains your brain to maintain attention for longer periods, a skill that transfers to work, studies, and other activities requiring sustained focus.

            **3. Faster Problem-Solving Skills**
            Regular puzzle-solving teaches your brain to recognize patterns and develop systematic approaches to challenges. When faced with real-world problems, puzzle enthusiasts often find themselves naturally breaking complex issues into smaller, manageable components—a technique directly learned from puzzle-solving.

            **4. Delayed Cognitive Decline**
            Studies published in medical journals have shown that adults who regularly engage in mentally stimulating activities experience slower cognitive decline as they age. Logic puzzles create new neural connections and strengthen existing ones, essentially keeping your brain younger for longer.

            **5. Stress Reduction**
            When you enter a focused puzzle-solving state, your brain produces dopamine—the feel-good neurotransmitter. This meditative focus provides a healthy escape from daily stressors, leaving you feeling accomplished and mentally refreshed.

            Start your brain training journey today with PuzzlyNest's collection of logic puzzles designed for all skill levels.
        `
    },
    {
        id: 'how-to-play-sudoku',
        title: 'How to Play Sudoku: A Beginner\'s Complete Guide',
        category: 'Tutorial',
        emoji: '🔢',
        readTime: '6 min read',
        excerpt: 'Learn the fundamental rules and techniques to start solving Sudoku puzzles with confidence.',
        content: `
            Sudoku is one of the world's most popular logic puzzles, and learning to play it is easier than you might think. This beginner's guide will have you solving puzzles confidently in no time.

            **The Basic Rules**
            A standard Sudoku puzzle consists of a 9x9 grid, divided into nine 3x3 boxes. The objective is simple: fill every cell with a number from 1 to 9, following three rules:

            1. **Each row must contain all numbers from 1-9** with no repeats
            2. **Each column must contain all numbers from 1-9** with no repeats
            3. **Each 3x3 box must contain all numbers from 1-9** with no repeats

            That's it! There is always exactly one correct solution, and it can be found using pure logic—no guessing required.

            **Getting Started**
            When you first look at a Sudoku grid, some cells will already be filled with numbers (called "givens"). The difficulty level depends on how many givens are provided and their placement. Easy puzzles might have 35-40 givens, while expert puzzles have fewer than 25.

            **Essential Techniques for Beginners**
            
            *Scanning:* Look at each row, column, and box to find cells where only one number can possibly fit. If eight numbers are already present in a row, the ninth cell must contain the missing number.

            *Cross-Hatching:* When a number appears in two rows within a set of three boxes, you can often determine where that number must go in the third row.

            *Single Candidates:* Sometimes a cell has only one possible number when you consider all constraints from its row, column, and box combined.

            **Practice Makes Perfect**
            The more puzzles you solve, the faster your pattern recognition becomes. Start with easy puzzles on PuzzlyNest to build confidence, then gradually increase the difficulty as your skills improve.
        `
    },
    {
        id: 'history-of-number-puzzles',
        title: 'The Fascinating History of Number Puzzles',
        category: 'History',
        emoji: '📜',
        readTime: '5 min read',
        excerpt: 'Journey from ancient Magic Squares to modern Sudoku and discover how number puzzles captivated humanity.',
        content: `
            Number puzzles have fascinated humans for thousands of years, from ancient civilizations to modern smartphone apps. Understanding their history helps us appreciate the timeless appeal of these mental challenges.

            **Ancient Origins: Magic Squares**
            The earliest number puzzles date back over 4,000 years. The Lo Shu Square—a 3x3 grid where every row, column, and diagonal sums to 15—appeared in ancient Chinese legend around 2200 BCE. The Chinese believed this mathematical curiosity held mystical powers. Magic squares later spread to India, the Middle East, and Europe, captivating mathematicians and philosophers alike.

            **Latin Squares: The Mathematical Foundation**
            In the 18th century, Swiss mathematician Leonhard Euler developed "Latin Squares"—grids where each symbol appears exactly once in each row and column. While Euler created these as pure mathematical objects, they laid the groundwork for puzzles we enjoy today.

            **The Birth of Sudoku**
            Contrary to popular belief, Sudoku wasn't invented in Japan. American architect Howard Garns designed the puzzle in 1979, calling it "Number Place." It was published in Dell Puzzle magazines and remained relatively obscure until a Japanese puzzle company, Nikoli, renamed it "Sudoku" (meaning "single number") in 1984.

            **The Global Sudoku Explosion**
            Sudoku remained a Japanese phenomenon until 2004, when British newspapers began publishing the puzzles. Within months, Sudoku appeared in publications worldwide. By 2006, it had become a global craze, spawning books, apps, and tournaments.

            **Modern Evolution**
            Today, number puzzles have evolved beyond traditional grids. Variations like Killer Sudoku, Kakuro, and KenKen offer new challenges for experienced solvers. Digital platforms allow players to access millions of puzzles instantly, while AI generates new puzzles of precisely calibrated difficulty.

            The appeal remains unchanged: the pure satisfaction of logic conquering chaos, one number at a time.
        `
    },
    {
        id: 'digital-vs-paper-puzzles',
        title: 'Digital vs. Paper Puzzles: Why PuzzlyNest is Better',
        category: 'Features',
        emoji: '💻',
        readTime: '4 min read',
        excerpt: 'Explore the advantages of solving puzzles digitally and how PuzzlyNest enhances your puzzle experience.',
        content: `
            For decades, puzzle enthusiasts filled in grids with pencils in newspapers and books. Today, digital platforms offer compelling advantages that enhance the puzzle-solving experience in ways paper never could.

            **Unlimited Undo/Redo**
            Made a mistake three steps ago? On paper, you are stuck with messy erasures or starting over. PuzzlyNest allows unlimited undo and redo, letting you experiment freely without fear of ruining your puzzle. This freedom encourages learning through trial and error.

            **Instant Error Detection**
            While some purists prefer discovering mistakes themselves, optional error highlighting helps beginners learn faster. When PuzzlyNest identifies a conflict, you immediately understand the rule you violated—a learning opportunity that paper puzzles cannot provide.

            **Perfect Difficulty Matching**
            Newspaper puzzles come in fixed difficulties. PuzzlyNest offers dynamic difficulty adjustment, generating puzzles that match your exact skill level. Too easy? Increase the challenge. Struggling? Find puzzles that build your skills progressively.

            **No Erasure Marks or Torn Pages**
            Paper puzzles become illegible after multiple corrections. Digital puzzles remain pristine regardless of how many times you change your mind. The clean interface helps you think clearly without visual clutter.

            **Eco-Friendly Gaming**
            Consider the environmental impact: no paper production, no printing, no transportation, and no disposal. By choosing digital puzzles, you enjoy unlimited entertainment without contributing to deforestation or waste.

            **Progress Tracking**
            PuzzlyNest remembers your achievements, tracks your solving times, and monitors your improvement over weeks and months. This data helps you understand your strengths and identify areas for growth—insights paper puzzles simply cannot provide.

            **Play Anywhere, Anytime**
            Forget carrying puzzle books. With PuzzlyNest accessible from any device, your entire puzzle library travels with you. Solve during your commute, on lunch breaks, or relaxing at home—all from the same account.

            Embrace the future of puzzling at PuzzlyNest.com.
        `
    },
    {
        id: 'tips-solve-hard-puzzles',
        title: 'Tips to Solve Hard Puzzles Faster',
        category: 'Game Tips',
        emoji: '⚡',
        readTime: '6 min read',
        excerpt: 'Master advanced techniques that expert puzzle solvers use to tackle the toughest challenges.',
        content: `
            You have mastered the basics, but now you face puzzles that seem impossible. Here are the advanced strategies that separate casual solvers from puzzle masters.

            **Master the Art of Scanning**
            Before making any marks, scan the entire puzzle systematically. Look at each row, column, and box in sequence. Expert solvers can often fill several cells immediately through rapid visual scanning alone. This initial pass reveals the puzzle's structure and highlights promising starting points.

            **Use Pencil Marks Strategically**
            In difficult puzzles, noting candidate numbers in each cell is essential. However, writing every possibility creates overwhelming clutter. Instead, focus on cells with only two or three candidates—these "bivalue" cells are where breakthroughs happen.

            **Look for Naked Singles and Hidden Singles**
            A "naked single" is a cell where only one number can possibly fit. A "hidden single" is when a number can only go in one cell within a row, column, or box—even if that cell has other candidates. Training yourself to spot both types quickly is crucial for hard puzzles.

            **Master Pair and Triple Techniques**
            When two cells in a row, column, or box can only contain the same two numbers, those numbers cannot appear elsewhere in that unit. This "naked pair" technique eliminates candidates and unlocks further deductions. The same logic extends to triples and quadruples.

            **Use the X-Wing Strategy**
            When a candidate appears in exactly two cells in each of two different rows, and these cells align in the same columns, you can eliminate that candidate from other cells in those columns. This powerful technique solves cells that resist simpler methods.

            **Take Strategic Breaks**
            When stuck, step away briefly. Your subconscious continues processing the puzzle, and solutions often appear when you return with fresh eyes. This is not defeat—it is how the human brain works most effectively.

            **Practice Deliberately**
            Speed comes from recognizing patterns instantly. Challenge yourself with harder puzzles regularly. Each difficult puzzle you solve expands your mental toolkit for future challenges.

            With these techniques and consistent practice, no puzzle is truly unsolvable.
        `
    },
];

// New standalone article cards shown in the blog index listing
export const STANDALONE_ARTICLES = [
    {
        href: '/blog/best-brain-training-games-2026',
        title: '10 Best Free Brain Training Games to Play Online in 2026',
        category: 'Brain Training',
        emoji: '🧠',
        readTime: '8 min read',
        excerpt: 'From Sudoku to Logic Grid, we rank the top 10 scientifically-backed brain training games available free online right now.',
        isNew: true,
    },
    {
        href: '/blog/how-puzzles-improve-memory',
        title: 'How Daily Puzzles Improve Memory: The Science Behind Brain Games',
        category: 'Neuroscience',
        emoji: '🔬',
        readTime: '7 min read',
        excerpt: 'What the research actually says about puzzles and memory — four types of memory that brain games train, and which games are most effective.',
        isNew: true,
    },
    {
        href: '/blog/free-educational-games-kids-2026',
        title: "Free Educational Games for Kids: A Parent's Complete Guide 2026",
        category: 'Kids & Education',
        emoji: '👶',
        readTime: '9 min read',
        excerpt: 'Safe, free, no-download educational games for ages 4–12. Recommendations by age group with safety guidance for parents.',
        isNew: true,
    },
    {
        href: '/blog/solitaire-strategy-tips',
        title: 'Solitaire Strategy: Expert Tips to Win More Games',
        category: 'Classic Games',
        emoji: '🃏',
        readTime: '8 min read',
        excerpt: 'Expert strategies for Klondike, Spider, FreeCell, and Pyramid Solitaire — dramatically improve your win rate with these proven techniques.',
        isNew: true,
    },
];


export default function BlogPage() {
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
                {/* Structured Data - Breadcrumbs */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: stringifySchema(getBreadcrumbSchema([
                            { name: 'Home', url: '/' },
                            { name: 'Blog', url: '/blog' }
                        ]))
                    }}
                />
                {/* Structured Data - Articles */}
                {ARTICLES.map(article => (
                    <script
                        key={article.id}
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: stringifySchema(getArticleSchema(article))
                        }}
                    />
                ))}
                {/* Animated background orbs */}
                <div style={{
                    position: 'absolute',
                    top: '5%',
                    right: '-5%',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '20%',
                    left: '-10%',
                    width: '350px',
                    height: '350px',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                }} />

                <div className="container" style={{
                    paddingTop: '3rem',
                    paddingBottom: '4rem',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <header style={{
                        marginBottom: '3rem',
                        textAlign: 'center',
                        padding: '2rem',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
                        borderRadius: '24px',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                    }}>
                        <h1 style={{
                            marginBottom: '1rem',
                            fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #a5b4fc 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            📝 PuzzlyNest Blog
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                            Tips, strategies, and insights to sharpen your puzzle skills and keep your mind active.
                        </p>
                    </header>

                    {/* ===== NEW: Standalone Articles (linked pages) ===== */}
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            color: 'rgba(255,255,255,0.5)',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            marginBottom: '1.5rem',
                        }}>
                            ✨ New Articles
                        </h2>
                        <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                            {STANDALONE_ARTICLES.map((article) => (
                                <Link
                                    key={article.href}
                                    href={article.href}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <article style={{
                                        padding: '1.5rem',
                                        background: 'rgba(255,255,255,0.04)',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(99,102,241,0.2)',
                                        height: '100%',
                                        transition: 'all 0.2s',
                                        cursor: 'pointer',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '1.75rem' }}>{article.emoji}</span>
                                            <span style={{ background: 'rgba(99,102,241,0.2)', borderRadius: '100px', padding: '0.2rem 0.6rem', fontSize: '0.7rem', color: '#a5b4fc', fontWeight: 600 }}>
                                                {article.category}
                                            </span>
                                            {article.isNew && (
                                                <span style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#000', borderRadius: '100px', padding: '0.2rem 0.55rem', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                                                    NEW
                                                </span>
                                            )}
                                            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginLeft: 'auto' }}>{article.readTime}</span>
                                        </div>
                                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.6rem', lineHeight: 1.35 }}>
                                            {article.title}
                                        </h3>
                                        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '1rem' }}>
                                            {article.excerpt}
                                        </p>
                                        <span style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 600 }}>
                                            Read Article →
                                        </span>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginBottom: '2.5rem' }} />
                    <h2 style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.5)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        marginBottom: '1.5rem',
                    }}>
                        📚 All Articles
                    </h2>

                    {/* Articles Grid */}
                    <div style={{
                        display: 'grid',
                        gap: '2rem',
                    }}>

                        {ARTICLES.map((article, index) => (
                            <article
                                key={article.id}
                                id={article.id}
                                style={{
                                    padding: '2rem',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(99, 102, 241, 0.15)',
                                }}
                            >
                                {/* Article Header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '2.5rem' }}>{article.emoji}</span>
                                    <div>
                                        <span style={{
                                            background: 'rgba(99, 102, 241, 0.2)',
                                            borderRadius: '100px',
                                            padding: '0.25rem 0.75rem',
                                            fontSize: '0.75rem',
                                            color: '#a5b4fc',
                                            fontWeight: 600,
                                            marginRight: '0.75rem',
                                        }}>
                                            {article.category}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                                            {article.readTime}
                                        </span>
                                    </div>
                                </div>

                                <h2 style={{
                                    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                                    marginBottom: '1rem',
                                    color: '#fff',
                                    fontWeight: 700,
                                    lineHeight: 1.3,
                                }}>
                                    {index + 1}. {article.title}
                                </h2>

                                <p style={{
                                    fontSize: '1.05rem',
                                    color: 'rgba(255,255,255,0.8)',
                                    marginBottom: '1.5rem',
                                    fontStyle: 'italic',
                                }}>
                                    {article.excerpt}
                                </p>

                                {/* Full Article Content */}
                                <div style={{
                                    fontSize: '0.95rem',
                                    color: 'rgba(255,255,255,0.75)',
                                    lineHeight: 1.9,
                                    whiteSpace: 'pre-line',
                                }}>
                                    {article.content.trim().split('\n\n').map((paragraph, i) => {
                                        // Handle bold headers
                                        if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
                                            return (
                                                <h3 key={i} style={{
                                                    color: '#c7d2fe',
                                                    fontWeight: 700,
                                                    fontSize: '1.1rem',
                                                    marginTop: '1.5rem',
                                                    marginBottom: '0.75rem',
                                                }}>
                                                    {paragraph.trim().replace(/\*\*/g, '')}
                                                </h3>
                                            );
                                        }
                                        // Regular paragraphs
                                        return (
                                            <p key={i} style={{ marginBottom: '1rem' }}>
                                                {paragraph.trim().split('**').map((part, j) =>
                                                    j % 2 === 1 ? <strong key={j} style={{ color: '#c7d2fe' }}>{part}</strong> : part
                                                )}
                                            </p>
                                        );
                                    })}
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* CTA */}
                    <div style={{
                        marginTop: '3rem',
                        textAlign: 'center',
                        padding: '2.5rem',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.05))',
                        borderRadius: '20px',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                    }}>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                            Ready to put these tips into practice?
                        </p>
                        <Link
                            href="/games"
                            style={{
                                display: 'inline-block',
                                padding: '0.875rem 2.5rem',
                                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                color: '#fff',
                                borderRadius: '100px',
                                textDecoration: 'none',
                                fontWeight: 600,
                                fontSize: '1.05rem',
                                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                            }}
                        >
                            🎮 Start Playing Now →
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

// Export articles for use in homepage
export { ARTICLES };
