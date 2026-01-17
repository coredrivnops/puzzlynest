import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
    title: 'Privacy Policy - PuzzlyNest',
    description: 'Privacy Policy for PuzzlyNest. Learn how we collect, use, and protect your information.',
};

export default function PrivacyPage() {
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
                        Privacy Policy
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
                                1. Introduction
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
                                Welcome to <strong>PuzzlyNest</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting
                                your personal information and your right to privacy. This Privacy Policy explains how we collect,
                                use, and share your information when you visit our website <code style={{ color: '#a5b4fc' }}>puzzlynest.com</code>.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#c7d2fe', fontSize: '1.25rem', marginBottom: '1rem' }}>
                                2. Advertising and Cookies (Google AdSense)
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, marginBottom: '1rem' }}>
                                We use <strong>Google AdSense</strong> to display advertisements on our website.
                            </p>
                            <ul style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.9, marginLeft: '1.5rem' }}>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    <strong>Third-Party Vendors:</strong> Third-party vendors, including Google, use cookies to serve ads
                                    based on a user&apos;s prior visits to our website or other websites.
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    <strong>DoubleClick DART Cookie:</strong> Google&apos;s use of the advertising cookie enables it and its
                                    partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.
                                </li>
                                <li>
                                    <strong>Opt-Out:</strong> Users may opt-out of personalized advertising by visiting{' '}
                                    <Link href="https://www.google.com/settings/ads" target="_blank" style={{ color: '#a5b4fc' }}>
                                        Google Ad Settings
                                    </Link>.
                                </li>
                            </ul>
                        </section>

                        {/* Section 3 */}
                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#c7d2fe', fontSize: '1.25rem', marginBottom: '1rem' }}>
                                3. Data Collection
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, marginBottom: '1rem' }}>
                                We do not collect personally identifiable information (PII) like names or phone numbers unless you
                                voluntarily contact us via email. We automatically collect non-personal data via standard server logs, such as:
                            </p>
                            <ul style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.9, marginLeft: '1.5rem' }}>
                                <li>Browser type and version.</li>
                                <li>Operating system.</li>
                                <li>Date and time of visit.</li>
                            </ul>
                        </section>

                        {/* Section 4 */}
                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#c7d2fe', fontSize: '1.25rem', marginBottom: '1rem' }}>
                                4. GDPR Compliance (For European Visitors)
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
                                If you are visiting from the European Economic Area (EEA), you have the right to access, rectify,
                                or erase your personal data. We comply with the IAB Transparency and Consent Framework (TCF).
                                You may withdraw your consent for ad personalization at any time by clicking the &quot;Privacy Settings&quot;
                                link in the footer.
                            </p>
                        </section>

                        {/* Section 5 - Contact */}
                        <section>
                            <h2 style={{ color: '#c7d2fe', fontSize: '1.25rem', marginBottom: '1rem' }}>
                                5. Contact Us
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
                                If you have questions about this policy, please contact us at:
                            </p>
                            <p style={{ marginTop: '0.75rem' }}>
                                <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Email:</strong>{' '}
                                <Link href="mailto:solutions@coredrivn.com" style={{ color: '#a5b4fc' }}>
                                    solutions@coredrivn.com
                                </Link>
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
