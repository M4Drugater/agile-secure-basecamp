
import React from 'react';
import { UnifiedSidebar } from './UnifiedSidebar';
import { UnifiedTopNav } from './UnifiedTopNav';

interface UnifiedAppLayoutProps {
  children: React.ReactNode;
}

export function UnifiedAppLayout({ children }: UnifiedAppLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div data-tour="sidebar">
        <UnifiedSidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <UnifiedTopNav />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
