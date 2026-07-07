'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getStoredUser } from '@/lib/api';

export default function AuditPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<Array<{
    id: string; action: string; entity: string; entityId?: string;
    createdAt: string; user?: { email: string; firstName: string; role: string };
  }>>([]);

  useEffect(() => {
    const u = getStoredUser();
    if (!u || u.role === 'OPERATEUR') { router.push('/connexion'); return; }
    api.audit().then(setLogs).catch(() => {});
  }, [router]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Journal d&apos;audit</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b text-gray-500"><th className="pb-2">Date</th><th>Action</th><th>Entité</th><th>Utilisateur</th></tr></thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-b border-gray-100">
                <td className="py-2">{new Date(l.createdAt).toLocaleString('fr-FR')}</td>
                <td>{l.action}</td>
                <td>{l.entity} {l.entityId ? `(${l.entityId.slice(0, 8)}…)` : ''}</td>
                <td>{l.user ? `${l.user.firstName} (${l.user.role})` : 'Système'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
