
import React from 'react';
import { UserKnowledgeManager } from '@/components/knowledge/UserKnowledgeManager';

export default function KnowledgeBase() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <UserKnowledgeManager />
      </div>
    </div>
  );
}
