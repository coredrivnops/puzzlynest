'use client';

import { useState } from 'react';

interface SocialShareProps {
    url?: string;
    title?: string;
    description?: string;
    gameScore?: number;
}

export default function SocialShare({ url, title, description, gameScore }: SocialShareProps) {
    const [copied, setCopied] = useState(false);

    // Use current URL if not provided
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const shareTitle = title || 'Check out this game on PuzzlyNest!';
    const shareText = gameScore
        ? `I scored ${gameScore} points! ${shareTitle}`
        : description || shareTitle;

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
        pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}`,
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleShare = (platform: keyof typeof shareLinks) => {
        window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    };

    // Native share if available
    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        }
    };

    return (
        <div className="social-share" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap'
        }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Share:</span>

            {/* Twitter/X */}
            <button
                onClick={() => handleShare('twitter')}
                className="share-btn"
                title="Share on Twitter"
                style={shareButtonStyle}
            >
                𝕏
            </button>

            {/* Facebook */}
            <button
                onClick={() => handleShare('facebook')}
                className="share-btn"
                title="Share on Facebook"
                style={{ ...shareButtonStyle, background: 'rgba(24, 119, 242, 0.2)' }}
            >
                f
            </button>

            {/* WhatsApp */}
            <button
                onClick={() => handleShare('whatsapp')}
                className="share-btn"
                title="Share on WhatsApp"
                style={{ ...shareButtonStyle, background: 'rgba(37, 211, 102, 0.2)' }}
            >
                💬
            </button>

            {/* Pinterest */}
            <button
                onClick={() => handleShare('pinterest')}
                className="share-btn"
                title="Share on Pinterest"
                style={{ ...shareButtonStyle, background: 'rgba(189, 8, 28, 0.2)' }}
            >
                📌
            </button>

            {/* Copy Link */}
            <button
                onClick={copyToClipboard}
                className="share-btn"
                title="Copy link"
                style={{ ...shareButtonStyle, background: copied ? 'rgba(16, 185, 129, 0.3)' : 'rgba(100, 100, 100, 0.2)' }}
            >
                {copied ? '✓' : '🔗'}
            </button>

            {/* Native Share (mobile) */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                    onClick={handleNativeShare}
                    className="share-btn"
                    title="Share"
                    style={{ ...shareButtonStyle, background: 'rgba(99, 102, 241, 0.2)' }}
                >
                    📤
                </button>
            )}
        </div>
    );
}

const shareButtonStyle: React.CSSProperties = {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
};

// Compact version for game cards
export function ShareButton({ url, title }: { url: string; title: string }) {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch {
                // Fallback to copy
                navigator.clipboard.writeText(url);
            }
        } else {
            navigator.clipboard.writeText(url);
        }
    };

    return (
        <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleShare(); }}
            style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.9rem'
            }}
            title="Share"
        >
            📤
        </button>
    );
}
