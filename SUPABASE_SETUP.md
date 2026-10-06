# Connexion à Supabase — TontineApp

Le projet utilise **Prisma + PostgreSQL**. Supabase fournit la base PostgreSQL hébergée ;
Prisma s'y connecte via deux URLs (déjà configurées dans `prisma/schema.prisma`).

## 1. Récupérer les informations dans Supabase

1. Crée un projet sur https://supabase.com/dashboard (région la plus proche, ex. `eu-west-3` Paris).
2. Note le **mot de passe de la base** choisi à la création (réinitialisable dans
   *Project Settings > Database*).
3. Clique sur **Connect** (en haut du dashboard) > onglet **ORMs > Prisma** :
   copie les deux chaînes de connexion.
4. *(Optionnel)* *Project Settings > API* : copie `Project URL` et la clé `anon`
   (et `service_role` si besoin côté serveur).

## 2. Remplir `.env.local`

```env
DATABASE_URL="postgresql://postgres.<PROJECT-REF>:<PASSWORD>@aws-0-<REGION>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.<PROJECT-REF>:<PASSWORD>@aws-0-<REGION>.pooler.supabase.com:5432/postgres"
```

- `DATABASE_URL` (port **6543**, pooler transactionnel) → utilisée par l'application.
- `DIRECT_URL` (port **5432**) → utilisée par `prisma migrate` / `db push`.
- Mot de passe avec caractères spéciaux : encoder (`@` → `%40`, `#` → `%23`, `/` → `%2F`, `:` → `%3A`).

## 3. Créer les tables dans Supabase

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Alternative rapide en phase de prototypage :

```bash
npx prisma db push
```

Vérifie ensuite dans Supabase > *Table Editor* que les tables (`User`, `Tontine`,
`TontineMember`, `Cycle`, `Contribution`, `Transaction`, …) existent.

## 4. Lancer et tester

```bash
npm run dev
```

Crée un compte sur `/register` puis vérifie la ligne dans la table `User` de Supabase.

## 5. Déploiement (Vercel)

Ajoute dans *Project Settings > Environment Variables* : `DATABASE_URL`, `DIRECT_URL`,
`AUTH_SECRET`, `NEXTAUTH_URL` (URL de production) et, si utilisées, les variables `SUPABASE_*`.
Ajoute `prisma generate` au build si besoin : `"build": "prisma generate && next build"`.

## Dépannage

| Erreur | Cause probable | Solution |
|--------|----------------|----------|
| `P1001: Can't reach database server` | Mauvais host/région ou réseau bloqué | Recopier l'URL depuis *Connect*, tester avec un autre réseau/partage de connexion |
| `P1000: Authentication failed` | Mot de passe incorrect ou non encodé | Réinitialiser le mot de passe, encoder les caractères spéciaux |
| `prepared statement "s0" already exists` | `?pgbouncer=true` absent sur `DATABASE_URL` | Ajouter `?pgbouncer=true&connection_limit=1` |
| `Environment variable not found: DIRECT_URL` | Variable manquante | Ajouter `DIRECT_URL` dans `.env.local` |
| Migration qui bloque | Migration lancée via l'URL poolée | Vérifier que `DIRECT_URL` est bien renseignée |
| Prisma CLI ne lit pas `.env.local` | Prisma lit `.env` par défaut | Voir ci-dessous |

### Prisma CLI et `.env.local`

Le CLI Prisma charge `.env`, pas `.env.local`. Deux options :

```bash
# Option A : copier le fichier
copy .env.local .env

# Option B : passer par dotenv-cli (sans copier)
npm i -D dotenv-cli
npx dotenv -e .env.local -- npx prisma migrate dev --name init
```

> `.env*` est déjà dans `.gitignore` : les secrets ne seront pas commités.

## Sécurité

- Ne jamais commiter `.env.local` ni exposer `SUPABASE_SERVICE_ROLE_KEY` côté client.
- Prisma se connecte avec le rôle `postgres` (contourne RLS) : les contrôles d'accès restent
  à faire dans les routes API. Si tu actives RLS sur Supabase, cela n'affecte que l'API
  PostgREST / supabase-js, pas Prisma.
