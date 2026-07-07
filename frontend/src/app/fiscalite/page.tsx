'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getStoredUser } from '@/lib/api';
export default function FiscalPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Array<{
    id: string; periodStart: string; periodEnd: string;
    pbjAmount: number; levyAmount: number; currencyCode: string; status: string;
    gameOperator?: { name: string }; jurisdiction?: { name: string };
  }>>([]);

  useEffect(() => {
    if (!getStoredUser()) { router.push('/connexion'); return; }
    api.invoices().then(setInvoices).catch(() => {});
  }, [router]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Fiscalité & prélèvements</h1>
      <p className="mb-6 text-sm text-gray-500">Calcul automatique des prélèvements PBJ selon les règles de chaque juridiction</p>
      <div className="space-y-4">
        {invoices.map((inv) => (
          <div key={inv.id} className="card">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">{inv.gameOperator?.name} — {inv.jurisdiction?.name}</p>
                <p className="text-sm text-gray-500">{new Date(inv.periodStart).toLocaleDateString('fr-FR')} → {new Date(inv.periodEnd).toLocaleDateString('fr-FR')}</p>
              </div>
              <span className="rounded bg-gray-100 px-2 py-1 text-xs">{inv.status}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <p>PBJ: <strong>{Number(inv.pbjAmount).toLocaleString()} {inv.currencyCode}</strong></p>
              <p>Prélèvement: <strong className="text-africa-green">{Number(inv.levyAmount).toLocaleString()} {inv.currencyCode}</strong></p>
            </div>
          </div>
        ))}
        {invoices.length === 0 && <p className="text-center text-gray-500">Aucune facture générée</p>}
      </div>
    </div>
  );
}
