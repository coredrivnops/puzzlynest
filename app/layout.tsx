import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PuzzlyNest - Free Brain Games for Kids & Seniors",
  description: "Play 100+ free online games at PuzzlyNest! Brain training puzzles for seniors and safe, fun educational games for kids. No download required!",
  keywords: "free games, brain games, kids games, senior games, online games, puzzle games, memory games, sudoku, solitaire, puzzlynest",
  authors: [{ name: "PuzzlyNest" }],
  openGraph: {
    title: "PuzzlyNest - Your Cozy Corner for Brain Games",
    description: "Free brain training games for seniors and safe, educational games for kids. 100+ games to play now!",
    type: "website",
    siteName: "PuzzlyNest",
    url: "https://puzzlynest.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "PuzzlyNest - Free Brain Games",
    description: "100+ free games for kids and seniors. Play now!",
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
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
