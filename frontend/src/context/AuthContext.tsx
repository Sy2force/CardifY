import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../types';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('cardify_token');
      const savedUser = localStorage.getItem('cardify_user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        
        // Verify token is still valid
        try {
          const response = await authAPI.getProfile();
          setUser(response.user!);
        } catch (error) {
          // Token is invalid, clear auth data
          localStorage.removeItem('cardify_token');
          localStorage.removeItem('cardify_user');
          setToken(null);
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      
      setUser(response.user);
      setToken(response.token);
      
      localStorage.setItem('cardify_token', response.token);
      localStorage.setItem('cardify_user', JSON.stringify(response.user));
      
      toast.success(t('common.login_success'));
    } catch (error: any) {
      const message = error.response?.data?.message || t('common.login_error');
      toast.error(message);
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const response = await authAPI.register(data);
      
      setUser(response.user);
      setToken(response.token);
      
      localStorage.setItem('cardify_token', response.token);
      localStorage.setItem('cardify_user', JSON.stringify(response.user));
      
      toast.success(t('common.register_success'));
    } catch (error: any) {
      const message = error.response?.data?.message || t('common.register_error');
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cardify_token');
    localStorage.removeItem('cardify_user');
    toast.success(t('common.logout_success'));
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
