// Serveur principal de l'API Cardify - Point d'entrée de l'application
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { errorHandler } from './middlewares/error';
import { generalLimiter } from './middlewares/rateLimit';
import userRoutes from './routes/user.routes';
import cardRoutes from './routes/card.routes';
import uploadRoutes from './routes/upload.routes';
import { logger } from './services/logger';

// Configuration des variables d'environnement
dotenv.config();

// Création de l'app Express
const app = express();

// Sécurité
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Configuration CORS
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.CLIENT_URL || 'https://cardify-app-new.vercel.app', 'https://cardify-app-new.vercel.app', 'https://www.cardify-app-new.vercel.app']
  : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3008'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Middlewares
app.use(generalLimiter);
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Créer le dossier uploads
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Routes
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Cardify API is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

app.use('/api/users', userRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/upload', uploadRoutes);

// Gestion des erreurs
app.use(errorHandler);

app.use('*', (_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Fonction de connexion MongoDB avec retry
const connectWithRetry = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;
  
  if (!mongoUri) {
    logger.error('MONGO_URI environment variable is not set');
    logger.info('Available environment variables:', { 
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      hasJWT: !!process.env.JWT_SECRET,
      hasMONGO: !!process.env.MONGO_URI
    });
    process.exit(1);
  }

  // Log sanitized URI for debugging (hide credentials)
  const sanitizedUri = mongoUri.replace(/\/\/.*@/, '//***@');
  logger.info(`Attempting MongoDB connection to: ${sanitizedUri}`);

  const options = {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    maxPoolSize: 10,
    retryWrites: true,
    authSource: 'admin'
  };

  try {
    await mongoose.connect(mongoUri, options);
    logger.info('✅ MongoDB connected successfully');
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', { error: error instanceof Error ? error.message : String(error) });
    
    if (process.env.NODE_ENV === 'production') {
      logger.info('Retrying MongoDB connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    } else {
      process.exit(1);
    }
  }
};

// Connexion MongoDB au démarrage du module
if (process.env.NODE_ENV !== 'test') {
  connectWithRetry();
}

export default app;
