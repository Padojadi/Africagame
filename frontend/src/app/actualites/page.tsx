'use client';

import { useEffect, useState } from 'react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: { firstName: string; lastName: string };
}

export default function ActualitesPage() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/news?published=true`)
      .then((r) => r.json())
      .then(setNews)
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-10 text-3xl font-bold">Actualités</h1>
      <div className="space-y-8">
        {news.map((n) => (
          <article key={n.id} className="card">
            <time className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleDateString('fr-FR')}</time>
            <h2 className="mb-2 mt-1 text-xl font-bold">{n.title}</h2>
            <p className="text-gray-600">{n.content}</p>
            <p className="mt-3 text-xs text-gray-400">Par {n.author.firstName} {n.author.lastName}</p>
          </article>
        ))}
      </div>
      {news.length === 0 && <p className="text-center text-gray-500">Aucune actualité</p>}
    </div>
  );
}
