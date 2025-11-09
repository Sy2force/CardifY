// Client API principal - Gestion des appels vers le backend
import axios from 'axios';
import { AuthResponse, ApiResponse, LoginFormData, RegisterFormData, CardFormData } from '../types';

// URL de base de l'API (env ou localhost par défaut)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Instance Axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur : ajoute automatiquement le token d'auth
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cardify_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // JWT dans l'en-tête
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur : gestion centralisée des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log détaillé pour debug
    console.error('Erreur API:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    // Erreur réseau (serveur inaccessible)
    if (!error.response) {
      const networkError = new Error('Impossible de se connecter au serveur. Vérifiez votre connexion.');
      networkError.name = 'NetworkError';
      return Promise.reject(networkError);
    }
    
    // Token expiré ou invalide : déconnexion auto
    if (error.response?.status === 401) {
      localStorage.removeItem('cardify_token');
      localStorage.removeItem('cardify_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Authentification - Gestion des comptes utilisateurs
export const authAPI = {
  // Connexion utilisateur
  login: (data: LoginFormData): Promise<AuthResponse> =>
    api.post('/users/login', data).then(res => res.data),
  
  // Inscription nouvel utilisateur
  register: (data: RegisterFormData): Promise<AuthResponse> =>
    api.post('/users/register', data).then(res => res.data),
  
  // Récupération du profil connecté
  getProfile: (): Promise<ApiResponse> =>
    api.get('/users/profile').then(res => res.data),
  
  // Mise à jour du profil
  updateProfile: (data: Partial<RegisterFormData>): Promise<ApiResponse> =>
    api.put('/users/profile', data).then(res => res.data),
};

// API Cartes - Gestion des cartes professionnelles
export const cardsAPI = {
  // Liste toutes les cartes (avec pagination)
  getAllCards: (page = 1, limit = 12): Promise<ApiResponse> =>
    api.get(`/cards?page=${page}&limit=${limit}`).then(res => res.data),
  
  // Mes cartes uniquement
  getMyCards: (page = 1, limit = 12): Promise<ApiResponse> =>
    api.get(`/cards/my-cards?page=${page}&limit=${limit}`).then(res => res.data),
  
  // Détails d'une carte spécifique
  getCardById: (id: string): Promise<ApiResponse> =>
    api.get(`/cards/${id}`).then(res => res.data),
  
  // Création nouvelle carte
  createCard: (data: CardFormData): Promise<ApiResponse> =>
    api.post('/cards', data).then(res => res.data),
  
  // Modification carte existante
  updateCard: (id: string, data: Partial<CardFormData>): Promise<ApiResponse> =>
    api.put(`/cards/${id}`, data).then(res => res.data),
  
  // Suppression carte
  deleteCard: (id: string): Promise<ApiResponse> =>
    api.delete(`/cards/${id}`).then(res => res.data),
  
  // Like/Unlike une carte
  likeCard: (id: string): Promise<ApiResponse> =>
    api.patch(`/cards/${id}/like`).then(res => res.data),
};

// Export de l'instance Axios configurée
export default api;
