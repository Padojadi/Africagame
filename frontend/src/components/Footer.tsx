import { Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-africa-dark text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <h3 className="mb-3 text-lg font-bold text-white">Africa Game</h3>
          <p className="text-sm leading-relaxed">
            Initiative panafricaine pour former et accompagner les jeunes talents africains
            passionnés par la création de jeux vidéo et le patrimoine culturel.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Programme</h4>
          <ul className="space-y-2 text-sm">
            <li>Hackathons panafricains</li>
            <li>Formation Unreal Engine</li>
            <li>Accompagnement prototypes</li>
            <li>Communauté GameDev</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 flex items-center gap-2 font-semibold text-white">
            <Globe className="h-4 w-4" /> Contact
          </h4>
          <p className="text-sm">africagame.2ticglobal.com</p>
          <p className="mt-2 text-sm">NET-INFO × Epic MegaGrants</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Africa Game — Plateforme Panafricaine. Tous droits réservés.
      </div>
    </footer>
  );
}
