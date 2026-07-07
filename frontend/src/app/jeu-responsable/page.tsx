'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getStoredUser } from '@/lib/api';
export default function ResponsibleGamingPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Array<{
    id: string; msisdn?: string; riskLevel: string;
    totalDeposits: number; totalBets: number; notes?: string;
  }>>([]);

  useEffect(() => {
    const u = getStoredUser();
    if (!u || u.role === 'OPERATEUR') { router.push('/connexion'); return; }
    api.responsibleGaming().then(setProfiles).catch(() => {});
  }, [router]);

  const riskColor: Record<string, string> = {
    LOW: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    CRITICAL: 'bg-red-100 text-red-800',
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">Jeu responsable</h1>
      <p className="mb-6 text-sm text-gray-500">Catégorisation des parieurs (y compris MSISDN USSD/SMS)</p>
      <div className="space-y-3">
        {profiles.map((p) => (
          <div key={p.id} className="card flex items-center justify-between">
            <div>
              <p className="font-medium">{p.msisdn || 'Réf. anonyme'}</p>
              <p className="text-sm text-gray-500">Dépôts: {Number(p.totalDeposits).toLocaleString()} · Paris: {Number(p.totalBets).toLocaleString()}</p>
              {p.notes && <p className="mt-1 text-xs text-gray-400">{p.notes}</p>}
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${riskColor[p.riskLevel] || ''}`}>{p.riskLevel}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
