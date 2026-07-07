'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api, getStoredUser } from '@/lib/api';
interface Payment {
  id: string;
  nature: string;
  amount: number;
  currencyCode: string;
  channel: string;
  msisdn?: string;
  status: string;
  operatedAt: string;
  gameOperator?: { name: string };
  jurisdiction?: { name: string };
}

function PaymentsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [items, setItems] = useState<Payment[]>([]);

  useEffect(() => {
    if (!getStoredUser()) { router.push('/connexion'); return; }
    const q = params.toString();
    api.payments(q).then(setItems).catch(() => {});
  }, [router, params]);

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b text-gray-500">
            <th className="pb-2">Date</th><th>Juridiction</th><th>Opérateur</th><th>Nature</th>
            <th>Montant</th><th>Canal</th><th>MSISDN</th><th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="border-b border-gray-100">
              <td className="py-2">{new Date(p.operatedAt).toLocaleString('fr-FR')}</td>
              <td>{p.jurisdiction?.name}</td>
              <td>{p.gameOperator?.name}</td>
              <td>{p.nature}</td>
              <td className="font-medium">{Number(p.amount).toLocaleString()} {p.currencyCode}</td>
              <td><span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{p.channel}</span></td>
              <td>{p.msisdn || '-'}</td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <p className="py-8 text-center text-gray-500">Aucune transaction</p>}
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Concentrateur de paiements</h1>
      <Suspense fallback={<p>Chargement...</p>}>
        <PaymentsContent />
      </Suspense>
    </div>
  );
}
