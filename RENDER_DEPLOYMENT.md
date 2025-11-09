# 🚀 Guide Complet Déploiement Render

## Configuration Cardify Backend sur Render.com

---

## 📋 **Prérequis**

- ✅ Repository Git : `Sy2force/CardifY`
- ✅ Compte Render.com (gratuit)
- ✅ MongoDB Atlas configuré
- ✅ Variables d'environnement prêtes

---

## 🔧 **Étape 1: Créer le Service Render**

### 1.1 Connexion à Render
1. Aller sur [render.com](https://render.com)
2. Se connecter avec GitHub
3. Cliquer **"New +"** → **"Web Service"**

### 1.2 Configuration Repository
```bash
Repository: Sy2force/CardifY
Branch: main
Root Directory: backend
```

### 1.3 Configuration Build & Start
```bash
Build Command: npm ci && npm run build
Start Command: npm start
```

---

## ⚙️ **Étape 2: Variables d'Environnement**

### Variables Obligatoires à Configurer dans Render Dashboard

#### 🔐 **MONGO_URI** (Requis)
```bash
# Format MongoDB Atlas
mongodb+srv://cardifyuser:bg1skvf3eZmQdLNh@cluster.mongodb.net/cardify?retryWrites=true&w=majority&authSource=admin
```

#### 🔑 **JWT_SECRET** (Requis)
```bash
# Générer un secret fort (64+ caractères)
openssl rand -base64 64

# Exemple de résultat:
aBcD3fG8hIjK2mNoPqRsT4uVwXyZ1aBcD3fG8hIjK2mNoPqRsT4uVwXyZ1aBcD3fG=
```

#### 🌐 **CLIENT_URL** (Requis)
```bash
# URL de votre frontend Vercel
https://cardif-y-3zrs.vercel.app
```

### Variables Auto-Configurées (dans render.yaml)
```yaml
NODE_ENV: production
PORT: 10000
```

---

## 📁 **Étape 3: Configuration Render Dashboard**

### Service Settings
```bash
Name: cardify-backend
Environment: Node
Plan: Free
Auto-Deploy: Yes (recommandé)
```

### Advanced Settings
```bash
Root Directory: backend
Health Check Path: /api/health
```

---

## 🔍 **Étape 4: Vérification Déploiement**

### 4.1 Logs de Déploiement
Surveiller les logs pour ces étapes:
```bash
✅ ==> Cloning from https://github.com/Sy2force/CardifY...
✅ ==> Using Node version 18.x.x
✅ ==> Running build command: npm ci && npm run build
✅ ==> npm WARN using --force Recommended protections disabled
✅ ==> Build completed successfully
✅ ==> Starting service with: npm start
✅ ==> Server running on http://localhost:10000
```

### 4.2 Tests Post-Déploiement
```bash
# Test health check
curl https://your-service-name.onrender.com/health
# Attendu: {"status":"ok"}

curl https://your-service-name.onrender.com/api/health
# Attendu: JSON avec status, message, timestamp, env
```

---

## 🚨 **Résolution des Erreurs Communes**

### Erreur: "Cannot find module"
```bash
❌ Error: Cannot find module '/opt/render/project/src/index.js'

✅ Solution:
- Vérifier que render.yaml contient rootDir: ./backend
- S'assurer que buildCommand compile TypeScript: npm run build
- Vérifier que package.json main: "dist/index.js"
```

### Erreur: "Port already in use"
```bash
❌ Error: listen EADDRINUSE: address already in use :::8080

✅ Solution:
- Utiliser process.env.PORT dans le code
- Render assigne automatiquement le port
- Ne pas hardcoder le port dans le code
```

### Erreur: MongoDB Connection
```bash
❌ MongooseServerSelectionError: Could not connect to any servers

✅ Solution:
1. Vérifier MONGO_URI dans les variables d'environnement
2. Whitelister l'IP de Render (0.0.0.0/0) dans MongoDB Atlas
3. Vérifier les credentials MongoDB
```

### Erreur: JWT Secret manquant
```bash
❌ Error: JWT secret is required

✅ Solution:
- Configurer JWT_SECRET dans les variables d'environnement Render
- Générer un secret fort: openssl rand -base64 64
```

---

## 📊 **Monitoring & Health Checks**

### Endpoints de Santé
```bash
GET /health
Response: {"status":"ok"}

GET /api/health  
Response: {
  "status": "ok",
  "message": "Cardify API is running",
  "timestamp": "2024-11-09T07:00:00.000Z",
  "env": "production"
}
```

### Métriques Render
- **Uptime Target:** 99.9%
- **Response Time:** < 500ms
- **Memory Usage:** < 256MB (Free plan)
- **Build Time:** < 10 minutes

---

## 🔄 **Processus de Redéploiement**

### Déploiement Automatique
```bash
# Push vers main déclenche auto-deploy
git add .
git commit -m "Fix: update backend configuration"
git push origin main

# Render redéploie automatiquement
```

### Déploiement Manuel
1. Aller dans Render Dashboard
2. Sélectionner le service `cardify-backend`
3. Cliquer **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🛠️ **Configuration Complète render.yaml**

```yaml
services:
  - type: web
    name: cardify-backend
    env: node
    rootDir: ./backend
    buildCommand: npm ci && npm run build
    startCommand: npm start
    plan: free
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: CLIENT_URL
        value: https://cardif-y-3zrs.vercel.app
```

---

## 🔐 **Checklist Sécurité Render**

- [ ] **MongoDB URI** configuré avec credentials sécurisés
- [ ] **JWT Secret** généré avec 64+ caractères aléatoires
- [ ] **Variables sensibles** marquées `sync: false`
- [ ] **HTTPS** activé automatiquement par Render
- [ ] **Client URL** pointant vers le domaine HTTPS du frontend
- [ ] **IP Whitelist** MongoDB Atlas configuré pour 0.0.0.0/0

---

## 📈 **URLs Finales**

### Backend API (Render)
```bash
# Production URL (exemple)
https://cardify-backend-3dfn.onrender.com

# Health checks
https://cardify-backend-3dfn.onrender.com/health
https://cardify-backend-3dfn.onrender.com/api/health
```

### Frontend (Vercel)
```bash
# Production URL
https://cardif-y-3zrs.vercel.app
```

---

## 🎯 **Étapes de Validation Finale**

### 1. Build Local
```bash
cd backend
npm run build
npm start
# ✅ Server running on http://localhost:8080
```

### 2. Test Endpoints
```bash
curl http://localhost:8080/health
curl http://localhost:8080/api/health
```

### 3. Déploiement Render
- Push vers Git
- Vérifier logs de build
- Tester endpoints en production

### 4. Configuration Frontend
- Mettre à jour VITE_API_URL dans Vercel
- Tester API calls depuis le frontend

---

## ❓ **Support & Dépannage**

### Logs Render
```bash
# Accéder aux logs en temps réel
1. Aller dans Render Dashboard
2. Sélectionner le service
3. Onglet "Logs"
4. Surveiller les erreurs de démarrage
```

### Contact Support
- **Render Support:** [render.com/support](https://render.com/support)
- **Documentation:** [render.com/docs](https://render.com/docs)
- **Community:** [render.com/community](https://render.com/community)

---

**🚀 Déploiement Render Prêt à l'Emploi !**
