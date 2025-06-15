
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  BarChart3
} from 'lucide-react';

interface StrategicDecision {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeline: string;
  requiredActions: string[];
  riskFactors: string[];
  successMetrics: string[];
  aiRecommendation: string;
  status: 'pending' | 'approved' | 'implemented' | 'rejected';
}

export function StrategicDecisionEngine() {
  const [decisions, setDecisions] = useState<StrategicDecision[]>([
    {
      id: '1',
      title: 'Market Entry Strategy - Southeast Asia',
      description: 'AI analysis suggests optimal timing for market expansion based on competitive landscape analysis',
      priority: 'high',
      confidence: 94,
      impact: 'high',
      timeline: '6-8 months',
      requiredActions: [
        'Conduct detailed market research in target countries',
        'Establish local partnerships',
        'Adapt product offerings for regional preferences',
        'Develop localized marketing strategy'
      ],
      riskFactors: [
        'Regulatory compliance complexity',
        'Currency fluctuation risks',
        'Cultural adaptation challenges',
        'Local competitor responses'
      ],
      successMetrics: [
        'Market share of 5% within 18 months',
        'Revenue growth of $10M in first year',
        'Customer acquisition rate of 1,000/month',
        'Brand recognition of 15% within 2 years'
      ],
      aiRecommendation: 'Based on competitive intelligence and market analysis, this is an optimal timing for expansion. Market gaps identified with low competitive density.',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Strategic Partnership with TechCorp',
      description: 'AI identifies synergistic opportunities for technology integration and market access',
      priority: 'high',
      confidence: 87,
      impact: 'high',
      timeline: '3-4 months',
      requiredActions: [
        'Initiate formal partnership discussions',
        'Conduct due diligence assessment',
        'Negotiate partnership terms',
        'Develop integration roadmap'
      ],
      riskFactors: [
        'Intellectual property concerns',
        'Cultural misalignment',
        'Integration complexity',
        'Market overlap conflicts'
      ],
      successMetrics: [
        'Joint product launch within 12 months',
        'Combined revenue increase of 25%',
        'Technology integration success rate >90%',
        'Customer satisfaction scores >4.5/5'
      ],
      aiRecommendation: 'Strong strategic fit identified. Partnership would accelerate innovation capabilities and market reach.',
      status: 'pending'
    }
  ]);

  const [selectedDecision, setSelectedDecision] = useState<StrategicDecision | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const updateDecisionStatus = (decisionId: string, newStatus: StrategicDecision['status']) => {
    setDecisions(prev => prev.map(decision => 
      decision.id === decisionId ? { ...decision, status: newStatus } : decision
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-500" />
            Strategic Decision Engine
          </h2>
          <p className="text-muted-foreground">
            AI-powered strategic recommendations based on competitive intelligence
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="default" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            AI-Enhanced
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            {decisions.filter(d => d.status === 'pending').length} Pending
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Decisions List */}
        <div className="lg:col-span-2 space-y-4">
          {decisions.map((decision) => (
            <Card 
              key={decision.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedDecision?.id === decision.id ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => setSelectedDecision(decision)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{decision.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {decision.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge 
                      variant="secondary"
                      className={`${getPriorityColor(decision.priority)} text-white`}
                    >
                      {decision.priority} priority
                    </Badge>
                    <Badge variant="outline">
                      {decision.confidence}% confidence
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Target className={`h-4 w-4 ${getImpactColor(decision.impact)}`} />
                      <span className="text-sm">{decision.impact} impact</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{decision.timeline}</span>
                    </div>
                  </div>
                  
                  <Badge 
                    variant={decision.status === 'pending' ? 'secondary' : 'default'}
                    className="capitalize"
                  >
                    {decision.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Decision Details */}
        <div className="space-y-4">
          {selectedDecision ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Decision Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                    <TabsTrigger value="risks">Risks</TabsTrigger>
                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">AI Recommendation</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedDecision.aiRecommendation}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium">Confidence</span>
                        <div className="text-lg font-bold text-green-600">
                          {selectedDecision.confidence}%
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Timeline</span>
                        <div className="text-lg font-bold">
                          {selectedDecision.timeline}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => updateDecisionStatus(selectedDecision.id, 'approved')}
                        disabled={selectedDecision.status !== 'pending'}
                        className="flex-1"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => updateDecisionStatus(selectedDecision.id, 'rejected')}
                        disabled={selectedDecision.status !== 'pending'}
                        className="flex-1"
                      >
                        Reject
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="actions" className="space-y-2">
                    {selectedDecision.requiredActions.map((action, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{action}</span>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="risks" className="space-y-2">
                    {selectedDecision.riskFactors.map((risk, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm">{risk}</span>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="metrics" className="space-y-2">
                    {selectedDecision.successMetrics.map((metric, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{metric}</span>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Decision</h3>
                <p className="text-muted-foreground">
                  Choose a strategic decision to view detailed analysis and recommendations.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
