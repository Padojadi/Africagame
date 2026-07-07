'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, clearAuth, getStoredUser, User, Payment, Invoice, Dashboard } from '@/lib/api';
import { BackButton } from '@/components/BackButton';
import { PasswordInput } from '@/components/PasswordInput';
import {
  UserCircle, Wallet, Database, LogOut, Shield, Building2, CreditCard, BarChart3,
} from 'lucide-react';

interface FullUser extends User {
  active?: boolean;
  mfaEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
  jurisdictionId?: string | null;
  gameOperatorId?: string | null;
}

export default function ProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<FullUser | null>(null);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) { router.push('/connexion'); return; }

    Promise.all([
      api.me() as Promise<FullUser>,
      api.dashboard().catch(() => null),
      api.payments().catch(() => []),
      api.invoices().catch(() => []),
    ]).then(([me, dash, pays, invs]) => {
      setUser(me);
      setDashboard(dash);
      setPayments(pays.slice(0, 10));
      setInvoices(invs.slice(0, 5));
    }).finally(() => setLoading(false));
  }, [router]);

  const logout = () => {
    clearAuth();
    router.push('/');
  };

  if (loading) return <p className="p-8 text-center text-gray-500">Chargement du profil...</p>;
  if (!user) return null;

  const currency = user.jurisdiction?.currency?.code ?? 'XOF';

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <BackButton href="/admin" label="Retour au tableau de bord" />
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-africa-green text-2xl font-bold text-white">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
            <p className="text-gray-500">{user.email}</p>
            <span className="mt-1 inline-block rounded-full bg-africa-green/10 px-3 py-0.5 text-xs font-semibold text-africa-green">
              {user.role}
            </span>
          </div>
        </div>
        <button onClick={logout} className="btn-secondary flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
          <LogOut className="h-4 w-4" /> Déconnexion
        </button>
      </div>

      {/* Profil */}
      <section className="card mb-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <UserCircle className="h-5 w-5 text-africa-green" /> Mon profil
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase text-gray-400">Prénom</dt>
            <dd className="font-medium">{user.firstName}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-400">Nom</dt>
            <dd className="font-medium">{user.lastName}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-400">Email</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-400">Rôle</dt>
            <dd className="font-medium">{user.role}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-400">Statut</dt>
            <dd className="font-medium">{user.active !== false ? '✅ Actif' : '❌ Inactif'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-400">MFA</dt>
            <dd className="font-medium">{user.mfaEnabled ? 'Activé' : 'Non activé'}</dd>
          </div>
          {user.jurisdiction && (
            <div>
              <dt className="text-xs font-medium uppercase text-gray-400">Juridiction</dt>
              <dd className="font-medium">{user.jurisdiction.name} ({user.jurisdiction.code})</dd>
            </div>
          )}
          {user.gameOperator && (
            <div>
              <dt className="text-xs font-medium uppercase text-gray-400">Opérateur de jeu</dt>
              <dd className="font-medium">{user.gameOperator.name}</dd>
            </div>
          )}
        </dl>
      </section>

      {/* Métadonnées */}
      <section className="card mb-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <Database className="h-5 w-5 text-africa-green" /> Métadonnées du compte
        </h2>
        <dl className="grid gap-3 text-sm">
          <div className="flex justify-between border-b border-gray-100 py-2">
            <dt className="text-gray-500">Identifiant (UUID)</dt>
            <dd className="font-mono text-xs">{user.id}</dd>
          </div>
          {user.jurisdictionId && (
            <div className="flex justify-between border-b border-gray-100 py-2">
              <dt className="text-gray-500">ID Juridiction</dt>
              <dd className="font-mono text-xs">{user.jurisdictionId}</dd>
            </div>
          )}
          {user.gameOperatorId && (
            <div className="flex justify-between border-b border-gray-100 py-2">
              <dt className="text-gray-500">ID Opérateur</dt>
              <dd className="font-mono text-xs">{user.gameOperatorId}</dd>
            </div>
          )}
          {user.gameOperator?.licenseNumber && (
            <div className="flex justify-between border-b border-gray-100 py-2">
              <dt className="text-gray-500">N° Licence</dt>
              <dd className="font-medium">{user.gameOperator.licenseNumber}</dd>
            </div>
          )}
          {user.jurisdiction?.currency && (
            <div className="flex justify-between border-b border-gray-100 py-2">
              <dt className="text-gray-500">Devise juridiction</dt>
              <dd className="font-medium">{user.jurisdiction.currency.code} ({user.jurisdiction.currency.symbol})</dd>
            </div>
          )}
          {user.createdAt && (
            <div className="flex justify-between border-b border-gray-100 py-2">
              <dt className="text-gray-500">Compte créé le</dt>
              <dd>{new Date(user.createdAt).toLocaleString('fr-FR')}</dd>
            </div>
          )}
          {user.updatedAt && (
            <div className="flex justify-between py-2">
              <dt className="text-gray-500">Dernière mise à jour</dt>
              <dd>{new Date(user.updatedAt).toLocaleString('fr-FR')}</dd>
            </div>
          )}
        </dl>
      </section>

      {/* Portefeuille */}
      <section id="portefeuille" className="card mb-6 scroll-mt-24">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <Wallet className="h-5 w-5 text-africa-green" /> Mon portefeuille
        </h2>

        {dashboard && (
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-africa-green/5 p-4 text-center">
              <CreditCard className="mx-auto mb-2 h-6 w-6 text-africa-green" />
              <p className="text-xl font-bold">{Number(dashboard.totals.paymentVolume).toLocaleString()}</p>
              <p className="text-xs text-gray-500">Volume paiements ({currency})</p>
            </div>
            <div className="rounded-xl bg-africa-gold/10 p-4 text-center">
              <BarChart3 className="mx-auto mb-2 h-6 w-6 text-amber-600" />
              <p className="text-xl font-bold">{Number(dashboard.totals.pbj).toLocaleString()}</p>
              <p className="text-xs text-gray-500">PBJ total ({currency})</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <p className="text-xl font-bold">{dashboard.totals.payments}</p>
              <p className="text-xs text-gray-500">Transactions</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <p className="text-xl font-bold">{dashboard.totals.bets}</p>
              <p className="text-xs text-gray-500">Paris déclarés</p>
            </div>
          </div>
        )}

        <h3 className="mb-3 text-sm font-semibold text-gray-700">Dernières transactions</h3>
        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2">Date</th><th>Nature</th><th>Montant</th><th>Canal</th><th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50">
                    <td className="py-2">{new Date(p.operatedAt).toLocaleDateString('fr-FR')}</td>
                    <td>{p.nature}</td>
                    <td className="font-medium">{Number(p.amount).toLocaleString()} {p.currencyCode}</td>
                    <td>{p.channel}</td>
                    <td>{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Aucune transaction sur votre périmètre.</p>
        )}

        {invoices.length > 0 && (
          <>
            <h3 className="mb-3 mt-6 text-sm font-semibold text-gray-700">Factures & prélèvements</h3>
            <div className="space-y-2">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{inv.jurisdiction?.name} — {inv.gameOperator?.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(inv.periodStart).toLocaleDateString('fr-FR')} → {new Date(inv.periodEnd).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-africa-green">{Number(inv.levyAmount).toLocaleString()} {inv.currencyCode}</p>
                    <p className="text-xs text-gray-500">{inv.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Accès rapides selon rôle */}
      <section className="card">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <Shield className="h-5 w-5 text-africa-green" /> Accès rapides
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin" className="btn-secondary text-sm">Tableau de bord</Link>
          <Link href="/paiements" className="btn-secondary text-sm">Paiements</Link>
          <Link href="/paris" className="btn-secondary text-sm">Paris</Link>
          <Link href="/fiscalite" className="btn-secondary text-sm">Fiscalité</Link>
          {user.role === 'EXPLOITANT' && (
            <Link href="/admin/utilisateurs" className="btn-secondary text-sm">Utilisateurs</Link>
          )}
          {(user.role === 'EXPLOITANT' || user.role === 'REGULATEUR') && (
            <Link href="/jeu-responsable" className="btn-secondary text-sm">Jeu responsable</Link>
          )}
          {user.jurisdiction && (
            <Link href="/juridictions" className="btn-secondary flex items-center gap-1 text-sm">
              <Building2 className="h-4 w-4" /> Juridictions
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
