
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, MessageSquare } from 'lucide-react';
import { LaigentBucketSelector } from '@/components/orchestrators/LaigentBucketSelector';
import { LaigentWorkflowInterface } from '@/components/orchestrators/LaigentWorkflowInterface';
import { CollaborativeSession } from '../CollaborativeSession';
import { AgentWorkspaceContent } from '../AgentWorkspaceContent';
import type { AgentConfig } from '../UnifiedAgentWorkspace';

interface ConsolidatedAgentsInterfaceProps {
  activeMode: 'orchestrator' | 'workspace';
  selectedBucket: any;
  selectedAgents: AgentConfig[];
  collaborativeMode: boolean;
  sessionConfig: any;
  onModeSwitch: (mode: 'orchestrator' | 'workspace') => void;
  onSelectBucket: (bucket: any) => void;
  onBackToBuckets: () => void;
  onUpdateConfig: React.Dispatch<React.SetStateAction<any>>;
  onBackFromCollaborative: () => void;
}

export function ConsolidatedAgentsInterface({
  activeMode,
  selectedBucket,
  selectedAgents,
  collaborativeMode,
  sessionConfig,
  onModeSwitch,
  onSelectBucket,
  onBackToBuckets,
  onUpdateConfig,
  onBackFromCollaborative
}: ConsolidatedAgentsInterfaceProps) {
  return (
    <Tabs value={activeMode} onValueChange={(value) => onModeSwitch(value as 'orchestrator' | 'workspace')} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="orchestrator" className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          LAIGENT Orchestrator
        </TabsTrigger>
        <TabsTrigger value="workspace" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Agent Workspace
        </TabsTrigger>
      </TabsList>

      <TabsContent value="orchestrator" className="mt-6">
        {!selectedBucket ? (
          <LaigentBucketSelector onSelectBucket={onSelectBucket} />
        ) : (
          <LaigentWorkflowInterface 
            selectedBucket={selectedBucket}
            onBack={onBackToBuckets}
          />
        )}
      </TabsContent>

      <TabsContent value="workspace" className="mt-6">
        {collaborativeMode ? (
          <CollaborativeSession
            selectedAgents={selectedAgents}
            sessionConfig={sessionConfig}
            onUpdateConfig={onUpdateConfig}
            onBack={onBackFromCollaborative}
          />
        ) : (
          <AgentWorkspaceContent
            selectedAgents={selectedAgents}
            sessionConfig={sessionConfig}
            setSessionConfig={onUpdateConfig}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
