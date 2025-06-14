
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
  description?: string;
}

interface ConsolidatedNavSectionProps {
  title: string;
  items: NavItem[];
  isCollapsed: boolean;
}

export function ConsolidatedNavSection({ title, items, isCollapsed }: ConsolidatedNavSectionProps) {
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
