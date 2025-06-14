
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { UnifiedNavItem } from './unifiedNavigationItems';

interface UnifiedNavItemProps {
  item: UnifiedNavItem;
  isCollapsed: boolean;
}

export function UnifiedNavItem({ item, isCollapsed }: UnifiedNavItemProps) {
  const location = useLocation();
  const Icon = item.icon;
  const isActive = location.pathname === item.href;

  if (isCollapsed) {
    return (
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
    );
  }

  return (
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
  );
}
