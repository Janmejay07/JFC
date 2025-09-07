// Design System Configuration
// This file contains all the standardized design tokens and utilities

export const DESIGN_SYSTEM = {
  // Color Palette
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    }
  },

  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Inter', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeight: {
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    }
  },

  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
    '5xl': '8rem',
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    primary: '0 4px 14px 0 rgba(59, 130, 246, 0.15)',
    secondary: '0 4px 14px 0 rgba(16, 185, 129, 0.15)',
    glow: '0 0 20px rgba(59, 130, 246, 0.3)',
    'glow-secondary': '0 0 20px rgba(16, 185, 129, 0.3)',
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
    'primary-reverse': 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
    dark: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    card: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
  },

  // Animation Durations
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '1000ms',
  },

  // Component Variants
  components: {
    button: {
      variants: ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'success', 'warning', 'link', 'dark'],
      sizes: ['sm', 'default', 'lg', 'xl', 'icon', 'icon-sm', 'icon-lg'],
    },
    card: {
      variants: ['default', 'dark', 'glass', 'gradient', 'outlined'],
    },
    input: {
      variants: ['default', 'dark', 'glass', 'error', 'success'],
      sizes: ['sm', 'default', 'lg'],
    }
  }
};

// Utility functions for consistent styling
export const getVariantClasses = (component, variant, size = 'default') => {
  const baseClasses = {
    button: {
      base: 'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      variants: {
        primary: 'bg-gradient-primary text-white shadow-primary hover:shadow-glow hover:scale-105 active:scale-95',
        secondary: 'bg-gradient-primary-reverse text-white shadow-secondary hover:shadow-glow-secondary hover:scale-105 active:scale-95',
        outline: 'border-2 border-primary-500 bg-transparent text-primary-500 hover:bg-primary-500 hover:text-white shadow-sm hover:shadow-primary',
        ghost: 'bg-transparent text-primary-500 hover:bg-primary-50 hover:text-primary-700',
        destructive: 'bg-error text-white shadow-sm hover:bg-red-600 hover:shadow-lg hover:scale-105 active:scale-95',
        success: 'bg-success text-white shadow-sm hover:bg-green-600 hover:shadow-lg hover:scale-105 active:scale-95',
        warning: 'bg-warning text-white shadow-sm hover:bg-yellow-600 hover:shadow-lg hover:scale-105 active:scale-95',
        link: 'text-primary-500 underline-offset-4 hover:underline hover:text-primary-700',
        dark: 'bg-neutral-800 text-white hover:bg-neutral-700 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95',
      },
      sizes: {
        sm: 'h-8 px-3 text-xs rounded-md',
        default: 'h-10 px-6 py-2 rounded-lg',
        lg: 'h-12 px-8 text-base rounded-xl',
        xl: 'h-14 px-10 text-lg rounded-2xl',
        icon: 'h-10 w-10 rounded-lg',
        'icon-sm': 'h-8 w-8 rounded-md',
        'icon-lg': 'h-12 w-12 rounded-xl',
      }
    },
    card: {
      base: 'rounded-xl border transition-all duration-300',
      variants: {
        default: 'bg-white border-neutral-200 text-neutral-900 shadow-sm hover:shadow-md',
        dark: 'bg-neutral-800 border-neutral-700 text-white shadow-lg hover:shadow-xl',
        glass: 'bg-white/10 backdrop-blur-sm border-white/20 text-white shadow-lg hover:shadow-xl',
        gradient: 'bg-gradient-primary text-white shadow-primary hover:shadow-glow',
        outlined: 'bg-transparent border-2 border-primary-500 text-primary-700 hover:bg-primary-50',
      }
    },
    input: {
      base: 'flex w-full border transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      variants: {
        default: 'border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-500 focus:border-primary-500 focus:ring-primary-500',
        dark: 'border-neutral-600 bg-neutral-800 text-white placeholder:text-neutral-400 focus:border-primary-400 focus:ring-primary-400',
        glass: 'border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20',
        error: 'border-error bg-white text-neutral-900 placeholder:text-neutral-500 focus:border-error focus:ring-error',
        success: 'border-success bg-white text-neutral-900 placeholder:text-neutral-500 focus:border-success focus:ring-success',
      },
      sizes: {
        sm: 'h-8 px-3 text-xs rounded-md',
        default: 'h-10 px-4 text-sm rounded-lg',
        lg: 'h-12 px-4 text-base rounded-xl',
      }
    }
  };

  const component = baseClasses[component];
  if (!component) return '';

  const variantClass = component.variants[variant] || '';
  const sizeClass = component.sizes[size] || '';
  
  return `${component.base} ${variantClass} ${sizeClass}`.trim();
};

// Common layout patterns
export const LAYOUT_PATTERNS = {
  container: 'max-w-7xl mx-auto px-4',
  section: 'py-16 px-4',
  card: 'p-6',
  form: 'space-y-6',
  grid: {
    '2': 'grid grid-cols-1 md:grid-cols-2 gap-6',
    '3': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    '4': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
  }
};

// Status message styles
export const STATUS_STYLES = {
  success: 'bg-success text-white p-3 rounded-lg',
  error: 'bg-error text-white p-3 rounded-lg',
  warning: 'bg-warning text-white p-3 rounded-lg',
  info: 'bg-info text-white p-3 rounded-lg',
};

export default DESIGN_SYSTEM;
