'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { clearAuth, getStoredUser, User } from '@/lib/api';
import { Lang, t } from '@/lib/i18n';
import { UserCircle, LayoutDashboard, Wallet, LogOut, ChevronDown } from 'lucide-react';

interface UserMenuProps {
  lang: Lang;
}

export function UserMenu({ lang }: UserMenuProps) {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const logout = () => {
    clearAuth();
    window.location.href = '/';
  };

  if (!user) {
    return (
      <Link href="/connexion" className="btn-primary text-sm" aria-label={t(lang, 'login')}>
        {t(lang, 'login')}
      </Link>
    );
  }

  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1.5 pl-1.5 pr-3 transition hover:border-africa-green hover:shadow-sm"
        aria-label={t(lang, 'myAccount')}
        aria-expanded={open}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-africa-green text-sm font-bold text-white">
          {initials || <UserCircle className="h-5 w-5" />}
        </span>
        <span className="hidden max-w-[120px] truncate text-sm font-medium text-gray-700 lg:block">
          {user.firstName}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
            <span className="mt-1 inline-block rounded-full bg-africa-green/10 px-2 py-0.5 text-xs font-medium text-africa-green">
              {user.role}
            </span>
          </div>

          <div className="py-1">
            <Link
              href="/profil"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <UserCircle className="h-4 w-4 text-africa-green" />
              {t(lang, 'profile')}
            </Link>
            <Link
              href="/profil#portefeuille"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Wallet className="h-4 w-4 text-africa-green" />
              {t(lang, 'wallet')}
            </Link>
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <LayoutDashboard className="h-4 w-4 text-africa-gold" />
              {t(lang, 'dashboard')}
            </Link>
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              {t(lang, 'logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
