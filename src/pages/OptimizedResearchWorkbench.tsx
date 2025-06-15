
import React from 'react';
import { EliteResearchInterface } from '@/components/research/EliteResearchInterface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Brain, BarChart3, FileText, Zap } from 'lucide-react';

export default function OptimizedResearchWorkbenchPage() {
  return (
    <div className="container mx-auto p-6 lg:p-8 max-w-7xl space-y-8">
      {/* Unified Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Brain className="h-8 w-8 text-blue-500" />
          Elite Research Platform
        </h1>
        <p className="text-muted-foreground">
          Investigación unificada con metodología tripartite (OpenAI → Perplexity → Claude) para insights Fortune 500
        </p>
      </div>

      {/* Tripartite System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-blue-500" />
              <div>
                <h4 className="font-medium">OpenAI GPT-4</h4>
                <p className="text-sm text-muted-foreground">Context Analysis</p>
              </div>
              <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Search className="h-8 w-8 text-green-500" />
              <div>
                <h4 className="font-medium">Perplexity AI</h4>
                <p className="text-sm text-muted-foreground">Web Research</p>
              </div>
              <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-purple-500" />
              <div>
                <h4 className="font-medium">Claude Sonnet</h4>
                <p className="text-sm text-muted-foreground">Content Synthesis</p>
              </div>
              <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Research Interface */}
      <EliteResearchInterface />
    </div>
  );
}
