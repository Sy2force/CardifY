# 🚀 Cardify Backend API

## Production-ready Express + TypeScript backend for Cardify business card application

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-v4.18+-lightgrey.svg)](https://expressjs.com/)

---

## 🎯 **Quick Start**

```bash
# Clone and navigate to backend
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Development mode (auto-reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📂 **Project Architecture**

```text
backend/
├── 📁 src/
│   └── 📄 index.ts              # 🎯 Main application entry point
├── 📁 dist/                     # 🔨 Compiled JavaScript output
├── 📄 package.json              # 📦 Dependencies & scripts
├── 📄 tsconfig.json             # ⚙️  TypeScript configuration
├── 📄 .env.example              # 🔧 Environment variables template
└── 📄 README.md                 # 📖 This documentation
```

## ⚡ **Available Scripts**

| Command | Description | Usage |
|---------|-------------|-------|
| `npm run dev` | 🔥 Development server with hot reload | Local development |
| `npm run build` | 🔨 Compile TypeScript → JavaScript | Pre-deployment |
| `npm start` | 🚀 Start production server | Production/Render |
| `npm run clean` | 🧹 Clean dist directory | Before fresh build |

## 🌐 **API Endpoints**

### Health & Status

- **GET** `/health` → Simple health check (`200 OK`)
- **GET** `/api/health` → Detailed health with environment info

```json
{
  "status": "ok",
  "message": "Cardify API is running",
  "timestamp": "2024-01-09T12:00:00.000Z",
  "env": "production"
}
```

### Future API Routes

*Ready for implementation:*

- `POST /api/auth/register` → User registration
- `POST /api/auth/login` → User authentication  
- `GET /api/cards` → List business cards
- `POST /api/cards` → Create new card
- `PUT /api/cards/:id` → Update card
- `DELETE /api/cards/:id` → Delete card

## 🔍 **Testing & Validation**

```bash
# 1. Build and test locally
npm run build
npm start

# 2. Health check endpoints
curl http://localhost:8080/health
curl http://localhost:8080/api/health

# 3. Verify environment loading
echo $NODE_ENV

# 4. Check TypeScript compilation
npx tsc --noEmit
```

## 🚀 **Production Deployment (Render.com)**

### Automatic Deployment Configuration

**Root Directory:** `./backend`  
**Build Command:** `npm ci && npm run build`  
**Start Command:** `npm start`  
**Health Check Path:** `/api/health`

### 🔐 **Required Environment Variables**

```bash
# Server
NODE_ENV=production
PORT=10000                    # Render auto-assigns

# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/cardify

# Security
JWT_SECRET=your-64-char-secret-key-generated-with-openssl-rand
JWT_EXPIRES_IN=7d

# CORS & Frontend
CLIENT_URL=https://cardify.vercel.app
CORS_ORIGINS=https://cardify.vercel.app,https://www.cardify.vercel.app
```

### 🛡️ **Security Checklist**

- ✅ **Strong JWT Secret** (64+ characters)
- ✅ **HTTPS Only** in production
- ✅ **MongoDB Atlas** with IP whitelist
- ✅ **CORS** properly configured
- ✅ **Environment variables** secured
- ✅ **No sensitive data** in logs
- ✅ **Rate limiting** configured

## 🔧 **Development Setup**

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas account
- Git

### Local Development

```bash
# 1. Environment setup
cp .env.example .env

# 2. Configure .env file
PORT=8080
NODE_ENV=development
MONGO_URI=your_mongodb_connection
JWT_SECRET=dev-secret-min-32-chars
CLIENT_URL=http://localhost:3008

# 3. Install and run
npm install
npm run dev
```

### 🐛 **Troubleshooting**

| Issue | Solution |
|-------|----------|
| `MODULE_NOT_FOUND` | Run `npm run build` first |
| Port already in use | Change `PORT` in `.env` |
| TypeScript errors | Check `tsconfig.json` |
| MongoDB connection | Verify `MONGO_URI` format |
| CORS errors | Update `CLIENT_URL` |

## 📊 **Performance & Monitoring**

### Health Monitoring

- **Uptime:** Monitor `/api/health` endpoint
- **Response Time:** Target < 200ms
- **Memory Usage:** Monitor with `process.memoryUsage()`

### Logging Strategy

```typescript
// Development: console logs
// Production: structured JSON logging
// Monitoring: Winston + external service
```

## 🛠️ **Technology Stack**

- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.18+
- **Language:** TypeScript 5.0+
- **Database:** MongoDB Atlas
- **Deployment:** Render.com
- **CI/CD:** GitHub Actions (ready)

## 📈 **Scaling Considerations**

- **Horizontal:** Multiple Render instances
- **Database:** MongoDB Atlas auto-scaling
- **Caching:** Redis integration ready
- **CDN:** Static assets via Vercel
- **Load Balancing:** Render handles automatically

## 🔗 **Related Documentation**

- [Frontend README](../app/frontend/README.md)
- [Deployment Guide](../README.md)
- [Environment Variables Guide](../.env.example)
- [API Documentation](./docs/api.md) *(planned)*

---

**🎯 Ready for Enterprise** | **🛡️ Security-First** | **⚡ Performance-Optimized**
