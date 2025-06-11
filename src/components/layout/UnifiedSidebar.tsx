
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  BarChart3, 
  BookOpen, 
  GraduationCap, 
  Settings, 
  CreditCard,
  TrendingUp,
  Brain
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const mainNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'AI Chat',
    href: '/chat',
    icon: MessageSquare,
  },
  {
    title: 'Tendencias',
    href: '/trends',
    icon: TrendingUp,
    badge: 'Nuevo',
  },
];

const contentNavItems = [
  {
    title: 'Generador',
    href: '/content/generator',
    icon: Brain,
  },
  {
    title: 'Biblioteca',
    href: '/content/library',
    icon: FileText,
  },
  {
    title: 'Analytics',
    href: '/content/analytics',
    icon: BarChart3,
  },
];

const learningNavItems = [
  {
    title: 'Base de Conocimiento',
    href: '/knowledge',
    icon: BookOpen,
  },
  {
    title: 'Aprendizaje',
    href: '/learning',
    icon: GraduationCap,
  },
];

const settingsNavItems = [
  {
    title: 'Facturación',
    href: '/billing',
    icon: CreditCard,
  },
  {
    title: 'Administración',
    href: '/admin',
    icon: Settings,
    adminOnly: true,
  },
];

interface UnifiedSidebarProps {
  isCollapsed?: boolean;
}

export function UnifiedSidebar({ isCollapsed = false }: UnifiedSidebarProps) {
  const location = useLocation();
  const { profile } = useAuth();
  
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

  const NavSection = ({ 
    title, 
    items, 
    className = "" 
  }: { 
    title: string; 
    items: typeof mainNavItems; 
    className?: string;
  }) => (
    <div className={cn("space-y-1", className)}>
      {!isCollapsed && (
        <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
      )}
      {items
        .filter(item => !item.adminOnly || isAdmin)
        .map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                isCollapsed && "justify-center px-2"
              )}
            >
              <item.icon className="h-4 w-4" />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          );
        })}
    </div>
  );

  return (
    <div className={cn(
      "flex flex-col gap-6 py-6",
      isCollapsed ? "px-2" : "px-4"
    )}>
      <NavSection title="Principal" items={mainNavItems} />
      <NavSection title="Contenido" items={contentNavItems} />
      <NavSection title="Conocimiento" items={learningNavItems} />
      <NavSection title="Configuración" items={settingsNavItems} />
    </div>
  );
}
