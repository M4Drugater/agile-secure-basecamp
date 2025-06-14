
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Home,
  MessageSquare,
  FileText,
  BookOpen,
  Shield,
  User,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const coreNavItems = [
  { 
    title: 'Dashboard', 
    href: '/dashboard', 
    icon: Home,
    description: 'Vista general del sistema'
  },
  { 
    title: 'CLIPOGINO', 
    href: '/chat', 
    icon: MessageSquare,
    badge: 'IA',
    description: 'Tu mentor inteligente personalizado'
  }
];

const activeModulesItems = [
  { 
    title: 'Inteligencia Competitiva', 
    href: '/competitive-intelligence', 
    icon: Shield,
    badge: 'IA',
    description: 'Análisis competitivo con agentes CDV, CIA y CIR'
  },
  { 
    title: 'Generador de Contenido', 
    href: '/content-generator', 
    icon: FileText,
    badge: 'IA',
    description: 'Creación de contenido profesional'
  },
  { 
    title: 'Base de Conocimiento', 
    href: '/knowledge', 
    icon: BookOpen,
    description: 'Gestión de documentos y recursos'
  }
];

const accountItems = [
  { 
    title: 'Perfil', 
    href: '/profile', 
    icon: User,
    description: 'Configuración personal'
  },
  { 
    title: 'Administración', 
    href: '/admin', 
    icon: Settings,
    description: 'Panel de administración'
  }
];

interface NavSectionProps {
  title: string;
  items: Array<{
    title: string;
    href: string;
    icon: React.ComponentType<any>;
    badge?: string;
    description?: string;
  }>;
  isCollapsed: boolean;
}

function NavSection({ title, items, isCollapsed }: NavSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  if (isCollapsed) {
    return (
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link key={item.href} to={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-center p-2 h-10",
                  isActive && "bg-blue-50 text-blue-700 border-blue-200"
                )}
                title={item.title}
              >
                <Icon className="h-5 w-5" />
              </Button>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider px-3"
      >
        {title}
        {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </Button>
      
      {isOpen && (
        <div className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start h-auto p-3",
                    isActive && "bg-blue-50 text-blue-700 border-blue-200"
                  )}
                >
                  <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {item.description}
                      </div>
                    )}
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function MinimalistSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "border-r bg-white transition-all duration-200",
      isCollapsed ? "w-16" : "w-80"
    )}>
      <div className="flex h-16 items-center border-b px-4">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">L</span>
          </div>
          {!isCollapsed && (
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LAIGENT v2.0
            </span>
          )}
        </Link>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-90")} />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-4 space-y-6">
          <NavSection 
            title="Principal" 
            items={coreNavItems} 
            isCollapsed={isCollapsed}
          />
          
          <NavSection 
            title="Módulos Activos" 
            items={activeModulesItems} 
            isCollapsed={isCollapsed}
          />
          
          <NavSection 
            title="Cuenta" 
            items={accountItems} 
            isCollapsed={isCollapsed}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
