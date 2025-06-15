
import {
  Home,
  MessageSquare,
  BookOpen,
  User,
  CreditCard,
  Brain,
  Bot,
  Sparkles,
  FileText,
  Settings
} from 'lucide-react';

export const navigationItems = [
  { 
    section: 'Principal',
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: Home, description: 'Vista general del sistema' },
      { title: 'Chat con CLIPOGINO', href: '/chat', icon: MessageSquare, badge: 'AI', description: 'Asistente inteligente personalizado' },
      { title: 'Agentes IA', href: '/agents', icon: Bot, badge: 'ELITE', description: 'Centro unificado de agentes IA con metodología tripartite' }
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
      { title: 'Aprendizaje', href: '/learning', icon: Sparkles, description: 'Rutas y módulos de aprendizaje' }
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
