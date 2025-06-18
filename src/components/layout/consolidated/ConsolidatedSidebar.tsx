
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConsolidatedNavSection } from './ConsolidatedNavSection';
import { getNavigationItems } from './navigationConfig';
import { useTranslation } from 'react-i18next';

interface ConsolidatedSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function ConsolidatedSidebar({ isCollapsed, onToggleCollapse }: ConsolidatedSidebarProps) {
  const { t } = useTranslation();
  const navigationItems = getNavigationItems(t);

  return (
    <div className={cn(
      "transition-all duration-200 border-r bg-white",
      isCollapsed ? "w-16" : "w-80"
    )}>
      {/* Sidebar Header */}
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
          onClick={onToggleCollapse}
          className="ml-auto"
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-90")} />
        </Button>
      </div>

      {/* Sidebar Content */}
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-4 space-y-6">
          {navigationItems.map((section) => (
            <ConsolidatedNavSection
              key={section.section}
              title={section.section}
              items={section.items}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
