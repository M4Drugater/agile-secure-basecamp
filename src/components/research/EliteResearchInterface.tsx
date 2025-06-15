
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  Search, 
  Target, 
  Zap, 
  TrendingUp, 
  FileText, 
  Clock,
  Coins,
  BarChart3,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useEliteResearchEngine, ResearchRequest } from '@/hooks/research/useEliteResearchEngine';
import { ResearchAnalyticsDashboard } from './ResearchAnalyticsDashboard';
import { ResearchResults } from './ResearchResults';
import { ResearchHistory } from './ResearchHistory';

export function EliteResearchInterface() {
  const { 
    conductResearch, 
    isResearching, 
    currentSession, 
    researchSessions, 
    analytics,
    researchProgress,
    estimateCredits,
    getResearchRecommendations,
    error,
    setCurrentSession
  } = useEliteResearchEngine();

  const [query, setQuery] = useState('');
  const [researchType, setResearchType] = useState<ResearchRequest['researchType']>('comprehensive');
  const [industry, setIndustry] = useState('');
  const [model, setModel] = useState<'llama-3.1-sonar-small-128k-online' | 'llama-3.1-sonar-large-128k-online'>('llama-3.1-sonar-large-128k-online');
  const [outputFormat, setOutputFormat] = useState<'executive-brief' | 'detailed-analysis' | 'data-points' | 'strategic-insights'>('detailed-analysis');
  const [contextLevel, setContextLevel] = useState<'basic' | 'enhanced' | 'elite'>('elite');

  const handleResearch = () => {
    if (!query.trim()) return;

    const request: ResearchRequest = {
      query: query.trim(),
      researchType,
      model,
      industry: industry || undefined,
      outputFormat,
      contextLevel,
      sourceFilters: ['reuters.com', 'bloomberg.com', 'wsj.com', 'ft.com', 'harvard.edu', 'mit.edu'],
      timeFilter: 'month',
      confidenceThreshold: 0.8
    };

    conductResearch(request);
  };

  const creditsEstimate = estimateCredits({ 
    query, 
    researchType, 
    model, 
    contextLevel, 
    outputFormat 
  });

  const recommendations = getResearchRecommendations();

  const researchTypeOptions = [
    {
      value: 'quick-scan' as const,
      label: 'Quick Scan',
      description: 'Rapid overview and key insights (2-3 credits)',
      icon: Zap,
      credits: 2,
      timeEstimate: '30 seconds'
    },
    {
      value: 'comprehensive' as const,
      label: 'Comprehensive Analysis',
      description: 'In-depth research with strategic insights (5-7 credits)',
      icon: Brain,
      credits: 5,
      timeEstimate: '2 minutes'
    },
    {
      value: 'industry-deep-dive' as const,
      label: 'Industry Deep Dive',
      description: 'Sector-specific analysis with trends (8-10 credits)',
      icon: Target,
      credits: 8,
      timeEstimate: '3 minutes'
    },
    {
      value: 'competitive-analysis' as const,
      label: 'Competitive Analysis',
      description: 'Market positioning and competitor intelligence (10-12 credits)',
      icon: TrendingUp,
      credits: 10,
      timeEstimate: '4 minutes'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Elite Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-500" />
            Elite Research Engine
          </h1>
          <p className="text-muted-foreground mt-2">
            Fortune 500-grade research powered by advanced AI with verified sources
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Elite v3.0
          </Badge>
          {analytics && (
            <Badge variant="outline" className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              {analytics.totalSessions} Sessions
            </Badge>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      {isResearching && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Research in Progress</h4>
                <span className="text-sm text-muted-foreground">{researchProgress.progress}%</span>
              </div>
              <Progress value={researchProgress.progress} className="w-full" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {researchProgress.details}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Research Input */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Research Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="What would you like to research? Be specific for Fortune 500-quality insights..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  rows={3}
                  className="min-h-[80px]"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Industry context (optional)"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                  
                  <Select value={outputFormat} onValueChange={(value: any) => setOutputFormat(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Output format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="executive-brief">Executive Brief</SelectItem>
                      <SelectItem value="detailed-analysis">Detailed Analysis</SelectItem>
                      <SelectItem value="data-points">Data Points</SelectItem>
                      <SelectItem value="strategic-insights">Strategic Insights</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Research Type Selection */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Research Type
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {researchTypeOptions.map((option) => (
                    <Card 
                      key={option.value}
                      className={`cursor-pointer transition-colors ${
                        researchType === option.value 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setResearchType(option.value)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <option.icon className="h-5 w-5 mt-0.5 text-blue-500" />
                          <div className="space-y-1">
                            <h5 className="font-medium text-sm">{option.label}</h5>
                            <p className="text-xs text-muted-foreground">
                              {option.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {option.timeEstimate}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4" />
                    <span>Est. {creditsEstimate} credits</span>
                  </div>
                  <Badge variant="outline">{contextLevel.toUpperCase()}</Badge>
                </div>
                
                <Button 
                  onClick={handleResearch}
                  disabled={!query.trim() || isResearching}
                  className="flex items-center gap-2"
                >
                  {isResearching ? (
                    <>
                      <Brain className="h-4 w-4 animate-pulse" />
                      Researching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Start Research
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Research Recommendations & Settings */}
        <div className="space-y-4">
          {/* Quick Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Recommended Research
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recommendations.map((rec, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => {
                    setQuery(rec.query);
                    setResearchType(rec.type as any);
                  }}
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{rec.query}</p>
                    <p className="text-xs text-muted-foreground">{rec.type}</p>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Quality Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Quality Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Context Level</label>
                <Select value={contextLevel} onValueChange={(value: any) => setContextLevel(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="enhanced">Enhanced</SelectItem>
                    <SelectItem value="elite">Elite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <Select value={model} onValueChange={(value: any) => setModel(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="llama-3.1-sonar-small-128k-online">Sonar Small (Fast)</SelectItem>
                    <SelectItem value="llama-3.1-sonar-large-128k-online">Sonar Large (Premium)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Research error: {error.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Results and Analytics */}
      <Tabs defaultValue="current" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Current Research
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          {currentSession ? (
            <ResearchResults session={currentSession} />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ready for Elite Research</h3>
                <p className="text-muted-foreground text-center">
                  Configure your research parameters above to start generating Fortune 500-quality insights
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <ResearchHistory 
            sessions={researchSessions} 
            onSelectSession={setCurrentSession} 
          />
        </TabsContent>

        <TabsContent value="analytics">
          <ResearchAnalyticsDashboard analytics={analytics} sessions={researchSessions} />
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-muted-foreground text-center">
                Advanced pattern recognition and trend analysis coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
