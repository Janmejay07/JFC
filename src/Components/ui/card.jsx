import * as React from 'react';

import { cn } from '@/lib/utils';

const Card = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-white border-neutral-200 text-neutral-900 shadow-sm hover:shadow-md transition-shadow duration-300',
    dark: 'bg-neutral-800 border-neutral-700 text-white shadow-lg hover:shadow-xl transition-shadow duration-300',
    glass: 'bg-white/10 backdrop-blur-sm border-white/20 text-white shadow-lg hover:shadow-xl transition-all duration-300',
    gradient: 'bg-gradient-primary text-white shadow-primary hover:shadow-glow transition-all duration-300',
    outlined: 'bg-transparent border-2 border-primary-500 text-primary-700 hover:bg-primary-50 transition-colors duration-300',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border transition-all duration-300',
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-2 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, size = 'default', ...props }, ref) => {
  const sizes = {
    sm: 'text-lg font-semibold',
    default: 'text-xl font-bold',
    lg: 'text-2xl font-bold',
    xl: 'text-3xl font-bold',
  };

  return (
    <h3
      ref={ref}
      className={cn('leading-tight tracking-tight', sizes[size], className)}
      {...props}
    />
  );
});
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center justify-between p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
