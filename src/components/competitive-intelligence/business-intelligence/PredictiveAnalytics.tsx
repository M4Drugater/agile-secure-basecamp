
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface PredictionMetric {
  id: string;
  title: string;
  currentValue: number;
  predictedValue: number;
  change: number;
  confidence: number;
  timeframe: string;
  category: 'revenue' | 'market_share' | 'customer' | 'competitive';
  trend: 'up' | 'down' | 'stable';
  riskLevel: 'low' | 'medium' | 'high';
}

interface MarketScenario {
  id: string;
  name: string;
  probability: number;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  keyFactors: string[];
  expectedOutcome: string;
}

export function PredictiveAnalytics() {
  const [predictions] = useState<PredictionMetric[]>([
    {
      id: '1',
      title: 'Revenue Growth',
      currentValue: 150,
      predictedValue: 187,
      change: 24.7,
      confidence: 92,
      timeframe: '6 months',
      category: 'revenue',
      trend: 'up',
      riskLevel: 'low'
    },
    {
      id: '2',
      title: 'Market Share',
      currentValue: 23.5,
      predictedValue: 28.2,
      change: 20.0,
      confidence: 87,
      timeframe: '12 months',
      category: 'market_share',
      trend: 'up',
      riskLevel: 'medium'
    },
    {
      id: '3',
      title: 'Customer Acquisition Cost',
      currentValue: 125,
      predictedValue: 98,
      change: -21.6,
      confidence: 89,
      timeframe: '9 months',
      category: 'customer',
      trend: 'down',
      riskLevel: 'low'
    },
    {
      id: '4',
      title: 'Competitive Pressure Index',
      currentValue: 67,
      predictedValue: 74,
      change: 10.4,
      confidence: 83,
      timeframe: '6 months',
      category: 'competitive',
      trend: 'up',
      riskLevel: 'high'
    }
  ]);

  const [scenarios] = useState<MarketScenario[]>([
    {
      id: '1',
      name: 'Aggressive Market Expansion',
      probability: 34,
      impact: 'positive',
      description: 'New market entry by key competitor triggers industry expansion',
      keyFactors: [
        'Competitor announces $50M expansion budget',
        'Regulatory environment becomes more favorable',
        'Consumer demand increases by 15%'
      ],
      expectedOutcome: 'Market size increases by 25%, creating opportunities for all players'
    },
    {
      id: '2',
      name: 'Economic Downturn Impact',
      probability: 28,
      impact: 'negative',
      description: 'Economic uncertainty reduces consumer spending in our sector',
      keyFactors: [
        'GDP growth slows to <2%',
        'Consumer confidence index drops',
        'B2B spending cuts of 10-15%'
      ],
      expectedOutcome: 'Overall market contraction of 12%, increased price competition'
    },
    {
      id: '3',
      name: 'Technology Disruption',
      probability: 22,
      impact: 'positive',
      description: 'AI advancement creates new product categories and opportunities',
      keyFactors: [
        'Breakthrough in AI capabilities',
        'Cost of technology decreases by 40%',
        'Regulatory approval for new applications'
      ],
      expectedOutcome: 'New market segment worth $2B emerges within 18 months'
    }
  ]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'revenue': return 'bg-green-500';
      case 'market_share': return 'bg-blue-500';
      case 'customer': return 'bg-purple-500';
      case 'competitive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'negative': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-500" />
            Predictive Analytics Engine
          </h2>
          <p className="text-muted-foreground">
            AI-powered predictions and scenario analysis for strategic planning
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="default" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Real-Time Predictions
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            92% Avg Confidence
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="predictions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="predictions">Key Predictions</TabsTrigger>
          <TabsTrigger value="scenarios">Market Scenarios</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {predictions.map((prediction) => (
              <Card key={prediction.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{prediction.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(prediction.trend)}
                      <Badge 
                        variant="secondary"
                        className={`${getCategoryColor(prediction.category)} text-white`}
                      >
                        {prediction.category.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Current vs Predicted Values */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Current</span>
                      <div className="text-2xl font-bold">
                        {prediction.category === 'revenue' ? '$' : ''}
                        {prediction.currentValue}
                        {prediction.category === 'market_share' ? '%' : ''}
                        {prediction.category === 'customer' ? ' CAC' : ''}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Predicted</span>
                      <div className="text-2xl font-bold text-blue-600">
                        {prediction.category === 'revenue' ? '$' : ''}
                        {prediction.predictedValue}
                        {prediction.category === 'market_share' ? '%' : ''}
                        {prediction.category === 'customer' ? ' CAC' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Change Percentage */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Expected Change</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${prediction.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {prediction.change > 0 ? '+' : ''}{prediction.change.toFixed(1)}%
                      </span>
                      <span className="text-sm text-muted-foreground">
                        in {prediction.timeframe}
                      </span>
                    </div>
                  </div>

                  {/* Confidence and Risk */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Confidence:</span>
                      <Badge variant="outline">{prediction.confidence}%</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Risk:</span>
                      <Badge 
                        variant="secondary"
                        className={getRiskColor(prediction.riskLevel)}
                      >
                        {prediction.riskLevel}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scenarios">
          <div className="space-y-4">
            {scenarios.map((scenario) => (
              <Card key={scenario.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{scenario.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getImpactIcon(scenario.impact)}
                      <Badge variant="outline">
                        {scenario.probability}% probability
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {scenario.description}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Key Factors */}
                  <div>
                    <h4 className="font-semibold mb-2">Key Factors</h4>
                    <div className="space-y-1">
                      {scenario.keyFactors.map((factor, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          {factor}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expected Outcome */}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-1">Expected Outcome</h4>
                    <p className="text-sm text-blue-700">
                      {scenario.expectedOutcome}
                    </p>
                  </div>

                  {/* Probability Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Probability</span>
                      <span className="font-semibold">{scenario.probability}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${scenario.probability}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
