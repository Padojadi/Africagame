'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getStoredUser, User } from '@/lib/api';
import { Lang, t } from '@/lib/i18n';
import { UserMenu } from '@/components/UserMenu';
import { Shield, Menu, X, Globe } from 'lucide-react';

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>('fr');

  useEffect(() => {
    setUser(getStoredUser());
    const saved = localStorage.getItem('lang') as Lang;
    if (saved) setLang(saved);
  }, []);

  const changeLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem('lang', l);
  };

  const nav = [
    { href: '/paiements', label: t(lang, 'payments') },
    { href: '/paris', label: t(lang, 'bets') },
    { href: '/fiscalite', label: t(lang, 'fiscal') },
    { href: '/juridictions', label: t(lang, 'jurisdictions') },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-africa-green">
          <Shield className="h-7 w-7" />
          <span>Africa Game</span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {user && nav.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-gray-700 hover:text-africa-green">{l.label}</Link>
          ))}
          <div className="flex items-center gap-1 text-xs">
            <Globe className="h-4 w-4 text-gray-400" />
            {(['fr', 'en', 'pt', 'ar'] as Lang[]).map((l) => (
              <button key={l} onClick={() => changeLang(l)} className={`rounded px-1.5 py-0.5 uppercase ${lang === l ? 'bg-africa-green text-white' : 'text-gray-500'}`}>{l}</button>
            ))}
          </div>
          <UserMenu lang={lang} />
        </nav>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t px-4 py-3 md:hidden">
          {user && nav.map((l) => (
            <Link key={l.href} href={l.href} className="block py-2" onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          {user ? (
            <>
              <Link href="/profil" className="block py-2" onClick={() => setOpen(false)}>{t(lang, 'profile')}</Link>
              <Link href="/profil#portefeuille" className="block py-2" onClick={() => setOpen(false)}>{t(lang, 'wallet')}</Link>
              <Link href="/admin" className="block py-2" onClick={() => setOpen(false)}>{t(lang, 'dashboard')}</Link>
            </>
          ) : (
            <Link href="/connexion" className="block py-2">{t(lang, 'login')}</Link>
          )}
          <div className="mt-2 md:hidden">
            <UserMenu lang={lang} />
          </div>
        </div>
      )}
    </header>
  );
}
