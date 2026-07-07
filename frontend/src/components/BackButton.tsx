import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href?: string;
  label?: string;
}

export function BackButton({ href = '/admin', label = 'Retour' }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-africa-green"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}
