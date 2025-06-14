
import React, { useState, Suspense } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Clock, Brain } from 'lucide-react';
import { usePerplexityResearch, ResearchRequest } from '@/hooks/usePerplexityResearch';
import { useOptimizedPerformance } from '@/hooks/useOptimizedPerformance';
import { ResearchHeader } from './ResearchHeader';
import { ResearchInput } from './ResearchInput';
import { ResearchFilters } from './ResearchFilters';

// Lazy load heavy components
const ResearchResults = React.lazy(() => import('./ResearchResults').then(module => ({ default: module.ResearchResults })));
const ResearchSessionCard = React.lazy(() => import('./ResearchSessionCard').then(module => ({ default: module.ResearchSessionCard })));

export function OptimizedResearchWorkbench() {
  const { shouldOptimize, measurePerformance } = useOptimizedPerformance();
  
  const { 
    conductResearch, 
    isResearching, 
    currentSession, 
    researchSessions, 
    estimateCredits,
    error,
    setCurrentSession
  } = usePerplexityResearch();

  const [query, setQuery] = useState('');
  const [researchType, setResearchType] = useState<'quick' | 'comprehensive' | 'industry-specific'>('comprehensive');
  const [industry, setIndustry] = useState('');
  const [model, setModel] = useState<'llama-3.1-sonar-small-128k-online' | 'llama-3.1-sonar-large-128k-online'>('llama-3.1-sonar-large-128k-online');

  const handleResearch = () => {
    if (!query.trim()) return;

    measurePerformance('research-start', () => {
      const request: ResearchRequest = {
        query: query.trim(),
        researchType,
        model: shouldOptimize ? 'llama-3.1-sonar-small-128k-online' : model,
        industry: industry || undefined,
      };

      conductResearch(request);
    });
  };

  const creditsEstimate = estimateCredits(researchType, model);

  return (
    <div className="space-y-6">
      <ResearchHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ResearchInput
            query={query}
            setQuery={setQuery}
            industry={industry}
            setIndustry={setIndustry}
            researchType={researchType}
            setResearchType={setResearchType}
            creditsEstimate={creditsEstimate}
            isResearching={isResearching}
            onResearch={handleResearch}
          />
        </div>

        <div className="space-y-4">
          <ResearchFilters 
            model={model}
            onModelChange={setModel}
            isResearching={isResearching}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            Research error: {error.message}
          </AlertDescription>
        </Alert>
      )}

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
          <Suspense fallback={<div className="animate-pulse">Loading results...</div>}>
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
          </Suspense>
        </TabsContent>

        <TabsContent value="history">
          <Suspense fallback={<div className="animate-pulse">Loading history...</div>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {researchSessions.length > 0 ? (
                researchSessions.slice(0, shouldOptimize ? 6 : 12).map((session) => (
                  <ResearchSessionCard 
                    key={session.id} 
                    session={session}
                    onSelect={setCurrentSession}
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
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
