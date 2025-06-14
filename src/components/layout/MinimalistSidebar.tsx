
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
  ChevronRight,
  Lock
} from 'lucide-react';
import { useProgressiveJourney } from '@/hooks/useProgressiveJourney';

const coreNavItems = [
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
    lockedMessage: 'Sube documentos primero'
  }
];

const activeModulesItems = [
  { 
    title: 'Inteligencia Competitiva', 
    href: '/competitive-intelligence', 
    icon: Shield,
    badge: 'IA',
    description: 'Análisis competitivo con agentes CDV, CIA y CIR',
    requiresStep: 'chat',
    lockedMessage: 'Completa tu primer chat'
  },
  { 
    title: 'Generador de Contenido', 
    href: '/content-generator', 
    icon: FileText,
    badge: 'IA',
    description: 'Creación de contenido profesional',
    requiresStep: 'chat',
    lockedMessage: 'Completa tu primer chat'
  },
  { 
    title: 'Base de Conocimiento', 
    href: '/knowledge', 
    icon: BookOpen,
    description: 'Gestión de documentos y recursos',
    requiresStep: 'profile',
    lockedMessage: 'Completa tu perfil primero'
  }
];

const accountItems = [
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

interface NavSectionProps {
  title: string;
  items: Array<{
    title: string;
    href: string;
    icon: React.ComponentType<any>;
    badge?: string;
    description?: string;
    alwaysShow?: boolean;
    requiresStep?: string;
    lockedMessage?: string;
  }>;
  isCollapsed: boolean;
  completionStates: Record<string, boolean>;
  isJourneyComplete: boolean;
}

function NavSection({ title, items, isCollapsed, completionStates, isJourneyComplete }: NavSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  // Filter items based on journey progress
  const visibleItems = items.filter(item => {
    // Always show if marked as such or journey is complete
    if (item.alwaysShow || isJourneyComplete) return true;
    
    // Show if required step is completed OR show as locked
    return true; // We show all items but mark some as locked
  });

  // Don't render section if no items are visible
  if (visibleItems.length === 0) return null;

  if (isCollapsed) {
    return (
      <div className="space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          const isLocked = item.requiresStep && !completionStates[item.requiresStep] && !isJourneyComplete;
          
          return (
            <div key={item.href}>
              {isLocked ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center p-2 h-10 opacity-50 cursor-not-allowed"
                  title={item.lockedMessage || `Requiere: ${item.requiresStep}`}
                  disabled
                >
                  <Lock className="h-5 w-5" />
                </Button>
              ) : (
                <Link to={item.href}>
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
              )}
            </div>
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
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            const isLocked = item.requiresStep && !completionStates[item.requiresStep] && !isJourneyComplete;
            
            return (
              <div key={item.href}>
                {isLocked ? (
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-auto p-3 opacity-50 cursor-not-allowed"
                      disabled
                    >
                      <Lock className="h-4 w-4 mr-3 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{item.title}</span>
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            Bloqueado
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {item.lockedMessage || `Requiere: ${item.requiresStep}`}
                        </div>
                      </div>
                    </Button>
                  </div>
                ) : (
                  <Link to={item.href}>
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
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function MinimalistSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { getJourneySteps, isJourneyComplete } = useProgressiveJourney();
  
  const steps = getJourneySteps();
  const completionStates = steps.reduce((acc, step) => {
    acc[step.id] = step.completed;
    return acc;
  }, {} as Record<string, boolean>);

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
            completionStates={completionStates}
            isJourneyComplete={isJourneyComplete()}
          />
          
          <NavSection 
            title="Módulos Activos" 
            items={activeModulesItems} 
            isCollapsed={isCollapsed}
            completionStates={completionStates}
            isJourneyComplete={isJourneyComplete()}
          />
          
          <NavSection 
            title="Cuenta" 
            items={accountItems} 
            isCollapsed={isCollapsed}
            completionStates={completionStates}
            isJourneyComplete={isJourneyComplete()}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
