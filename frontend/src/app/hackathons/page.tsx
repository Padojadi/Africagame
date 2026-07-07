'use client';

import { useEffect, useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';

interface Hackathon {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  maxTeams: number;
  country?: { name: string; flagEmoji?: string };
}

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/hackathons`)
      .then((r) => r.json())
      .then(setHackathons)
      .catch(() => {});
  }, []);

  const statusLabel: Record<string, string> = {
    UPCOMING: 'À venir',
    REGISTRATION_OPEN: 'Inscriptions ouvertes',
    IN_PROGRESS: 'En cours',
    COMPLETED: 'Terminé',
    CANCELLED: 'Annulé',
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Hackathons Panafricains</h1>
      <p className="mb-10 text-gray-500">Événements en ligne réunissant les talents africains du game dev</p>
      <div className="grid gap-6 md:grid-cols-2">
        {hackathons.map((h) => (
          <div key={h.id} className="card">
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-africa-green/10 px-3 py-1 text-xs font-medium text-africa-green">
                {statusLabel[h.status] || h.status}
              </span>
              <span className="text-sm text-gray-500">{h.maxTeams} équipes max</span>
            </div>
            <h2 className="mb-2 text-xl font-bold">{h.title}</h2>
            <p className="mb-4 text-sm text-gray-600">{h.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(h.startDate).toLocaleDateString('fr-FR')} — {new Date(h.endDate).toLocaleDateString('fr-FR')}
              </span>
              {h.country && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {h.country.flagEmoji} {h.country.name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      {hackathons.length === 0 && <p className="text-center text-gray-500">Aucun hackathon programmé</p>}
    </div>
  );
}
