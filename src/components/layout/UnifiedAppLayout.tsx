
import React from 'react';
import { MinimalistSidebar } from './MinimalistSidebar';
import { UnifiedTopNav } from './UnifiedTopNav';

interface UnifiedAppLayoutProps {
  children: React.ReactNode;
}

export function UnifiedAppLayout({ children }: UnifiedAppLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <MinimalistSidebar />
      <div className="flex-1 flex flex-col">
        <UnifiedTopNav />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
