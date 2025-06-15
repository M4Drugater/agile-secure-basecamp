
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Users,
  Zap,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface RevenueOpportunity {
  id: string;
  title: string;
  description: string;
  potentialRevenue: number;
  confidenceLevel: number;
  timeToImplement: string;
  difficulty: 'low' | 'medium' | 'high';
  category: 'pricing' | 'product' | 'market' | 'customer';
  requiredInvestment: number;
  roi: number;
  status: 'identified' | 'analyzing' | 'implementing' | 'completed';
}

interface PricingScenario {
  id: string;
  name: string;
  currentPrice: number;
  suggestedPrice: number;
  impactAnalysis: {
    revenueChange: number;
    demandChange: number;
    competitiveResponse: string;
  };
  riskLevel: 'low' | 'medium' | 'high';
}

export function RevenueOptimization() {
  const [opportunities] = useState<RevenueOpportunity[]>([
    {
      id: '1',
      title: 'Premium Tier Pricing Strategy',
      description: 'Introduce high-value premium tier with advanced features based on customer demand analysis',
      potentialRevenue: 2400000,
      confidenceLevel: 89,
      timeToImplement: '3-4 months',
      difficulty: 'medium',
      category: 'pricing',
      requiredInvestment: 150000,
      roi: 1600,
      status: 'identified'
    },
    {
      id: '2',
      title: 'Enterprise Customer Expansion',
      description: 'Target Fortune 500 companies with customized enterprise solutions',
      potentialRevenue: 5200000,
      confidenceLevel: 82,
      timeToImplement: '6-8 months',
      difficulty: 'high',
      category: 'customer',
      requiredInvestment: 800000,
      roi: 650,
      status: 'analyzing'
    },
    {
      id: '3',
      title: 'Add-on Services Revenue',
      description: 'Develop complementary services and consultation offerings',
      potentialRevenue: 1800000,
      confidenceLevel: 94,
      timeToImplement: '2-3 months',
      difficulty: 'low',
      category: 'product',
      requiredInvestment: 100000,
      roi: 1800,
      status: 'implementing'
    },
    {
      id: '4',
      title: 'Geographic Market Expansion',
      description: 'Enter high-growth emerging markets with localized offerings',
      potentialRevenue: 3600000,
      confidenceLevel: 76,
      timeToImplement: '8-12 months',
      difficulty: 'high',
      category: 'market',
      requiredInvestment: 650000,
      roi: 554,
      status: 'identified'
    }
  ]);

  const [pricingScenarios] = useState<PricingScenario[]>([
    {
      id: '1',
      name: 'Premium Positioning',
      currentPrice: 99,
      suggestedPrice: 129,
      impactAnalysis: {
        revenueChange: 22.5,
        demandChange: -8.2,
        competitiveResponse: 'Competitors likely to maintain current pricing due to cost constraints'
      },
      riskLevel: 'medium'
    },
    {
      id: '2',
      name: 'Value-Based Pricing',
      currentPrice: 99,
      suggestedPrice: 149,
      impactAnalysis: {
        revenueChange: 35.8,
        demandChange: -15.3,
        competitiveResponse: 'Moderate competitive price adjustments expected within 6 months'
      },
      riskLevel: 'high'
    },
    {
      id: '3',
      name: 'Market Penetration',
      currentPrice: 99,
      suggestedPrice: 79,
      impactAnalysis: {
        revenueChange: -12.4,
        demandChange: 28.6,
        competitiveResponse: 'Aggressive competitive response likely, potential price war'
      },
      riskLevel: 'high'
    }
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'pricing': return 'bg-blue-500';
      case 'product': return 'bg-purple-500';
      case 'market': return 'bg-green-500';
      case 'customer': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'identified': return 'bg-gray-500';
      case 'analyzing': return 'bg-blue-500';
      case 'implementing': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalPotentialRevenue = opportunities.reduce((sum, opp) => sum + opp.potentialRevenue, 0);
  const averageROI = opportunities.reduce((sum, opp) => sum + opp.roi, 0) / opportunities.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-500" />
            Revenue Optimization Engine
          </h2>
          <p className="text-muted-foreground">
            AI-powered revenue growth opportunities and pricing optimization
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="default" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            AI-Optimized
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {formatCurrency(totalPotentialRevenue)} Potential
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalPotentialRevenue)}
            </div>
            <div className="text-sm text-muted-foreground">Total Opportunity</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {averageROI.toFixed(0)}%
            </div>
            <div className="text-sm text-muted-foreground">Average ROI</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {opportunities.length}
            </div>
            <div className="text-sm text-muted-foreground">Opportunities</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">
              {opportunities.filter(o => o.status === 'implementing').length}
            </div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="opportunities">Revenue Opportunities</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Scenarios</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {opportunities.map((opportunity) => (
              <Card key={opportunity.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {opportunity.description}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge 
                        variant="secondary"
                        className={`${getCategoryColor(opportunity.category)} text-white text-xs`}
                      >
                        {opportunity.category}
                      </Badge>
                      <Badge 
                        variant="outline"
                        className={`${getStatusColor(opportunity.status)} text-white text-xs`}
                      >
                        {opportunity.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Revenue Potential */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Revenue Potential</span>
                      <div className="text-xl font-bold text-green-600">
                        {formatCurrency(opportunity.potentialRevenue)}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">ROI</span>
                      <div className="text-xl font-bold text-blue-600">
                        {opportunity.roi}%
                      </div>
                    </div>
                  </div>

                  {/* Investment and Timeline */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Investment</span>
                      <div className="font-semibold">
                        {formatCurrency(opportunity.requiredInvestment)}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Timeline</span>
                      <div className="font-semibold">
                        {opportunity.timeToImplement}
                      </div>
                    </div>
                  </div>

                  {/* Confidence and Difficulty */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Confidence:</span>
                      <Badge variant="outline">{opportunity.confidenceLevel}%</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Difficulty:</span>
                      <Badge 
                        variant="secondary"
                        className={`${getDifficultyColor(opportunity.difficulty)} text-white`}
                      >
                        {opportunity.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    variant={opportunity.status === 'identified' ? 'default' : 'outline'}
                  >
                    {opportunity.status === 'identified' ? 'Start Analysis' : 'View Details'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pricing">
          <div className="space-y-6">
            {pricingScenarios.map((scenario) => (
              <Card key={scenario.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{scenario.name}</CardTitle>
                    <Badge 
                      variant="outline"
                      className={`${
                        scenario.riskLevel === 'high' ? 'text-red-600' :
                        scenario.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`}
                    >
                      {scenario.riskLevel} risk
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Price Comparison */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <span className="text-sm text-muted-foreground">Current Price</span>
                      <div className="text-2xl font-bold">
                        ${scenario.currentPrice}
                      </div>
                    </div>
                    <div className="text-center flex items-center justify-center">
                      {scenario.suggestedPrice > scenario.currentPrice ? (
                        <ArrowUpRight className="h-8 w-8 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-8 w-8 text-red-500" />
                      )}
                    </div>
                    <div className="text-center">
                      <span className="text-sm text-muted-foreground">Suggested Price</span>
                      <div className="text-2xl font-bold text-blue-600">
                        ${scenario.suggestedPrice}
                      </div>
                    </div>
                  </div>

                  {/* Impact Analysis */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Revenue Impact</span>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {scenario.impactAnalysis.revenueChange > 0 ? '+' : ''}
                        {scenario.impactAnalysis.revenueChange.toFixed(1)}%
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Demand Impact</span>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {scenario.impactAnalysis.demandChange > 0 ? '+' : ''}
                        {scenario.impactAnalysis.demandChange.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Competitive Response */}
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-1">Competitive Response</h4>
                    <p className="text-sm text-yellow-700">
                      {scenario.impactAnalysis.competitiveResponse}
                    </p>
                  </div>

                  <Button className="w-full">
                    Simulate Scenario
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
