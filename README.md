# 💼 Cardify - Plateforme de Cartes Professionnelles Multilingue

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/Sy2force/CardifY)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![Security](https://img.shields.io/badge/vulnerabilities-0-brightgreen)](https://github.com/Sy2force/CardifY)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Une plateforme moderne de cartes professionnelles construite avec React, TypeScript et Node.js, supportant 3 langues avec une interface élégante et sécurisée.

## Configuration Requise

### Variables d'Environnement Frontend

Créez un fichier `.env` dans le dossier `frontend/` avec le contenu suivant :

```env
VITE_API_URL=http://localhost:3006/api
```

### Variables d'Environnement Backend

Copiez `.env.example` vers `.env` dans le dossier racine et ajustez les valeurs :

```bash
cp .env.example .env
```

## Démarrage Rapide

1. **Installation des dépendances** :
   ```bash
   # Dépendances racine
   npm install
   
   # Dépendances backend
   cd backend && npm install
   
   # Dépendances frontend
   cd ../frontend && npm install
   ```

2. **Configuration de la base de données** :
   - Assurez-vous que MongoDB est démarré sur `localhost:27017`
   - La base de données `cardify` sera créée automatiquement

3. **Démarrage des services** :
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

4. **Accès à l'application** :
   - Frontend : http://localhost:3008
   - Backend API : http://localhost:3006

## Résolution des Problèmes

### Erreur "Impossible de se connecter au serveur"

1. Vérifiez que le backend est démarré sur le port 3006
2. Vérifiez que le fichier `.env` existe dans `frontend/` avec `VITE_API_URL=http://localhost:3006/api`
3. Vérifiez que MongoDB est démarré

### Erreur de chargement des cartes

L'application inclut maintenant une gestion d'erreur robuste qui affichera des messages spécifiques selon le problème :
- Erreur réseau : "Impossible de se connecter au serveur"
- Service non trouvé : "Vérifiez que le serveur est démarré"
- Erreur serveur : "Veuillez réessayer plus tard"

## ✨ Fonctionnalités

- 🌐 **Multilingue** - Support FR/EN/HE avec traductions complètes
- 🚀 **Interface moderne** - Design responsive et élégant
- 👥 **Gestion d'utilisateurs** - Comptes Admin, Business et User
- 📱 **Cartes digitales** - Création et partage facile
- 🔐 **Authentification sécurisée** - JWT tokens
- 📊 **Dashboard intuitif** - Gestion centralisée
- 🧪 **Comptes de démonstration** - Test immédiat

## 🚀 Démarrage Rapide

### Prérequis

- Node.js (v18+)
- MongoDB
- npm ou yarn

### Installation

1. **Cloner le repository**

```bash
git clone https://github.com/Sy2force/CardifY.git
cd CardifY
```

2. **Installer les dépendances**

```bash
npm run install:all
```

3. **Configuration**

```bash
cp .env.example .env
# Modifier les variables dans .env
```

4. **Initialiser la base de données**

```bash
npm run seed
```

5. **Démarrer l'application**

```bash
npm run dev
```

L'application sera accessible sur:

- Frontend: <http://localhost:3008>
- Backend: <http://localhost:3006>

## 🧪 Comptes de Démonstration

| Email | Mot de passe | Type | Statut |
|-------|--------------|------|--------|
| admin@cardify.com | admin123 | Admin | ✅ Fonctionnel |
| sarah@example.com | business123 | Business | ✅ Fonctionnel |
| john@example.com | user123 | User | ✅ Fonctionnel |

## 📁 Structure du Projet

```text
CardifY/
├── frontend/          # Application React (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── locales/   # Traductions FR/EN/HE
│   │   └── services/
├── backend/           # API Node.js (Express)
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── validations/
└── package.json       # Scripts globaux
```

## 🔧 Scripts Disponibles

- `npm run dev` - Démarrer frontend et backend
- `npm run build` - Build frontend pour production
- `npm run seed` - Initialiser les données de démonstration
- `npm run install:all` - Installer toutes les dépendances

## 🌐 Langues Supportées

- 🇫🇷 **Français** - Interface complète
- 🇬🇧 **English** - Full interface
- 🇮🇱 **עברית** - ממשק מלא

## 🛠️ Technologies

**Frontend:**

- React 18 + TypeScript
- Vite
- Tailwind CSS
- i18next (internationalisation)
- React Hook Form + Yup

**Backend:**

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Joi Validation

## 📱 Fonctionnalités Métier

- Création de cartes professionnelles
- Gestion des profils utilisateur
- Système de rôles (Admin/Business/User)
- Validation des numéros de téléphone internationaux
- Interface responsive
- Thème sombre/clair

## 🔒 Sécurité

- Authentification JWT
- Validation des données côté client et serveur
- Hashage des mots de passe
- Protection CORS
- Middleware d'autorisation

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT

## 👨‍💻 Auteur

**Shay Acoca**

- Email: <shay@cardify.com>
- GitHub: [@Sy2force](https://github.com/Sy2force)
- **Vite** - Build tool rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **Framer Motion** - Animations fluides
- **React Router DOM** - Navigation
- **React Hook Form + Yup** - Gestion des formulaires
- **React i18next** - Internationalisation
- **Axios** - Client HTTP
- **React Hot Toast** - Notifications

### Backend
- **Node.js + Express.js** - Serveur web
- **TypeScript** - Typage statique
- **MongoDB + Mongoose** - Base de données
- **JWT** - Authentification
- **bcryptjs** - Hash des mots de passe
- **Joi** - Validation des données
- **Morgan** - Logging des requêtes
- **CORS** - Cross-Origin Resource Sharing

## 📁 Structure du Projet

```
cardify/
├── frontend/                    # Application React
│   ├── src/
│   │   ├── components/          # Composants réutilisables
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   ├── context/             # Contextes React
│   │   │   └── AuthContext.tsx
│   │   ├── i18n/                # Configuration i18n
│   │   │   └── index.ts
│   │   ├── locales/             # Fichiers de traduction
│   │   │   ├── fr/translation.json
│   │   │   ├── en/translation.json
│   │   │   └── he/translation.json
│   │   ├── pages/               # Pages principales
│   │   │   ├── Landing.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Cards.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── services/            # Services API
│   │   │   └── api.ts
│   │   ├── types/               # Types TypeScript
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── backend/                     # API Node.js
│   ├── src/
│   │   ├── controllers/         # Contrôleurs
│   │   │   ├── user.controller.ts
│   │   │   └── card.controller.ts
│   │   ├── middlewares/         # Middlewares
│   │   │   ├── auth.ts
│   │   │   └── error.ts
│   │   ├── models/              # Modèles Mongoose
│   │   │   ├── user.model.ts
│   │   │   └── card.model.ts
│   │   ├── routes/              # Routes API
│   │   │   ├── user.routes.ts
│   │   │   └── card.routes.ts
│   │   ├── services/            # Services
│   │   │   └── logger.ts
│   │   ├── validations/         # Validation Joi
│   │   │   ├── user.validation.ts
│   │   │   └── card.validation.ts
│   │   ├── data/                # Scripts de données
│   │   │   └── seed.ts
│   │   └── server.ts
│   ├── logs/                    # Fichiers de logs
│   ├── package.json
│   └── tsconfig.json
├── .env.example                 # Variables d'environnement
├── package.json                 # Scripts globaux
└── README.md
```

## 🚀 Installation et Démarrage

### Prérequis
- **Node.js** (v18+)
- **MongoDB** (local ou cloud)
- **npm** ou **yarn**

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/cardify.git
cd cardify
```

### 2. Installation des dépendances
```bash
# Installation globale et de tous les modules
npm run install:all
```

### 3. Configuration de l'environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env avec vos configurations
```

**Variables d'environnement requises :**
```env
# Configuration serveur
PORT=3006
NODE_ENV=development

# Base de données MongoDB
MONGO_URI=mongodb://localhost:27017/cardify

# JWT Secret (générez une clé sécurisée)
JWT_SECRET=votre-secret-jwt-super-securise

# URL du client frontend
CLIENT_URL=http://localhost:3008

# Niveau de log
LOG_LEVEL=info
```

### 4. Initialisation de la base de données
```bash
# Peupler la base avec des données de test
npm run seed
```

### 5. Démarrer l'application
```bash
# Démarrer backend + frontend simultanément
npm run dev

# OU démarrer séparément :
npm run dev:backend   # Backend sur http://localhost:3006
npm run dev:frontend  # Frontend sur http://localhost:3008
```

## 📊 Structure MongoDB

### Collection `users`
```javascript
{
  _id: ObjectId,
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String (optional),
  isAdmin: Boolean (default: false),
  isBusiness: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Collection `cards`
```javascript
{
  _id: ObjectId,
  title: String (required),
  subtitle: String (required),
  description: String (required),
  phone: String (required),
  email: String (required),
  web: String (optional),
  image: {
    url: String (optional),
    alt: String (optional)
  },
  address: {
    country: String (required),
    city: String (required),
    street: String (required),
    houseNumber: String (required),
    state: String (optional),
    zip: String (optional)
  },
  bizNumber: Number (unique, auto-generated),
  likes: [ObjectId] (references to users),
  user_id: ObjectId (reference to user, required),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Routes

| Méthode | Endpoint | Description | Auth | Rôle |
|---------|----------|-------------|------|------|
| **Authentification** ||||
| POST | `/api/users/register` | Inscription | ❌ | - |
| POST | `/api/users/login` | Connexion | ❌ | - |
| GET | `/api/users/profile` | Profil utilisateur | ✅ | User |
| PUT | `/api/users/profile` | Modifier profil | ✅ | User |
| GET | `/api/users` | Liste utilisateurs | ✅ | Admin |
| DELETE | `/api/users/:id` | Supprimer utilisateur | ✅ | Admin |
| **Cartes** ||||
| GET | `/api/cards` | Toutes les cartes | ❌ | - |
| GET | `/api/cards/:id` | Carte par ID | ❌ | - |
| POST | `/api/cards` | Créer carte | ✅ | Business |
| GET | `/api/cards/my-cards` | Mes cartes | ✅ | User |
| PUT | `/api/cards/:id` | Modifier carte | ✅ | Owner/Admin |
| DELETE | `/api/cards/:id` | Supprimer carte | ✅ | Owner/Admin |
| PATCH | `/api/cards/:id/like` | Liker/Unlike | ✅ | User |

## 🔐 Authentification et Rôles

### Système de Rôles
- **👤 User** - Utilisateur standard (peut liker les cartes)
- **💼 Business** - Compte professionnel (peut créer des cartes)
- **⚡ Admin** - Administrateur (gestion complète)

### JWT Payload
```javascript
{
  _id: "user_id",
  isAdmin: boolean,
  isBusiness: boolean,
  iat: timestamp,
  exp: timestamp
}
```

### Middleware de Protection
- `authMiddleware` - Vérifie la validité du token
- `adminMiddleware` - Accès admin uniquement
- `businessMiddleware` - Accès business/admin

## 🌐 Internationalisation

Cardify supporte 3 langues :
- **🇫🇷 Français** (par défaut)
- **🇺🇸 Anglais**
- **🇮🇱 Hébreu** (avec support RTL)

### Changer de langue
```typescript
import { useTranslation } from 'react-i18next';

const { i18n } = useTranslation();
i18n.changeLanguage('en'); // 'fr', 'en', 'he'
```

## 🧪 Comptes de Test

Après avoir exécuté `npm run seed`, vous aurez accès à :

| Email | Mot de passe | Type | Statut |
|-------|--------------|------|--------|
| admin@cardify.com | admin123 | Admin | ✅ Fonctionnel |
| sarah@example.com | business123 | Business | ✅ Fonctionnel |
| john@example.com | user123 | User | ✅ Fonctionnel |

## 📋 Scripts Disponibles

### Scripts Globaux (racine)
```bash
npm run dev              # Démarrer backend + frontend
npm run dev:backend      # Démarrer uniquement backend
npm run dev:frontend     # Démarrer uniquement frontend
npm run install:all      # Installer toutes les dépendances
npm run build           # Build du frontend
npm run seed            # Peupler la base de données
```

### Scripts Backend
```bash
npm run dev             # Développement avec ts-node-dev
npm run build          # Compilation TypeScript
npm start              # Démarrer en production
npm run seed           # Peupler la base de données
```

### Scripts Frontend
```bash
npm run dev            # Serveur de développement Vite
npm run build         # Build de production
npm run preview       # Prévisualiser le build
npm run lint          # Linter ESLint
```

## 🚀 Déploiement

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Déployer le dossier 'dist'
```

### Backend (Render/Railway)
```bash
cd backend
npm run build
npm start
```

### Variables d'environnement production
```env
NODE_ENV=production
PORT=3006
MONGO_URI=mongodb+srv://...
JWT_SECRET=super-secret-production-key
CLIENT_URL=https://votre-domaine.com
```

## 🐛 Dépannage

### Problèmes courants

1. **Erreur de connexion MongoDB**
   ```bash
   # Vérifiez que MongoDB est démarré
   mongosh mongodb://localhost:27017/cardify
   ```

2. **Port déjà utilisé**
   ```bash
   # Changer le port dans .env
   PORT=3006
   ```

3. **Erreur CORS**
   ```bash
   # Vérifiez CLIENT_URL dans .env backend
   CLIENT_URL=http://localhost:3008
   ```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**Shay Acoca** - Développeur Full-Stack
- GitHub: [@shayacoca](https://github.com/shayacoca)
- Email: shay@cardify.com

---

<div align="center">
  <p>Fait avec ❤️ pour connecter les professionnels</p>
  <p>
    <a href="https://cardify.app">Site Web</a> •
    <a href="https://github.com/shayacoca/cardify/issues">Signaler un Bug</a> •
    <a href="https://github.com/shayacoca/cardify/issues">Demander une Fonctionnalité</a>
  </p>
</div>
