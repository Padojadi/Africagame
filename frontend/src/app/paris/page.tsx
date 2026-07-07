'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getStoredUser } from '@/lib/api';
import { BackButton } from '@/components/BackButton';

interface Bet {
  id: string;
  nature: string;
  amount: number;
  currencyCode: string;
  channel: string;
  gameType: string;
  msisdn?: string;
  status: string;
  operatedAt: string;
  gameOperator?: { name: string };
}

export default function BetsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Bet[]>([]);
  const [pbj, setPbj] = useState<{ pbj: number; count: number } | null>(null);

  useEffect(() => {
    if (!getStoredUser()) { router.push('/connexion'); return; }
    api.bets().then(setItems).catch(() => {});
    api.pbj().then(setPbj).catch(() => {});
  }, [router]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <BackButton />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Monitoring des paris</h1>
        {pbj && <p className="rounded-lg bg-africa-green/10 px-4 py-2 text-sm font-semibold text-africa-green">PBJ: {Number(pbj.pbj).toLocaleString()} ({pbj.count} paris)</p>}
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="pb-2">Date</th><th>Opérateur</th><th>Nature</th><th>Type</th>
              <th>Montant</th><th>Canal</th><th>MSISDN</th><th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr key={b.id} className="border-b border-gray-100">
                <td className="py-2">{new Date(b.operatedAt).toLocaleString('fr-FR')}</td>
                <td>{b.gameOperator?.name}</td>
                <td>{b.nature}</td>
                <td>{b.gameType}</td>
                <td>{Number(b.amount).toLocaleString()} {b.currencyCode}</td>
                <td>{b.channel}</td>
                <td>{b.msisdn || '-'}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
