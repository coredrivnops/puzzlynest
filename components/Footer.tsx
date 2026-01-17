'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-links">
                <Link href="/about" className="footer-link">About</Link>
                <Link href="/blog" className="footer-link">Blog</Link>
                <Link href="/sitemap-html" className="footer-link">Sitemap</Link>
                <Link href="/privacy" className="footer-link">Privacy Policy</Link>
                <Link href="/terms" className="footer-link">Terms of Use</Link>
                <Link href="/contact" className="footer-link">Contact</Link>
            </div>
            <p className="footer-copy">
                © {new Date().getFullYear()} PuzzlyNest. Your cozy corner for brain games.
                <br />
                <span style={{ fontSize: '0.75rem' }}>
                    This website contains ads to keep our games free.
                </span>
            </p>
        </footer>
    );
}
