'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getStoredUser, User, Project } from '@/lib/api';
import { FolderPlus } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', heritage: '' });

  useEffect(() => {
    const u = getStoredUser();
    if (!u) { router.push('/connexion'); return; }
    setUser(u);
    api.myProjects().then(setProjects).catch(() => {});
  }, [router]);

  const submitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createProject(form);
    setShowForm(false);
    setForm({ title: '', description: '', heritage: '' });
    api.myProjects().then(setProjects);
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">Mon espace</h1>
      <p className="mb-8 text-gray-500">Bienvenue, {user.firstName} {user.lastName}</p>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Mes projets</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <FolderPlus className="mr-2 h-4 w-4" /> Nouveau projet
        </button>
      </div>

      {showForm && (
        <form onSubmit={submitProject} className="card mb-6 space-y-4">
          <div>
            <label className="label">Titre du projet</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="label">Description (votre idée en ~500 mots)</label>
            <textarea className="input min-h-[150px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required minLength={50} />
          </div>
          <div>
            <label className="label">Patrimoine culturel</label>
            <input className="input" value={form.heritage} onChange={(e) => setForm({ ...form, heritage: e.target.value })} placeholder="Ex: contes wolof, masques dogon..." />
          </div>
          <button type="submit" className="btn-primary">Soumettre</button>
        </form>
      )}

      <div className="space-y-4">
        {projects.map((p) => (
          <div key={p.id} className="card">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-bold">{p.title}</h3>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{p.status}</span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-3">{p.description}</p>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-center text-gray-500">Aucun projet. <Link href="/hackathons" className="text-africa-green">Découvrez les hackathons</Link></p>
        )}
      </div>
    </div>
  );
}
