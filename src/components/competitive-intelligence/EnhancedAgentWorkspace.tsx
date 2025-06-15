
import React, { useState } from 'react';
import { WorkspaceHeader } from './workspace/WorkspaceHeader';
import { WorkspaceNavigation } from './workspace/WorkspaceNavigation';
import { WorkspaceContent } from './workspace/WorkspaceContent';

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
      <WorkspaceHeader 
        sessionConfig={sessionConfig}
        selectedAgent={selectedAgent}
      />

      <WorkspaceNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <WorkspaceContent
        activeTab={activeTab}
        sessionConfig={sessionConfig}
        setSessionConfig={setSessionConfig}
        selectedAgent={selectedAgent}
        analysisData={analysisData}
      />
    </div>
  );
}
