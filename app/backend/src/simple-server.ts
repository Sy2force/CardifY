import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// CORS simple
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Cardify API is running',
    timestamp: new Date().toISOString()
  });
});

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Démarrage serveur
if (process.env.NODE_ENV !== 'test') {
  const mongoUri = process.env.MONGO_URI;
  
  if (mongoUri) {
    mongoose.connect(mongoUri)
      .then(() => console.log('MongoDB connected'))
      .catch(() => console.log('MongoDB connection failed, continuing without DB'));
  }
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
