import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';

import { getFeaturedGames, getGamesByAgeGroup, getGameStats, getGameById } from '@/lib/games';
import { GAME_CATEGORIES, PLATFORM_CONFIG } from '@/lib/config';
import { getFAQSchema, getGameListSchema, HOMEPAGE_FAQS, stringifySchema } from '@/lib/structuredData';
import { achievementManager } from '@/lib/achievements';
import Link from 'next/link';

export default function Home() {
  const stats = getGameStats();
  const featuredGames = getFeaturedGames();
  const kidsGames = getGamesByAgeGroup('kids').slice(0, 6);
  const brainGames = getGamesByAgeGroup('seniors').slice(0, 6);

  // Daily challenge — date-derived, no localStorage (safe for SSR)
  const dailyChallenge = achievementManager.getDailyChallenge();
  const dailyGame = dailyChallenge ? getGameById(dailyChallenge.gameId) : null;

  return (
    <>
      <Navigation />

      <main>
        {/* Structured Data for Homepage - FAQ Schema for rich snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: stringifySchema(getFAQSchema(HOMEPAGE_FAQS))
          }}
        />
        {/* ItemList Schema for Featured Games */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: stringifySchema(getGameListSchema(featuredGames, 'Featured Free Online Games'))
          }}
        />

        {/* Hero Section with Particles */}
        <section className="hero">
          <div className="hero-particles" />
          <h1 className="hero-title animate-float">
            {PLATFORM_CONFIG.name}
          </h1>
          <p className="tagline">{PLATFORM_CONFIG.tagline}</p>

          {/* Age Filter Tabs */}
          <div className="age-tabs">
            <Link href="/games" className="age-tab active glow-on-hover">
              🎯 All {stats.total} Games
            </Link>
            <Link href="/games/kids" className="age-tab glow-on-hover">
              👶 {stats.kids} Kids Games
            </Link>
            <Link href="/games/seniors" className="age-tab glow-on-hover">
              🧠 {stats.seniors} Brain Games
            </Link>
          </div>

          {/* Animated Stats */}
          <div className="stats-bar">
            <div className="stat-item animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="stat-value counter-animation">{stats.total}+</div>
              <div className="stat-label">Free Games</div>
            </div>
            <div className="stat-item animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="stat-value">100%</div>
              <div className="stat-label">No Download</div>
            </div>
            <div className="stat-item animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="stat-value">✨</div>
              <div className="stat-label">Premium Experience</div>
            </div>
          </div>
        </section>

        <div className="container">
          {/* ===== DAILY CHALLENGE CARD ===== */}
          {dailyGame && dailyChallenge && (
            <section style={{ marginBottom: '3rem' }}>
              <div style={{
                position: 'relative',
                background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(251,191,36,0.06) 50%, rgba(217,119,6,0.1) 100%)',
                border: '2px solid',
                borderImage: 'linear-gradient(135deg, #f59e0b, #fbbf24, #d97706) 1',
                borderRadius: '20px',
                padding: '2rem 2.5rem',
                overflow: 'hidden',
                boxShadow: '0 0 40px rgba(245,158,11,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}>
                {/* Animated glow orb */}
                <div style={{
                  position: 'absolute',
                  top: '-60px',
                  right: '-60px',
                  width: '200px',
                  height: '200px',
                  background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  {/* Trophy Icon */}
                  <div style={{
                    fontSize: '3.5rem',
                    flexShrink: 0,
                    animation: 'pulse-scale 3s ease-in-out infinite',
                    filter: 'drop-shadow(0 4px 12px rgba(251,191,36,0.6))',
                  }}>🏆</div>

                  {/* Challenge Info */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                        color: '#000',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        padding: '0.2rem 0.65rem',
                        borderRadius: '100px',
                        textTransform: 'uppercase',
                      }}>Today&apos;s Challenge</span>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(251,191,36,0.7)' }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <h2 style={{
                      fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                      fontWeight: 800,
                      color: '#fff',
                      marginBottom: '0.35rem',
                      lineHeight: 1.2,
                    }}>
                      {dailyGame.name}
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                      🎯 {dailyChallenge.objective} &nbsp;·&nbsp; +{dailyChallenge.reward.points} pts
                    </p>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`/play/${dailyGame.id}`}
                    id="daily-challenge-cta"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.85rem 1.75rem',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #d97706 100%)',
                      color: '#000',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
                      transition: 'all 0.2s',
                    }}
                    aria-label={`Play today's daily challenge: ${dailyGame.name}`}
                  >
                    Play Today&apos;s Challenge →
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Featured Games with Premium Badge */}
          <section style={{ marginBottom: '4rem' }}>
            <div className="section-header">
              <h2 className="section-title">
                <span className="premium-badge">⭐</span> Featured Games
              </h2>
              <Link href="/games" className="btn btn-primary shimmer">
                View All {stats.total} Games →
              </Link>
            </div>
            <div className="game-grid stagger-animation">
              {featuredGames.map((game, index) => (
                <div key={game.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <GameCard game={game} />
                </div>
              ))}
            </div>
          </section>

          {/* Kids Section with Vibrant Design */}
          <section style={{ marginBottom: '4rem' }}>
            <div className="section-header">
              <h2 className="section-title kids-gradient">
                👶 Fun for Kids ({stats.kids} Games)
              </h2>
              <Link href="/games/kids" className="btn btn-accent pulse-animation">
                See All Kids Games →
              </Link>
            </div>
            <div className="game-grid">
              {kidsGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>


          {/* Brain Training Section */}
          <section style={{ marginBottom: '4rem' }}>
            <div className="section-header">
              <h2 className="section-title brain-gradient">
                🧠 Brain Training ({stats.seniors} Games)
              </h2>
              <Link href="/category/brain-training" className="btn btn-ghost">
                See All Brain Games →
              </Link>
            </div>
            <div className="game-grid">
              {brainGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>

          {/* NEW: Puzzle Solvers & Makers Highlight */}
          <section style={{ marginBottom: '4rem' }}>
            <div className="card" style={{
              padding: '2.5rem',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(168, 85, 247, 0.1))',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              textAlign: 'center',
            }}>
              <h2 style={{
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: 700,
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #fbbf24, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                ✨ Stuck on a Puzzle? Use Our Free Solvers!
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
                Whether you&apos;re solving a Sudoku, unscrambling letters for Scrabble, or creating worksheets for your classroom — we&apos;ve got you covered.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
                <Link href="/tools/sudoku-solver" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                  🧩 Sudoku Solver
                </Link>
                <Link href="/tools/word-unscrambler" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                  🔠 Word Unscrambler
                </Link>
                <Link href="/tools/word-search-maker" className="btn btn-accent">
                  🖨️ Word Search Maker
                </Link>
                <Link href="/tools" className="btn btn-ghost">
                  View All Solvers →
                </Link>
              </div>
            </div>
          </section>

          {/* Interactive Categories */}
          <section style={{ marginBottom: '4rem' }}>
            <div className="section-header">
              <h2 className="section-title">📂 Browse by Category</h2>
            </div>
            <div className="category-grid">
              {GAME_CATEGORIES.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="card category-card hover-lift"
                  style={{
                    padding: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    textDecoration: 'none',
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <span
                    className="category-icon"
                    style={{
                      fontSize: '3rem',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                    }}
                  >
                    {category.icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      color: 'white',
                      marginBottom: '0.5rem',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                    }}>
                      {category.name}
                    </h3>
                    <p style={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.95rem',
                      lineHeight: 1.5,
                    }}>
                      {category.description}
                    </p>
                  </div>
                  <span className="category-arrow">→</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Blog & Tips Section - SEO Content */}
          <section style={{ marginBottom: '4rem' }}>
            <div className="section-header">
              <h2 className="section-title">📝 Learn & Improve</h2>
              <Link href="/blog" className="btn btn-ghost">
                Read All Articles →
              </Link>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}>
              {/* Article 1 */}
              <Link href="/blog#logic-puzzles-boost-brain" style={{ textDecoration: 'none' }}>
                <article className="card hover-lift" style={{
                  padding: '1.75rem',
                  height: '100%',
                  background: 'linear-gradient(145deg, rgba(99, 102, 241, 0.08), rgba(99, 102, 241, 0.02))',
                  border: '1px solid rgba(99, 102, 241, 0.15)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>🧠</span>
                    <span style={{
                      background: 'rgba(99, 102, 241, 0.2)',
                      borderRadius: '100px',
                      padding: '0.2rem 0.6rem',
                      fontSize: '0.7rem',
                      color: '#a5b4fc',
                      fontWeight: 600,
                    }}>Brain Training</span>
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    5 Reasons Why Logic Puzzles Boost Your Brain Power
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Discover the science-backed cognitive benefits of solving logic puzzles daily.
                  </p>
                </article>
              </Link>

              {/* Article 2 */}
              <Link href="/blog#how-to-play-sudoku" style={{ textDecoration: 'none' }}>
                <article className="card hover-lift" style={{
                  padding: '1.75rem',
                  height: '100%',
                  background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.02))',
                  border: '1px solid rgba(16, 185, 129, 0.15)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>🔢</span>
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      borderRadius: '100px',
                      padding: '0.2rem 0.6rem',
                      fontSize: '0.7rem',
                      color: '#6ee7b7',
                      fontWeight: 600,
                    }}>Tutorial</span>
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    How to Play Sudoku: A Beginner&apos;s Guide
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Learn the fundamental rules and techniques to start solving with confidence.
                  </p>
                </article>
              </Link>

              {/* Article 3 */}
              <Link href="/blog#tips-solve-hard-puzzles" style={{ textDecoration: 'none' }}>
                <article className="card hover-lift" style={{
                  padding: '1.75rem',
                  height: '100%',
                  background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.08), rgba(245, 158, 11, 0.02))',
                  border: '1px solid rgba(245, 158, 11, 0.15)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>⚡</span>
                    <span style={{
                      background: 'rgba(245, 158, 11, 0.2)',
                      borderRadius: '100px',
                      padding: '0.2rem 0.6rem',
                      fontSize: '0.7rem',
                      color: '#fbbf24',
                      fontWeight: 600,
                    }}>Game Tips</span>
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    Tips to Solve Hard Puzzles Faster
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Master scanning techniques and strategies expert solvers use.
                  </p>
                </article>
              </Link>
            </div>
          </section>

          {/* SEO Content Block with Enhanced Design */}
          <section className="card" style={{
            marginBottom: '4rem',
            padding: '3rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}>
            <h2 style={{
              marginBottom: '1.5rem',
              fontSize: '2rem',
              background: 'linear-gradient(135deg, #fff 0%, #c7d2fe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Welcome to PuzzlyNest - {stats.total}+ Free Online Games
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.8)',
              marginBottom: '1.5rem',
              fontSize: '1.1rem',
              lineHeight: 1.8,
            }}>
              PuzzlyNest is your cozy destination for free online games designed for everyone.
              Our collection of <strong>{stats.total}+ games</strong> includes brain training puzzles
              to keep your mind sharp, and safe, fun educational games that kids will love.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginTop: '2rem',
            }}>
              <div className="feature-box">
                <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧠</span>
                <h3 style={{ marginBottom: '0.5rem' }}>Brain Training</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                  {stats.seniors} games designed to keep your mind sharp
                </p>
              </div>
              <div className="feature-box">
                <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👶</span>
                <h3 style={{ marginBottom: '0.5rem' }}>Safe for Kids</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                  {stats.kids} educational & fun games with no chat or external links
                </p>
              </div>
              <div className="feature-box">
                <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎮</span>
                <h3 style={{ marginBottom: '0.5rem' }}>No Download</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                  Play instantly in your browser, works on all devices
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Section - Matches structured data for rich snippets */}
          <section style={{ marginBottom: '4rem' }}>
            <div className="section-header">
              <h2 className="section-title">❓ Frequently Asked Questions</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {HOMEPAGE_FAQS.map((faq, index) => (
                <details
                  key={index}
                  className="card"
                  style={{
                    padding: '1.5rem',
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.02))',
                    border: '1px solid rgba(99, 102, 241, 0.15)',
                  }}
                >
                  <summary style={{
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    color: '#fff',
                    listStyle: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    {faq.question}
                    <span style={{ marginLeft: '1rem', transition: 'transform 0.2s' }}>▼</span>
                  </summary>
                  <p style={{
                    marginTop: '1rem',
                    color: 'rgba(255,255,255,0.75)',
                    lineHeight: 1.7,
                    fontSize: '0.95rem',
                  }}>
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main >

      <Footer />
    </>
  );
}
