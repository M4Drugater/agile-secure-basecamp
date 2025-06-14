
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { UnifiedNavItem } from './UnifiedNavItem';
import { UnifiedNavItem as NavItemType } from './unifiedNavigationItems';

interface UnifiedNavSectionProps {
  title: string;
  items: NavItemType[];
  isCollapsed: boolean;
}

export function UnifiedNavSection({ title, items, isCollapsed }: UnifiedNavSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (isCollapsed) {
    return (
      <div className="space-y-1">
        {items.map((item) => (
          <UnifiedNavItem
            key={item.href}
            item={item}
            isCollapsed={isCollapsed}
          />
        ))}
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
          {items.map((item) => (
            <UnifiedNavItem
              key={item.href}
              item={item}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      )}
    </div>
  );
}
