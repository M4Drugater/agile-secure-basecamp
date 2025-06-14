
import { 
  Home,
  MessageSquare,
  FileText,
  BookOpen,
  TrendingUp,
  Search,
  Shield,
  Settings,
  User,
  CreditCard,
  BarChart3,
  Brain,
  Sparkles
} from 'lucide-react';

export const mainNavItems = [
  { 
    title: 'Dashboard', 
    href: '/dashboard', 
    icon: Home,
    description: 'Vista general del sistema'
  },
  { 
    title: 'Chat con CLIPOGINO', 
    href: '/chat', 
    icon: MessageSquare,
    badge: 'AI',
    description: 'Asistente inteligente personalizado'
  }
];

export const aiModulesItems = [
  { 
    title: 'Inteligencia Competitiva', 
    href: '/competitive-intelligence', 
    icon: Shield,
    badge: 'AI',
    description: 'Agentes CDV, CIA y CIR'
  },
  { 
    title: 'Descubrimiento de Tendencias', 
    href: '/trends', 
    icon: TrendingUp,
    badge: 'LIVE',
    description: 'Tendencias de Reddit en tiempo real'
  },
  { 
    title: 'Research Workbench', 
    href: '/research', 
    icon: Search,
    description: 'Investigación con Perplexity AI'
  }
];

export const contentItems = [
  { 
    title: 'Generador de Contenido', 
    href: '/content/generator', 
    icon: FileText,
    description: 'Creación de contenido con IA'
  },
  { 
    title: 'Biblioteca de Contenido', 
    href: '/content/library', 
    icon: BookOpen,
    description: 'Gestión de contenido creado'
  },
  { 
    title: 'Analytics de Contenido', 
    href: '/content/analytics', 
    icon: BarChart3,
    description: 'Métricas y rendimiento'
  }
];

export const learningItems = [
  { 
    title: 'Base de Conocimiento', 
    href: '/knowledge', 
    icon: Brain,
    description: 'Documentos y recursos'
  },
  { 
    title: 'Gestión de Aprendizaje', 
    href: '/learning', 
    icon: Sparkles,
    description: 'Rutas y módulos de aprendizaje'
  }
];

export const accountItems = [
  { 
    title: 'Perfil', 
    href: '/profile', 
    icon: User,
    description: 'Configuración personal'
  },
  { 
    title: 'Facturación', 
    href: '/billing', 
    icon: CreditCard,
    description: 'Suscripciones y pagos'
  },
  { 
    title: 'Administración', 
    href: '/admin', 
    icon: Settings,
    description: 'Panel de administración'
  }
];

export type UnifiedNavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
  description?: string;
};
