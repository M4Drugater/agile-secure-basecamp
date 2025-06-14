
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRealTimeWebSearch } from '@/hooks/competitive-intelligence/useRealTimeWebSearch';
import { 
  Search, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  Target, 
  Zap,
  Clock,
  Globe,
  BarChart3
} from 'lucide-react';

interface RealTimeIntelligencePanelProps {
  companyName: string;
  industry: string;
}

export function RealTimeIntelligencePanel({ companyName, industry }: RealTimeIntelligencePanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'news' | 'financial' | 'competitive' | 'market' | 'regulatory'>('competitive');
  const [timeframe, setTimeframe] = useState<'hour' | 'day' | 'week' | 'month' | 'quarter'>('week');

  const webSearch = useRealTimeWebSearch();

  const handleWebSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      await webSearch.performWebSearch({
        query: searchQuery,
        companyName,
        industry,
        searchType,
        timeframe
      });
    } catch (error) {
      console.error('Web search failed:', error);
    }
  };

  const handleQuickSearch = async (type: 'news' | 'market' | 'regulatory' | 'financial') => {
    setSearchType(type);
    const queries = {
      news: `latest news announcements ${companyName}`,
      market: `market trends analysis ${industry}`,
      regulatory: `regulatory changes compliance ${industry}`,
      financial: `financial results earnings revenue ${companyName}`
    };
    
    setSearchQuery(queries[type]);
    
    try {
      await webSearch.performWebSearch({
        query: queries[type],
        companyName,
        industry,
        searchType: type,
        timeframe
      });
    } catch (error) {
      console.error('Quick search failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-600" />
            Real-Time Competitive Intelligence
          </h2>
          <p className="text-muted-foreground">
            Live web search and market analysis powered by Perplexity for {companyName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Live Data
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Real-Time
          </Badge>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button
          variant="outline"
          onClick={() => handleQuickSearch('news')}
          disabled={webSearch.isLoading}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Latest News
        </Button>
        <Button
          variant="outline"
          onClick={() => handleQuickSearch('financial')}
          disabled={webSearch.isLoading}
          className="flex items-center gap-2"
        >
          <DollarSign className="h-4 w-4" />
          Financial Data
        </Button>
        <Button
          variant="outline"
          onClick={() => handleQuickSearch('market')}
          disabled={webSearch.isLoading}
          className="flex items-center gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          Market Trends
        </Button>
        <Button
          variant="outline"
          onClick={() => handleQuickSearch('regulatory')}
          disabled={webSearch.isLoading}
          className="flex items-center gap-2"
        >
          <AlertTriangle className="h-4 w-4" />
          Regulatory Updates
        </Button>
      </div>

      {/* Main Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Real-Time Intelligence Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search-query">Search Query</Label>
              <Input
                id="search-query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter your search query..."
                onKeyPress={(e) => e.key === 'Enter' && handleWebSearch()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="search-type">Search Type</Label>
              <Select value={searchType} onValueChange={(value: any) => setSearchType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="competitive">Competitive Analysis</SelectItem>
                  <SelectItem value="news">News & Announcements</SelectItem>
                  <SelectItem value="financial">Financial Updates</SelectItem>
                  <SelectItem value="market">Market Trends</SelectItem>
                  <SelectItem value="regulatory">Regulatory Changes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select value={timeframe} onValueChange={(value: any) => setTimeframe(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hour">Last Hour</SelectItem>
                  <SelectItem value="day">Last 24 Hours</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button 
            onClick={handleWebSearch} 
            disabled={webSearch.isLoading || !searchQuery.trim()}
            className="w-full"
          >
            {webSearch.isLoading ? (
              <>
                <Search className="h-4 w-4 mr-2 animate-spin" />
                Searching Real-Time Data...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Intelligence
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Search Results */}
      {webSearch.searchResults && (
        <div className="space-y-4">
          {/* Key Insights */}
          {webSearch.searchResults.insights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Key Intelligence Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {webSearch.searchResults.insights.map((insight, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{insight.title}</h4>
                        <Badge variant={insight.impact === 'high' ? 'default' : 'secondary'}>
                          {insight.impact} impact
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          Confidence: {(insight.confidence * 100).toFixed(0)}%
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {insight.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Strategic Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Strategic Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-sm">
                  {webSearch.searchResults.searchResults.strategicAnalysis}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-Time Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Real-Time Web Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-sm">
                  {webSearch.searchResults.searchResults.webData}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Threats and Opportunities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {webSearch.searchResults.threats.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Identified Threats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {webSearch.searchResults.threats.map((threat, index) => (
                      <div key={index} className="p-3 border border-red-200 rounded-lg bg-red-50/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-red-800">{threat.type}</span>
                          <Badge variant="destructive">{threat.severity}</Badge>
                        </div>
                        <p className="text-sm text-red-700">{threat.description}</p>
                        <span className="text-xs text-red-600">
                          Probability: {(threat.probability * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {webSearch.searchResults.opportunities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <Target className="h-5 w-5" />
                    Market Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {webSearch.searchResults.opportunities.map((opportunity, index) => (
                      <div key={index} className="p-3 border border-green-200 rounded-lg bg-green-50/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-green-800">{opportunity.type}</span>
                          <Badge variant="secondary">{opportunity.potential}</Badge>
                        </div>
                        <p className="text-sm text-green-700">{opportunity.description}</p>
                        <span className="text-xs text-green-600">
                          Feasibility: {(opportunity.feasibility * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Related Questions */}
          {webSearch.searchResults.searchResults.relatedQuestions?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Search Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {webSearch.searchResults.searchResults.relatedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery(question);
                        handleWebSearch();
                      }}
                      className="text-xs"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Search Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Search Type:</span>
                  <div className="text-muted-foreground">{webSearch.searchResults.metadata.searchType}</div>
                </div>
                <div>
                  <span className="font-medium">Timeframe:</span>
                  <div className="text-muted-foreground">{webSearch.searchResults.metadata.timeframe}</div>
                </div>
                <div>
                  <span className="font-medium">Confidence:</span>
                  <div className="text-muted-foreground">{(webSearch.searchResults.metadata.dataConfidence * 100).toFixed(0)}%</div>
                </div>
                <div>
                  <span className="font-medium">Sources:</span>
                  <div className="text-muted-foreground">{webSearch.searchResults.metadata.sources.length} sources</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error Display */}
      {webSearch.error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Search Error:</strong> {webSearch.error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
