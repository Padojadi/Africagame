'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getStoredUser, Dashboard, User } from '@/lib/api';
import { BackButton } from '@/components/BackButton';
import { CreditCard, BarChart3, AlertTriangle, Globe2, Users, FileText } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dash, setDash] = useState<Dashboard | null>(null);

  useEffect(() => {
    const u = getStoredUser();
    if (!u) { router.push('/connexion'); return; }
    setUser(u);
    api.dashboard().then(setDash).catch(() => {});
  }, [router]);

  if (!user) return <p className="p-8 text-center">Chargement...</p>;

  const cards = [
    { label: 'Transactions paiement', value: dash?.totals.payments ?? '-', icon: CreditCard, href: '/paiements' },
    { label: 'Paris déclarés', value: dash?.totals.bets ?? '-', icon: BarChart3, href: '/paris' },
    { label: 'Volume paiements', value: dash ? `${Number(dash.totals.paymentVolume).toLocaleString()}` : '-', icon: CreditCard, href: '/paiements' },
    { label: 'PBJ total', value: dash ? `${Number(dash.totals.pbj).toLocaleString()}` : '-', icon: BarChart3, href: '/paris' },
    { label: 'Juridictions', value: dash?.totals.jurisdictions ?? '-', icon: Globe2, href: '/juridictions' },
    { label: 'Opérateurs', value: dash?.totals.operators ?? '-', icon: Users, href: '/juridictions' },
    { label: 'Hors concentrateur', value: dash?.totals.outsidePayments ?? '-', icon: AlertTriangle, href: '/paiements?status=OUTSIDE_CONCENTRATOR' },
    { label: 'Non déclarés', value: dash?.totals.undeclaredBets ?? '-', icon: AlertTriangle, href: '/paris' },
  ];

  const adminLinks = user.role === 'EXPLOITANT' ? [
    { href: '/admin/utilisateurs', label: 'Gestion utilisateurs' },
    { href: '/admin/audit', label: 'Journal d\'audit' },
    { href: '/jeu-responsable', label: 'Jeu responsable' },
    { href: '/fiscalite', label: 'Fiscalité & factures' },
  ] : user.role === 'REGULATEUR' ? [
    { href: '/jeu-responsable', label: 'Jeu responsable' },
    { href: '/fiscalite', label: 'Prélèvements' },
    { href: '/admin/audit', label: 'Audit' },
  ] : [
    { href: '/fiscalite', label: 'Mes factures' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <BackButton href="/" label="Retour à l'accueil" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord — {user.role}</h1>
        <p className="text-gray-500">{user.firstName} {user.lastName} — {user.jurisdiction?.name || 'Vue globale'}</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="card flex items-center gap-3 hover:shadow-md">
            <Icon className="h-8 w-8 text-africa-green" />
            <div>
              <p className="text-xl font-bold">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {dash?.byChannel && (
        <div className="card mb-8">
          <h2 className="mb-4 font-bold">Paiements par canal</h2>
          <div className="grid gap-2 sm:grid-cols-4">
            {dash.byChannel.map((c) => (
              <div key={c.channel} className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="font-bold">{c.channel}</p>
                <p className="text-sm">{c._count} tx</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {adminLinks.map((l) => (
          <Link key={l.href} href={l.href} className="btn-secondary flex items-center gap-2">
            <FileText className="h-4 w-4" /> {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
