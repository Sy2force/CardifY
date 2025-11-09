# 🚀 Cardify - Digital Business Cards Platform

> **Production-Ready Full-Stack Application**  
> Modern, responsive platform for creating and sharing digital business cards.

## 🏗️ Architecture

```text
cardify/
├── 🔙 backend/              # Node.js + Express + TypeScript
│   ├── src/index.ts         # Entry point (health checks)
│   ├── dist/index.js        # Compiled output for Render
│   ├── .env.example         # Backend environment variables
│   └── README.md            # Backend documentation
├── 🎨 app/frontend/         # React + Vite + TypeScript
│   ├── src/                 # React source code
│   ├── dist/                # Production build for Vercel
│   ├── .env.example         # Frontend environment variables  
│   └── README.md            # Frontend documentation
├── 📋 Documentation/
│   ├── RENDER_DEPLOYMENT.md # Complete Render setup guide
│   ├── VERCEL_SETUP.md      # Vercel configuration guide
│   ├── SECURITY.md          # Security best practices
│   ├── TESTING.md           # Testing strategy
│   ├── MONITORING.md        # Monitoring & observability
│   └── MAINTENANCE.md       # Post-launch maintenance
├── ⚙️  render.yaml          # Render deployment config
└── 🌐 vercel.json           # Vercel deployment config
```

## 🚀 Deployment Status

| Component | Platform | Status | URL |
|-----------|----------|--------|-----|
| 🔙 **Backend API** | Render.com | ✅ Ready | `https://cardify-backend-XXXX.onrender.com` |
| 🎨 **Frontend** | Vercel | ✅ Ready | `https://cardif-y-3zrs.vercel.app` |
| 🗄️ **Database** | MongoDB Atlas | ✅ Ready | Connection string configured |

## ⚡ Quick Deploy

### 1. **Backend on Render** ⭐
```bash
# Auto-configured via render.yaml
Root Directory: ./backend
Build Command: npm ci && npm run build
Start Command: npm start
Health Check: /api/health
```

**📖 [Complete Render Setup Guide →](RENDER_DEPLOYMENT.md)**

### 2. **Frontend on Vercel** ⭐
```bash
# Auto-configured via vercel.json
Build Command: cd app/frontend && npm install && npm run build
Output Directory: app/frontend/dist
API Proxy: /api/* → Backend Render URL
```

**📖 [Complete Vercel Setup Guide →](VERCEL_SETUP.md)**

## 💻 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account
- Git

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env          # Configure environment variables
npm run dev                   # Starts on http://localhost:8080
```

### Frontend Setup  
```bash
cd app/frontend
npm install
cp .env.example .env          # Configure API URL
npm run dev                   # Starts on http://localhost:5173
```

## 🧪 Testing & Validation

### Backend Health Checks
```bash
# Build and start backend
cd backend
npm run build
npm start

# Test endpoints
curl http://localhost:8080/health
curl http://localhost:8080/api/health
```

### Frontend Build Test
```bash
cd app/frontend
npm run build
npm run preview               # Test production build
```

## ✨ Key Features

- 🔐 **JWT Authentication** - Secure user authentication
- 📇 **Digital Business Cards** - Create and manage cards
- 📱 **Responsive Design** - Works on all devices
- 🌍 **Internationalization** - French & English support
- 🖼️ **Image Upload** - Profile pictures and logos
- ⚡ **Health Monitoring** - Built-in health checks
- 🚀 **Production Ready** - Optimized for deployment

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **Framer Motion**
- **Axios** + **React Router** + **i18next**

### Backend
- **Node.js** + **Express** + **TypeScript**
- **MongoDB** + **Mongoose** + **JWT**
- **Health Checks** + **Error Handling**

### Deployment
- **Frontend:** Vercel (Auto-deploy from `main`)
- **Backend:** Render.com (Auto-deploy from `main`)
- **Database:** MongoDB Atlas
- **API Proxy:** Vercel rewrites to Render backend

## 📚 Documentation

| Document | Purpose |
|----------|----------|
| **[RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)** | Complete backend deployment guide |
| **[VERCEL_SETUP.md](VERCEL_SETUP.md)** | Frontend deployment configuration |
| **[SECURITY.md](SECURITY.md)** | Security best practices & checklist |
| **[TESTING.md](TESTING.md)** | Testing strategy & implementation |
| **[MONITORING.md](MONITORING.md)** | Monitoring & observability setup |
| **[MAINTENANCE.md](MAINTENANCE.md)** | Post-launch maintenance plan |
| **[backend/README.md](backend/README.md)** | Backend API documentation |
| **[app/frontend/README.md](app/frontend/README.md)** | Frontend setup & development |

## 🧪 Test Accounts

```bash
# Development/Testing Credentials
Admin:    admin@cardify.com / admin123
Business: sarah@example.com / business123  
User:     john@example.com / user123
```

---

## 🎯 **Production-Ready Full-Stack Application**
✅ **Enterprise Documentation** | ✅ **Security Hardened** | ✅ **CI/CD Ready** | ✅ **Monitoring Enabled**

## 🚀 **Next Steps After Deployment**

1. **Deploy Backend** → Follow [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)
2. **Deploy Frontend** → Follow [VERCEL_SETUP.md](VERCEL_SETUP.md)  
3. **Configure Monitoring** → Implement [MONITORING.md](MONITORING.md)
4. **Run Tests** → Execute [TESTING.md](TESTING.md) strategy
5. **Security Audit** → Review [SECURITY.md](SECURITY.md) checklist
6. **Launch Maintenance** → Follow [MAINTENANCE.md](MAINTENANCE.md) plan

---

**🔥 Ready for Production Deployment on Render + Vercel**
