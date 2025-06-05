
import React from 'react';
import { ContentGenerator } from '@/components/content/ContentGenerator';
import { UniversalLayout } from '@/components/layout/UniversalLayout';

export default function ContentGeneratorPage() {
  return (
    <UniversalLayout>
      <div className="min-h-screen bg-background pt-16">
        <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
          <ContentGenerator />
        </div>
      </div>
    </UniversalLayout>
  );
}
