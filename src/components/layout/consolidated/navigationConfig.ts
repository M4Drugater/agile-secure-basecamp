
import {
  Home,
  MessageSquare,
  BookOpen,
  User,
  CreditCard,
  Brain,
  Search,
  FileText,
  Settings,
  Users,
  Crown
} from 'lucide-react';

export const getNavigationItems = (t: (key: string) => string) => [
  { 
    section: t('nav.main'),
    items: [
      { title: t('nav.dashboard'), href: '/dashboard', icon: Home, description: t('nav.dashboardDesc') },
      { title: t('nav.chat'), href: '/chat', icon: MessageSquare, badge: 'UNIFICADO', description: t('nav.chatDesc') },
      { title: t('nav.agents'), href: '/agents', icon: Crown, badge: 'ELITE', description: t('nav.agentsDesc') },
      { title: t('nav.research'), href: '/research', icon: Search, badge: 'TRIPARTITE', description: t('nav.researchDesc') }
    ]
  },
  { 
    section: t('nav.aiContent'),
    items: [
      { title: t('nav.content'), href: '/content', icon: FileText, description: t('nav.contentDesc') }
    ]
  },
  { 
    section: t('nav.management'),
    items: [
      { title: t('nav.knowledge'), href: '/knowledge', icon: Brain, description: t('nav.knowledgeDesc') },
      { title: t('nav.learning'), href: '/learning', icon: BookOpen, description: t('nav.learningDesc') }
    ]
  },
  { 
    section: t('nav.account'),
    items: [
      { title: t('nav.profile'), href: '/profile', icon: User, description: t('nav.profileDesc') },
      { title: t('nav.billing'), href: '/billing', icon: CreditCard, description: t('nav.billingDesc') },
      { title: t('nav.settings'), href: '/admin', icon: Settings, description: t('nav.settingsDesc') }
    ]
  }
];
