# Nexora 3D

Plateforme web complète pour Nexora 3D : site public, authentification client/admin, demandes de devis, fichiers privés, projets, devis PDF, portfolio, FAQ, contact et notifications.

## 1. Prérequis
- Node.js 20.9+
- Docker Desktop

## 2. Installation
```bash
docker compose up -d
npm install
copy .env.example .env
npx prisma db push
npm run db:seed
npm run dev
```
Sous macOS/Linux, remplace `copy .env.example .env` par `cp .env.example .env`.

## 3. Premier admin
Le seed crée :
- email : `admin@nexora3d.tn`
- mot de passe : `ChangeMe123!`

Change ce mot de passe dès la première connexion. Pour créer un autre admin :
```bash
npm run admin:create -- admin@example.com Prenom Nom MotDePasseSolide123!
```

## 4. Configuration `.env`
- `DATABASE_URL` : connexion PostgreSQL.
- `AUTH_SECRET` : longue chaîne aléatoire obligatoire en production.
- `APP_URL` : URL publique de Nexora.
- `SMTP_*` : facultatif en local, nécessaire pour les emails de vérification/réinitialisation et notifications email.
- `MAX_UPLOAD_MB` : taille maximale d'un fichier.
- `NEXT_PUBLIC_TAX_RATE` : TVA par défaut côté configuration.

## 5. Lancer
```bash
npm run dev
```
Puis ouvre `http://localhost:3000`.

## 6. Stockage
Les fichiers privés sont stockés dans `storage/` et servis uniquement par une route authentifiée. En production, sauvegarde régulièrement le dossier `storage/` et la base PostgreSQL.
