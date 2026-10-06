# TontineApp 🤝

Application de tontine numérique pour l'Afrique de l'Ouest — PWA Next.js 16

## Stack Technique
- **Framework** : Next.js 16 (App Router) + TypeScript
- **Styling** : Tailwind CSS v4
- **Auth** : NextAuth.js v5
- **BDD** : PostgreSQL (Supabase) + Prisma ORM
- **State** : Zustand + TanStack Query v5
- **Formulaires** : React Hook Form + Zod
- **PWA** : @ducanh2912/next-pwa

## Prérequis
- Node.js ≥ 20
- Un projet Supabase (voir `SUPABASE_SETUP.md`) ou PostgreSQL 14+

## Installation

```bash
# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env.local
# Remplir les valeurs dans .env.local

# Générer le client Prisma
npx prisma generate

# Créer la base de données et migrer
npx prisma migrate dev --name init

# Lancer le serveur de développement
npm run dev
```

## Structure du projet

```
src/
├── app/
│   ├── (auth)/          # Login, Register
│   ├── (dashboard)/     # Dashboard, Tontines, Wallet
│   ├── api/             # Route Handlers API
│   └── page.tsx         # Landing page
├── auth.ts              # NextAuth v5 config
├── middleware.ts         # Protection des routes
├── components/
│   ├── dashboard/       # Sidebar, TopBar
│   ├── tontine/         # Composants tontine
│   └── providers.tsx    # Session + Query providers
├── lib/
│   ├── db.ts            # Prisma client singleton
│   ├── utils.ts         # Utilitaires (cn, formatCurrency…)
│   └── validations/     # Schémas Zod
└── types/               # Types TypeScript
```

## API Routes

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Créer un compte |
| POST | `/api/auth/[...nextauth]` | Auth NextAuth |
| GET | `/api/tontines` | Lister ses tontines |
| POST | `/api/tontines` | Créer une tontine |
| GET | `/api/tontines/[id]` | Détail d'une tontine |
| PATCH | `/api/tontines/[id]` | Modifier (admin) |
| DELETE | `/api/tontines/[id]` | Dissoudre (admin) |
| POST | `/api/tontines/[id]/start` | Démarrer les cycles |
| POST | `/api/tontines/join` | Rejoindre via code |
| POST | `/api/contributions` | Enregistrer cotisation |

## Variables d'environnement requises

Voir `.env.example` pour la liste complète.

Minimum pour démarrer :
- `DATABASE_URL` : URL Supabase poolée (port 6543)
- `DIRECT_URL` : URL Supabase directe (port 5432, migrations)
- `AUTH_SECRET` : Secret NextAuth (générer avec `openssl rand -base64 32`)

Guide complet de connexion : voir [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md).
