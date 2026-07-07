'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { clearAuth, getStoredUser, User } from '@/lib/api';
import { Gamepad2, Menu, X } from 'lucide-react';

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const logout = () => {
    clearAuth();
    setUser(null);
    window.location.href = '/';
  };

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/hackathons', label: 'Hackathons' },
    { href: '/formations', label: 'Formations' },
    { href: '/actualites', label: 'Actualités' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-africa-green">
          <Gamepad2 className="h-8 w-8" />
          <span>Africa Game</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-gray-700 hover:text-africa-green">
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <Link href="/admin" className="text-sm font-semibold text-africa-gold">
                  Administration
                </Link>
              )}
              <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-africa-green">
                Mon espace
              </Link>
              <button onClick={logout} className="text-sm text-gray-500 hover:text-africa-red">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/connexion" className="text-sm font-medium text-gray-700 hover:text-africa-green">
                Connexion
              </Link>
              <Link href="/inscription" className="btn-primary">
                S&apos;inscrire
              </Link>
            </>
          )}
        </nav>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                {user.role === 'ADMIN' && <Link href="/admin">Administration</Link>}
                <Link href="/dashboard">Mon espace</Link>
                <button onClick={logout}>Déconnexion</button>
              </>
            ) : (
              <>
                <Link href="/connexion">Connexion</Link>
                <Link href="/inscription">S&apos;inscrire</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
