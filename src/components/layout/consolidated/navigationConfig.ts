
import {
  Home,
  MessageSquare,
  BookOpen,
  User,
  CreditCard,
  Brain,
  Bot,
  Search,
  Sparkles,
  FileText,
  Library,
  BarChart3,
  Target,
  Zap,
  Settings
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
    section: 'IA y Contenido',
    items: [
      { title: 'Generador de Contenido', href: '/content', icon: FileText, description: 'Creación de contenido con IA' },
      { title: 'Biblioteca de Contenido', href: '/content-library', icon: Library, description: 'Gestión de contenido generado' },
      { title: 'Orquestador LAIGENT', href: '/laigent-orchestrator', icon: Zap, badge: 'ELITE', description: 'Coordinación avanzada de agentes' }
    ]
  },
  { 
    section: 'Investigación y Análisis',
    items: [
      { title: 'Motor de Investigación', href: '/research', icon: Search, description: 'Investigación avanzada con IA' },
      { title: 'Inteligencia Competitiva', href: '/competitive-intelligence', icon: Target, description: 'Análisis competitivo estratégico' },
      { title: 'Analytics', href: '/content-analytics', icon: BarChart3, description: 'Métricas y análisis' }
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
