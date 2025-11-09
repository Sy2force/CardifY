# 🎨 Cardify Frontend

## Modern React + TypeScript + Vite frontend for Cardify business card platform

[![React](https://img.shields.io/badge/React-v18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-v7+-646CFF.svg)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-v3+-38B2AC.svg)](https://tailwindcss.com/)

---

## 🎯 **Quick Start**

```bash
# Navigate to frontend
cd app/frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Configure your API endpoint

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📂 **Project Architecture**

```text
app/frontend/
├── 📁 public/                    # Static assets
├── 📁 src/
│   ├── 📁 components/            # Reusable UI components
│   │   ├── 📄 Card.tsx
│   │   ├── 📄 Navbar.tsx
│   │   └── 📄 Footer.tsx
│   ├── 📁 pages/                 # Route components
│   │   ├── 📄 Landing.tsx
│   │   ├── 📄 Login.tsx
│   │   ├── 📄 Register.tsx
│   │   ├── 📄 Cards.tsx
│   │   ├── 📄 Dashboard.tsx
│   │   └── 📄 CardDetails.tsx
│   ├── 📁 context/               # React Context providers
│   │   ├── 📄 AuthContext.tsx
│   │   └── 📄 LanguageContext.tsx
│   ├── 📁 services/              # API services
│   │   └── 📄 api.ts
│   ├── 📁 types/                 # TypeScript interfaces
│   │   └── 📄 index.ts
│   ├── 📁 i18n/                  # Internationalization
│   │   └── 📄 index.ts
│   └── 📁 locales/               # Language files
│       ├── 📄 fr.json
│       ├── 📄 en.json
│       └── 📄 he.json
├── 📄 package.json               # Dependencies & scripts
├── 📄 vite.config.ts             # Vite configuration
├── 📄 tailwind.config.js         # Tailwind CSS config
├── 📄 tsconfig.json              # TypeScript config
└── 📄 .env.example               # Environment variables template
```

## ⚡ **Available Scripts**

| Command | Description | Environment |
|---------|-------------|-------------|
| `npm run dev` | 🔥 Development server with HMR | Development |
| `npm run build` | 🔨 Build for production | Production |
| `npm run preview` | 👀 Preview production build locally | Testing |
| `npm run lint` | 🔍 ESLint code analysis | Development |

## 🌐 **Features**

### ✨ **Core Functionality**
- **Authentication:** Login, Register, JWT token management
- **Business Cards:** Create, Read, Update, Delete operations
- **Search & Filter:** Advanced card discovery
- **Favorites:** Like/unlike cards functionality
- **Admin Panel:** User & content management

### 🎨 **UI/UX Features**
- **Responsive Design:** Mobile-first approach with Tailwind CSS
- **Modern Animations:** Framer Motion powered interactions
- **Accessible:** Full keyboard navigation and screen reader support
- **Multi-language:** i18next with French, English, Hebrew support
- **RTL Support:** Right-to-left languages (Arabic, Hebrew)

### 🛠️ **Technical Features**
- **TypeScript:** Full type safety and IntelliSense
- **React Hooks:** Modern functional components
- **Context API:** Centralized state management
- **Axios:** HTTP client with interceptors
- **Form Validation:** react-hook-form + Yup schemas
- **Hot Toast:** User feedback notifications

## 🔍 **Development**

### Environment Variables

```bash
# Backend API endpoint
VITE_API_URL=http://localhost:8080

# Development features (optional)
VITE_DEV_TOOLS=true
VITE_DEBUG_MODE=true
```

### Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit VITE_API_URL to match your backend

# 3. Start development server
npm run dev
# Opens http://localhost:5173

# 4. Backend connection
# Ensure backend is running on configured API URL
```

### Code Quality

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Fix lint issues
npm run lint --fix
```

## 🚀 **Production Deployment (Vercel)**

### Automatic Deployment Configuration

```json
{
  "buildCommand": "cd app/frontend && npm install && npm run build",
  "outputDirectory": "app/frontend/dist",
  "framework": "vite"
}
```

### 🔐 **Environment Variables (Vercel)**

```bash
# Production API endpoint
VITE_API_URL=https://cardify-backend.onrender.com

# Optional production settings
VITE_ENABLE_ANALYTICS=true
VITE_LOG_LEVEL=error
```

### Build Optimization

The production build is optimized with:
- **Code Splitting:** Automatic chunk splitting for optimal loading
- **Tree Shaking:** Dead code elimination
- **Minification:** Compressed JavaScript and CSS
- **Asset Optimization:** Optimized images and fonts

```bash
# Production build analysis
npm run build
# Outputs chunk sizes and optimization details
```

## 🔒 **Security Best Practices**

### ✅ **Client-Side Security**
- **Environment Variables:** Only `VITE_` prefixed vars are exposed
- **API Security:** All sensitive operations handled by backend
- **XSS Prevention:** Proper input sanitization
- **JWT Storage:** Secure token management in localStorage
- **HTTPS Enforcement:** Production uses secure protocols only

### 🛡️ **Authentication Flow**
```typescript
// Secure token management
const login = async (credentials) => {
  const response = await authAPI.login(credentials);
  localStorage.setItem('cardify_token', response.token);
  setAuthUser(response.user);
};

// Auto logout on token expiry
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout(); // Clear invalid tokens
    }
    return Promise.reject(error);
  }
);
```

## 📊 **Performance Metrics**

### Build Optimization Results
```text
✓ 1647 modules transformed
dist/index.html                   1.33 kB │ gzip:  0.57 kB
dist/assets/index-BoZA5bkP.css   35.11 kB │ gzip:  5.96 kB
dist/assets/router-CLhNp4gm.js   21.13 kB │ gzip:  7.89 kB
dist/assets/http-R-lXtGyY.js     36.28 kB │ gzip: 14.65 kB
dist/assets/i18n-DiZDeU4v.js     53.22 kB │ gzip: 16.36 kB
dist/assets/forms-CwOZssyq.js    59.55 kB │ gzip: 20.67 kB
dist/assets/ui-DCENkkyI.js      101.97 kB │ gzip: 34.37 kB
dist/assets/index-DJCGhBuM.js   117.44 kB │ gzip: 30.28 kB
dist/assets/vendor-D3F3s8fL.js  141.72 kB │ gzip: 45.44 kB
```

### Performance Targets
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3s
- **Cumulative Layout Shift:** < 0.1

## 🛠️ **Technology Stack**

- **Framework:** React 18 with Hooks
- **Build Tool:** Vite 7+ (Lightning fast HMR)
- **Language:** TypeScript 5+ (Full type safety)
- **Styling:** Tailwind CSS 3+ (Utility-first)
- **Routing:** React Router DOM 6+
- **Forms:** react-hook-form + Yup validation
- **HTTP:** Axios with interceptors
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **i18n:** react-i18next
- **Notifications:** react-hot-toast

## 🧪 **Testing Strategy**

### Recommended Testing Tools
```bash
# Unit Testing
npm install --save-dev vitest @testing-library/react

