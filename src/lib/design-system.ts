
// LAIGENT v2.0 Design System Configuration
// This file centralizes all design tokens and system configurations

export const designTokens = {
  // Color Palette
  colors: {
    primary: {
      50: 'hsl(252, 95%, 98%)',
      100: 'hsl(252, 91%, 95%)',
      500: 'hsl(262, 83%, 58%)',
      600: 'hsl(262, 83%, 48%)',
      900: 'hsl(262, 83%, 18%)',
    },
    secondary: {
      50: 'hsl(210, 40%, 98%)',
      100: 'hsl(210, 40%, 96%)',
      500: 'hsl(210, 40%, 50%)',
      600: 'hsl(210, 40%, 40%)',
    },
    gradient: {
      primary: 'from-purple-600 to-blue-600',
      secondary: 'from-blue-500 to-indigo-600',
      accent: 'from-emerald-500 to-teal-600',
      warning: 'from-orange-500 to-red-500',
    },
  },
  
  // Typography Scale
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
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
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  
  // Spacing Scale
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  // Shadow System
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    glow: '0 0 20px rgb(139 92 246 / 0.3)',
  },
  
  // Border Radius
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  
  // Animation Durations
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
} as const;

// Component Variants System
export const componentVariants = {
  button: {
    size: {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-11 px-8 text-lg',
      icon: 'h-10 w-10',
    },
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'border border-input bg-background hover:bg-accent',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
    },
  },
  
  card: {
    variant: {
      default: 'bg-card text-card-foreground shadow-sm border',
      elevated: 'bg-card text-card-foreground shadow-lg border',
      flat: 'bg-card text-card-foreground border',
    },
    padding: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
} as const;

// Layout Constants
export const layoutConfig = {
  maxWidth: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    container: '1200px',
  },
  
  sidebar: {
    width: '256px',
    collapsedWidth: '64px',
  },
  
  header: {
    height: '64px',
  },
  
  footer: {
    height: '80px',
  },
} as const;

// Utility Functions
export const getVariantClasses = (component: keyof typeof componentVariants, variant: string, size?: string) => {
  const componentConfig = componentVariants[component];
  if (!componentConfig) return '';
  
  let classes = '';
  
  if ('variant' in componentConfig && variant in componentConfig.variant) {
    classes += componentConfig.variant[variant as keyof typeof componentConfig.variant] + ' ';
  }
  
  if (size && 'size' in componentConfig && size in componentConfig.size) {
    classes += componentConfig.size[size as keyof typeof componentConfig.size];
  }
  
  return classes.trim();
};

export const getColorValue = (colorPath: string) => {
  const keys = colorPath.split('.');
  let value: any = designTokens.colors;
  
  for (const key of keys) {
    value = value?.[key];
  }
  
  return value || colorPath;
};

export const getSpacingValue = (spacing: keyof typeof designTokens.spacing) => {
  return designTokens.spacing[spacing];
};
