# Africa Game — Plateforme Panafricaine de Régulation des Flux de Jeux

Plateforme conforme au **TDR v4** : concentrateur de paiements, monitoring des paris, fiscalité multi-juridiction, audit et jeu responsable.

## Architecture (TDR §6-7)

| Composant | Description |
|-----------|-------------|
| **Concentrateur de paiements** | API unique pour dépôts/retraits Mobile Money (Retail/Online/USSD/SMS) |
| **Monitoring des paris** | Déclaration temps réel ou par lot, reconstitution PBJ |
| **Multi-juridiction** | Tenancy isolé par pays, devises, canaux configurables |
| **Fiscalité** | Prélèvements automatiques selon règles PBJ par juridiction |
| **Jeu responsable** | Catégorisation parieurs (MSISDN USSD/SMS inclus) |
| **Audit** | Journal inaltérable des actions d'administration |

## Stack

- Frontend: Next.js 15, Tailwind, i18n (FR/EN/PT/AR)
- Backend: NestJS 10, Prisma, PostgreSQL
- Déploiement: Docker Compose + Nginx

## Compte administrateur (EXPLOITANT)

| Champ | Valeur |
|-------|--------|
| Email | `admin@africagame.2ticglobal.com` |
| Mot de passe | `Africagame!@#2026` |

Comptes démo : `regulateur@africagame.2ticglobal.com` / `Regulateur!2026` — `operateur@africagame.2ticglobal.com` / `Operateur!2026`

## Démarrage

```bash
docker compose up -d
```

- Site : https://africagame.2ticglobal.com
- API : `/api` — Swagger : `/api/docs`

## API Opérateurs (clé API)

```bash
# Initier paiement
curl -X POST /api/payments/initiate -H "x-api-key: <API_KEY>" -d '{...}'

# Déclarer pari
curl -X POST /api/bets/declare -H "x-api-key: <API_KEY>" -d '{...}'
```
