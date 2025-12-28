'use client';

interface AdBannerProps {
    type: 'horizontal' | 'square' | 'vertical';
    slot?: string;
}

export default function AdBanner({ type, slot }: AdBannerProps) {
    // Placeholder for AdSense integration
    // Replace with actual AdSense code once approved

    const sizes = {
        horizontal: { width: '728px', height: '90px' },
        square: { width: '300px', height: '250px' },
        vertical: { width: '160px', height: '600px' },
    };

    const size = sizes[type];

    return (
        <div
            className="ad-banner"
            style={{
                maxWidth: size.width,
                minHeight: size.height,
                margin: '1.5rem auto',
            }}
            data-ad-slot={slot}
        >
            {/* AdSense will inject content here */}
            <span>Advertisement</span>
        </div>
    );
}
