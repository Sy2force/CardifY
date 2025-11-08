# 🚀 CARDIFY - GUIDE DE DÉPLOIEMENT COMPLET

## 📋 PRÉREQUIS
- Compte GitHub : [github.com](https://github.com)
- Compte Render : [render.com](https://render.com)  
- Compte Vercel : [vercel.com](https://vercel.com)
- Compte MongoDB Atlas : [mongodb.com](https://cloud.mongodb.com)

## 🔧 ÉTAPE 1 : DÉPLOIEMENT BACKEND (RENDER)

### 1.1 Créer le service
1. Allez sur [render.com](https://render.com)
2. **New** → **Web Service**
3. **Connect repository** : `Sy2force/CardifY`
4. **Name** : `cardify-backend-new`
5. **Root Directory** : `backend`
6. **Environment** : `Node`
7. **Build Command** : `npm install && npm run build`
8. **Start Command** : `node dist/server.js`

### 1.2 Variables d'environnement
```
NODE_ENV=production
PORT=10000
JWT_SECRET=cardify-super-secret-jwt-key-2024
CLIENT_URL=https://cardify-app-new.vercel.app
CORS_ORIGINS=https://cardify-app-new.vercel.app,https://www.cardify-app-new.vercel.app
SERVER_URL=https://cardify-backend-new.onrender.com
MONGO_URI=mongodb+srv://cardifyuser:bg1skvf3eZmQdLNh@cluster.mongodb.net/cardify
```

### 1.3 Déployer
- Cliquez **Create Web Service**
- Attendez le déploiement (5-10 minutes)
- Notez l'URL finale : `https://cardify-backend-new.onrender.com`

## 🎨 ÉTAPE 2 : DÉPLOIEMENT FRONTEND (VERCEL)

### 2.1 Créer le projet
1. Allez sur [vercel.com](https://vercel.com)
2. **New Project**
3. **Import Git Repository** : `Sy2force/CardifY`
4. **Project Name** : `cardify-app-new`
5. **Framework Preset** : `Vite`

### 2.2 Variables d'environnement
```
VITE_API_URL=https://cardify-backend-new.onrender.com
```

### 2.3 Déployer
- Cliquez **Deploy**
- Attendez le déploiement (2-3 minutes)
- Notez l'URL finale : `https://cardify-app-new.vercel.app`

## 🔗 ÉTAPE 3 : CONNEXION FINALE

### 3.1 Mettre à jour le backend Render
Si l'URL Vercel est différente, mettez à jour dans Render :
- `CLIENT_URL` : Nouvelle URL Vercel
- `CORS_ORIGINS` : Nouvelle URL Vercel
- Redéployez le service

### 3.2 Mettre à jour le frontend Vercel  
Si l'URL Render est différente, mettez à jour dans Vercel :
- `VITE_API_URL` : Nouvelle URL Render
- Redéployez le projet

## 🧪 ÉTAPE 4 : TESTS

### 4.1 Comptes de test
```
Admin    : admin@cardify.com / admin123
Business : sarah@example.com / business123  
User     : john@example.com / user123
```

### 4.2 Vérifications
- ✅ Page d'accueil se charge
- ✅ Connexion fonctionne
- ✅ Cartes s'affichent
- ✅ Pas d'erreurs console

## 📊 URLS FINALES

**Frontend** : `https://cardify-app-new.vercel.app`
**Backend** : `https://cardify-backend-new.onrender.com`
**API Health** : `https://cardify-backend-new.onrender.com/api/health`

## 🔧 DÉPANNAGE

### Erreur de connexion
1. Vérifiez les variables d'environnement
2. Vérifiez les URLs dans les configurations
3. Redéployez les deux services

### Backend ne démarre pas
1. Vérifiez les logs Render
2. Vérifiez la connexion MongoDB
3. Vérifiez les variables d'environnement

### Frontend ne se connecte pas
1. Vérifiez `VITE_API_URL` dans Vercel
2. Vérifiez les CORS dans le backend
3. Vérifiez la console du navigateur

---

**✅ PROJET PRÊT POUR PRODUCTION !**
