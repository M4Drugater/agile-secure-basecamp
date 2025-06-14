
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnifiedSidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function UnifiedSidebarHeader({ isCollapsed, onToggleCollapse }: UnifiedSidebarHeaderProps) {
  return (
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
  );
}
