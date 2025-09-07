import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Primary gradient button (main brand)
        primary: 'bg-gradient-primary text-white shadow-primary hover:shadow-glow hover:scale-105 active:scale-95',
        
        // Secondary gradient button
        secondary: 'bg-gradient-primary-reverse text-white shadow-secondary hover:shadow-glow-secondary hover:scale-105 active:scale-95',
        
        // Outline button
        outline: 'border-2 border-primary-500 bg-transparent text-primary-500 hover:bg-primary-500 hover:text-white shadow-sm hover:shadow-primary',
        
        // Ghost button
        ghost: 'bg-transparent text-primary-500 hover:bg-primary-50 hover:text-primary-700',
        
        // Destructive button
        destructive: 'bg-error text-white shadow-sm hover:bg-red-600 hover:shadow-lg hover:scale-105 active:scale-95',
        
        // Success button
        success: 'bg-success text-white shadow-sm hover:bg-green-600 hover:shadow-lg hover:scale-105 active:scale-95',
        
        // Warning button
        warning: 'bg-warning text-white shadow-sm hover:bg-yellow-600 hover:shadow-lg hover:scale-105 active:scale-95',
        
        // Link button
        link: 'text-primary-500 underline-offset-4 hover:underline hover:text-primary-700',
        
        // Dark theme button
        dark: 'bg-neutral-800 text-white hover:bg-neutral-700 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-md',
        default: 'h-10 px-6 py-2 rounded-lg',
        lg: 'h-12 px-8 text-base rounded-xl',
        xl: 'h-14 px-10 text-lg rounded-2xl',
        icon: 'h-10 w-10 rounded-lg',
        'icon-sm': 'h-8 w-8 rounded-md',
        'icon-lg': 'h-12 w-12 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
