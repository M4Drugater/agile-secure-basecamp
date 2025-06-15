
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefactoredKnowledgeManager } from '@/components/knowledge/RefactoredKnowledgeManager';
import { SystemKnowledgeViewer } from '@/components/knowledge/SystemKnowledgeViewer';
import { DownloadableResourcesManager } from '@/components/knowledge/DownloadableResourcesManager';
import { BookOpen, Download, Database, Zap } from 'lucide-react';

export default function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          Enhanced Knowledge Base
          <Zap className="h-8 w-8 text-yellow-500" />
        </h1>
        <p className="text-muted-foreground">
          Advanced AI-powered knowledge management with intelligent processing, recommendations, and CLIPOGINO integration
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Personal Knowledge
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            System Knowledge
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <RefactoredKnowledgeManager />
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <SystemKnowledgeViewer />
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <DownloadableResourcesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
