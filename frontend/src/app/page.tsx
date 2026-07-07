import Link from 'next/link';
import { Shield, CreditCard, BarChart3, Globe2, Radio, Smartphone } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <section className="bg-gradient-to-br from-africa-dark via-emerald-950 to-africa-dark text-white">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <p className="mb-3 text-sm text-africa-gold">TDR Plateforme Panafricaine de Jeux et Paris</p>
          <h1 className="mb-4 max-w-4xl text-4xl font-extrabold md:text-5xl">
            Régulation, audit et concentration des flux de jeux
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-gray-300">
            Concentrateur de paiements Mobile Money, monitoring déclaratif des paris, fiscalité multi-juridiction
            et jeu responsable — Retail, Online, USSD et SMS.
          </p>
          <Link href="/connexion" className="btn-primary bg-africa-gold text-africa-dark hover:bg-yellow-300">
            Accéder à la plateforme
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-10 text-center text-2xl font-bold">Architecture fonctionnelle</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: CreditCard, title: 'Concentrateur de paiements', desc: 'Point d\'entrée unique Mobile Money (M-Pesa, MTN MoMo, Orange, Wave…)' },
            { icon: BarChart3, title: 'Monitoring des paris', desc: 'Déclaration temps réel ou par lot — PBJ par canal et juridiction' },
            { icon: Globe2, title: 'Multi-juridiction', desc: 'Tenancy isolé par pays, devises XOF/XAF/NGN/GHS/KES…' },
            { icon: Shield, title: 'Audit & reporting', desc: 'Journal inaltérable, prélèvements automatiques, jeu responsable' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card">
              <Icon className="mb-3 h-8 w-8 text-africa-green" />
              <h3 className="mb-2 font-bold">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">Canaux pris en charge</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Radio, name: 'Retail', desc: 'Points de vente, agents' },
              { icon: Globe2, name: 'Online', desc: 'Web & applications mobiles' },
              { icon: Smartphone, name: 'USSD', desc: 'Codes courts *XXX#, sessions multi-étapes' },
              { icon: Smartphone, name: 'SMS', desc: 'Mots-clés, idempotence, DLR' },
            ].map(({ icon: Icon, name, desc }) => (
              <div key={name} className="rounded-xl border p-5 text-center">
                <Icon className="mx-auto mb-2 h-6 w-6 text-africa-green" />
                <p className="font-bold">{name}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-6 text-2xl font-bold">Modèle d&apos;accès hiérarchisé</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { role: 'EXPLOITANT', scope: 'Visibilité globale', func: 'Administration, onboarding, supervision' },
            { role: 'RÉGULATEUR', scope: 'Sa juridiction', func: 'Audit, fiscalité, jeu responsable, reporting' },
            { role: 'OPÉRATEUR DE JEU', scope: 'Sa seule activité', func: 'API paiement/paris, factures, intégration' },
          ].map((r) => (
            <div key={r.role} className="card border-l-4 border-l-africa-green">
              <p className="font-bold text-africa-green">{r.role}</p>
              <p className="text-sm text-gray-500">{r.scope}</p>
              <p className="mt-2 text-sm">{r.func}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
