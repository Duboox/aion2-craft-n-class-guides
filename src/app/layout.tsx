import type { Metadata } from 'next';
import React from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aion 2 — Craft, Market Auditor & Class Guides (Azphel 12106)',
  description:
    'Live Aion 2 Crafting Calculator, IndexedDB Market Auditor (aion2.gg x aion2.exchange) & Chanter/Gladiator Guides in Spanish and English.',
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-[#070b14] text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
