# Guide de configuration et de déploiement — NEXORA 3D

Ce projet conserve son architecture existante : **Next.js 15, React 19, Prisma 6 et PostgreSQL**. Supabase fournit PostgreSQL et le stockage privé des fichiers; Resend gère les emails; Vercel héberge l'application. Les étapes ci-dessous ne nécessitent pas de migrer vers un autre framework.

> Important : je n'ai pas accès à vos comptes externes. Aucun projet Supabase/Resend/Vercel n'a été créé et aucun déploiement réel n'a été effectué depuis ce code. Les identifiants doivent être ajoutés par vous dans les interfaces des fournisseurs.

## 1. Préparer le projet en local

1. Installez Node.js **20.9 ou plus récent**.
2. Décompressez le projet, ouvrez un terminal dans le dossier qui contient `package.json`.
3. Copiez `.env.example` vers `.env.local` (PowerShell : `Copy-Item .env.example .env.local`; macOS/Linux : `cp .env.example .env.local`).
4. N'envoyez jamais `.env.local` sur GitHub. Le `.gitignore` fourni l'exclut.
5. Installez les dépendances : `npm ci`.
6. Les valeurs d'exemple ne permettent pas de se connecter : configurez d'abord la base et `AUTH_SECRET`.

Générez le secret de session avec :
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```
Collez la sortie dans `AUTH_SECRET`. Ne la publiez jamais.

## PARTIE A — Supabase (PostgreSQL et fichiers privés)

### A1. Créer le projet

1. Ouvrez le site officiel de [Supabase](https://supabase.com/), créez un compte puis cliquez sur **New project**.
2. Choisissez une organisation, un nom comme `nexora-3d`, une région proche de vos utilisateurs et un mot de passe PostgreSQL fort. Conservez-le dans un gestionnaire de mots de passe.
3. Attendez que le projet soit prêt.
4. Dans le tableau de bord du projet, ouvrez **Project Settings → API** (l'intitulé peut évoluer). Copiez l'URL du projet dans `SUPABASE_URL`.
5. Dans la même zone, récupérez la clé secrète serveur/service role. Collez-la uniquement dans `SUPABASE_SERVICE_ROLE_KEY` dans `.env.local` et dans les variables Vercel. **Ne la préfixez jamais par `NEXT_PUBLIC_`, ne l'envoyez jamais au navigateur et ne la commitez pas.**
6. Dans **Project Settings → Database**, trouvez les informations de connexion. Copiez l'URI PostgreSQL dans `DATABASE_URL`. Pour un déploiement Vercel, choisissez une connexion compatible avec Prisma (connexion directe ou pooler en mode session selon les instructions affichées par Supabase). Ajoutez `?sslmode=require` si l'URI fournie ne l'inclut pas. Remplacez les valeurs entre crochets par les valeurs affichées dans votre compte; ne recopiez pas littéralement les exemples.

### A2. Initialiser le schéma

Le projet utilise Prisma et sa propre structure SQL, pas le SDK Auth de Supabase. La connexion à Supabase ne crée pas automatiquement les tables. Dans un terminal avec `DATABASE_URL` configurée :
```bash
npx prisma migrate deploy
npx prisma generate
```
Cela applique les migrations versionnées présentes dans `prisma/migrations`. **N'exécutez pas `prisma db push` sur une base contenant déjà des données** et ne supprimez pas de tables pour corriger une erreur. Si la base est déjà initialisée avec ces tables, sauvegardez-la puis vérifiez l'état des migrations avant d'agir.

### A3. Créer le bucket privé pour les fichiers

1. Dans Supabase, ouvrez **Storage** puis **New bucket**.
2. Nom : `client-files` (ou le nom choisi pour `SUPABASE_STORAGE_BUCKET`).
3. Laissez le bucket **Private**; ne le rendez pas public.
4. Ajoutez `SUPABASE_STORAGE_BUCKET=client-files` aux variables locales et Vercel.
5. Le code serveur utilise la clé service role pour déposer, lire et supprimer les fichiers. Cette clé contourne les règles RLS de Storage : les routes API de l'application doivent donc continuer à vérifier la session et les droits du client avant chaque lecture/téléchargement. Ne créez aucune URL publique permanente pour les documents clients.

### A4. Créer le premier administrateur

Dans `.env.local`, renseignez temporairement `ADMIN_EMAIL` et `ADMIN_PASSWORD` avec une adresse à vous et un mot de passe long. Puis exécutez :
```bash
npm run db:seed
```
Le seed est conçu pour ne créer l'administrateur que si le compte n'existe pas déjà; il ne remplace pas un compte existant. Retirez ensuite le mot de passe de l'environnement si vous n'en avez plus besoin. N'utilisez pas un mot de passe partagé ou un secret d'exemple.

### A5. Vérifications Supabase

- Dans **Table Editor**, confirmez la présence des tables Prisma après migration.
- Dans **Storage**, confirmez que le bucket est privé.
- Testez avec un compte client que les documents d'un autre client ne sont pas accessibles.
- Le projet utilise une authentification applicative personnalisée (mot de passe bcrypt et cookie de session), pas Supabase Auth. Les liens de redirection et les emails d'authentification Supabase ne gèrent donc pas les comptes Nexora dans cette architecture.
- Les quotas, limites et conditions du niveau gratuit changent. Consultez la page officielle de tarification et les avertissements affichés dans votre tableau de bord avant de choisir une région ou de compter sur une absence de mise en veille.

## PARTIE B — Resend (emails transactionnels)

1. Créez un compte sur [Resend](https://resend.com/).
2. Ouvrez **API Keys** et créez une clé dédiée à l'application. Copiez-la une seule fois dans `RESEND_API_KEY` localement puis dans Vercel. Ne la partagez pas.
3. Le code envoie les emails via l'API Resend côté serveur. Configurez `EMAIL_FROM` avec un expéditeur autorisé, par exemple `Nexora 3D <noreply@votre-domaine.tld>`. L'adresse fictive de l'exemple doit être remplacée.
4. Pour un envoi de production fiable, ouvrez **Domains → Add Domain**, saisissez votre propre domaine, puis copiez exactement les enregistrements DNS affichés par Resend chez le fournisseur DNS de ce domaine. Ne devinez ni les noms ni les valeurs DNS. Attendez que Resend confirme la vérification.
5. Renseignez `ADMIN_NOTIFICATION_EMAIL` avec l'adresse qui doit recevoir les alertes.
6. Pour vérifier : envoyez une demande via le formulaire du site puis consultez **Logs** dans Resend. Une réponse API réussie signifie que Resend a accepté la demande, pas que le destinataire l'a nécessairement reçue; vérifiez aussi les événements de livraison/rejet.
7. Si aucun `RESEND_API_KEY` n'est défini, le code conserve une compatibilité avec l'ancienne intégration Gmail API si toutes ses variables sont présentes. Sinon l'envoi retourne `false` et un avertissement est journalisé. Les emails ne peuvent pas être testés complètement sans identifiants valides et expéditeur autorisé.
8. Vérifiez les quotas, limites de test et conditions actuelles sur la page de tarification officielle de Resend avant de vous appuyer sur le niveau gratuit.

## PARTIE C — GitHub

1. Créez un dépôt GitHub privé de préférence.
2. Avant le premier commit, vérifiez que `.env`, `.env.local`, `node_modules`, `.next` et `storage/` ne sont pas suivis :
   ```bash
   git status --short
   git check-ignore .env.local
   ```
3. Si les fichiers sont corrects, initialisez et poussez le dépôt :
   ```bash
   git init
   git add .
   git status
   git commit -m "Préparer Nexora 3D pour Vercel, Supabase et Resend"
   git branch -M main
   git remote add origin <URL_DU_DEPOT_GITHUB>
   git push -u origin main
   ```
4. Remplacez le placeholder par l'URL de votre dépôt. N'exécutez pas `git add .env.local`.
5. Si un secret a déjà été commité, le supprimer du dernier commit ne suffit pas : révoquez/renouvelez-le chez le fournisseur et traitez l'historique Git comme compromis.

## PARTIE D — Vercel

### D1. Importer et configurer

1. Ouvrez [Vercel](https://vercel.com/) et connectez-vous avec GitHub.
2. Cliquez sur **Add New → Project**, puis **Import** à côté du dépôt Nexora.
3. Vérifiez que le framework détecté est **Next.js**. La commande de build du `package.json` est `prisma generate && next build`; le script `start` est destiné au lancement local et n'est pas à remplacer par une commande personnalisée Vercel.
4. Dans **Environment Variables**, ajoutez les variables suivantes pour **Production**, **Preview** et **Development** selon le besoin :
   - `DATABASE_URL` : URI PostgreSQL Supabase compatible Prisma.
   - `AUTH_SECRET` : secret aléatoire distinct de la valeur d'exemple.
   - `APP_URL` : URL publique du site pour l'environnement correspondant.
   - `SUPABASE_URL` : URL du projet Supabase.
   - `SUPABASE_SERVICE_ROLE_KEY` : clé secrète serveur.
   - `SUPABASE_STORAGE_BUCKET` : `client-files`.
   - `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_NOTIFICATION_EMAIL`.
   - `MAX_UPLOAD_MB` si vous souhaitez modifier la limite.
   Ne mettez pas les secrets dans des variables `NEXT_PUBLIC_*`. Les variables `ADMIN_EMAIL`/`ADMIN_PASSWORD` ne sont nécessaires que si vous lancez le seed.
5. Vérifiez chaque valeur, puis cliquez sur **Deploy**. Le premier build peut échouer si la base n'est pas accessible ou si une variable manque; consultez **Deployments → [déploiement] → Build Logs**.
6. Après chaque changement de variable, relancez un déploiement pour qu'il prenne effet.
7. Pour une URL personnalisée : **Settings → Domains**, ajoutez votre domaine et appliquez les instructions DNS affichées par Vercel.

### D2. Attention aux fichiers et migrations

- Le stockage disque local n'est pas persistant sur Vercel. Le code fourni utilise Supabase Storage dès que `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont présents; sans ces deux variables, il retombe sur le disque local, ce qui ne convient pas aux fichiers clients en production Vercel.
- Exécutez les migrations avec une connexion de base appropriée avant d'exposer le site. Ne lancez pas de migrations destructrices automatiquement dans le build de production.
- Les fonctions serverless ont des limites de durée et de taille de requête. Les fichiers volumineux (50 Mo par défaut) peuvent dépasser les limites de la plateforme avant même d'atteindre le code. Testez le flux réel; si les limites Vercel l'empêchent, réduisez la taille autorisée ou implémentez un upload direct signé vers Storage.
- Les environnements Preview peuvent pointer vers une base partagée si vous réutilisez les mêmes variables. Idéalement, utilisez un projet/base de test distinct pour Preview afin d'éviter de modifier les données de production.

