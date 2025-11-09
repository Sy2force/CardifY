# Comment déployer le backend Cardify sur Render

Salut ! Voici un guide simple pour déployer ton backend sur Render. J'ai déjà préparé tout le code, il te reste juste quelques étapes à faire.

## Ce qu'on a déjà fait

Le backend est prêt à être déployé. J'ai corrigé les erreurs TypeScript qui causaient des problèmes sur Render, notamment les types manquants pour Express et Node. Tout est configuré dans les bons fichiers.

## Ce que tu dois faire maintenant

### 1. Créer le service sur Render

Va sur render.com et connecte-toi. Crée un nouveau "Web Service" et connecte ton repository GitHub `Sy2force/CardifY`. 

Render va automatiquement détecter la configuration que j'ai mise dans le fichier `render.yaml`. Ça va utiliser le dossier `backend` comme racine, installer les dépendances avec `npm ci`, compiler le TypeScript avec `npm run build`, et démarrer le serveur avec `npm start`.

### 2. Configurer les variables d'environnement

Dans le dashboard Render, va dans la section Environment de ton service et ajoute ces variables :

```
MONGO_URI=mongodb+srv://cardifyuser:bg1skvf3eZmQdLNh@cluster.mongodb.net/cardify?retryWrites=true&w=majority&authSource=admin
JWT_SECRET=cardify-super-secret-jwt-key-2024-production-64-chars-minimum
CLIENT_URL=https://ton-frontend.vercel.app
CORS_ORIGINS=https://ton-frontend.vercel.app,https://www.ton-frontend.vercel.app
```

Remplace `ton-frontend.vercel.app` par la vraie URL de ton frontend une fois qu'il sera déployé.

### 3. Lancer le déploiement

Une fois que tu as configuré ça, Render va automatiquement déployer ton service. Tu peux suivre les logs en temps réel dans le dashboard.

Si tout va bien, tu vas voir des messages comme :
- Installation des dépendances
- Compilation TypeScript
- Serveur qui démarre sur le port 10000
- Message "Server listening"

### 4. Tester que ça marche

Une fois déployé, tu peux tester ton backend en allant sur :
`https://ton-service.onrender.com/api/health`

Ça devrait te renvoyer un JSON avec `"status": "ok"` et quelques infos sur le serveur.

## En cas de problème

Si le déploiement échoue, regarde les logs dans Render. Les erreurs les plus courantes :

- **Erreur MongoDB** : Vérifie que ta string de connexion MongoDB est correcte et que l'accès réseau est configuré pour accepter toutes les IPs (0.0.0.0/0)
- **Erreur TypeScript** : Normalement c'est corrigé, mais si ça persiste, vérifie que les types sont bien en "dependencies" et pas en "devDependencies" 
- **Erreur de port** : Render gère ça automatiquement, le serveur va s'adapter au port que Render lui donne

## MongoDB Atlas

Assure-toi que ton cluster MongoDB Atlas :
- A un utilisateur `cardifyuser` avec le bon mot de passe
- Autorise les connexions depuis n'importe quelle IP (pour que Render puisse s'y connecter)
- Utilise la base de données `cardify`

## C'est tout !

Le code est déjà optimisé pour la production. Une fois que ton backend fonctionne sur Render, tu peux déployer ton frontend sur Vercel en configurant la variable `VITE_API_URL` pour pointer vers ton backend Render.

N'hésite pas si tu as des questions ou des problèmes !
