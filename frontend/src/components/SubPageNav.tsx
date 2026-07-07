'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const PAGE_LABELS: Record<string, string> = {
  '/admin': 'Tableau de bord',
  '/admin/utilisateurs': 'Gestion des utilisateurs',
  '/admin/audit': 'Journal d\'audit',
  '/paiements': 'Paiements',
  '/paris': 'Paris',
  '/fiscalite': 'Fiscalité',
  '/juridictions': 'Juridictions',
  '/jeu-responsable': 'Jeu responsable',
  '/profil': 'Mon profil',
};

function getBackTarget(pathname: string): { href: string; label: string } {
  if (pathname.startsWith('/admin/')) {
    return { href: '/admin', label: 'Tableau de bord' };
  }
  if (pathname === '/admin') {
    return { href: '/', label: 'Accueil' };
  }
  if (pathname === '/profil') {
    return { href: '/admin', label: 'Tableau de bord' };
  }
  return { href: '/admin', label: 'Tableau de bord' };
}

export function SubPageNav() {
  const pathname = usePathname();

  if (!pathname || pathname === '/' || pathname === '/connexion') {
    return null;
  }

  const back = getBackTarget(pathname);
  const currentLabel = PAGE_LABELS[pathname] || 'Page';

  return (
    <div className="sticky top-[53px] z-40 border-b border-africa-green/20 bg-gradient-to-r from-africa-green/10 to-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link
          href={back.href}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border-2 border-africa-green bg-white px-4 py-2 text-sm font-bold text-africa-green shadow-sm transition hover:bg-africa-green hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          Retour
        </Link>

        <div className="hidden items-center gap-1 text-sm text-gray-500 sm:flex">
          <Link href={back.href} className="hover:text-africa-green">{back.label}</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-800">{currentLabel}</span>
        </div>
      </div>
    </div>
  );
}
