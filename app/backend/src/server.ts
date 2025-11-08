// Serveur principal de l'API Cardify - Point d'entrée de l'application
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Configuration des variables d'environnement
dotenv.config();

// Création de l'app Express et définition du port
const app = express();
const PORT = parseInt(process.env.PORT || '10000', 10);

// Configuration CORS simple
app.use(cors({
  origin: true,
  credentials: true
}));

// Parsing des données JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cardify API is running' });
});

// Route par défaut
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connexion MongoDB et démarrage serveur
if (process.env.NODE_ENV !== 'test') {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/cardify';
  
  mongoose.connect(mongoUri)
    .then(() => {
      console.log('✅ MongoDB connected');
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    });
}

export default app;
