
import React from 'react';
import { UniversalTopNav } from './UniversalTopNav';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

interface UniversalLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function UniversalLayout({ children, className = '' }: UniversalLayoutProps) {
  // Enable keyboard navigation
  useKeyboardNavigation();

  return (
    <div className={`min-h-screen ${className}`}>
      <UniversalTopNav />
      {children}
    </div>
  );
}
