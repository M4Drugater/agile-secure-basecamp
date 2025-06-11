
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Brain, 
  FileText, 
  ExternalLink, 
  Lightbulb,
  TrendingUp,
  Clock,
  Coins,
  BookOpen,
  Target,
  Zap
} from 'lucide-react';
import { usePerplexityResearch, ResearchRequest } from '@/hooks/usePerplexityResearch';
import { ResearchSessionCard } from './ResearchSessionCard';
import { ResearchResults } from './ResearchResults';
import { ResearchFilters } from './ResearchFilters';

export function ResearchWorkbench() {
  const { 
    conductResearch, 
    isResearching, 
    currentSession, 
    researchSessions, 
    estimateCredits,
    error 
  } = usePerplexityResearch();

  const [query, setQuery] = useState('');
  const [researchType, setResearchType] = useState<'quick' | 'comprehensive' | 'industry-specific'>('comprehensive');
  const [industry, setIndustry] = useState('');
  const [model, setModel] = useState<'llama-3.1-sonar-small-128k-online' | 'llama-3.1-sonar-large-128k-online'>('llama-3.1-sonar-large-128k-online');

  const handleResearch = () => {
    if (!query.trim()) return;

    const request: ResearchRequest = {
      query: query.trim(),
      researchType,
      model,
      industry: industry || undefined,
    };

    conductResearch(request);
  };

  const creditsEstimate = estimateCredits(researchType, model);

  const researchTypeOptions = [
    {
      value: 'quick' as const,
      label: 'Quick Overview',
      description: 'Fast insights and key facts (3-5 credits)',
      icon: Zap,
      credits: 3
    },
    {
      value: 'comprehensive' as const,
      label: 'Comprehensive Analysis',
      description: 'In-depth research with full context (6-8 credits)',
      icon: Brain,
      credits: 6
    },
    {
      value: 'industry-specific' as const,
      label: 'Industry-Specific',
      description: 'Sector-focused deep dive (8-10 credits)',
      icon: Target,
      credits: 8
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-500" />
            Research Workbench
          </h1>
          <p className="text-muted-foreground mt-2">
            Intelligent research powered by Perplexity AI with verified sources
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            Enhanced Research v2.0
          </Badge>
        </div>
      </div>

      {/* Research Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Research Input */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Research Query
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="What would you like to research? Be specific for better results..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  rows={3}
                  className="min-h-[80px]"
                />
                
                <Input
                  placeholder="Industry context (optional) - e.g., fintech, healthcare, SaaS"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>

              {/* Research Type Selection */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Research Type
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Coins className="h-4 w-4" />
                  <span>Estimated: {creditsEstimate} credits</span>
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

        {/* Research Filters & Settings */}
        <div className="space-y-4">
          <ResearchFilters 
            model={model}
            onModelChange={setModel}
            isResearching={isResearching}
          />

          {/* Research Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Research Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Be specific in your queries for better results</p>
                <p>• Include industry context when relevant</p>
                <p>• Use comprehensive mode for detailed analysis</p>
                <p>• Sources are automatically verified and ranked</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            Research error: {error.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Results */}
      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Current Research
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Research History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          {currentSession ? (
            <ResearchResults session={currentSession} />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ready to Research</h3>
                <p className="text-muted-foreground text-center">
                  Enter your research query above to get started with AI-powered research
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {researchSessions.length > 0 ? (
              researchSessions.map((session) => (
                <ResearchSessionCard 
                  key={session.id} 
                  session={session}
                  onSelect={(session) => setCurrentSession(session)}
                />
              ))
            ) : (
              <Card className="md:col-span-2">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Research History</h3>
                  <p className="text-muted-foreground text-center">
                    Your research sessions will appear here after you conduct your first research
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
