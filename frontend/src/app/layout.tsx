import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { SubPageNav } from '@/components/SubPageNav';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Africa Game — Régulation des flux de jeux',
  description: 'Plateforme panafricaine de régulation, concentrateur de paiements et monitoring des paris',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Navbar />
        <SubPageNav />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
