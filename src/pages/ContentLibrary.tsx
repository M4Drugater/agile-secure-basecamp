
import React from 'react';
import { ContentLibrary } from '@/components/content/ContentLibrary';

export default function ContentLibraryPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <ContentLibrary />
      </div>
    </div>
  );
}
