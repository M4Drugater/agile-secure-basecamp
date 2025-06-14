
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Eye, 
  Target, 
  Brain,
  Send,
  Settings,
  Play,
  Zap
} from 'lucide-react';
import { AgentChat } from './AgentChat';

interface AgentInterfaceProps {
  selectedAgent: string | null;
  onAgentSelect: (agentId: string) => void;
}

const agents = {
  cdv: {
    name: 'CDV - Competitive Data Visualization',
    icon: Eye,
    color: 'bg-blue-500',
    description: 'Specialized in transforming raw competitive data into compelling visual insights',
    capabilities: [
      'Market share visualization',
      'Competitive positioning maps',
      'Trend analysis charts',
      'Performance benchmarking',
      'Data correlation analysis'
    ]
  },
  cir: {
    name: '(CIR) COMPETITIVE INTELLIGENCE RETRIEVER',
    icon: Target,
    color: 'bg-green-500',
    description: 'Data intelligence specialist providing actual market data and metrics',
    capabilities: [
      'Domain authority estimates',
      'Traffic analysis',
      'Social media metrics',
      'Team size evaluation',
      'Content volume assessment'
    ]
  },
  cia: {
    name: 'CIA - Competitive Intelligence Analysis',
    icon: Brain,
    color: 'bg-purple-500',
    description: 'Expert in strategic analysis and competitive intelligence gathering',
    capabilities: [
      'Strategic threat assessment',
      'Market opportunity analysis',
      'Competitor profiling',
      'SWOT analysis',
      'Risk evaluation'
    ]
  }
};

export function AgentInterface({ selectedAgent, onAgentSelect }: AgentInterfaceProps) {
  const [sessionConfig, setSessionConfig] = useState({
    companyName: '',
    industry: '',
    analysisFocus: '',
    objectives: ''
  });

  if (!selectedAgent) {
    return (
      <div className="text-center py-12">
        <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Select an AI Agent</h3>
        <p className="text-muted-foreground mb-6">
          Choose a specialized competitive intelligence agent to begin your analysis
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {Object.entries(agents).map(([id, agent]) => (
            <Card key={id} className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => onAgentSelect(id)}>
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 ${agent.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <agent.icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">{agent.name}</h4>
                <p className="text-sm text-muted-foreground">{agent.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const agent = agents[selectedAgent as keyof typeof agents];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Agent Configuration */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${agent.color} rounded-full flex items-center justify-center`}>
                <agent.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <Badge variant="secondary" className="mt-1">
                  <Zap className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{agent.description}</p>
            
            <div>
              <h4 className="font-medium mb-2">Capabilities:</h4>
              <div className="space-y-1">
                {agent.capabilities.map((capability, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    {capability}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Session Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyName">Target Company</Label>
              <Input
                id="companyName"
                placeholder="Company to analyze"
                value={sessionConfig.companyName}
                onChange={(e) => setSessionConfig(prev => ({ ...prev, companyName: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select value={sessionConfig.industry} onValueChange={(value) => 
                setSessionConfig(prev => ({ ...prev, industry: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="analysisFocus">Analysis Focus</Label>
              <Select value={sessionConfig.analysisFocus} onValueChange={(value) => 
                setSessionConfig(prev => ({ ...prev, analysisFocus: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select focus area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market-share">Market Share</SelectItem>
                  <SelectItem value="pricing">Pricing Strategy</SelectItem>
                  <SelectItem value="product-features">Product Features</SelectItem>
                  <SelectItem value="marketing">Marketing Strategy</SelectItem>
                  <SelectItem value="financial">Financial Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="objectives">Objectives</Label>
              <Textarea
                id="objectives"
                placeholder="What do you want to achieve with this analysis?"
                value={sessionConfig.objectives}
                onChange={(e) => setSessionConfig(prev => ({ ...prev, objectives: e.target.value }))}
              />
            </div>

            <Button className="w-full">
              <Play className="h-4 w-4 mr-2" />
              Start Analysis Session
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Agent Chat Interface */}
      <div className="lg:col-span-2">
        <AgentChat agentId={selectedAgent} sessionConfig={sessionConfig} />
      </div>
    </div>
  );
}
