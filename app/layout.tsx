import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { ANALYTICS_CONFIG } from "@/lib/analytics";
import { getOrganizationSchema, getWebSiteSchema, stringifySchema } from "@/lib/structuredData";

export const metadata: Metadata = {
  title: "PuzzlyNest - Free Brain Games & Puzzles Online",
  description: "Play 100+ free online games at PuzzlyNest! Brain training puzzles, educational games for kids, and fun for all ages. No download required!",
  keywords: "free games, brain games, kids games, online games, puzzle games, memory games, sudoku, solitaire, puzzlynest, educational games",
  authors: [{ name: "PuzzlyNest" }],
  metadataBase: new URL('https://puzzlynest.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "PuzzlyNest - Your Cozy Corner for Brain Games",
    description: "Free brain training games and safe, educational games for kids. 100+ games to play now!",
    type: "website",
    siteName: "PuzzlyNest",
    url: "https://puzzlynest.com",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PuzzlyNest - Free Brain Games",
    description: "100+ free games for all ages. Play now!",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: ANALYTICS_CONFIG.SEARCH_CONSOLE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#6366f1" />
        {/* AdSense will be added here after approval with new coredrivn.ops Publisher ID */}
        {/* Structured Data for SEO - Enhanced schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: stringifySchema(getWebSiteSchema())
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: stringifySchema(getOrganizationSchema())
          }}
        />
      </head>
      <body>
        {/* Google Analytics */}
        <GoogleAnalytics />

        {/* Animated Background */}
        <div className="bg-orbs">
          <div className="bg-orb bg-orb-1"></div>
          <div className="bg-orb bg-orb-2"></div>
          <div className="bg-orb bg-orb-3"></div>
        </div>

        {children}
      </body>
    </html>
  );
}
