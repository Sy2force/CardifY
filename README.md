# Cardify - Digital Business Cards Platform

Modern, responsive platform for creating and sharing digital business cards.

## Project Structure

```text
cardify/
├── backend/              # API Express + TypeScript (Render)
│   ├── src/index.ts     # Point d'entrée minimal
│   ├── dist/            # JavaScript compilé
│   └── package.json     # Scripts build/start
├── app/frontend/        # React + Vite + TypeScript (Vercel)
│   ├── src/             # Code source React
│   ├── dist/            # Build de production
│   └── package.json     # Scripts frontend
├── render.yaml          # Configuration Render
└── vercel.json          # Configuration Vercel
```

## Configuration de Déploiement

### Backend (Render)

**Scripts:**

- `npm run build` → Compile TypeScript vers `dist/index.js`
- `npm start` → Lance `node dist/index.js`

**Endpoints:**

- `/health` → Health check simple
- `/api/health` → Health check détaillé avec timestamp

**Variables d'environnement:**

- `NODE_ENV=production`
- `PORT=8080`
- `MONGO_URI=mongodb+srv://...`
- `JWT_SECRET=...`
- `CLIENT_URL=https://your-frontend.vercel.app`

### Frontend (Vercel)

**Build:** `cd app/frontend && npm run build`
**Output:** `app/frontend/dist`

**Variables d'environnement:**

- `VITE_API_URL=https://your-backend.onrender.com`

**Proxy API:** `/api/*` → Backend Render

## Développement Local

```bash
# Backend
cd backend
npm install
npm run dev        # Port 8080

# Frontend  
cd app/frontend
npm install
npm run dev        # Port 5173
```

## Tests

```bash
# Backend
cd backend
npm run build
npm start
curl http://localhost:8080/health

# Frontend
cd app/frontend
npm run build
npm run preview
```

## Fonctionnalités

- Authentification JWT
- CRUD cartes de visite
- Interface responsive
- Internationalisation (FR/EN)
- Upload d'images
- Health checks

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
**Backend:** Node.js, Express, TypeScript, MongoDB, JWT
**Deploy:** Vercel + Render

## Déploiement

- **Backend:** Auto-deploy depuis `main` → Render
- **Frontend:** Auto-deploy depuis `main` → Vercel
- **URL API:** Configurée via `/api/*` proxytation

- [Deployment Guide](app/docs/DEPLOYMENT.md)
- [Contributing Guide](app/docs/CONTRIBUTING.md)

## Test Accounts

```text
Admin:    admin@cardify.com / admin123
Business: sarah@example.com / business123
User:     john@example.com / user123
```

---

## ✨ Clean, organized, production-ready codebase
