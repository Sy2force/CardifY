import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, CreditCard, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RegisterFormData } from '../types';
import Button from '../components/Button';

const registerSchema = yup.object({
  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .required('First name is required'),
  lastName: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .required('Last name is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  phone: yup
    .string()
    .matches(/^[\+]?[\d\s\-\.\(\)]+$/, 'Please enter a valid phone number')
    .min(1)
    .max(25)
    .optional(),
  isBusiness: yup.boolean().default(false),
});

const Register: React.FC = () => {
  const { t } = useTranslation();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      isBusiness: false,
    },
  });

  const isBusiness = watch('isBusiness');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      navigate('/dashboard');
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
          
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            {t('auth.register.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('auth.register.subtitle')}
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
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="form-label">
                  {t('auth.register.firstName')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('firstName')}
                    type="text"
                    className={`form-input pl-10 ${
                      errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder={t('placeholders.firstName')}
                  />
                </div>
                {errors.firstName && (
                  <p className="form-error">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="form-label">
                  {t('auth.register.lastName')}
                </label>
                <input
                  {...register('lastName')}
                  type="text"
                  className={`form-input ${
                    errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder={t('placeholders.lastName')}
                />
                {errors.lastName && (
                  <p className="form-error">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="form-label">
                {t('auth.register.email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
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
                {t('auth.register.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
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

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="form-label">
                {t('auth.register.phone')} <span className="text-gray-400">({t('common.optional')})</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('phone')}
                  type="tel"
                  className={`form-input pl-10 ${
                    errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder={t('placeholders.phone')}
                />
              </div>
              {errors.phone && (
                <p className="form-error">{errors.phone.message}</p>
              )}
            </div>

            {/* Business Account Toggle */}
            <div className="flex items-center">
              <input
                {...register('isBusiness')}
                id="isBusiness"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <div className="ml-3 flex items-center">
                <Briefcase className="h-4 w-4 text-gray-400 mr-1" />
                <label htmlFor="isBusiness" className="text-sm text-gray-700 dark:text-gray-300">
                  {t('auth.register.isBusiness')}
                </label>
              </div>
            </div>
            
            {isBusiness && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800"
              >
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  ✨ {t('auth.register.businessBenefit')}
                </p>
              </motion.div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              loading={isLoading}
              fullWidth
              size="lg"
              className="font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              {t('auth.register.submit')}
            </Button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('auth.register.login_link')}
              <Link
                to="/login"
                className="ml-1 font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                {t('navigation.login')}
              </Link>
            </p>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Register;
