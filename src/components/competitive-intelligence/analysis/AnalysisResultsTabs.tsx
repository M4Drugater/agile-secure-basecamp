
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  AlertTriangle, 
  Target, 
  Lightbulb,
  TrendingUp,
  Shield
} from 'lucide-react';
import { ThreatCard } from './ThreatCard';
import { OpportunityCard } from './OpportunityCard';
import { RecommendationCard } from './RecommendationCard';

interface AnalysisResultsTabsProps {
  analysisResults: {
    executiveSummary: string;
    strategicFindings: string[];
    threatAssessment: any[];
    opportunities: any[];
    recommendations: any[];
    confidenceScore: number;
  };
}

export function AnalysisResultsTabs({ analysisResults }: AnalysisResultsTabsProps) {
  return (
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
  );
}
