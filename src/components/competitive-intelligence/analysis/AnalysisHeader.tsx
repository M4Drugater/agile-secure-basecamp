
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap } from 'lucide-react';

interface AnalysisHeaderProps {
  agentType: string;
  selectedFramework: string;
  strategicFrameworks: Array<{
    name: string;
    description: string;
    components: string[];
    outputFormat: string;
  }>;
  isAnalyzing: boolean;
  onRunAnalysis: () => void;
  onFrameworkSelect: (framework: string) => void;
}

export function AnalysisHeader({ 
  agentType, 
  selectedFramework, 
  strategicFrameworks,
  isAnalyzing,
  onRunAnalysis,
  onFrameworkSelect
}: AnalysisHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          McKinsey-Level Strategic Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Badge variant="secondary">Agent: {agentType.toUpperCase()}</Badge>
            <Badge variant="outline">Framework: {selectedFramework}</Badge>
          </div>
          <Button 
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Zap className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4" />
                Run Strategic Analysis
              </>
            )}
          </Button>
        </div>

        {/* Framework Selection */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {strategicFrameworks.map((framework) => (
            <Button
              key={framework.name}
              variant={selectedFramework === framework.name ? "default" : "outline"}
              size="sm"
              onClick={() => onFrameworkSelect(framework.name)}
              className="text-xs"
            >
              {framework.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
