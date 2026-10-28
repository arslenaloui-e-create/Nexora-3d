# Nexora 3D

Site et plateforme de Nexora 3D : site public (services, réalisations, FAQ, contact), demandes de devis avec fichiers, devis PDF acceptés en ligne, suivi de projet, messagerie, notifications, espace client et administration.

Stack : Next.js 15 (App Router) · React 19 · TypeScript · Prisma 6 · PostgreSQL · déploiement Vercel (ou hébergement Node compatible). Supabase peut fournir PostgreSQL et le stockage privé des fichiers; Resend peut fournir les emails transactionnels.

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
| `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_NOTIFICATION_EMAIL` | Emails transactionnels via Resend (facultatif). Gmail API reste disponible comme compatibilité. |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET` | Stockage privé des fichiers en production Vercel. La clé service role est serveur uniquement. |
| `MAX_UPLOAD_MB` | Taille max par fichier (50 par défaut). |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Utilisés seulement par `npm run db:seed`. |

## Déploiement Vercel + Supabase + Resend

- Build Vercel : `npm run build` (génère Prisma puis Next). Vercel détecte Next.js automatiquement.
- **Fichiers clients** : sur Vercel, configurez `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` et le bucket privé `SUPABASE_STORAGE_BUCKET=client-files`. Sans ces variables, le stockage local est utilisé et n’est pas persistant sur Vercel.
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


## Configuration Vercel, Supabase et Resend

Consultez **[GUIDE_CONFIGURATION_DEPLOIEMENT.md](./GUIDE_CONFIGURATION_DEPLOIEMENT.md)** pour les étapes détaillées, les variables, la création du bucket privé, les migrations, le déploiement et la checklist de validation.

Le projet utilise Prisma avec PostgreSQL et son authentification applicative personnalisée. Supabase est utilisé ici comme fournisseur PostgreSQL/Storage, pas comme remplacement automatique du système d'authentification. Les migrations SQL existantes sont conservées.

Pour envoyer des emails, configurez `RESEND_API_KEY`, `EMAIL_FROM` et `ADMIN_NOTIFICATION_EMAIL`. Le code utilise Resend côté serveur si la clé est présente; sinon il conserve une compatibilité facultative avec l'ancienne intégration Gmail API.

**Important :** ne déployez pas avec la valeur d'exemple `AUTH_SECRET`, et ne rendez pas public le bucket contenant les fichiers clients.
