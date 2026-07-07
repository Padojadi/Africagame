'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getStoredUser, User, Jurisdiction, GameOperator } from '@/lib/api';
import { PasswordInput } from '@/components/PasswordInput';
import { Plus, Pencil, Ban, CheckCircle, Trash2, X } from 'lucide-react';

type FormMode = 'create' | 'edit' | null;

interface UserForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  jurisdictionId: string;
  gameOperatorId: string;
}

const emptyForm: UserForm = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  role: 'OPERATEUR',
  jurisdictionId: '',
  gameOperatorId: '',
};

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [operators, setOperators] = useState<GameOperator[]>([]);
  const [mode, setMode] = useState<FormMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadUsers = () => api.users().then(setUsers).catch(() => {});

  useEffect(() => {
    const u = getStoredUser();
    if (!u || u.role !== 'EXPLOITANT') { router.push('/connexion'); return; }
    loadUsers();
    api.jurisdictions().then(setJurisdictions).catch(() => {});
    api.operators().then(setOperators).catch(() => {});
  }, [router]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMode('create');
    setError('');
  };

  const openEdit = (user: User) => {
    setForm({
      email: user.email,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      jurisdictionId: user.jurisdictionId || '',
      gameOperatorId: user.gameOperatorId || '',
    });
    setEditingId(user.id);
    setMode('edit');
    setError('');
  };

  const closeForm = () => {
    setMode(null);
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload: Record<string, unknown> = {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        role: form.role,
        jurisdictionId: form.jurisdictionId || undefined,
        gameOperatorId: form.gameOperatorId || undefined,
      };
      if (mode === 'create') {
        if (!form.password || form.password.length < 8) {
          setError('Le mot de passe doit contenir au moins 8 caractères');
          setLoading(false);
          return;
        }
        payload.password = form.password;
        await api.createUser(payload);
      } else if (editingId) {
        if (form.password) payload.password = form.password;
        await api.updateUser(editingId, payload);
      }
      closeForm();
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const toggleSuspend = async (user: User) => {
    const action = user.active !== false ? 'suspendre' : 'réactiver';
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} l'utilisateur ${user.firstName} ${user.lastName} ?`)) return;
    try {
      await api.updateUser(user.id, { active: user.active === false });
      loadUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleDelete = async (user: User) => {
    if (user.role === 'EXPLOITANT') {
      alert('Impossible de supprimer un compte EXPLOITANT');
      return;
    }
    if (!confirm(`Supprimer définitivement ${user.firstName} ${user.lastName} ?`)) return;
    try {
      await api.deleteUser(user.id);
      loadUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const set = (key: keyof UserForm, value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Créer un utilisateur
        </button>
      </div>

      {mode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleSubmit} className="card max-h-[90vh] w-full max-w-lg overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {mode === 'create' ? 'Nouvel utilisateur' : 'Modifier l\'utilisateur'}
              </h2>
              <button type="button" onClick={closeForm} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>}

            <div className="space-y-4">
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
                <label className="label">
                  Mot de passe {mode === 'edit' && <span className="font-normal text-gray-400">(laisser vide pour ne pas changer)</span>}
                </label>
                <PasswordInput
                  value={form.password}
                  onChange={(v) => set('password', v)}
                  required={mode === 'create'}
                />
              </div>
              <div>
                <label className="label">Rôle</label>
                <select className="input" value={form.role} onChange={(e) => set('role', e.target.value)}>
                  <option value="OPERATEUR">Opérateur de jeu</option>
                  <option value="REGULATEUR">Régulateur</option>
                  <option value="EXPLOITANT">Exploitant</option>
                </select>
              </div>
              <div>
                <label className="label">Juridiction</label>
                <select className="input" value={form.jurisdictionId} onChange={(e) => set('jurisdictionId', e.target.value)}>
                  <option value="">— Aucune (global) —</option>
                  {jurisdictions.map((j) => (
                    <option key={j.id} value={j.id}>{j.name} ({j.code})</option>
                  ))}
                </select>
              </div>
              {form.role === 'OPERATEUR' && (
                <div>
                  <label className="label">Opérateur de jeu</label>
                  <select className="input" value={form.gameOperatorId} onChange={(e) => set('gameOperatorId', e.target.value)}>
                    <option value="">— Sélectionner —</option>
                    {operators.map((o) => (
                      <option key={o.id} value={o.id}>{o.name} — {o.licenseNumber}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button type="submit" className="btn-primary flex-1" disabled={loading}>
                {loading ? 'Enregistrement...' : mode === 'create' ? 'Créer' : 'Enregistrer'}
              </button>
              <button type="button" onClick={closeForm} className="btn-secondary">Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3 pr-4">Nom</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Rôle</th>
              <th className="pb-3 pr-4">Juridiction</th>
              <th className="pb-3 pr-4">Statut</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium">{u.firstName} {u.lastName}</td>
                <td className="py-3 pr-4">{u.email}</td>
                <td className="py-3 pr-4">
                  <span className="rounded-full bg-africa-green/10 px-2 py-0.5 text-xs font-medium text-africa-green">{u.role}</span>
                </td>
                <td className="py-3 pr-4">{u.jurisdiction?.name || 'Global'}</td>
                <td className="py-3 pr-4">
                  {u.active !== false ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Actif</span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Suspendu</span>
                  )}
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(u)}
                      title="Modifier"
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-africa-green"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {u.role !== 'EXPLOITANT' && (
                      <>
                        <button
                          onClick={() => toggleSuspend(u)}
                          title={u.active !== false ? 'Suspendre' : 'Réactiver'}
                          className={`rounded-lg p-2 hover:bg-gray-100 ${u.active !== false ? 'text-amber-600 hover:text-amber-700' : 'text-green-600 hover:text-green-700'}`}
                        >
                          {u.active !== false ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          title="Supprimer"
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="py-8 text-center text-gray-500">Aucun utilisateur. Cliquez sur « Créer un utilisateur ».</p>
        )}
      </div>
    </div>
  );
}
