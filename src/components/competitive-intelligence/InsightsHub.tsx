
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Lightbulb, 
  Search, 
  Filter,
  TrendingUp,
  AlertTriangle,
  Target,
  Clock,
  ArrowRight
} from 'lucide-react';

// Mock insights data
const mockInsights = [
  {
    id: '1',
    title: 'Market Share Opportunity in Mobile Segment',
    description: 'Analysis reveals a 15% market share gap in the premium mobile segment that Apple could capture through targeted product positioning.',
    category: 'Market Analysis',
    impactLevel: 'high',
    urgencyLevel: 'medium',
    agentType: 'cia',
    confidenceScore: 85,
    tags: ['market-share', 'mobile', 'premium-segment'],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Pricing Strategy Vulnerability Detected',
    description: 'Competitor analysis shows Tesla\'s pricing model has a vulnerability in the mid-range EV market, presenting a strategic opportunity.',
    category: 'Pricing Strategy',
    impactLevel: 'critical',
    urgencyLevel: 'high',
    agentType: 'cdv',
    confidenceScore: 92,
    tags: ['pricing', 'vulnerability', 'strategy'],
    createdAt: new Date('2024-01-14')
  },
  {
    id: '3',
    title: 'Innovation Gap in AI Integration',
    description: 'Competitive intelligence reveals significant gaps in AI integration across traditional automotive manufacturers.',
    category: 'Technology Analysis',
    impactLevel: 'medium',
    urgencyLevel: 'low',
    agentType: 'cir',
    confidenceScore: 78,
    tags: ['ai', 'innovation', 'automotive'],
    createdAt: new Date('2024-01-13')
  }
];

const impactColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

const urgencyColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  immediate: 'bg-red-100 text-red-800'
};

export function InsightsHub() {
  const [insights] = useState(mockInsights);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [impactFilter, setImpactFilter] = useState('all');

  const filteredInsights = insights.filter(insight => {
    const matchesSearch = insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insight.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || insight.category === categoryFilter;
    const matchesImpact = impactFilter === 'all' || insight.impactLevel === impactFilter;
    
    return matchesSearch && matchesCategory && matchesImpact;
  });

  const getImpactIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Target className="h-4 w-4 text-yellow-500" />;
      default: return <Lightbulb className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Intelligence Insights</h2>
          <p className="text-muted-foreground">Actionable insights from your competitive analysis</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-3 py-1">
            {filteredInsights.length} Insights
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search insights..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Market Analysis">Market Analysis</SelectItem>
            <SelectItem value="Pricing Strategy">Pricing Strategy</SelectItem>
            <SelectItem value="Technology Analysis">Technology Analysis</SelectItem>
          </SelectContent>
        </Select>

        <Select value={impactFilter} onValueChange={setImpactFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Impact Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Impact Levels</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredInsights.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No insights found</h3>
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== 'all' || impactFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Start analyzing competitors to generate insights'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredInsights.map((insight) => (
            <Card key={insight.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      {getImpactIcon(insight.impactLevel)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{insight.title}</h3>
                        <p className="text-muted-foreground mb-3">{insight.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {insight.createdAt.toLocaleDateString()}
                      </span>
                      <span>Agent: {insight.agentType.toUpperCase()}</span>
                      <span>Confidence: {insight.confidenceScore}%</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={impactColors[insight.impactLevel as keyof typeof impactColors]}>
                        {insight.impactLevel} impact
                      </Badge>
                      <Badge className={urgencyColors[insight.urgencyLevel as keyof typeof urgencyColors]}>
                        {insight.urgencyLevel} urgency
                      </Badge>
                      <Badge variant="outline">{insight.category}</Badge>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {insight.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
