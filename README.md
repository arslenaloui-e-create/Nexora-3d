# Nexora 3D

Site et plateforme de Nexora 3D : site public (services, réalisations, FAQ, contact), demandes de devis avec fichiers, devis PDF acceptés en ligne, suivi de projet, messagerie, notifications, espace client et administration.

Stack : Next.js 15 (App Router) · React 19 · TypeScript · Prisma 6 · PostgreSQL · hébergement Railway.

## Parcours

Client : demande de devis (+ fichiers) → Nexora prépare le devis → le client l’accepte ou le refuse dans son espace → Nexora crée le projet → avancement, historique, livrables et messages dans l’espace client.

Administration (`/admin`) : demandes, devis (brouillon / envoi / PDF), projets (statut + note → notifiés au client, dépôt de livrables), fichiers, messagerie clients + formulaire de contact, clients, utilisateurs (désactivation), portfolio (choix des images dans `public/images`), FAQ, notifications, statistiques, paramètres (coordonnées, TVA par défaut).

## Installation locale

Prérequis : Node.js 20.9+ et PostgreSQL (Docker : `docker compose up -d`).

```bash
npm install
cp .env.example .env        # Windows : copy .env.example .env
npx prisma migrate deploy
npm run db:seed             # avec ADMIN_EMAIL et ADMIN_PASSWORD renseignés dans .env
npm run dev
```

Le seed :
- crée l’admin **seulement** si `ADMIN_EMAIL` / `ADMIN_PASSWORD` sont fournis et que ce compte n’existe pas (il ne modifie jamais un admin existant) ;
- ajoute les 3 questions FAQ de départ si elles manquent ;
- importe les 11 réalisations d’origine dans le portfolio si elles manquent (comparaison par titre, rien n’est écrasé).

Autre admin : `npm run admin:create -- email@exemple.com Prenom Nom MotDePasseLong`.

## Variables d’environnement

| Variable | Rôle |
|---|---|
| `DATABASE_URL` | Connexion PostgreSQL. |
| `AUTH_SECRET` | **Obligatoire**, 32 caractères minimum. En production, une valeur absente ou d’exemple bloque toutes les connexions (volontaire : sinon n’importe qui pourrait fabriquer une session admin). |
| `APP_URL` | Adresse publique (liens des emails, sitemap). |
| `SMTP_*`, `ADMIN_NOTIFY_EMAIL` | Emails (facultatif). Sans SMTP, tout fonctionne sauf l’envoi d’emails. |
| `STORAGE_DIR` | Dossier des fichiers clients. Sur Railway : le chemin du volume. |
| `MAX_UPLOAD_MB` | Taille max par fichier (50 par défaut). |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Utilisés seulement par `npm run db:seed`. |

## Déploiement Railway

- Build : `npm run build` (génère Prisma puis Next). Start : `npm start` (Next écoute sur `PORT` fourni par Railway).
- **Fichiers clients** : le disque d’un service Railway est effacé à chaque déploiement. Créez un **Volume** sur le service web, monté sur `/app/storage`, et définissez `STORAGE_DIR=/app/storage`. Sans volume, les fichiers envoyés disparaissent au prochain déploiement.
- **Migrations** : aucune modification du schéma dans cette version, rien à migrer. Pour une future migration : `npm run db:deploy`. Si la base a été créée avec `prisma db push` (pas de table `_prisma_migrations`), marquer d’abord les migrations existantes comme appliquées :
  ```bash
  npx prisma migrate resolve --applied 20260925235227_init
  npx prisma migrate resolve --applied 20260926192000_quote_details
  ```
- Remplir le portfolio en production : `railway run npm run db:seed` (depuis votre PC, avec la CLI Railway liée au projet).

## Images

- `public/images/` : images **servies par le site** (portfolio). Ajouter une image ici puis redéployer la rend disponible dans Admin › Portfolio.
- `images/` : dossier source d’origine (noms d’export). Toutes ces images existent à l’identique dans `public/images` sous un nom web ; ce dossier n’est pas servi par le site et n’est pas utilisé par le code.

## Sécurité en place

Mots de passe bcrypt · session JWT en cookie `httpOnly` / `SameSite=Lax` / `Secure` en production · rôle et statut relus en base à chaque requête (un compte désactivé perd l’accès immédiatement) · accès aux fichiers, devis et messages limité au client concerné · limites anti-abus (connexion, inscription, mot de passe oublié, contact, demandes) · types de fichiers contrôlés · en-têtes de sécurité (`X-Frame-Options`, `nosniff`, `Referrer-Policy`).