## PARTIE E — Tests finaux

À exécuter après configuration :
```bash
npm ci
npx prisma generate
npx tsc --noEmit
npm run build
```
`npm run lint` dépend de la configuration Next/ESLint présente; si la commande échoue parce que `next lint` n'est pas disponible dans la version installée, utilisez la commande ESLint configurée par votre projet ou ajoutez une configuration dédiée avant de considérer le lint validé.

Checklist manuelle :
- [ ] Accueil, À propos, services, réalisations, FAQ, contact et navigation.
- [ ] Formulaire de contact : validation, enregistrement en base, email administratif et gestion des erreurs.
- [ ] Inscription, vérification/connexion, déconnexion, mot de passe oublié/réinitialisation.
- [ ] Un client ne peut pas accéder à `/admin` ni aux données d'un autre client.
- [ ] Un compte désactivé perd l'accès.
- [ ] Demande de devis avec pièces jointes, devis PDF, acceptation/refus.
- [ ] Création et progression d'un projet, historique et livrables.
- [ ] Messagerie et notifications.
- [ ] Fichiers déposés dans le bucket privé, lecture/téléchargement via les routes authentifiées.
- [ ] Envoi email Resend et statut dans ses logs.
- [ ] Vérification sur mobile et ordinateur.
- [ ] Logs Vercel sans erreur et quotas des services contrôlés.

