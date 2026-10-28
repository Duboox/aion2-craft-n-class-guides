import type { Metadata } from 'next';
import React from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aion 2 — SangreLatina Hub: Crafting (242), 8 Class Guides, Shugo.gg Inspector & Tools',
  description:
    'Complete Aion 2 Community Hub: 242 Client Recipes Auditor, 8 Class Guides (PvE/PvP), Live Shugo.gg Character Inspector & Leaderboard, Transcendence T1-T4 & Kinah-to-Quna Tools.',
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-[#0b0e14] text-[#edf1f7] antialiased selection:bg-[#d9b36c] selection:text-[#0b0e14]">
        {children}
      </body>
    </html>
  );
}
