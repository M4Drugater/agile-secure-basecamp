
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Library,
  BarChart3,
  BookOpen,
  GraduationCap,
  Users,
  Settings,
  CreditCard,
  Brain,
  Bot,
  Search
} from 'lucide-react';

export const mainNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Panel principal de control'
  },
  {
    title: 'AI Agents',
    href: '/agents',
    icon: Bot,
    description: 'Workspace unificado de agentes IA'
  },
  {
    title: 'Chat Unificado',
    href: '/chat',
    icon: MessageSquare,
    description: 'Chat consolidado con CLIPOGINO'
  }
];

export const aiModulesItems = [
  {
    title: 'Content Generator',
    href: '/content',
    icon: FileText,
    description: 'Generador avanzado de contenido'
  },
  {
    title: 'Research Engine',
    href: '/research',
    icon: Search,
    description: 'Motor de investigación con IA'
  },
  {
    title: 'Knowledge Base',
    href: '/knowledge',
    icon: Library,
    description: 'Base de conocimiento empresarial'
  }
];

export const contentItems = [
  {
    title: 'Content Library',
    href: '/content-library',
    icon: Library,
    description: 'Biblioteca de contenido generado'
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Métricas y análisis de contenido'
  }
];

export const learningItems = [
  {
    title: 'Learning Paths',
    href: '/learning',
    icon: GraduationCap,
    description: 'Rutas de aprendizaje personalizadas'
  },
  {
    title: 'Progress Tracking',
    href: '/progress',
    icon: BarChart3,
    description: 'Seguimiento de progreso'
  }
];

export const accountItems = [
  {
    title: 'Profile',
    href: '/profile',
    icon: Users,
    description: 'Perfil de usuario'
  },
  {
    title: 'Billing',
    href: '/billing',
    icon: CreditCard,
    description: 'Facturación y suscripciones'
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Configuración de la cuenta'
  }
];
