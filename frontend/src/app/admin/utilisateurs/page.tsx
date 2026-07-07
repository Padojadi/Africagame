'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getStoredUser, User } from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    email: '', password: '', firstName: '', lastName: '', role: 'PARTICIPANT',
  });

  useEffect(() => {
    const u = getStoredUser();
    if (!u || u.role !== 'ADMIN') { router.push('/connexion'); return; }
    loadUsers();
  }, [router]);

  const loadUsers = () => api.users().then(setUsers).catch(() => {});

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createUser(form);
    setShowForm(false);
    setForm({ email: '', password: '', firstName: '', lastName: '', role: 'PARTICIPANT' });
    loadUsers();
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    await api.deleteUser(id);
    loadUsers();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="mr-2 h-4 w-4" /> Créer un utilisateur
        </button>
      </div>

      {showForm && (
        <form onSubmit={createUser} className="card mb-6 grid gap-4 sm:grid-cols-2">
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input" placeholder="Mot de passe" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <input className="input" placeholder="Prénom" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
          <input className="input" placeholder="Nom" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
          <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="PARTICIPANT">Participant</option>
            <option value="MENTOR">Mentor</option>
            <option value="MODERATOR">Modérateur</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit" className="btn-primary">Créer</button>
        </form>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="pb-3 pr-4">Nom</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Rôle</th>
              <th className="pb-3 pr-4">Pays</th>
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
                <td className="py-3 pr-4">{u.country?.flagEmoji} {u.country?.name || '-'}</td>
                <td className="py-3">
                  {u.role !== 'ADMIN' && (
                    <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
