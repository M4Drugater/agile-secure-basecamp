
import React from 'react';
import { ConsolidatedAppLayout } from './ConsolidatedAppLayout';

interface UnifiedAppLayoutProps {
  children: React.ReactNode;
}

export function UnifiedAppLayout({ children }: UnifiedAppLayoutProps) {
  return (
    <ConsolidatedAppLayout>
      {children}
    </ConsolidatedAppLayout>
  );
}
