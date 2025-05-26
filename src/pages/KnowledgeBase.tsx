
import React from 'react';
import { KnowledgeBaseManager } from '@/components/knowledge/KnowledgeBaseManager';

export default function KnowledgeBase() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <KnowledgeBaseManager />
      </div>
    </div>
  );
}
