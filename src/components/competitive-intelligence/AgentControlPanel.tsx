
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Brain, 
  Settings, 
  Zap, 
  Shield, 
  BarChart3, 
  Clock,
  Target,
  Globe,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface AgentConfig {
  id: string;
  name: string;
  status: 'active' | 'standby' | 'offline';
  performance: number;
  lastActive: Date;
  intelligenceLevel: number;
  realTimeEnabled: boolean;
  costEfficiency: number;
}

export function AgentControlPanel() {
  const [agents, setAgents] = useState<AgentConfig[]>([
    {
      id: 'cdv',
      name: 'CDV Agent',
      status: 'active',
      performance: 94,
      lastActive: new Date(),
      intelligenceLevel: 90,
      realTimeEnabled: true,
      costEfficiency: 87
    },
    {
      id: 'cir',
      name: 'CIR Agent',
      status: 'active',
      performance: 91,
      lastActive: new Date(Date.now() - 300000), // 5 min ago
      intelligenceLevel: 95,
      realTimeEnabled: true,
      costEfficiency: 92
    },
    {
      id: 'cia',
      name: 'CIA Agent',
      status: 'active',
      performance: 96,
      lastActive: new Date(Date.now() - 120000), // 2 min ago
      intelligenceLevel: 98,
      realTimeEnabled: true,
      costEfficiency: 89
    }
  ]);

  const [systemMetrics] = useState({
    totalQueries: 1247,
    avgResponseTime: 2.3,
    dataAccuracy: 96,
    costPerQuery: 0.12,
    realTimeDataSources: 15,
    activeConnections: 8
  });

  const toggleAgentStatus = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { 
            ...agent, 
            status: agent.status === 'active' ? 'standby' : 'active',
            lastActive: new Date()
          }
        : agent
    ));
  };

  const updateIntelligenceLevel = (agentId: string, value: number[]) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, intelligenceLevel: value[0] }
        : agent
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'standby': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAgentIcon = (agentId: string) => {
    switch (agentId) {
      case 'cdv': return Target;
      case 'cir': return BarChart3;
      case 'cia': return Brain;
      default: return Settings;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6 text-blue-500" />
            Elite Agent Control Center
          </h2>
          <p className="text-muted-foreground">
            Real-time management and optimization of CI agents
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="default" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Real-Time Mode
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Enterprise Security
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agents">Agent Control</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="intelligence">Intelligence Settings</TabsTrigger>
          <TabsTrigger value="system">System Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="agents">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agents.map((agent) => {
              const Icon = getAgentIcon(agent.id);
              
              return (
                <Card key={agent.id} className="relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 ${getStatusColor(agent.status)}`} />
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                      </div>
                      <Badge 
                        variant={agent.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {agent.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">
                          {agent.performance}%
                        </div>
                        <div className="text-xs text-muted-foreground">Performance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">
                          {agent.costEfficiency}%
                        </div>
                        <div className="text-xs text-muted-foreground">Efficiency</div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Agent Status</span>
                        <Switch
                          checked={agent.status === 'active'}
                          onCheckedChange={() => toggleAgentStatus(agent.id)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Real-Time Data</span>
                        <Switch
                          checked={agent.realTimeEnabled}
                          onCheckedChange={() => {}}
                        />
                      </div>
                    </div>

                    {/* Last Activity */}
                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Last active: {agent.lastActive.toLocaleTimeString()}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Configure
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Test
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{agent.name} Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Intelligence Quality</span>
                      <span>{agent.performance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${agent.performance}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cost Efficiency</span>
                      <span>{agent.costEfficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${agent.costEfficiency}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Intelligence Level</span>
                      <span>{agent.intelligenceLevel}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${agent.intelligenceLevel}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="intelligence">
          <div className="space-y-6">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{agent.name} Intelligence Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Intelligence Level</span>
                      <span className="text-sm text-muted-foreground">
                        {agent.intelligenceLevel}%
                      </span>
                    </div>
                    <Slider
                      value={[agent.intelligenceLevel]}
                      onValueChange={(value) => updateIntelligenceLevel(agent.id, value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground">
                      Higher levels provide more sophisticated analysis but increase costs
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Response Style</label>
                      <select className="w-full p-2 border rounded text-sm">
                        <option>Executive Summary</option>
                        <option>Detailed Analysis</option>
                        <option>Quick Insights</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data Sources</label>
                      <select className="w-full p-2 border rounded text-sm">
                        <option>All Sources</option>
                        <option>Premium Only</option>
                        <option>Real-Time Only</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="system">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Query Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Queries</span>
                    <span className="font-semibold">{systemMetrics.totalQueries.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Response Time</span>
                    <span className="font-semibold">{systemMetrics.avgResponseTime}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Data Accuracy</span>
                    <span className="font-semibold">{systemMetrics.dataAccuracy}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Cost Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Cost Per Query</span>
                    <span className="font-semibold">${systemMetrics.costPerQuery}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Daily Budget</span>
                    <span className="font-semibold">$150.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Budget Used</span>
                    <span className="font-semibold text-green-600">67%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-500" />
                  Data Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Active Sources</span>
                    <span className="font-semibold">{systemMetrics.realTimeDataSources}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Live Connections</span>
                    <span className="font-semibold">{systemMetrics.activeConnections}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Source Quality</span>
                    <span className="font-semibold">98%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
