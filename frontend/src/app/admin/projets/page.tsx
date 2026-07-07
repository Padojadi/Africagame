'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getStoredUser, Project } from '@/lib/api';

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const u = getStoredUser();
    if (!u || (u.role !== 'ADMIN' && u.role !== 'MODERATOR')) { router.push('/connexion'); return; }
    api.projects().then(setProjects).catch(() => {});
  }, [router]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Gestion des projets</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="pb-3 pr-4">Titre</th>
              <th className="pb-3 pr-4">Auteur</th>
              <th className="pb-3 pr-4">Pays</th>
              <th className="pb-3 pr-4">Statut</th>
              <th className="pb-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium">{p.title}</td>
                <td className="py-3 pr-4">{p.author?.firstName} {p.author?.lastName}</td>
                <td className="py-3 pr-4">{p.country?.flagEmoji} {p.country?.name || '-'}</td>
                <td className="py-3 pr-4">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{p.status}</span>
                </td>
                <td className="py-3">{p.createdAt ? new Date(p.createdAt).toLocaleDateString('fr-FR') : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && <p className="py-8 text-center text-gray-500">Aucun projet soumis</p>}
      </div>
    </div>
  );
}
