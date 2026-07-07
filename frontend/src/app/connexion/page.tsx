'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, setAuth } from '@/lib/api';
import { PasswordInput } from '@/components/PasswordInput';
import { Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@africagame.2ticglobal.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.login(email, password);
      setAuth(res.accessToken, res.user);
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <form onSubmit={submit} className="card w-full max-w-md">
        <Shield className="mx-auto mb-4 h-12 w-12 text-africa-green" />
        <h1 className="mb-6 text-center text-2xl font-bold">Connexion sécurisée</h1>
        {error && <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>}
        <label className="label" htmlFor="email">Email</label>
        <input id="email" className="input mb-4" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="label" htmlFor="password">Mot de passe</label>
        <div className="mb-6">
          <PasswordInput id="password" value={password} onChange={setPassword} required />
        </div>
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}</button>
      </form>
    </div>
  );
}
