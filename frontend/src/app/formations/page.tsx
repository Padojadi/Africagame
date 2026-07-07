'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  duration?: number;
  moduleOrder: number;
}

export default function FormationsPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/courses?published=true`)
      .then((r) => r.json())
      .then(setCourses)
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Formations</h1>
      <p className="mb-10 text-gray-500">Modules de formation Unreal Engine et storytelling africain</p>
      <div className="grid gap-6 md:grid-cols-3">
        {courses.map((c) => (
          <div key={c.id} className="card">
            <span className="mb-2 inline-block rounded bg-africa-gold/20 px-2 py-0.5 text-xs font-medium text-amber-800">
              Module {c.moduleOrder}
            </span>
            <h2 className="mb-2 text-lg font-bold">{c.title}</h2>
            <p className="mb-4 text-sm text-gray-600">{c.description}</p>
            {c.duration && (
              <p className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" /> {c.duration} min
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
