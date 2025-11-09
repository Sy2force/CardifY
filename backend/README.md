# Cardify Backend API

Backend Express API with TypeScript for the Cardify business card application.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- MongoDB (local or MongoDB Atlas)

### Environment Variables

Create `.env` file in backend directory:

```env
NODE_ENV=development
PORT=10000
MONGO_URI=mongodb://localhost:27017/cardify-dev
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:3000
```

### Local Development

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
npm run lint:fix
```

## 📁 Project Structure

```text
backend/
├── src/
│   ├── index.ts          # Entry point
│   ├── controllers/      # Route controllers
│   ├── middlewares/      # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript interfaces
│   ├── utils/           # Helper functions
│   └── validations/     # Input validation schemas
├── dist/                # Compiled JavaScript (auto-generated)
├── package.json
├── tsconfig.json
└── README.md
```

## 🔍 Testing

### Health Check

```bash
# Test local server
curl http://localhost:10000/health

# Expected response:
{
  "status": "OK",
  "message": "Cardify API is running",
  "timestamp": "2025-11-09T04:04:09.558Z",
  "env": "development",
  "port": 10000
}
```

### API Routes

```bash
# Health check (alternative)
curl http://localhost:10000/api/health

# Root endpoint
curl http://localhost:10000/
```

### Build Verification

```bash
# Clean build
npm run clean
npm run build

# Verify dist/index.js exists
ls -la dist/
# Should show: index.js and other compiled files

# Test compiled version directly
node dist/index.js
```

## 🔧 Scripts Reference

| Script | Description |
|--------|-------------|
| `npm start` | Start production server (`node dist/index.js`) |
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Clean build TypeScript to dist/ |
| `npm run build:watch` | Build with file watching |
| `npm run clean` | Remove dist/ directory |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors automatically |
| `npm run test` | Run Jest tests |
| `npm run healthcheck` | curl health endpoint |

## 🚀 Deployment (Render)

The backend is configured for automatic deployment on Render.com:

### render.yaml Configuration

```yaml
services:
  - type: web
    name: cardify-backend
    env: node
    rootDir: ./backend
    buildCommand: npm ci && npm run build
    startCommand: npm start
```

### Required Environment Variables on Render

- `NODE_ENV=production`
- `PORT=10000`
- `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cardify`
- `JWT_SECRET=your-production-jwt-secret`
- `CLIENT_URL=https://your-frontend-domain.vercel.app`

### Deployment Process

1. Push code to main branch
2. Render automatically detects changes
3. Runs `npm ci && npm run build`
4. Starts server with `npm start`
5. Server available at `https://your-service.onrender.com`

## 🐛 Troubleshooting

### Common Issues

**Error: `Cannot find module './dist/index.js'`**

```bash
# Solution: Ensure build completed successfully
npm run build
ls -la dist/  # Should show index.js
```

**Error: `EADDRINUSE: address already in use`**

```bash
# Solution: Use different port
PORT=3009 npm start
```

**Error: `Missing MONGO_URI environment variable`**

```bash
# Solution: Set environment variable
export MONGO_URI=mongodb://localhost:27017/cardify-dev
# Or add to .env file
```

**MongoDB Connection Failed**

```bash
# Local MongoDB
brew services start mongodb-community
# Or use MongoDB Atlas cloud connection string
```

### Build Debugging

```bash
# Verbose TypeScript compilation
npx tsc --noEmit --listFiles

# Check TypeScript config
npx tsc --showConfig

# Verify all dependencies
npm ls
```

### Production Logs

```bash
# Check server logs
npm start 2>&1 | tee server.log

# Monitor with PM2 (optional)
npm install -g pm2
pm2 start dist/index.js --name cardify-api
pm2 logs cardify-api
```

## 🏗️ Development

### Adding New Routes

1. Create controller in `src/controllers/`
2. Add route in `src/routes/`
3. Import and use in `src/index.ts`

### Database Models

- Use Mongoose schemas in `src/models/`
- Add validation with Joi in `src/validations/`

### TypeScript Strict Mode

- All unused variables/parameters flagged
- Null safety enforced
- Type checking strict

---

## 📚 API Documentation

Once deployed, visit:
- Health: `https://your-api.onrender.com/health`
- API Health: `https://your-api.onrender.com/api/health`
- Root: `https://your-api.onrender.com/`
