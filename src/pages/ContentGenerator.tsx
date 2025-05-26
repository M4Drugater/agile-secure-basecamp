
import React from 'react';
import { ContentGenerator } from '@/components/content/ContentGenerator';

export default function ContentGeneratorPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <ContentGenerator />
      </div>
    </div>
  );
}
