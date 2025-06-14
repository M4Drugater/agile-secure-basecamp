
import { 
  Home,
  MessageSquare,
  FileText,
  BookOpen,
  Shield,
  User,
  Settings
} from 'lucide-react';

export const coreNavItems = [
  { 
    title: 'Dashboard', 
    href: '/dashboard', 
    icon: Home,
    description: 'Vista general del sistema',
    alwaysShow: true
  },
  { 
    title: 'CLIPOGINO', 
    href: '/chat', 
    icon: MessageSquare,
    badge: 'IA',
    description: 'Tu mentor inteligente personalizado',
    requiresStep: 'knowledge',
    lockedMessage: 'Primero sube documentos a tu base de conocimiento'
  }
];

export const activeModulesItems = [
  { 
    title: 'Inteligencia Competitiva', 
    href: '/competitive-intelligence', 
    icon: Shield,
    badge: 'IA',
    description: 'Análisis competitivo con agentes CDV, CIA y CIR',
    requiresStep: 'chat',
    lockedMessage: 'Primero completa una conversación con CLIPOGINO'
  },
  { 
    title: 'Generador de Contenido', 
    href: '/content-generator', 
    icon: FileText,
    badge: 'IA',
    description: 'Creación de contenido profesional',
    requiresStep: 'chat',
    lockedMessage: 'Primero completa una conversación con CLIPOGINO'
  },
  { 
    title: 'Base de Conocimiento', 
    href: '/knowledge', 
    icon: BookOpen,
    description: 'Gestión de documentos y recursos',
    requiresStep: 'profile',
    lockedMessage: 'Primero completa tu perfil profesional'
  }
];

export const accountItems = [
  { 
    title: 'Perfil', 
    href: '/profile', 
    icon: User,
    description: 'Configuración personal',
    alwaysShow: true
  },
  { 
    title: 'Administración', 
    href: '/admin', 
    icon: Settings,
    description: 'Panel de administración',
    alwaysShow: true
  }
];

export type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
  description?: string;
  alwaysShow?: boolean;
  requiresStep?: string;
  lockedMessage?: string;
};
