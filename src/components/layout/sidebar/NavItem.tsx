
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavItem } from './navigationItems';

interface NavItemProps {
  item: NavItem;
  isCollapsed: boolean;
  isLocked: boolean;
}

export function NavItemComponent({ item, isCollapsed, isLocked }: NavItemProps) {
  const location = useLocation();
  const Icon = item.icon;
  const isActive = location.pathname === item.href;

  if (isCollapsed) {
    return (
      <div>
        {isLocked ? (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center p-2 h-10 opacity-50 cursor-not-allowed"
            title={item.lockedMessage || `Requiere completar: ${item.requiresStep}`}
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
  }

  return (
    <div>
      {isLocked ? (
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-auto p-3 opacity-60 cursor-not-allowed"
            disabled
          >
            <Lock className="h-4 w-4 mr-3 flex-shrink-0 text-muted-foreground" />
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">{item.title}</span>
                <Badge variant="outline" className="text-xs px-1.5 py-0 bg-gray-50 text-gray-500 border-gray-300">
                  Bloqueado
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {item.lockedMessage || `Completa el paso anterior primero`}
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
}
