
import React, { useState } from 'react';
import { UnifiedSidebar } from './UnifiedSidebar';
import { UnifiedTopNav } from './UnifiedTopNav';
import { cn } from '@/lib/utils';

interface UnifiedAppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function UnifiedAppLayout({ children, className }: UnifiedAppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-200 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <UnifiedSidebar />
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
        <UnifiedTopNav 
          onToggleSidebar={toggleSidebar}
          showSidebarToggle={true}
        />
        
        <main className={cn("flex-1 overflow-auto", className)}>
          {children}
        </main>
      </div>
    </div>
  );
}
