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

// Connexion MongoDB et démarrage serveur
if (process.env.NODE_ENV !== 'test') {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/cardify';
  
  mongoose.connect(mongoUri)
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('✅ MongoDB connected');
      app.listen(PORT, '0.0.0.0', () => {
        // eslint-disable-next-line no-console
        console.log(`🚀 Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    });
}

export default app;