# E2E Testing  
npm install --save-dev playwright @playwright/test

# Component Testing
npm install --save-dev @storybook/react
```

### Test Structure
```text
tests/
├── unit/              # Component unit tests
├── integration/       # API integration tests  
├── e2e/              # End-to-end user flows
└── utils/            # Testing utilities
```

## 📈 **Monitoring & Analytics**

### Recommended Monitoring Setup
```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Performance monitoring
getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Error Tracking
```typescript
// Production error boundary
class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    // Log to external service (Sentry, LogRocket, etc.)
    console.error('App Error:', error, errorInfo);
  }
}
```

## 🔧 **Troubleshooting**

| Issue | Solution |
|-------|----------|
| Build fails | Check TypeScript errors with `npx tsc --noEmit` |
| API calls fail | Verify `VITE_API_URL` environment variable |
| Styles not loading | Clear browser cache, restart dev server |
| Hot reload broken | Restart Vite dev server |
| Memory issues | Reduce bundle size, enable code splitting |

## 🔗 **Related Documentation**

- [Backend API](../../backend/README.md)
- [Deployment Guide](../../README.md) 
- [Environment Variables](../../.env.example)
- [Component Storybook](./storybook) *(planned)*

---

**🎯 Production Ready** | **🛡️ Security Focused** | **⚡ Performance Optimized** | **♿ Accessible** | **🌍 International**
