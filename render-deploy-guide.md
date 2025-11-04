# 🚀 Guide de Déploiement Render - Cardify

## Configuration Complète pour Render

### 1. Configuration du Repository

Votre projet est maintenant configuré avec :
- ✅ `render.yaml` - Configuration automatique
- ✅ `.env.production` - Variables d'environnement de production
- ✅ Backend optimisé pour Render

### 2. Variables d'Environnement Render

**Variables automatiques (render.yaml) :**
- `NODE_ENV=production`
- `PORT=10000`
- `CLIENT_URL=https://cardify.vercel.app`
- `CORS_ORIGINS=https://cardify.vercel.app,https://www.cardify.vercel.app`
- `JWT_SECRET` (auto-généré par Render)

**Variable à ajouter manuellement dans Render Dashboard :**
```
MONGO_URI=mongodb+srv://cardifyuser:bg1skvf3eZmQdLNh@cluster.mongodb.net/cardify
```

### 3. Étapes de Déploiement

#### Étape 1: Préparer le Repository
```bash
git add .
git commit -m "Configure Render deployment with render.yaml"
git push origin main
```

#### Étape 2: Créer le Service sur Render
1. Aller sur [render.com](https://render.com)
2. Connecter votre repository GitHub
3. Render détectera automatiquement le `render.yaml`
4. Cliquer sur "Create Web Service"

#### Étape 3: Ajouter la Variable MongoDB
Dans le Render Dashboard :
1. Aller dans "Environment"
2. Ajouter : `MONGO_URI=mongodb+srv://cardifyuser:bg1skvf3eZmQdLNh@cluster.mongodb.net/cardify`
3. Sauvegarder

### 4. Configuration MongoDB Atlas

**Vérifications nécessaires :**
- ✅ Projet : "Cardify"
- ✅ Utilisateur : "cardifyuser" 
- ✅ Mot de passe : "bg1skvf3eZmQdLNh"
- ✅ Network Access : 0.0.0.0/0 (pour Render)
- ✅ Base de données : "cardify"

### 5. Configuration Automatique

Le fichier `render.yaml` configure automatiquement :

```yaml
services:
  - type: web
    name: cardify-backend
    env: node
    rootDir: ./backend
    buildCommand: npm install && npm run build
    startCommand: node dist/server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: JWT_SECRET
        generateValue: true
      - key: CLIENT_URL
        value: https://cardify.vercel.app
      - key: CORS_ORIGINS
        value: https://cardify.vercel.app,https://www.cardify.vercel.app
```

### 6. Optimisations Backend

Le serveur est optimisé pour Render :
- ✅ Bind sur `0.0.0.0` (compatible Render)
- ✅ Gestion d'erreur MongoDB robuste
- ✅ Timeout configurés pour production
- ✅ Retry logic pour MongoDB
- ✅ Logging amélioré

### 7. URL de Production

Une fois déployé, votre API sera accessible sur :
```
https://cardify-backend.onrender.com
```

### 8. Tests de Santé

Endpoint de test disponible :
```
GET https://cardify-backend.onrender.com/api/health
```

Réponse attendue :
```json
{
  "status": "OK",
  "message": "Cardify API is running"
}
```

### 9. Redéploiement Automatique

Render redéploiera automatiquement à chaque push sur la branche `main`.

### 10. Troubleshooting

**Erreur MongoDB :**
- Vérifier la variable `MONGO_URI` dans Render
- Vérifier Network Access dans MongoDB Atlas

**Erreur CORS :**
- Vérifier `CLIENT_URL` et `CORS_ORIGINS`
- S'assurer que l'URL frontend est correcte

**Build Error :**
- Vérifier que `npm run build` fonctionne localement
- Vérifier les dépendances dans `package.json`

---

## 🎯 Prêt pour le Déploiement !

Votre configuration Render est maintenant complète. Suivez les étapes ci-dessus pour déployer votre backend Cardify sur Render.
