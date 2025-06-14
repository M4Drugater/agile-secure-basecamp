
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProgressiveJourney } from '@/hooks/useProgressiveJourney';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { NavSection } from './sidebar/NavSection';
import { coreNavItems, activeModulesItems, accountItems } from './sidebar/navigationItems';

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
      <SidebarHeader 
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

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
