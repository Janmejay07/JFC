import React from 'react';
import { cn } from '@/lib/utils';

// Standardized Loading Spinner Component
export const LoadingSpinner = ({ 
  size = 'default', 
  variant = 'primary', 
  className = '' 
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
    '2xl': 'h-20 w-20',
  };

  const variants = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    white: 'border-white',
    gray: 'border-gray-500',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-t-transparent',
        sizes[size],
        variants[variant],
        className
      )}
    />
  );
};

// Standardized Progress Bar Component
export const LoadingProgress = ({ 
  variant = 'primary', 
  className = '',
  showPercentage = false,
  percentage = 40 
}) => {
  const variants = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    white: 'bg-white',
    gray: 'bg-gray-500',
  };

  return (
    <div className={cn('w-full space-y-2', className)}>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className={cn(
            'h-2.5 rounded-full animate-indeterminate',
            variants[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          {percentage}%
        </p>
      )}
    </div>
  );
};

// Standardized Loading Card Component
export const LoadingCard = ({ 
  variant = 'default',
  size = 'default',
  message = 'Loading...',
  showProgress = false,
  className = ''
}) => {
  const variants = {
    default: 'bg-white border-neutral-200 text-neutral-900',
    dark: 'bg-neutral-900 border-neutral-700 text-white',
    glass: 'bg-white/10 backdrop-blur-sm border-white/20 text-white',
  };

  const sizes = {
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  const spinnerSizes = {
    sm: 'sm',
    default: 'default',
    lg: 'lg',
  };

  const spinnerVariants = {
    default: 'primary',
    dark: 'white',
    glass: 'white',
  };

  return (
    <div
      className={cn(
        'rounded-xl border shadow-lg',
        variants[variant],
        sizes[size],
        className
      )}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        {showProgress ? (
          <LoadingProgress 
            variant={spinnerVariants[variant]} 
            className="w-48"
          />
        ) : (
          <LoadingSpinner 
            size={spinnerSizes[size]} 
            variant={spinnerVariants[variant]} 
          />
        )}
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

// Standardized Full Page Loading Component
export const FullPageLoading = ({ 
  variant = 'dark',
  message = 'Loading...',
  showProgress = false,
  className = ''
}) => {
  const variants = {
    light: 'bg-gradient-to-br from-gray-50 via-white to-blue-50',
    dark: 'bg-gradient-dark',
    primary: 'bg-gradient-primary',
  };

  const textColors = {
    light: 'text-primary-600',
    dark: 'text-white',
    primary: 'text-white',
  };

  const spinnerVariants = {
    light: 'primary',
    dark: 'white',
    primary: 'white',
  };

  return (
    <div className={cn('min-h-screen flex items-center justify-center p-4', variants[variant], className)}>
      <div className="flex flex-col items-center space-y-6">
        {showProgress ? (
          <LoadingProgress 
            variant={spinnerVariants[variant]} 
            className="w-60"
          />
        ) : (
          <LoadingSpinner 
            size="xl" 
            variant={spinnerVariants[variant]} 
          />
        )}
        <p className={cn('text-lg font-semibold', textColors[variant])}>
          {message}
        </p>
      </div>
    </div>
  );
};

// Standardized Section Loading Component
export const SectionLoading = ({ 
  variant = 'dark',
  message = 'Loading...',
  showProgress = false,
  className = ''
}) => {
  const variants = {
    light: 'bg-gradient-to-br from-gray-50 via-white to-blue-50',
    dark: 'bg-gradient-to-br from-gray-900 to-blue-900',
    primary: 'bg-gradient-primary',
  };

  const textColors = {
    light: 'text-primary-600',
    dark: 'text-white',
    primary: 'text-white',
  };

  const spinnerVariants = {
    light: 'primary',
    dark: 'white',
    primary: 'white',
  };

  return (
    <section className={cn('py-24 px-4 min-h-screen', variants[variant], className)}>
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex flex-col items-center space-y-6">
          {showProgress ? (
            <LoadingProgress 
              variant={spinnerVariants[variant]} 
              className="w-60"
            />
          ) : (
            <LoadingSpinner 
              size="xl" 
              variant={spinnerVariants[variant]} 
            />
          )}
          <p className={cn('text-lg font-medium', textColors[variant])}>
            {message}
          </p>
        </div>
      </div>
    </section>
  );
};

// Standardized Button Loading State
export const ButtonLoading = ({ 
  loading = false, 
  children, 
  loadingText = 'Loading...',
  className = ''
}) => {
  if (!loading) return children;

  return (
    <div className={cn('flex items-center justify-center space-x-2', className)}>
      <LoadingSpinner size="sm" variant="white" />
      <span>{loadingText}</span>
    </div>
  );
};

// Standardized Inline Loading Component
export const InlineLoading = ({ 
  variant = 'primary',
  size = 'sm',
  message = 'Loading...',
  className = ''
}) => {
  const textColors = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    white: 'text-white',
    gray: 'text-gray-600',
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <LoadingSpinner size={size} variant={variant} />
      <span className={cn('text-sm font-medium', textColors[variant])}>
        {message}
      </span>
    </div>
  );
};

export default {
  LoadingSpinner,
  LoadingProgress,
  LoadingCard,
  FullPageLoading,
  SectionLoading,
  ButtonLoading,
  InlineLoading,
};
