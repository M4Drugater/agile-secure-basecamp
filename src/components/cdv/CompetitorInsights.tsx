
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  Users,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from 'lucide-react';

export function CompetitorInsights() {
  const marketInsights = [
    {
      category: 'Market Position',
      insight: 'You are positioned as a challenger in the workflow automation space with 8% market share',
      impact: 'medium',
      recommendation: 'Focus on differentiation through specialized features for SMB segment'
    },
    {
      category: 'Pricing Strategy',
      insight: 'Your pricing is 23% below market average, creating competitive advantage',
      impact: 'high',
      recommendation: 'Consider tiered pricing strategy to capture enterprise segment'
    },
    {
      category: 'Feature Gap',
      insight: 'AI-powered automation is becoming table stakes - 67% of competitors offer it',
      impact: 'high',
      recommendation: 'Prioritize AI features development to maintain competitive parity'
    },
    {
      category: 'Growth Opportunity',
      insight: 'Remote work segment showing 145% growth with limited competition',
      impact: 'high',
      recommendation: 'Develop remote-first features to capture emerging market'
    }
  ];

  const competitiveMatrix = [
    {
      feature: 'Enterprise Security',
      yourCompany: 85,
      competitors: [
        { name: 'TechFlow Solutions', score: 95 },
        { name: 'Enterprise Connect', score: 90 },
        { name: 'FlexiWork Hub', score: 70 }
      ]
    },
    {
      feature: 'Ease of Use',
      yourCompany: 92,
      competitors: [
        { name: 'TechFlow Solutions', score: 75 },
        { name: 'Enterprise Connect', score: 65 },
        { name: 'FlexiWork Hub', score: 88 }
      ]
    },
    {
      feature: 'Integration Ecosystem',
      yourCompany: 78,
      competitors: [
        { name: 'TechFlow Solutions', score: 85 },
        { name: 'Enterprise Connect', score: 95 },
        { name: 'FlexiWork Hub', score: 60 }
      ]
    },
    {
      feature: 'Pricing Value',
      yourCompany: 88,
      competitors: [
        { name: 'TechFlow Solutions', score: 65 },
        { name: 'Enterprise Connect', score: 60 },
        { name: 'FlexiWork Hub', score: 85 }
      ]
    }
  ];

  const threatAnalysis = [
    {
      competitor: 'TechFlow Solutions',
      threatLevel: 'high',
      reason: 'Strong enterprise presence and aggressive expansion into SMB market',
      timeframe: 'Next 6 months',
      mitigation: 'Accelerate enterprise feature development'
    },
    {
      competitor: 'Enterprise Connect',
      threatLevel: 'medium',
      reason: 'Large user base but slow innovation cycle',
      timeframe: 'Next 12 months',
      mitigation: 'Focus on innovation speed and user experience'
    },
    {
      competitor: 'FlexiWork Hub',
      threatLevel: 'low',
      reason: 'Niche player with limited resources',
      timeframe: 'Long-term',
      mitigation: 'Monitor for potential acquisition opportunities'
    }
  ];

  const getImpactColor = (impact: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[impact as keyof typeof colors];
  };

  const getThreatColor = (level: string) => {
    const colors = {
      high: 'text-red-600',
      medium: 'text-yellow-600',
      low: 'text-green-600'
    };
    return colors[level as keyof typeof colors];
  };

  return (
    <div className="space-y-6">
      {/* Strategic Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Strategic Market Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {marketInsights.map((insight, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{insight.category}</h4>
                <Badge className={getImpactColor(insight.impact)}>
                  {insight.impact} impact
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{insight.insight}</p>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium">{insight.recommendation}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Competitive Feature Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Competitive Feature Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {competitiveMatrix.map((feature, index) => (
            <div key={index} className="space-y-3">
              <h4 className="font-medium">{feature.feature}</h4>
              
              {/* Your Company */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600">Your Company</span>
                  <span className="text-sm font-medium">{feature.yourCompany}%</span>
                </div>
                <Progress value={feature.yourCompany} className="h-2" />
              </div>

              {/* Competitors */}
              {feature.competitors.map((competitor, compIndex) => (
                <div key={compIndex} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{competitor.name}</span>
                    <span className="text-sm">{competitor.score}%</span>
                  </div>
                  <Progress value={competitor.score} className="h-1" />
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Threat Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Competitive Threat Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {threatAnalysis.map((threat, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{threat.competitor}</h4>
                <Badge className={`${getThreatColor(threat.threatLevel)} border`} variant="outline">
                  {threat.threatLevel} threat
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{threat.reason}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Timeline: </span>
                  <span className="text-muted-foreground">{threat.timeframe}</span>
                </div>
                <div>
                  <span className="font-medium">Mitigation: </span>
                  <span className="text-muted-foreground">{threat.mitigation}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Market Opportunity Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Market Opportunity Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-600">78%</div>
              <div className="text-sm text-muted-foreground">Market Opportunity Score</div>
              <p className="text-xs">Strong growth potential in target segments</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">$2.4B</div>
              <div className="text-sm text-muted-foreground">Total Addressable Market</div>
              <p className="text-xs">Growing at 23% CAGR</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-purple-600">145%</div>
              <div className="text-sm text-muted-foreground">Remote Work Segment Growth</div>
              <p className="text-xs">Fastest growing market segment</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
