
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { EnhancedIndustryConfiguration } from '../EnhancedIndustryConfiguration';
import { RealTimeIntelligencePanel } from '../RealTimeIntelligencePanel';
import { AgentChat } from '../AgentChat';
import { StrategicAnalysisPanel } from '../StrategicAnalysisPanel';
import { ExecutiveDashboard } from '../ExecutiveDashboard';
import { ContinuousMonitoringPanel } from '../ContinuousMonitoringPanel';

interface WorkspaceContentProps {
  activeTab: string;
  sessionConfig: any;
  setSessionConfig: React.Dispatch<React.SetStateAction<any>>;
  selectedAgent: string;
  analysisData: any;
}

export function WorkspaceContent({
  activeTab,
  sessionConfig,
  setSessionConfig,
  selectedAgent,
  analysisData
}: WorkspaceContentProps) {
  return (
    <div className="min-h-[600px]">
      {activeTab === 'config' && (
        <div className="max-w-4xl mx-auto">
          <EnhancedIndustryConfiguration 
            sessionConfig={sessionConfig} 
            setSessionConfig={setSessionConfig} 
          />
        </div>
      )}

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
    </div>
  );
}
