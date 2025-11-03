export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
  isBusiness: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  state?: string;
  country?: string;
  city?: string;
  street?: string;
  houseNumber?: string;
  zip?: string;
}

export interface CardImage {
  url?: string;
  alt?: string;
}

export interface Card {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  phone: string;
  email: string;
  web?: string;
  image?: CardImage;
  address?: Address;
  bizNumber: number;
  likes: string[];
  user_id: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  user?: User;
  token?: string;
  cards?: Card[];
  card?: Card;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  isBusiness: boolean;
}

export interface CardFormData {
  title: string;
  subtitle?: string;
  description?: string;
  phone: string;
  email: string;
  web?: string;
  image?: CardImage;
  address?: Address;
}
