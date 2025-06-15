
import React from 'react';
import { AgentConfig } from './UnifiedAgentWorkspace';
import { ConsolidatedAgentChat } from './ConsolidatedAgentChat';
import { AgentSelectionGrid } from './components/AgentSelectionGrid';
import { useConsolidatedAgentsHub } from './hooks/useConsolidatedAgentsHub';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface AgentWorkspaceContentProps {
  selectedAgents: AgentConfig[];
  sessionConfig: any;
  setSessionConfig: React.Dispatch<React.SetStateAction<any>>;
}

export function AgentWorkspaceContent({ 
  selectedAgents, 
  sessionConfig, 
  setSessionConfig 
}: AgentWorkspaceContentProps) {
  const { handleAgentSelect } = useConsolidatedAgentsHub();
  const navigate = useNavigate();
  const primaryAgent = selectedAgents[0];

  // Show agent selection grid when no agent is selected
  if (!primaryAgent) {
    return (
      <div className="py-8">
        <AgentSelectionGrid 
          onAgentSelect={handleAgentSelect}
          selectedAgentId={undefined}
        />
      </div>
    );
  }

  // Special handling for Enhanced Content Generator - redirect to unified system
  if (primaryAgent.id === 'enhanced-content-generator') {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Enhanced Content Generator</CardTitle>
          <p className="text-muted-foreground">
            The Enhanced Content Generator has been unified with our Premium Content Studio for a better experience.
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">New Unified Features</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Tripartite AI System (OpenAI + Perplexity + Claude)</li>
              <li>• Real-time web research capabilities</li>
              <li>• Enhanced content library management</li>
              <li>• Advanced analytics and insights</li>
              <li>• Style transfer and optimization tools</li>
            </ul>
          </div>
          
          <Button 
            onClick={() => navigate('/content?tab=generator')}
            className="w-full"
            size="lg"
          >
            Go to Unified Content Studio
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Use consolidated chat for all other agents
  return (
    <ConsolidatedAgentChat
      selectedAgent={primaryAgent}
      sessionConfig={sessionConfig}
      onUpdateConfig={setSessionConfig}
    />
  );
}
