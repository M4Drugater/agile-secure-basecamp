
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Search, Brain, Target, Coins } from 'lucide-react';
import { ResearchTypeSelector } from './ResearchTypeSelector';
import { useOptimizedPerformance } from '@/hooks/useOptimizedPerformance';

interface ResearchInputProps {
  query: string;
  setQuery: (query: string) => void;
  industry: string;
  setIndustry: (industry: string) => void;
  researchType: 'quick' | 'comprehensive' | 'industry-specific';
  setResearchType: (type: 'quick' | 'comprehensive' | 'industry-specific') => void;
  creditsEstimate: number;
  isResearching: boolean;
  onResearch: () => void;
}

export const ResearchInput = React.memo(({
  query,
  setQuery,
  industry,
  setIndustry,
  researchType,
  setResearchType,
  creditsEstimate,
  isResearching,
  onResearch
}: ResearchInputProps) => {
  const { optimizedCallback } = useOptimizedPerformance();

  const debouncedSetQuery = optimizedCallback(setQuery, 300);
  const debouncedSetIndustry = optimizedCallback(setIndustry, 300);

  return (
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
            defaultValue={query}
            onChange={(e) => debouncedSetQuery(e.target.value)}
            rows={3}
            className="min-h-[80px]"
          />
          
          <Input
            placeholder="Industry context (optional) - e.g., fintech, healthcare, SaaS"
            defaultValue={industry}
            onChange={(e) => debouncedSetIndustry(e.target.value)}
          />
        </div>

        <ResearchTypeSelector
          researchType={researchType}
          setResearchType={setResearchType}
        />

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Coins className="h-4 w-4" />
            <span>Estimated: {creditsEstimate} credits</span>
          </div>
          
          <Button 
            onClick={onResearch}
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
  );
});

ResearchInput.displayName = 'ResearchInput';
