
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Zap,
  Globe,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useRealTimeWebSearch } from '@/hooks/competitive-intelligence/useRealTimeWebSearch';

interface RealTimeIntelligencePanelProps {
  companyName: string;
  industry: string;
}

export function RealTimeIntelligencePanel({ companyName, industry }: RealTimeIntelligencePanelProps) {
  const [activeSearch, setActiveSearch] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  const {
    isLoading,
    searchResults,
    searchCompetitiveNews,
    searchMarketTrends,
    searchFinancialUpdates,
    clearResults
  } = useRealTimeWebSearch();

  const intelligenceTypes = [
    {
      id: 'competitive',
      title: 'Competitive Intelligence',
      description: 'Latest competitive moves and market positioning',
      icon: Target,
      action: () => searchCompetitiveNews(companyName, industry),
      color: 'bg-blue-500'
    },
    {
      id: 'financial',
      title: 'Financial Intelligence',
      description: 'Financial performance and market metrics',
      icon: TrendingUp,
      action: () => searchFinancialUpdates(companyName, industry),
      color: 'bg-green-500'
    },
    {
      id: 'market',
      title: 'Market Intelligence',
      description: 'Industry trends and market dynamics',
      icon: Globe,
      action: () => searchMarketTrends(industry),
      color: 'bg-purple-500'
    }
  ];

  const handleIntelligenceSearch = async (type: string, searchFunction: () => Promise<any>) => {
    setActiveSearch(type);
    try {
      await searchFunction();
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Intelligence search failed:', error);
    } finally {
      setActiveSearch(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-500" />
            Real-Time Intelligence Center
          </h2>
          <p className="text-muted-foreground">
            Live competitive intelligence for {companyName} in {industry}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Last update: {lastUpdate.toLocaleTimeString()}
          </Badge>
          {searchResults && (
            <Badge variant="default" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Data Quality: {searchResults.metadata?.dataConfidence || 0}%
            </Badge>
          )}
        </div>
      </div>

      {/* Intelligence Search Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {intelligenceTypes.map((type) => {
          const Icon = type.icon;
          const isSearching = activeSearch === type.id;
          
          return (
            <Card key={type.id} className="cursor-pointer hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <Button
                  onClick={() => handleIntelligenceSearch(type.id, type.action)}
                  disabled={isSearching || isLoading}
                  className="w-full h-auto p-4 flex flex-col items-center gap-3"
                  variant="outline"
                >
                  <div className={`w-12 h-12 rounded-full ${type.color} flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{type.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {type.description}
                    </div>
                  </div>
                  {isSearching && (
                    <div className="flex items-center gap-2 text-xs">
                      <div className="animate-spin w-3 h-3 border border-current border-t-transparent rounded-full" />
                      Searching...
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Intelligence Results */}
      {searchResults && (
        <Tabs defaultValue="intelligence" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="intelligence">Intelligence Data</TabsTrigger>
            <TabsTrigger value="insights">Key Insights</TabsTrigger>
            <TabsTrigger value="threats">Threats</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          </TabsList>

          <TabsContent value="intelligence">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Live Intelligence Data
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  {searchResults.metadata?.sources?.map((source, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {source}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="prose max-w-none">
                    <h4>Real-Time Market Intelligence</h4>
                    <div className="whitespace-pre-wrap text-sm">
                      {searchResults.searchResults.webData}
                    </div>
                  </div>
                  
                  {searchResults.searchResults.strategicAnalysis && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Strategic Analysis</h4>
                      <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {searchResults.searchResults.strategicAnalysis}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.insights?.map((insight, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{insight.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {insight.description}
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          Confidence: {insight.confidence}%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="threats">
            <div className="space-y-4">
              {searchResults.threats?.map((threat, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold">{threat.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {threat.description}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="destructive" className="text-xs">
                            {threat.severity} severity
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {threat.likelihood} likelihood
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="opportunities">
            <div className="space-y-4">
              {searchResults.opportunities?.map((opportunity, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold">{opportunity.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {opportunity.description}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="default" className="text-xs bg-green-600">
                            {opportunity.potential} potential
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {opportunity.timeframe}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Data Quality Metrics */}
      {searchResults?.metadata && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Intelligence Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {searchResults.metadata.dataConfidence}%
                </div>
                <div className="text-xs text-muted-foreground">Data Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {searchResults.metadata.sources?.length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Sources</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {searchResults.metrics?.sourceCount || 0}
                </div>
                <div className="text-xs text-muted-foreground">Validated Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {searchResults.searchResults.relatedQuestions?.length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Related Topics</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
