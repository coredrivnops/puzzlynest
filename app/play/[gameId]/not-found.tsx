import Link from 'next/link';

export default function NotFound() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
        }}>
            <div>
                <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>🎮</div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Game Not Found</h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
                    The game you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link href="/" className="btn btn-primary">
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}
