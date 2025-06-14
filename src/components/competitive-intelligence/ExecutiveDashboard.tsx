
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  BarChart3,
  RefreshCw,
  Download,
  Shield,
  Zap,
  Clock
} from 'lucide-react';
import { useExecutiveDashboard } from '@/hooks/competitive-intelligence/useExecutiveDashboard';

interface ExecutiveDashboardProps {
  companyContext: {
    companyName: string;
    industry: string;
    analysisFocus: string;
    objectives: string;
  };
}

export function ExecutiveDashboard({ companyContext }: ExecutiveDashboardProps) {
  const { 
    dashboardData, 
    isLoading, 
    autoRefresh, 
    setAutoRefresh,
    generateExecutiveDashboard, 
    refreshDashboard,
    exportDashboard 
  } = useExecutiveDashboard();

  const [selectedTimeframe, setSelectedTimeframe] = useState('current');

  useEffect(() => {
    if (companyContext.companyName) {
      generateExecutiveDashboard(companyContext);
    }
  }, [companyContext]);

  const MetricCard = ({ metric }: { metric: any }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
            <p className="text-2xl font-bold">{metric.value}</p>
            <div className="flex items-center gap-2">
              {metric.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : metric.trend === 'down' ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : (
                <BarChart3 className="h-4 w-4 text-gray-500" />
              )}
              <span className={`text-sm ${
                metric.trend === 'up' ? 'text-green-600' : 
                metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.change > 0 ? '+' : ''}{metric.change}
              </span>
            </div>
          </div>
          <Badge variant={
            metric.priority === 'high' ? 'destructive' : 
            metric.priority === 'medium' ? 'outline' : 'secondary'
          }>
            {metric.priority}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  const ThreatCard = ({ threat }: { threat: any }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-sm">{threat.competitor}</h4>
            <p className="text-xs text-muted-foreground">{threat.threatType}</p>
          </div>
          <Badge variant={
            threat.severity > 7 ? 'destructive' : 
            threat.severity > 5 ? 'outline' : 'secondary'
          }>
            Risk: {threat.severity}/10
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span>Probability:</span>
            <div className="flex items-center gap-2">
              <Progress value={threat.probability * 10} className="w-16 h-2" />
              <span>{threat.probability}/10</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span>Timeframe:</span>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {threat.timeframe}
            </Badge>
          </div>
          
          <div className="mt-3">
            <p className="text-xs font-medium mb-1">Impact:</p>
            <p className="text-xs text-muted-foreground">{threat.impact}</p>
          </div>
          
          <div className="mt-3">
            <p className="text-xs font-medium mb-1">Mitigation:</p>
            <div className="space-y-1">
              {threat.mitigation.map((action: string, index: number) => (
                <div key={index} className="text-xs bg-muted p-2 rounded">
                  • {action}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const OpportunityCard = ({ opportunity }: { opportunity: any }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold text-sm">{opportunity.title}</h4>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Success:</span>
            <span className="text-xs font-medium">{opportunity.probability}%</span>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3">{opportunity.description}</p>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="font-medium text-muted-foreground">Market Size:</span>
            <p>{opportunity.marketSize}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Timeline:</span>
            <p>{opportunity.timeline}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Effort:</span>
            <Badge variant="outline" className="text-xs">
              {opportunity.effort}
            </Badge>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Impact:</span>
            <Badge variant="secondary" className="text-xs">
              {opportunity.impact}
            </Badge>
          </div>
        </div>
        
        <div className="mt-3">
          <p className="text-xs font-medium mb-1">Requirements:</p>
          <div className="space-y-1">
            {opportunity.requirements.map((req: string, index: number) => (
              <div key={index} className="text-xs bg-muted p-1 rounded">
                • {req}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!dashboardData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground">Configure company context to generate executive dashboard</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Executive Intelligence Dashboard</h2>
          <p className="text-muted-foreground">
            Strategic intelligence for {companyContext.companyName}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto-refresh: {autoRefresh ? 'On' : 'Off'}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Disable' : 'Enable'} Auto-refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshDashboard(companyContext)}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportDashboard('pdf')}
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardData.kpiMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Market Intelligence Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Market Intelligence Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {dashboardData.marketIntelligence.marketGrowth}%
              </p>
              <p className="text-sm text-muted-foreground">Market Growth</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {dashboardData.marketIntelligence.competitorActivity}
              </p>
              <p className="text-sm text-muted-foreground">Competitor Activity</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {dashboardData.marketIntelligence.threatLevel}
              </p>
              <p className="text-sm text-muted-foreground">Threat Level</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {dashboardData.marketIntelligence.opportunityScore}
              </p>
              <p className="text-sm text-muted-foreground">Opportunity Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="threats" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="threats" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Competitive Threats ({dashboardData.competitiveThreats.length})
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Strategic Opportunities ({dashboardData.strategicOpportunities.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="threats">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Active Competitive Threats</h3>
              <Badge variant="outline">
                {dashboardData.competitiveThreats.filter(t => t.severity > 7).length} High Priority
              </Badge>
            </div>
            
            {dashboardData.competitiveThreats.map((threat) => (
              <ThreatCard key={threat.id} threat={threat} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="opportunities">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Strategic Opportunities</h3>
              <Badge variant="outline">
                {dashboardData.strategicOpportunities.filter(o => o.probability > 70).length} High Probability
              </Badge>
            </div>
            
            {dashboardData.strategicOpportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
