
import {
  Home,
  MessageSquare,
  BookOpen,
  User,
  CreditCard,
  Brain,
  Bot,
  Search,
  Sparkles
} from 'lucide-react';

export const navigationItems = [
  { 
    section: 'Principal',
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: Home, description: 'Vista general del sistema' },
      { title: 'Chat con CLIPOGINO', href: '/chat', icon: MessageSquare, badge: 'AI', description: 'Asistente inteligente personalizado' },
      { title: 'Agentes Unificados', href: '/agents', icon: Bot, badge: 'NEW', description: 'Interfaz centralizada para todos los agentes' }
    ]
  },
  { 
    section: 'Gestión',
    items: [
      { title: 'Base de Conocimiento', href: '/knowledge', icon: Brain, description: 'Documentos y recursos' },
      { title: 'Research Workbench', href: '/research', icon: Search, description: 'Investigación con IA' },
      { title: 'Learning', href: '/learning', icon: Sparkles, description: 'Rutas y módulos de aprendizaje' }
    ]
  },
  { 
    section: 'Cuenta',
    items: [
      { title: 'Perfil', href: '/profile', icon: User, description: 'Configuración personal' },
      { title: 'Facturación', href: '/billing', icon: CreditCard, description: 'Suscripciones y pagos' }
    ]
  }
];
