
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedCompetitiveHeader } from './EnhancedCompetitiveHeader';
import { EnhancedIndustryConfiguration } from './EnhancedIndustryConfiguration';
import { AgentChat } from './AgentChat';
import { StrategicAnalysisPanel } from './StrategicAnalysisPanel';
import { ExecutiveDashboard } from './ExecutiveDashboard';
import { ContinuousMonitoringPanel } from './ContinuousMonitoringPanel';
import { RealTimeIntelligencePanel } from './RealTimeIntelligencePanel';

interface SessionConfig {
  companyName: string;
  industry: string;
  analysisFocus: string;
  objectives: string;
  customIndustry?: string;
  subIndustries?: string[];
  competitorCompanies?: string[];
  geographicScope?: string;
  analysisDepth?: string;
}

interface EnhancedAgentWorkspaceProps {
  selectedAgent: string;
  sessionConfig: SessionConfig;
  setSessionConfig: React.Dispatch<React.SetStateAction<SessionConfig>>;
}

export function EnhancedAgentWorkspace({ 
  selectedAgent, 
  sessionConfig, 
  setSessionConfig 
}: EnhancedAgentWorkspaceProps) {
  const [activeTab, setActiveTab] = useState('config');
  const [analysisData, setAnalysisData] = useState({});

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <EnhancedCompetitiveHeader
        selectedAgent={selectedAgent}
        sessionConfig={sessionConfig}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Enhanced Workspace Content */}
      <div className="min-h-[600px]">
        {activeTab === 'realtime' && (
          <RealTimeIntelligencePanel 
            companyName={sessionConfig.companyName}
            industry={sessionConfig.industry}
          />
        )}

        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto">
            <AgentChat 
              agentId={selectedAgent} 
              sessionConfig={sessionConfig} 
            />
          </div>
        )}

        {activeTab === 'analysis' && (
          <StrategicAnalysisPanel 
            agentType={selectedAgent} 
            analysisData={analysisData}
          />
        )}

        {activeTab === 'dashboard' && (
          <ExecutiveDashboard companyContext={sessionConfig} />
        )}

        {activeTab === 'monitoring' && (
          <ContinuousMonitoringPanel companyContext={sessionConfig} />
        )}

        {activeTab === 'config' && (
          <div className="max-w-4xl mx-auto">
            <EnhancedIndustryConfiguration 
              sessionConfig={sessionConfig} 
              setSessionConfig={setSessionConfig} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
