
import React from 'react';
import { ContentGenerator } from '@/components/content/ContentGenerator';
import { UnifiedAppLayout } from '@/components/layout/UnifiedAppLayout';

export default function ContentGeneratorPage() {
  return (
    <UnifiedAppLayout>
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <ContentGenerator />
      </div>
    </UnifiedAppLayout>
  );
}
