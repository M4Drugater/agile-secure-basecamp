
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UnifiedSidebarHeader } from './sidebar/UnifiedSidebarHeader';
import { UnifiedNavSection } from './sidebar/UnifiedNavSection';
import {
  mainNavItems,
  aiModulesItems,
  contentItems,
  learningItems,
  accountItems
} from './sidebar/unifiedNavigationItems';

export function UnifiedSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "border-r bg-white transition-all duration-200",
      isCollapsed ? "w-16" : "w-80"
    )}>
      <UnifiedSidebarHeader 
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-4 space-y-6">
          <UnifiedNavSection 
            title="Principal" 
            items={mainNavItems} 
            isCollapsed={isCollapsed}
          />
          
          <UnifiedNavSection 
            title="Módulos IA" 
            items={aiModulesItems} 
            isCollapsed={isCollapsed}
          />
          
          <UnifiedNavSection 
            title="Contenido" 
            items={contentItems} 
            isCollapsed={isCollapsed}
          />
          
          <UnifiedNavSection 
            title="Aprendizaje" 
            items={learningItems} 
            isCollapsed={isCollapsed}
          />
          
          <UnifiedNavSection 
            title="Cuenta" 
            items={accountItems} 
            isCollapsed={isCollapsed}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
