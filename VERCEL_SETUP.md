# 🌐 Configuration Vercel pour Cardify Frontend

## Instructions de Déploiement Frontend + API Proxy

---

## 📋 **Configuration vercel.json**

Le fichier `vercel.json` est configuré pour:
- ✅ Build le frontend React + Vite
- ✅ Proxy les appels `/api/*` vers le backend Render
- ✅ Déploiement automatique depuis Git

```json
{
  "buildCommand": "cd app/frontend && npm install && npm run build",
  "outputDirectory": "app/frontend/dist",
  "installCommand": "cd app/frontend && npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://cardify-backend-XXXX.onrender.com/api/$1"
    }
  ]
}
```

---

## 🔧 **Étapes de Configuration Vercel**

### 1. **Mise à jour de l'URL Backend**
Une fois le backend déployé sur Render, remplacer `XXXX` par votre URL:

```json
"destination": "https://cardify-backend-3dfn.onrender.com/api/$1"
```

### 2. **Variables d'Environnement Vercel**
Dans le dashboard Vercel, configurer:

```bash
VITE_API_URL=https://cardify-backend-3dfn.onrender.com
NODE_ENV=production
```

### 3. **Test de Configuration**
Les appels API depuis le frontend seront automatiquement proxifiés:

```javascript
// Dans le frontend
axios.get('/api/health') 
// → Redirigé vers https://cardify-backend-3dfn.onrender.com/api/health
```

---

## 🚀 **Déploiement Automatique**

1. **Push vers Git** déclenche le déploiement Vercel
2. **Build Command** compile le frontend 
3. **Rewrites** configurent le proxy API
4. **Frontend** accessible sur `https://votre-app.vercel.app`

---

## ✅ **URLs Finales**

### Frontend (Vercel)
```
https://cardif-y-3zrs.vercel.app
```

### API Calls (Proxifiées)
```
https://cardif-y-3zrs.vercel.app/api/health
→ https://cardify-backend-3dfn.onrender.com/api/health
```

### Backend Direct (Render)
```
https://cardify-backend-3dfn.onrender.com/api/health
```
