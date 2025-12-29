import { NextRequest, NextResponse } from 'next/server';

// Google Search Console HTML File Verification
// Replace GOOGLE_VERIFICATION_FILE and GOOGLE_VERIFICATION_TOKEN with your actual values
// from Google Search Console

export async function GET(request: NextRequest) {
    // Get the filename from the URL
    const pathname = request.nextUrl.pathname;
    const filename = pathname.split('/').pop();

    // The verification token from Google Search Console
    // Format: google<token>.html
    const VERIFICATION_TOKEN = process.env.GOOGLE_VERIFICATION_TOKEN || '';

    // Check if this matches any Google verification file pattern
    if (filename?.startsWith('google') && filename?.endsWith('.html')) {
        // Extract the token from the filename
        const expectedToken = filename.replace('google', '').replace('.html', '');

        if (VERIFICATION_TOKEN && expectedToken === VERIFICATION_TOKEN) {
            return new NextResponse(
                `google-site-verification: ${filename}`,
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'text/html',
                    },
                }
            );
        }
    }

    return new NextResponse('Not Found', { status: 404 });
}
