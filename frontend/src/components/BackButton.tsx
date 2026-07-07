import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href?: string;
  label?: string;
}

export function BackButton({ href = '/admin', label = 'Retour au tableau de bord' }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="mb-6 inline-flex items-center gap-2 rounded-lg border-2 border-africa-green bg-white px-5 py-2.5 text-sm font-bold text-africa-green shadow-sm transition hover:bg-africa-green hover:text-white"
    >
      <ArrowLeft className="h-5 w-5" />
      {label}
    </Link>
  );
}
