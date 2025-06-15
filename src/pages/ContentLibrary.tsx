
import React from 'react';
import { ContentLibrary } from '@/components/content/ContentLibrary';
import { UnifiedAppLayout } from '@/components/layout/UnifiedAppLayout';

export default function ContentLibraryPage() {
  return (
    <UnifiedAppLayout>
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <ContentLibrary />
      </div>
    </UnifiedAppLayout>
  );
}
