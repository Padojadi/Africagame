'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getStoredUser } from '@/lib/api';
import { BackButton } from '@/components/BackButton';

export default function JurisdictionsPage() {
  const router = useRouter();
  const [jurisdictions, setJurisdictions] = useState<Array<{
    id: string; name: string; code: string; timezone: string;
    currency?: { code: string; symbol: string };
    allowedChannels?: Array<{ channel: string; enabled: boolean }>;
    _count?: { gameOperators: number };
  }>>([]);
  const [operators, setOperators] = useState<Array<{ id: string; name: string; licenseNumber: string; jurisdiction?: { name: string } }>>([]);

  useEffect(() => {
    if (!getStoredUser()) { router.push('/connexion'); return; }
    api.jurisdictions().then(setJurisdictions).catch(() => {});
    api.operators().then(setOperators).catch(() => {});
  }, [router]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <BackButton />
      <h1 className="mb-8 text-2xl font-bold">Juridictions & opérateurs</h1>
      <div className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jurisdictions.map((j) => (
          <div key={j.id} className="card">
            <p className="font-bold">{j.name} ({j.code})</p>
            <p className="text-sm text-gray-500">{j.currency?.code} · {j.timezone}</p>
            <p className="mt-2 text-sm">{j._count?.gameOperators ?? 0} opérateur(s)</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {j.allowedChannels?.filter((c) => c.enabled).map((c) => (
                <span key={c.channel} className="rounded bg-africa-green/10 px-2 py-0.5 text-xs text-africa-green">{c.channel}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <h2 className="mb-4 text-lg font-bold">Opérateurs de jeu licenciés</h2>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b text-gray-500"><th className="pb-2">Nom</th><th>Licence</th><th>Juridiction</th></tr></thead>
          <tbody>
            {operators.map((o) => (
              <tr key={o.id} className="border-b border-gray-100">
                <td className="py-2 font-medium">{o.name}</td>
                <td>{o.licenseNumber}</td>
                <td>{o.jurisdiction?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
