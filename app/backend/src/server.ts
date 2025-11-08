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

// Création de l'app Express et définition du port
const app = express();
const PORT = parseInt(process.env.PORT || '10000', 10);

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
  : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3010'];

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
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cardify API is running' });
});

app.use('/api/users', userRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/upload', uploadRoutes);

// Gestion des erreurs
app.use(errorHandler);

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Fonction de connexion MongoDB avec retry
const connectWithRetry = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;
  
  if (!mongoUri) {
    logger.error('MONGO_URI environment variable is not set');
    process.exit(1);
  }

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

// Démarrage serveur
if (process.env.NODE_ENV !== 'test') {
  // Démarrer le serveur indépendamment de MongoDB
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 Server running on port ${PORT}`);
  });
  
  // Connecter à MongoDB
  connectWithRetry();
}

export default app;