## PARTIE F — Maintenance et coûts

- Code : faites un commit Git avant chaque lot de changements; utilisez des Pull Requests si possible.
- Schéma : créez une migration versionnée avec `npx prisma migrate dev --name description`, vérifiez le SQL généré, puis appliquez-la en production avec `npx prisma migrate deploy`. Sauvegardez avant toute migration importante.
- Variables : modifiez-les dans **Vercel → Settings → Environment Variables**, puis redéployez.
- Diagnostic : examinez les logs Vercel, les erreurs API de l'application, les logs Resend et les métriques Supabase.
- Sauvegardes : exportez ou sauvegardez PostgreSQL avant les changements risqués; les sauvegardes automatiques peuvent dépendre de l'offre.
- Coûts : surveillez les quotas et alertes de Supabase, Vercel et Resend. N'activez pas d'option payante sans vérifier le prix et votre autorisation. Les offres gratuites et leurs restrictions peuvent changer.

## Actions qui restent à faire manuellement

- Créer/configurer les projets Supabase, Resend, GitHub et Vercel.
- Renseigner les variables avec les vraies valeurs.
- Vérifier le domaine d'envoi Resend et les DNS réels.
- Appliquer les migrations sur la base Supabase choisie après vérification de son état.
- Créer le premier administrateur.
- Déployer puis réaliser la checklist complète, notamment les tests d'email et de fichiers.
