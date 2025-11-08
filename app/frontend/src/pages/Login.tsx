import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, CreditCard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { LoginFormData } from '../types';
import Button from '../components/Button';

const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      // Redirect based on user role after successful login
      const savedUser = localStorage.getItem('cardify_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user.isAdmin) {
          navigate('/admin');
        } else if (user.isBusiness) {
          navigate('/dashboard');
        } else {
          navigate('/cards');
        }
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white" data-testid="login-heading">
            {t('auth.login.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('auth.login.subtitle')}
          </p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="form-label">
                {t('auth.login.email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  data-testid="email-input"
                  className={`form-input pl-10 ${
                    errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder={t('placeholders.email')}
                />
              </div>
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="form-label">
                {t('auth.login.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  data-testid="password-input"
                  className={`form-input pl-10 pr-10 ${
                    errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder={t('placeholders.password')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              loading={isLoading}
              fullWidth
              size="lg"
              data-testid="login-button"
              className="font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              {t('auth.login.submit')}
            </Button>
          </div>


          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('auth.login.register_link')}
              <Link
                to="/register"
                className="ml-1 font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                {t('navigation.register')}
              </Link>
            </p>
          </div>
        </motion.form>

        {/* Demo Accounts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">
            🧪 Comptes de démonstration
          </h3>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                const form = document.querySelector('form');
                if (form) {
                  const emailInput = form.querySelector('[data-testid="email-input"]') as HTMLInputElement;
                  const passwordInput = form.querySelector('[data-testid="password-input"]') as HTMLInputElement;
                  if (emailInput && passwordInput) {
                    emailInput.value = 'admin@cardify.com';
                    passwordInput.value = 'admin123';
                    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
                    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
                    emailInput.dispatchEvent(new Event('change', { bubbles: true }));
                    passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
                  }
                }
              }}
              className="w-full text-left p-2 text-xs bg-white dark:bg-gray-800 rounded border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            >
              <div className="font-medium text-blue-800 dark:text-blue-200">👑 Admin</div>
              <div className="text-blue-600 dark:text-blue-400">admin@cardify.com / admin123</div>
            </button>
            <button
              type="button"
              onClick={() => {
                const form = document.querySelector('form');
                if (form) {
                  const emailInput = form.querySelector('[data-testid="email-input"]') as HTMLInputElement;
                  const passwordInput = form.querySelector('[data-testid="password-input"]') as HTMLInputElement;
                  if (emailInput && passwordInput) {
                    emailInput.value = 'sarah@example.com';
                    passwordInput.value = 'business123';
                    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
                    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
                    emailInput.dispatchEvent(new Event('change', { bubbles: true }));
                    passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
                  }
                }
              }}
              className="w-full text-left p-2 text-xs bg-white dark:bg-gray-800 rounded border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            >
              <div className="font-medium text-blue-800 dark:text-blue-200">💼 Business</div>
              <div className="text-blue-600 dark:text-blue-400">sarah@example.com / business123</div>
            </button>
            <button
              type="button"
              onClick={() => {
                const form = document.querySelector('form');
                if (form) {
                  const emailInput = form.querySelector('[data-testid="email-input"]') as HTMLInputElement;
                  const passwordInput = form.querySelector('[data-testid="password-input"]') as HTMLInputElement;
                  if (emailInput && passwordInput) {
                    emailInput.value = 'john@example.com';
                    passwordInput.value = 'user123';
                    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
                    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
                    emailInput.dispatchEvent(new Event('change', { bubbles: true }));
                    passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
                  }
                }
              }}
              className="w-full text-left p-2 text-xs bg-white dark:bg-gray-800 rounded border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            >
              <div className="font-medium text-blue-800 dark:text-blue-200">👤 User</div>
              <div className="text-blue-600 dark:text-blue-400">john@example.com / user123</div>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
