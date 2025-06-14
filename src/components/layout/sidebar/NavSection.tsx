
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { NavItem } from './navigationItems';
import { NavItemComponent } from './NavItem';

interface NavSectionProps {
  title: string;
  items: NavItem[];
  isCollapsed: boolean;
  completionStates: Record<string, boolean>;
  isJourneyComplete: boolean;
}

export function NavSection({ 
  title, 
  items, 
  isCollapsed, 
  completionStates, 
  isJourneyComplete 
}: NavSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

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
          const isLocked = item.requiresStep && !completionStates[item.requiresStep] && !isJourneyComplete;
          
          return (
            <NavItemComponent
              key={item.href}
              item={item}
              isCollapsed={isCollapsed}
              isLocked={isLocked}
            />
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
            const isLocked = item.requiresStep && !completionStates[item.requiresStep] && !isJourneyComplete;
            
            return (
              <NavItemComponent
                key={item.href}
                item={item}
                isCollapsed={isCollapsed}
                isLocked={isLocked}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
