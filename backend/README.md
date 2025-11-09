# Cardify Backend

Minimal Express + TypeScript backend for Cardify business card application.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build for production  
npm run build

# Start production server
npm start
```

## 📂 Project Structure

```text
backend/
├── src/
│   └── index.ts          # Main entry point
├── dist/                 # Compiled JavaScript (auto-generated)
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript configuration
└── README.md
```

## 🔧 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Compile TypeScript → JavaScript |
| `npm start` | Start production server (`node dist/index.js`) |

## 🌐 API Endpoints

- **GET** `/health` → Simple health check
- **GET** `/api/health` → Detailed health check with timestamp

## 🔍 Testing

```bash
# Build and test locally
npm run build
npm start

# Test health endpoint
curl http://localhost:8080/health
curl http://localhost:8080/api/health
```

## 🚀 Render.com Deployment

Configured for automatic deployment:

**Build Command:** `cd backend && npm ci && npm run build`  
**Start Command:** `cd backend && npm start`  
**Health Check:** `/api/health`

### Required Environment Variables

- `NODE_ENV=production`
- `PORT=8080`
- `MONGO_URI=mongodb+srv://...`
- `JWT_SECRET=your-secret`
- `CLIENT_URL=https://your-frontend.vercel.app`

## 📝 Development Notes

- TypeScript strict mode enabled
- Minimal dependencies (express + dotenv)
- CommonJS modules for Node.js compatibility
- Health checks for monitoring
- API Health: `https://your-api.onrender.com/api/health`
- Root: `https://your-api.onrender.com/`
