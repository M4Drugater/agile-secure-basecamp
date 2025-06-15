
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Target,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { StrategicDecisionEngine } from '../business-intelligence/StrategicDecisionEngine';
import { PredictiveAnalytics } from '../business-intelligence/PredictiveAnalytics';
import { RevenueOptimization } from '../business-intelligence/RevenueOptimization';

export function BusinessIntelligenceDashboard() {
  const [activeTab, setActiveTab] = useState('strategic');

  const systemMetrics = {
    decisionsProcessed: 47,
    revenueOptimized: 8400000,
    predictionsGenerated: 156,
    confidenceLevel: 94
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            AI Business Intelligence Center
          </h1>
          <p className="text-muted-foreground mt-2">
            Enterprise-grade AI-powered business intelligence and strategic decision support
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="default" className="flex items-center gap-1 bg-purple-600">
            <Lightbulb className="h-3 w-3" />
            Phase 2 Active
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            {systemMetrics.confidenceLevel}% AI Confidence
          </Badge>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {systemMetrics.decisionsProcessed}
            </div>
            <div className="text-sm text-muted-foreground">Strategic Decisions</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              ${(systemMetrics.revenueOptimized / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-muted-foreground">Revenue Optimized</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {systemMetrics.predictionsGenerated}
            </div>
            <div className="text-sm text-muted-foreground">Predictions Generated</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">
              {systemMetrics.confidenceLevel}%
            </div>
            <div className="text-sm text-muted-foreground">AI Confidence</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Business Intelligence Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="strategic" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Strategic Decisions
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Predictive Analytics
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Revenue Optimization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="strategic" className="space-y-6">
          <StrategicDecisionEngine />
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <PredictiveAnalytics />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <RevenueOptimization />
        </TabsContent>
      </Tabs>
    </div>
  );
}
