import Link from 'next/link';
import { ArrowRight, Users, Trophy, BookOpen, Globe2 } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-africa-dark via-emerald-950 to-africa-dark text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-africa-gold blur-3xl" />
          <div className="absolute bottom-10 right-1/4 h-64 w-64 rounded-full bg-africa-green blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <p className="mb-4 inline-block rounded-full bg-africa-gold/20 px-4 py-1 text-sm font-medium text-africa-gold">
              Plateforme Panafricaine v4
            </p>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-6xl">
              Construisons la communauté{' '}
              <span className="text-africa-gold">African GameDev</span>
            </h1>
            <p className="mb-8 text-lg text-gray-300 md:text-xl">
              Formation gratuite, hackathons en ligne et accompagnement pour produire des prototypes
              de jeux vidéo basés sur le patrimoine culturel africain.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/inscription" className="btn-primary bg-africa-gold text-africa-dark hover:bg-yellow-300">
                Rejoindre le programme <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/hackathons" className="btn-secondary border-white text-white hover:bg-white hover:text-africa-dark">
                Voir les hackathons
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold">Notre mission</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, title: '200 jeunes talents', desc: 'Développeurs de 18 à 30 ans sélectionnés à travers l\'Afrique' },
            { icon: Trophy, title: '10 équipes', desc: '40 jeunes en 10 équipes pour la production de prototypes' },
            { icon: BookOpen, title: 'Formation UE', desc: 'Unreal Engine et programmation nodale (Blueprints)' },
            { icon: Globe2, title: '10 pays', desc: 'Partenariats avec écoles, universités et organisations africaines' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-africa-green/10 text-africa-green">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mb-2 font-bold">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold">Comment ça marche ?</h2>
              <ol className="space-y-4">
                {[
                  'Inscrivez-vous sur la plateforme (gratuit)',
                  'Présentez votre idée de projet en 500 mots',
                  'Participez aux hackathons panafricains en ligne',
                  'Bénéficiez de 5 mois d\'accompagnement et formation',
                  'Produisez votre prototype de jeu vidéo',
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-africa-green text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="card bg-gradient-to-br from-africa-green to-emerald-800 text-white">
              <h3 className="mb-4 text-2xl font-bold">100% Gratuit</h3>
              <p className="mb-6 leading-relaxed opacity-90">
                Ce programme est entièrement gratuit pour soutenir la communauté des développeurs
                de jeux vidéo en Afrique, initié par NET-INFO avec le soutien d&apos;Epic MegaGrants.
              </p>
              <Link href="/inscription" className="inline-block rounded-lg bg-africa-gold px-6 py-3 font-semibold text-africa-dark">
                Commencer maintenant
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
