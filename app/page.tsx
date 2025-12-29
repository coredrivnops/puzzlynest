import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';
import AdBanner from '@/components/AdBanner';
import { getFeaturedGames, getGamesByAgeGroup, getGameStats } from '@/lib/games';
import { GAME_CATEGORIES, PLATFORM_CONFIG } from '@/lib/config';
import Link from 'next/link';

export default function Home() {
  const stats = getGameStats();
  const featuredGames = getFeaturedGames();
  const kidsGames = getGamesByAgeGroup('kids').slice(0, 6);
  const brainGames = getGamesByAgeGroup('seniors').slice(0, 6); // Brain training games

  return (
    <>
      <Navigation />

      <main>
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
          {/* Ad Banner */}
          <AdBanner type="horizontal" slot="home-top" />

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

          {/* Ad Banner */}
          <AdBanner type="horizontal" slot="home-mid" />

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
        </div>
      </main>

      <Footer />
    </>
  );
}
