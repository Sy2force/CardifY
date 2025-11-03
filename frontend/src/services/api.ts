import axios from 'axios';
import { AuthResponse, ApiResponse, LoginFormData, RegisterFormData, CardFormData } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3003/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cardify_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cardify_token');
      localStorage.removeItem('cardify_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data: LoginFormData): Promise<AuthResponse> =>
    api.post('/users/login', data).then(res => res.data),
  
  register: (data: RegisterFormData): Promise<AuthResponse> =>
    api.post('/users/register', data).then(res => res.data),
  
  getProfile: (): Promise<ApiResponse> =>
    api.get('/users/profile').then(res => res.data),
  
  updateProfile: (data: Partial<RegisterFormData>): Promise<ApiResponse> =>
    api.put('/users/profile', data).then(res => res.data),
};

// Cards API
export const cardsAPI = {
  getAllCards: (page = 1, limit = 12): Promise<ApiResponse> =>
    api.get(`/cards?page=${page}&limit=${limit}`).then(res => res.data),
  
  getMyCards: (page = 1, limit = 12): Promise<ApiResponse> =>
    api.get(`/cards/my-cards?page=${page}&limit=${limit}`).then(res => res.data),
  
  getCardById: (id: string): Promise<ApiResponse> =>
    api.get(`/cards/${id}`).then(res => res.data),
  
  createCard: (data: CardFormData): Promise<ApiResponse> =>
    api.post('/cards', data).then(res => res.data),
  
  updateCard: (id: string, data: Partial<CardFormData>): Promise<ApiResponse> =>
    api.put(`/cards/${id}`, data).then(res => res.data),
  
  deleteCard: (id: string): Promise<ApiResponse> =>
    api.delete(`/cards/${id}`).then(res => res.data),
  
  likeCard: (id: string): Promise<ApiResponse> =>
    api.patch(`/cards/${id}/like`).then(res => res.data),
};

export default api;
