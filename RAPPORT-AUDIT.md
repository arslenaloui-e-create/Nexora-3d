# Nexora 3D : rapport d'audit et de corrections

Tout le travail se trouve sur la branche git `audit-production`. Ta branche `main` n'a pas été modifiée.

## ⚠️ À faire avant de mettre en ligne (dans cet ordre)

1. **Changer le mot de passe admin.** Il était écrit en clair dans `prisma/seed.ts`, et ce fichier a été poussé sur GitHub dans le commit « Initial deployment ». Je l'ai retiré du code, mais il reste lisible dans l'historique git. Vérifie aussi si le dépôt GitHub est public.
2. **Mettre un vrai `AUTH_SECRET` dans les variables Railway.** Ton `.env` contient encore la valeur d'exemple `CHANGE_ME_...`. Avec cette valeur, n'importe qui pouvait fabriquer une session admin. Désormais, en production, le site refuse toute connexion tant qu'un vrai secret n'est pas défini. Pour en générer un :
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
   ```
3. **Créer un Volume Railway pour les fichiers clients.** Le monter sur `/app/storage` et ajouter la variable `STORAGE_DIR=/app/storage`. Sans volume, Railway efface tous les fichiers envoyés par les clients à chaque déploiement.
4. **Fusionner la branche** `audit-production` dans `main`, puis pousser.
5. **Remplir le portfolio en production**, une seule fois :
   ```bash
   railway run npm run db:seed
   ```
   Le seed importe les 11 réalisations d'origine et les 3 questions FAQ, sans rien écraser de ce qui existe déjà. Il ne crée un admin que si `ADMIN_EMAIL` et `ADMIN_PASSWORD` sont définis.

Aucune modification de la base de données : il n'y a **aucune migration** à lancer.

## Problèmes trouvés et corrigés

- **Emails** : l'envoi ne pouvait jamais fonctionner, à cause d'un mauvais nom de paramètre SMTP (`password` au lieu de `pass`).
- **Livrables** : un fichier déposé par l'admin sur le projet d'un client était invisible pour ce client.
- **Messages de contact** : ils étaient enregistrés en base, mais aucune page de l'admin ne permettait de les lire.
- **Devis** :
  - le client voyait les brouillons ;
  - il n'y avait aucun moyen d'accepter ou de refuser un devis ;
  - la génération du PDF plantait dès qu'il y avait un retour à la ligne ;
  - le bouton « Créer devis » ne reprenait pas la demande ;
  - une seule ligne de prestation était possible.
- **Comptes désactivés** : ils gardaient l'accès jusqu'à l'expiration du cookie (7 jours). L'accès est maintenant coupé immédiatement.
- **Portfolio** : la page Réalisations était vide, car la base ne contenait aucun projet alors que l'accueil en affichait 11 écrits en dur. Il est maintenant branché sur la base et se gère depuis l'admin.
- **FAQ de l'accueil** : elle parlait de « Supabase » et d'un « mode démonstration », ce qui ne correspond pas au site. Elle vient maintenant de la base.
- **Erreurs** : les routes API renvoyaient des erreurs 500 brutes au lieu de messages compréhensibles.
- **Notifications** : seul le premier administrateur était prévenu. Les notifications ne pouvaient ni être lues ni être supprimées.
- **Messagerie** : aucun statut lu / non lu.

## Ajouts

- **Sécurité** :
  - limite d'essais à la connexion, à l'inscription, au mot de passe oublié, au formulaire de contact et aux demandes de devis ;
  - en-têtes HTTP de sécurité ;
  - textes échappés dans les emails ;
  - contrôle des types de fichiers envoyés.
- **Devis** :
  - plusieurs lignes par devis, avec brouillon puis envoi ;
  - numérotation `NX-2026-0001` ;
  - acceptation ou refus en un clic par le client ;
  - PDF refait.
- **Projets** : modification du projet, historique avec une note pour le client, dépôt de livrables.
- **Messagerie** : une conversation par client, et un onglet « Formulaire de contact » dans l'admin.
- **Notifications** : pour les clients et les admins, avec compteurs dans le menu.
- **Admin Portfolio** : choix des images en cliquant sur les vignettes de `public/images`, au lieu de taper les chemins.
- **Admin FAQ** : modification des questions et bouton pour les masquer.
- **Statistiques** : chiffres réels (taux d'acceptation, montant des devis acceptés).
- **Pages d'erreur** : page 404 et page d'erreur propres.
- **Nouveau design « planche technique »** :
  - chaque réalisation est présentée comme un plan avec son cartouche ;
  - le bleu du logo est la seule couleur d'action ;
  - le site est utilisable sur téléphone, testé jusqu'à 375 px de large.

## Images

- `public/images/` (28 images) : ce sont les images **servies par le site**.
- `images/` (24 images) : c'est le dossier source. Les 24 images existent toutes, à l'identique, dans `public/images`. **Aucune image n'a été supprimée, déplacée ni remplacée.**

## Tests effectués

Tous les tests ont été faits sur une base PostgreSQL locale jetable. **La base Railway n'a jamais été touchée.**

- `npm run build` réussit, et TypeScript ne signale aucune erreur.
- **135 tests automatiques réussis sur 135**, lancés sur le build de production. Ils couvrent :
  - toutes les pages publiques ;
  - l'inscription, la connexion et la déconnexion ;
  - le parcours complet demande → devis → acceptation → projet → livrable → messages → notifications ;
  - la FAQ, le portfolio et les paramètres de l'admin ;
  - les accès interdits : un client qui tente de lire les fichiers, devis ou messages d'un autre client, ou d'ouvrir l'admin ;
  - un compte désactivé qui perd l'accès immédiatement.
- **Mobile** : 34 pages mesurées à 375 px, aucun débordement horizontal.
- **Images** : les 29 images du portfolio restent dans leur cadre sur PC, tablette et mobile.

## Points à vérifier de ton côté

- **Email affiché** : le site affiche `contactnexora3d@gmail.com`. J'ai considéré `contact@nexora3d.tn` comme une valeur d'exemple. Si ce domaine est bien à toi, remets-le dans Admin › Paramètres.
- **Carte « NEXORA AI »** : je l'ai retirée de l'accueil, parce que cette fonction n'existe pas sur le site.
- **Emails** : ils ne partent que si les variables `SMTP_*` sont renseignées. Sans elles, tout le reste du site fonctionne normalement.
- **Nouvelles images** : pour en ajouter au portfolio, il faut placer le fichier dans `public/images` puis redéployer. Il n'y a pas d'envoi d'images depuis l'admin, parce que le disque Railway est effacé à chaque déploiement.

Le détail technique (variables d'environnement, déploiement Railway) est dans le `README.md`.
