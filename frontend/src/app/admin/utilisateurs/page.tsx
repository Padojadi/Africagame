'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getStoredUser, User } from '@/lib/api';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const u = getStoredUser();
    if (!u || u.role !== 'EXPLOITANT') { router.push('/connexion'); return; }
    api.users().then(setUsers).catch(() => {});
  }, [router]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Gestion des utilisateurs</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b text-gray-500"><th className="pb-2">Nom</th><th>Email</th><th>Rôle</th><th>Juridiction</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-100">
                <td className="py-2">{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>
                <td><span className="rounded bg-africa-green/10 px-2 py-0.5 text-xs text-africa-green">{u.role}</span></td>
                <td>{u.jurisdiction?.name || 'Global'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
