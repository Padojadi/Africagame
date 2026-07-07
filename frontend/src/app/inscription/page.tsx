'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, setAuth } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [countries, setCountries] = useState<Array<{ id: string; name: string; flagEmoji?: string }>>([]);
  const [form, setForm] = useState({
    email: '', password: '', firstName: '', lastName: '', age: '', phone: '', countryId: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.countries().then(setCountries).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.register({
        ...form,
        age: form.age ? parseInt(form.age) : undefined,
        countryId: form.countryId || undefined,
      });
      setAuth(res.accessToken, res.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inscription');
    } finally {
      setLoading(false);
    }
  };

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="card">
        <h1 className="mb-2 text-2xl font-bold">Inscription</h1>
        <p className="mb-6 text-sm text-gray-500">Jeunes talents africains (18-30 ans) — 100% gratuit</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Prénom</label>
              <input className="input" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} required />
            </div>
            <div>
              <label className="label">Nom</label>
              <input className="input" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={form.email} onChange={(e) => set('email', e.target.value)} required />
          </div>
          <div>
            <label className="label">Mot de passe</label>
            <input type="password" className="input" value={form.password} onChange={(e) => set('password', e.target.value)} minLength={8} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Âge</label>
              <input type="number" className="input" min={18} max={35} value={form.age} onChange={(e) => set('age', e.target.value)} />
            </div>
            <div>
              <label className="label">Pays</label>
              <select className="input" value={form.countryId} onChange={(e) => set('countryId', e.target.value)}>
                <option value="">Sélectionner</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>{c.flagEmoji} {c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Déjà inscrit ? <Link href="/connexion" className="text-africa-green hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
