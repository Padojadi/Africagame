'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getStoredUser, User } from '@/lib/api';
import { BarChart3, Users, FolderKanban, Trophy, BookOpen, Newspaper } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<{
    totals: Record<string, number>;
    projectsByStatus: Array<{ status: string; _count: number }>;
    usersByRole: Array<{ role: string; _count: number }>;
  } | null>(null);

  useEffect(() => {
    const u = getStoredUser();
    if (!u || u.role !== 'ADMIN') {
      router.push('/connexion');
      return;
    }
    setUser(u);
    api.stats().then(setStats).catch(() => {});
  }, [router]);

  if (!user) return <div className="p-8 text-center">Chargement...</div>;

  const cards = [
    { label: 'Utilisateurs', value: stats?.totals.users ?? '-', icon: Users, href: '/admin/utilisateurs' },
    { label: 'Projets', value: stats?.totals.projects ?? '-', icon: FolderKanban, href: '/admin/projets' },
    { label: 'Hackathons', value: stats?.totals.hackathons ?? '-', icon: Trophy, href: '/hackathons' },
    { label: 'Formations', value: stats?.totals.courses ?? '-', icon: BookOpen, href: '/formations' },
    { label: 'Actualités', value: stats?.totals.news ?? '-', icon: Newspaper, href: '/actualites' },
    { label: 'Pays', value: stats?.totals.countries ?? '-', icon: BarChart3, href: '/' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Administration</h1>
        <p className="text-gray-500">Bienvenue, {user.firstName} — Accès complet (lecture, écriture, modification, création)</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="card flex items-center gap-4 transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-africa-green/10 text-africa-green">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {stats && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card">
            <h2 className="mb-4 font-bold">Projets par statut</h2>
            <ul className="space-y-2">
              {stats.projectsByStatus.map((p) => (
                <li key={p.status} className="flex justify-between text-sm">
                  <span>{p.status}</span>
                  <span className="font-semibold">{p._count}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h2 className="mb-4 font-bold">Utilisateurs par rôle</h2>
            <ul className="space-y-2">
              {stats.usersByRole.map((u) => (
                <li key={u.role} className="flex justify-between text-sm">
                  <span>{u.role}</span>
                  <span className="font-semibold">{u._count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
