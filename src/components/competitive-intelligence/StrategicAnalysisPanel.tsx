
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Lightbulb,
  BarChart3,
  Shield,
  Zap
} from 'lucide-react';
import { useStrategicAnalysis } from '@/hooks/competitive-intelligence/useStrategicAnalysis';

interface StrategicAnalysisPanelProps {
  agentType: string;
  analysisData: any;
}

export function StrategicAnalysisPanel({ agentType, analysisData }: StrategicAnalysisPanelProps) {
  const { 
    strategicFrameworks, 
    analysisResults, 
    isAnalyzing,
    runComprehensiveAnalysis 
  } = useStrategicAnalysis();
  
  const [selectedFramework, setSelectedFramework] = useState('Porter\'s Five Forces');

  const handleRunAnalysis = async () => {
    await runComprehensiveAnalysis(analysisData, {});
  };

  const ThreatCard = ({ threat }: { threat: any }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-sm">{threat.threat}</h4>
          <Badge variant={threat.impact > 7 ? "destructive" : threat.impact > 5 ? "warning" : "secondary"}>
            Impact: {threat.impact}/10
          </Badge>
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Probability:</span>
            <Progress value={threat.probability * 10} className="w-16 h-2" />
            <span className="text-xs">{threat.probability}/10</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {threat.timeframe}
          </Badge>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Mitigation Strategies:</span>
          {threat.mitigationStrategies.map((strategy: string, index: number) => (
            <div key={index} className="text-xs bg-muted p-2 rounded">
              • {strategy}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const OpportunityCard = ({ opportunity }: { opportunity: any }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <h4 className="font-semibold text-sm mb-2">{opportunity.description}</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="font-medium text-muted-foreground">Market Size:</span>
            <p>{opportunity.marketSize}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Timeline:</span>
            <p>{opportunity.timeline}</p>
          </div>
          <div className="col-span-2">
            <span className="font-medium text-muted-foreground">Competitive Advantage:</span>
            <p>{opportunity.competitiveAdvantage}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const RecommendationCard = ({ recommendation }: { recommendation: any }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-sm">{recommendation.action}</h4>
          <Badge variant={
            recommendation.priority === 'high' ? "destructive" : 
            recommendation.priority === 'medium' ? "warning" : "secondary"
          }>
            {recommendation.priority}
          </Badge>
        </div>
        <div className="space-y-2 text-xs">
          <div>
            <span className="font-medium text-muted-foreground">Impact:</span>
            <p>{recommendation.impact}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Effort:</span>
            <p>{recommendation.effort}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Timeline:</span>
            <p>{recommendation.timeline}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Strategic Analysis Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            McKinsey-Level Strategic Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Agent: {agentType.toUpperCase()}</Badge>
              <Badge variant="outline">Framework: {selectedFramework}</Badge>
            </div>
            <Button 
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Zap className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  Run Strategic Analysis
                </>
              )}
            </Button>
          </div>

          {/* Framework Selection */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {strategicFrameworks.map((framework) => (
              <Button
                key={framework.name}
                variant={selectedFramework === framework.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFramework(framework.name)}
                className="text-xs"
              >
                {framework.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResults && (
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="threats" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Threats
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Opportunities
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Actions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Executive Summary
                  <Badge variant="secondary">
                    Confidence: {analysisResults.confidenceScore}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">
                  {analysisResults.executiveSummary}
                </p>
                
                <div>
                  <h4 className="font-semibold text-sm mb-2">Key Strategic Findings:</h4>
                  <div className="space-y-2">
                    {analysisResults.strategicFindings.map((finding, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                        <span>{finding}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="threats">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Threat Assessment Matrix
                </h3>
                <Badge variant="outline">
                  {analysisResults.threatAssessment.length} threats identified
                </Badge>
              </div>
              
              {analysisResults.threatAssessment.map((threat, index) => (
                <ThreatCard key={index} threat={threat} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="opportunities">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Strategic Opportunities
                </h3>
                <Badge variant="outline">
                  {analysisResults.opportunities.length} opportunities identified
                </Badge>
              </div>
              
              {analysisResults.opportunities.map((opportunity, index) => (
                <OpportunityCard key={index} opportunity={opportunity} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Strategic Recommendations
                </h3>
                <Badge variant="outline">
                  {analysisResults.recommendations.length} recommendations
                </Badge>
              </div>
              
              {analysisResults.recommendations.map((recommendation, index) => (
                <RecommendationCard key={index} recommendation={recommendation} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
