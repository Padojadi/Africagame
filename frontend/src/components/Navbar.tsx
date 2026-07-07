'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { clearAuth, getStoredUser, User } from '@/lib/api';
import { Lang, t } from '@/lib/i18n';
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

  const logout = () => {
    clearAuth();
    setUser(null);
    window.location.href = '/';
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
          {user ? (
            <>
              <Link href="/admin" className="text-sm font-semibold text-africa-gold">{t(lang, 'dashboard')}</Link>
              <button onClick={logout} className="text-sm text-gray-500">{t(lang, 'logout')}</button>
            </>
          ) : (
            <Link href="/connexion" className="btn-primary text-sm">{t(lang, 'login')}</Link>
          )}
        </nav>

        <button className="md:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div className="border-t px-4 py-3 md:hidden">
          {user && nav.map((l) => <Link key={l.href} href={l.href} className="block py-2">{l.label}</Link>)}
          {user ? <button onClick={logout}>{t(lang, 'logout')}</button> : <Link href="/connexion">{t(lang, 'login')}</Link>}
        </div>
      )}
    </header>
  );
}
