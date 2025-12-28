import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Privacy Policy - PlayZen',
    description: 'PlayZen privacy policy - how we handle your data and protect your privacy.',
};

export default function PrivacyPage() {
    return (
        <>
            <Navigation />

            <main className="container" style={{ paddingTop: '2rem', maxWidth: '800px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Privacy Policy</h1>

                <div className="card" style={{ padding: '2rem' }}>
                    <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    <h2 style={{ marginBottom: '1rem' }}>Information We Collect</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', lineHeight: 1.8 }}>
                        PlayZen does not require registration or collect personal information.
                        We may collect anonymous usage data to improve our games.
                    </p>

                    <h2 style={{ marginBottom: '1rem' }}>Cookies</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', lineHeight: 1.8 }}>
                        We use essential cookies to remember your game preferences.
                        Third-party advertising partners may use cookies for ad personalization.
                    </p>

                    <h2 style={{ marginBottom: '1rem' }}>Advertising</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', lineHeight: 1.8 }}>
                        We use Google AdSense to display advertisements. Google may use cookies
                        to serve ads based on your prior visits. You can opt out of personalized
                        advertising at Google&apos;s Ads Settings.
                    </p>

                    <h2 style={{ marginBottom: '1rem' }}>Children&apos;s Privacy (COPPA)</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', lineHeight: 1.8 }}>
                        For games designed for children under 13, we comply with COPPA.
                        We do not collect personal information from children, and ads shown
                        in the kids section are not personalized.
                    </p>

                    <h2 style={{ marginBottom: '1rem' }}>Contact</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
                        If you have questions about this Privacy Policy, please contact us
                        at privacy@playzen.io.
                    </p>
                </div>
            </main>

            <Footer />
        </>
    );
}
