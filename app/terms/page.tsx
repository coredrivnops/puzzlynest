import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Terms of Use - PuzzlyNest',
    description: 'Terms of Use for PuzzlyNest. Please read these terms carefully before using our website.',
};

export default function TermsPage() {
    return (
        <>
            <Navigation />

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
                    maxWidth: '800px',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                        marginBottom: '0.5rem',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #a5b4fc 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 800,
                    }}>
                        Terms of Use
                    </h1>
                    <p style={{
                        textAlign: 'center',
                        color: 'rgba(255,255,255,0.5)',
                        marginBottom: '2rem',
                        fontSize: '0.9rem',
                    }}>
                        Last Updated: January 2026
                    </p>

                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '2.5rem',
                    }}>
                        {/* Section 1 */}
                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#c7d2fe', fontSize: '1.25rem', marginBottom: '1rem' }}>
                                1. Acceptance of Terms
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
                                By accessing and using <code style={{ color: '#a5b4fc' }}>puzzlynest.com</code> (the &quot;Site&quot;),
                                you accept and agree to be bound by the terms and provision of this agreement.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#c7d2fe', fontSize: '1.25rem', marginBottom: '1rem' }}>
                                2. Use of Content
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
                                All content provided on this Site, including games, text, and graphics, is for personal,
                                non-commercial use only. You may not reproduce, distribute, or exploit the content without
                                our prior written permission.
                            </p>
                        </section>

                        {/* Section 3 */}
                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#c7d2fe', fontSize: '1.25rem', marginBottom: '1rem' }}>
                                3. Disclaimer of Warranties
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
                                The Site and its original content, features, and functionality are provided &quot;as is&quot; and
                                &quot;as available&quot; without any warranties of any kind, either express or implied. We do not
                                guarantee that the Site will be error-free or uninterrupted.
                            </p>
                        </section>

                        {/* Section 4 */}
                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#c7d2fe', fontSize: '1.25rem', marginBottom: '1rem' }}>
                                4. Third-Party Links
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
                                Our Site may contain links to third-party web sites or services (such as advertisements served
                                by Google) that are not owned or controlled by PuzzlyNest. We have no control over, and assume
                                no responsibility for, the content, privacy policies, or practices of any third-party web sites.
                            </p>
                        </section>

                        {/* Section 5 - Governing Law */}
                        <section style={{
                            marginBottom: '2rem',
                            padding: '1.5rem',
                            background: 'rgba(99, 102, 241, 0.1)',
                            borderRadius: '12px',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                        }}>
                            <h2 style={{ color: '#c7d2fe', fontSize: '1.25rem', marginBottom: '1rem' }}>
                                5. Governing Law
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.8 }}>
                                These Terms shall be governed and construed in accordance with the laws of <strong>India</strong>,
                                without regard to its conflict of law provisions.
                            </p>
                        </section>

                        {/* Section 6 */}
                        <section>
                            <h2 style={{ color: '#c7d2fe', fontSize: '1.25rem', marginBottom: '1rem' }}>
                                6. Changes to Terms
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                                Any changes will be posted on this page with an updated &quot;Last Updated&quot; date.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
