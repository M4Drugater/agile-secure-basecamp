
import React from 'react';
import { ContentLibrary } from '@/components/content/ContentLibrary';
import { UniversalLayout } from '@/components/layout/UniversalLayout';

export default function ContentLibraryPage() {
  return (
    <UniversalLayout className="bg-background">
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl pt-20">
        <ContentLibrary />
      </div>
    </UniversalLayout>
  );
}
