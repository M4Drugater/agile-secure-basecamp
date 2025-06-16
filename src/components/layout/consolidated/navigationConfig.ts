
import {
  Home,
  MessageSquare,
  BookOpen,
  User,
  CreditCard,
  Brain,
  Search,
  FileText,
  Settings
} from 'lucide-react';

export const navigationItems = [
  { 
    section: 'Principal',
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: Home, description: 'Vista general del sistema' },
      { title: 'CLIPOGINO IA', href: '/chat', icon: MessageSquare, badge: 'UNIFICADO', description: 'Asistente IA con sistema tripartite y agentes especializados' },
      { title: 'Investigación Elite', href: '/research', icon: Search, badge: 'TRIPARTITE', description: 'Investigación Fortune 500 con metodología unificada' }
    ]
  },
  { 
    section: 'IA y Contenido',
    items: [
      { title: 'Content Studio', href: '/content', icon: FileText, description: 'Creación y gestión unificada de contenido' }
    ]
  },
  { 
    section: 'Gestión',
    items: [
      { title: 'Base de Conocimiento', href: '/knowledge', icon: Brain, description: 'Documentos y recursos' },
      { title: 'Aprendizaje', href: '/learning', icon: BookOpen, description: 'Rutas y módulos de aprendizaje' }
    ]
  },
  { 
    section: 'Cuenta',
    items: [
      { title: 'Perfil', href: '/profile', icon: User, description: 'Configuración personal' },
      { title: 'Facturación', href: '/billing', icon: CreditCard, description: 'Suscripciones y pagos' },
      { title: 'Configuración', href: '/admin', icon: Settings, description: 'Panel administrativo' }
    ]
  }
];
