
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Zap, 
  Globe, 
  Settings,
  TrendingUp,
  AlertCircle,
  Target,
  BarChart3,
  Brain
} from 'lucide-react';

interface WorkspaceHeaderProps {
  sessionConfig: any;
  selectedAgent?: string;
  onConfigurationClick?: () => void;
}

export function WorkspaceHeader({ sessionConfig, selectedAgent, onConfigurationClick }: WorkspaceHeaderProps) {
  const systemStatus = {
    realTimeActive: true,
    dataQuality: 96,
    agentsOnline: 3,
    lastUpdate: new Date()
  };

  const getAgentInfo = (agentId: string) => {
    const agents = {
      cdv: { name: 'CDV Agent', icon: Target, description: 'Competitive Discovery & Validation' },
      cir: { name: 'CIR Agent', icon: BarChart3, description: 'Competitive Intelligence Research' },
      cia: { name: 'CIA Agent', icon: Brain, description: 'Competitive Intelligence Analysis' }
    };
    return agents[agentId as keyof typeof agents] || agents.cia;
  };

  const currentAgent = selectedAgent ? getAgentInfo(selectedAgent) : null;

  return (
    <div className="border-b border-gray-200 pb-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Elite Competitive Intelligence Platform
            {currentAgent && (
              <>
                <span className="text-gray-400">•</span>
                <currentAgent.icon className="h-6 w-6 text-purple-600" />
                <span className="text-purple-600">{currentAgent.name}</span>
              </>
            )}
          </h1>
          <p className="text-muted-foreground mt-2">
            {sessionConfig.companyName ? 
              `Real-time intelligence for ${sessionConfig.companyName} in ${sessionConfig.industry}` :
              'Configure your competitive intelligence session to get started'
            }
            {currentAgent && (
              <span className="block text-sm text-purple-600 mt-1">
                {currentAgent.description}
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* System Status Badges */}
          <Badge variant="default" className="flex items-center gap-1 bg-green-600">
            <Zap className="h-3 w-3" />
            Real-Time Active
          </Badge>
          
          <Badge variant="outline" className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            {systemStatus.agentsOnline} Agents Online
          </Badge>
          
          <Badge variant="outline" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {systemStatus.dataQuality}% Data Quality
          </Badge>

          {/* Quick Actions */}
          {onConfigurationClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onConfigurationClick}
              className="flex items-center gap-1"
            >
              <Settings className="h-3 w-3" />
              Configure
            </Button>
          )}
        </div>
      </div>

      {/* Session Info */}
      {sessionConfig.companyName && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="font-medium text-blue-800">Target Company:</span>
              <div className="text-blue-600">{sessionConfig.companyName}</div>
            </div>
            <div>
              <span className="font-medium text-blue-800">Industry:</span>
              <div className="text-blue-600">{sessionConfig.industry}</div>
            </div>
            <div>
              <span className="font-medium text-blue-800">Focus:</span>
              <div className="text-blue-600">{sessionConfig.analysisFocus}</div>
            </div>
            <div>
              <span className="font-medium text-blue-800">Last Update:</span>
              <div className="text-blue-600">{systemStatus.lastUpdate.toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Alert for Missing Configuration */}
      {!sessionConfig.companyName && (
        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <span className="text-amber-800 text-sm">
            Please configure your competitive intelligence session to access real-time analysis features.
          </span>
        </div>
      )}
    </div>
  );
}
