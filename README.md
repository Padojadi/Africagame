# Africa Game — Plateforme Panafricaine

Plateforme web pour la formation, l'accompagnement et la gestion des hackathons panafricains de création de jeux vidéo (initiative AfricanGameDev / NET-INFO × Epic MegaGrants).

## Architecture

| Composant | Technologie |
|-----------|-------------|
| Frontend | Next.js 15, React 19, Tailwind CSS |
| Backend | NestJS 10, Prisma, PostgreSQL |
| Auth | JWT + bcrypt, rôles (ADMIN, MODERATOR, MENTOR, PARTICIPANT) |
| Déploiement | Docker Compose + Nginx |

## Structure des dépôts

```
africagame/           # Monorepo principal
├── frontend/         # → padojadi/africagame-frontend
├── backend/          # → padojadi/africagame-backend
├── docker-compose.yml
├── nginx/
└── scripts/
```

## Compte administrateur

| Champ | Valeur |
|-------|--------|
| Email | `admin@africagame.2ticglobal.com` |
| Mot de passe | `Africagame!@#2026` |
| Privilèges | Lecture, écriture, modification, création d'utilisateurs |

## Démarrage local

```bash
# Avec Docker (recommandé)
docker compose up -d

# Ou manuellement
cd backend && cp .env.example .env && npm install && npx prisma migrate dev && npm run prisma:seed && npm run start:dev
cd frontend && cp .env.example .env.local && npm install && npm run dev
```

- Frontend : http://localhost:3000
- API : http://localhost:4000/api
- Swagger : http://localhost:4000/api/docs

## Déploiement VPS (195.110.35.45)

```bash
ssh root@195.110.35.45
git clone https://github.com/padojadi/africagame.git /opt/africagame
cd /opt/africagame
chmod +x scripts/deploy-vps.sh
./scripts/deploy-vps.sh
```

URL de production : **https://africagame.2ticglobal.com**

## Installation locale (Mac)

```bash
./scripts/setup-local.sh "/Users/Paul Do Mac Folders/Protosen_Hostinger/Africa Game"
```

## Fonctionnalités

- Inscription / connexion des participants (18-30 ans)
- Soumission de projets (idée en ~500 mots, patrimoine culturel)
- Gestion des hackathons panafricains
- Modules de formation Unreal Engine
- Actualités et annonces
- **Panel admin** : utilisateurs, projets, statistiques, CRUD complet

## API Endpoints principaux

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/login` | Connexion |
| POST | `/api/auth/register` | Inscription |
| GET | `/api/hackathons` | Liste hackathons |
| GET | `/api/courses` | Formations |
| GET | `/api/users` | Utilisateurs (admin) |
| POST | `/api/users` | Créer utilisateur (admin) |
| GET | `/api/stats/dashboard` | Statistiques (admin) |
