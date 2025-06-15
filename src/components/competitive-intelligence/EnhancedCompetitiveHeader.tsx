
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Globe, 
  Zap, 
  Clock, 
  Eye, 
  Brain, 
  Activity,
  TrendingUp,
  Shield,
  Star
} from 'lucide-react';

interface SessionConfig {
  companyName: string;
  industry: string;
  analysisFocus: string;
  objectives: string;
}

interface EnhancedCompetitiveHeaderProps {
  selectedAgent: string;
  sessionConfig: SessionConfig;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const agentDetails = {
  cdv: {
    name: 'Competitor Discovery & Validation',
    icon: Eye,
    color: 'bg-blue-600',
    description: 'Advanced threat detection and competitive landscape mapping',
    frameworks: ['Porter\'s Five Forces', 'Threat Matrix', 'Competitive Positioning']
  },
  cir: {
    name: 'Competitive Intelligence Retrieval',
    icon: Activity,
    color: 'bg-green-600',
    description: 'Real-time market data and financial intelligence gathering',
    frameworks: ['Financial Analysis', 'Market Benchmarking', 'Performance Metrics']
  },
  cia: {
    name: 'Competitive Intelligence Analysis',
    icon: Brain,
    color: 'bg-purple-600',
    description: 'Strategic analysis and executive decision support',
    frameworks: ['McKinsey 7-S', '3-Horizons Planning', 'Strategic Options']
  }
};

const tabConfig = [
  { id: 'realtime', label: 'Real-Time Intel', icon: Globe, description: 'Live market intelligence' },
  { id: 'chat', label: 'Agent Analysis', icon: Brain, description: 'AI-powered insights' },
  { id: 'analysis', label: 'Strategic Analysis', icon: TrendingUp, description: 'Framework-based analysis' },
  { id: 'dashboard', label: 'Executive Dashboard', icon: Shield, description: 'C-suite ready insights' },
  { id: 'monitoring', label: 'Continuous Monitoring', icon: Clock, description: 'Automated tracking' },
  { id: 'config', label: 'Configuration', icon: Activity, description: 'Setup & preferences' }
];

export function EnhancedCompetitiveHeader({ 
  selectedAgent, 
  sessionConfig, 
  activeTab, 
  onTabChange 
}: EnhancedCompetitiveHeaderProps) {
  const currentAgent = agentDetails[selectedAgent as keyof typeof agentDetails];
  const AgentIcon = currentAgent?.icon;

  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 ${currentAgent?.color} rounded-xl flex items-center justify-center shadow-lg`}>
            <AgentIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {currentAgent?.name}
            </h1>
            <p className="text-gray-600 mt-1">
              {currentAgent?.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {currentAgent?.frameworks.map((framework) => (
                <Badge key={framework} variant="secondary" className="text-xs">
                  {framework}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="default" className="flex items-center gap-1 px-3 py-1">
            <Zap className="h-3 w-3" />
            McKinsey-Level Analysis
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
            <Globe className="h-3 w-3" />
            Real-Time Intelligence
          </Badge>
          <Badge className="bg-green-600 flex items-center gap-1 px-3 py-1">
            <Star className="h-3 w-3" />
            Enterprise Ready
          </Badge>
        </div>
      </div>

      {/* Session Context Card */}
      {sessionConfig.companyName && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-sm font-medium text-gray-600">Target Company</span>
                  <div className="text-lg font-bold text-gray-900">{sessionConfig.companyName}</div>
                </div>
                {sessionConfig.industry && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Industry</span>
                    <div className="text-lg font-semibold text-gray-800">{sessionConfig.industry}</div>
                  </div>
                )}
                {sessionConfig.analysisFocus && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Focus Area</span>
                    <div className="text-lg font-semibold text-gray-800">{sessionConfig.analysisFocus}</div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Active Session</Badge>
                <Clock className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Navigation Tabs */}
      <div className="grid grid-cols-6 gap-2">
        {tabConfig.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "outline"}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-2 h-20 p-3 transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg scale-105' 
                  : 'hover:bg-gray-50 hover:scale-102'
              }`}
            >
              <TabIcon className="h-5 w-5" />
              <div className="text-center">
                <div className="text-xs font-medium">{tab.label}</div>
                <div className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                  {tab.description}
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
