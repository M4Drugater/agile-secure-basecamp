
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ConsolidatedSidebar } from './consolidated/ConsolidatedSidebar';
import { ConsolidatedTopNav } from './consolidated/ConsolidatedTopNav';

interface ConsolidatedAppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function ConsolidatedAppLayout({ children, className }: ConsolidatedAppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 transition-all duration-200",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <ConsolidatedSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation */}
        <ConsolidatedTopNav onToggleSidebar={toggleSidebar} />
        
        {/* Main Content */}
        <main className={cn("flex-1 overflow-auto", className)}>
          {children}
        </main>
      </div>
    </div>
  );
}
