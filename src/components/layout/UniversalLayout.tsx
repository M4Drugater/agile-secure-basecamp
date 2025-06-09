
import React from 'react';
import { EnhancedTopNav } from './EnhancedTopNav';
import { cn } from '@/lib/utils';

interface UniversalLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function UniversalLayout({ children, className }: UniversalLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <EnhancedTopNav />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
