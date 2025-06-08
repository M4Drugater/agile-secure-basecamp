import React from 'react';
import { EnhancedTopNav } from './EnhancedTopNav';

interface UniversalLayoutProps {
  children: React.ReactNode;
}

export function UniversalLayout({ children }: UniversalLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <EnhancedTopNav />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
