// Serveur principal de l'API Cardify - Point d'entrée de l'application
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { errorHandler } from './middlewares/error';
import { generalLimiter } from './middlewares/rateLimit';
import userRoutes from './routes/user.routes';
import cardRoutes from './routes/card.routes';
import uploadRoutes from './routes/upload.routes';
import { logger } from './services/logger';

// Chargement des variables d'environnement selon le contexte
if (process.env.NODE_ENV === 'production') {
  dotenv.config(); // Production : utilise .env par défaut
} else {
  dotenv.config({ path: path.join(__dirname, '../../.env') }); // Dev : cherche dans le dossier parent
}

// Création de l'app Express et définition du port
const app = express();
const PORT = parseInt(process.env.PORT || '3006', 10);

// Sécurité : protection contre les attaques courantes
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Permet les styles inline pour Tailwind
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"], // Autorise les images externes
    },
  },
  crossOriginEmbedderPolicy: false // Désactivé pour compatibilité
}));

// Configuration CORS : autorise les requêtes depuis le frontend
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.CLIENT_URL || 'https://cardify.vercel.app', 'https://cardify.vercel.app', 'https://www.cardify.vercel.app']
  : ['http://localhost:3008', 'http://localhost:3000', 'http://localhost:5173', 'http://localhost:3010']; // Ports de dev courants

app.use(cors({
  origin: allowedOrigins,
  credentials: true // Permet l'envoi de cookies et tokens
}));

// Protection contre le spam et les attaques
app.use(generalLimiter);

// Logs des requêtes HTTP
app.use(morgan('combined'));
// Parsing des données JSON et formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers uploadés (images de cartes)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes de l'API
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cardify API is running' }); // Check de santé
});

// Endpoints principaux
app.use('/api/users', userRoutes);   // Gestion utilisateurs
app.use('/api/cards', cardRoutes);   // Gestion cartes
app.use('/api/upload', uploadRoutes); // Upload de fichiers

// Gestion globale des erreurs
app.use(errorHandler);

// Route par défaut pour les endpoints inexistants
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Configuration MongoDB
mongoose.set('strictQuery', false); // Permet les requêtes flexibles

// Connexion DB et démarrage serveur (sauf en mode test)
if (process.env.NODE_ENV !== 'test') {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/cardify';
  logger.info('Tentative de connexion à MongoDB...');
  logger.info('URI MongoDB (masquée):', { uri: mongoUri.replace(/\/\/.*@/, '//***:***@') });

  // Fonction de connexion avec retry automatique
  const connectWithRetry = (): void => {
    mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // Timeout sélection serveur
      socketTimeoutMS: 20000,          // Timeout socket
      connectTimeoutMS: 10000,         // Timeout connexion
      maxPoolSize: 5,                  // Pool de connexions max
      minPoolSize: 1,                  // Pool de connexions min
      maxIdleTimeMS: 30000,            // Temps d'inactivité max
      retryWrites: true,               // Retry automatique des écritures
      authSource: 'admin'              // Source d'authentification
    }).then(() => {
      logger.info('✅ MongoDB connecté avec succès');
    }).catch((error) => {
      logger.error('❌ Échec connexion MongoDB:', { error: error.message });
      
      if (process.env.NODE_ENV === 'production') {
        // En prod : retry moins agressif (30s)
        setTimeout(connectWithRetry, 30000);
        return;
      }
      
      // En dev : retry rapide (10s)
      logger.info('Nouvelle tentative dans 10 secondes...');
      setTimeout(connectWithRetry, 10000);
    });
  };

  // Lancement de la connexion
  connectWithRetry();

  // Démarrage du serveur sur toutes les interfaces
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 Serveur Cardify API démarré sur le port ${PORT}`);
  });
}

export default app;
