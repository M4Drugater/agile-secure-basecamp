
import {
  Home,
  MessageSquare,
  Search,
  Shield,
  Settings,
  User,
  CreditCard,
  Brain,
  Bot
} from 'lucide-react';

export interface UnifiedNavItem {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
  description?: string;
}

export const mainNavItems: UnifiedNavItem[] = [
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

export const aiModulesItems: UnifiedNavItem[] = [
  { 
    title: 'Agentes Unificados', 
    href: '/agents', 
    icon: Bot, 
    badge: 'NEW', 
    description: 'Interfaz centralizada para todos los agentes' 
  },
  { 
    title: 'Inteligencia Competitiva', 
    href: '/competitive-intelligence', 
    icon: Shield, 
    badge: 'AI', 
    description: 'Agentes CDV, CIA y CIR' 
  },
  { 
    title: 'Research Workbench', 
    href: '/research', 
    icon: Search, 
    description: 'Investigación con Perplexity AI' 
  }
];

export const learningItems: UnifiedNavItem[] = [
  { 
    title: 'Base de Conocimiento', 
    href: '/knowledge', 
    icon: Brain, 
    description: 'Documentos y recursos' 
  }
];

export const accountItems: UnifiedNavItem[] = [
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
