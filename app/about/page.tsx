import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'About PlayZen - Free Games for Kids & Seniors',
    description: 'Learn about PlayZen, our mission to provide free, accessible games for all ages.',
};

export default function AboutPage() {
    return (
        <>
            <Navigation />

            <main className="container" style={{ paddingTop: '2rem', maxWidth: '800px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                    About PlayZen
                </h1>

                <section className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Our Mission</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
                        PlayZen was created with a simple goal: provide high-quality, free games that are
                        accessible and enjoyable for everyone, regardless of age. We believe that play is
                        essential for mental well-being, whether you&apos;re 4 or 94.
                    </p>
                </section>

                <section className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>For Seniors</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
                        Our brain training games feature large fonts, high contrast, and simple one-click
                        controls. Regular mental exercise through puzzles and games can help maintain
                        cognitive health and provide enjoyable entertainment.
                    </p>
                </section>

                <section className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>For Kids</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
                        Our kids games are designed with safety as the top priority. No external links,
                        no chat features, and age-appropriate content only. Games are designed to be
                        educational while remaining fun and engaging.
                    </p>
                </section>

                <section className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Free to Play</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
                        All games on PlayZen are completely free. We support our platform through
                        non-intrusive advertisements. No download, no signup, no hidden costs.
                    </p>
                </section>
            </main>

            <Footer />
        </>
    );
}
