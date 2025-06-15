
import React, { useState } from 'react';
import { LaigentOrchestrationPanel } from '@/components/orchestrators/LaigentOrchestrationPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Brain, 
  Search, 
  Sparkles, 
  TrendingUp, 
  Activity,
  Copy,
  Download,
  Save
} from 'lucide-react';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { toast } from 'sonner';

export default function LaigentOrchestrator() {
  const [orchestrationResult, setOrchestrationResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('orchestrator');

  const handleOrchestrationComplete = (result: any) => {
    setOrchestrationResult(result);
    setActiveTab('results');
    toast.success('LAIGENT Orchestration Complete');
  };

  const handleCopyContent = () => {
    if (orchestrationResult?.finalContent) {
      navigator.clipboard.writeText(orchestrationResult.finalContent);
      toast.success('Content copied to clipboard');
    }
  };

  const sessionConfig = {
    companyName: 'Your Company',
    industry: 'technology',
    analysisFocus: 'strategic-planning',
    objectives: 'competitive-analysis'
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="h-8 w-8 text-yellow-500" />
            LAIGENT Master Orchestrator
          </h1>
          <p className="text-muted-foreground mt-2">
            Advanced AI orchestration with OpenAI, Perplexity, and Claude coordination
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="default" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            Multi-Agent AI
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Elite Orchestration
          </Badge>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-sm">OpenAI Context</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Advanced context building and query interpretation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Perplexity Research</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Enhanced web research with quality standards
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Claude Styling</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Sophisticated content transformation and styling
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orchestrator" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Orchestrator
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orchestrator">
          <LaigentOrchestrationPanel
            sessionConfig={sessionConfig}
            onOrchestrationComplete={handleOrchestrationComplete}
          />
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Orchestration Results</CardTitle>
                  <CardDescription>
                    LAIGENT orchestrated content with multi-agent intelligence
                  </CardDescription>
                </div>
                {orchestrationResult && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyContent}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {orchestrationResult ? (
                <RichTextEditor
                  content={orchestrationResult.finalContent}
                  onChange={() => {}}
                  placeholder="Orchestrated content will appear here..."
                  className="min-h-[600px]"
                  readOnly
                />
              ) : (
                <div className="flex items-center justify-center h-[600px] border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <div className="text-center">
                    <Zap className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg font-medium">
                      Orchestrated content will appear here
                    </p>
                    <p className="text-muted-foreground/70 text-sm mt-2">
                      Execute LAIGENT orchestration to generate elite-level content
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {orchestrationResult ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Quality Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quality Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Executive Readiness</span>
                    <span className="font-medium">
                      {Math.round((orchestrationResult.qualityAssurance?.executiveReadiness || 0) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Strategic Depth</span>
                    <span className="font-medium">
                      {Math.round((orchestrationResult.qualityAssurance?.strategicDepth || 0) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Integration</span>
                    <span className="font-medium">
                      {Math.round((orchestrationResult.qualityAssurance?.dataIntegration || 0) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Actionability</span>
                    <span className="font-medium">
                      {Math.round((orchestrationResult.qualityAssurance?.actionability || 0) * 100)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Context Build Time</span>
                    <span className="font-medium">
                      {Math.round((orchestrationResult.performanceAnalytics?.contextBuildTime || 0) / 1000)}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Research Time</span>
                    <span className="font-medium">
                      {Math.round((orchestrationResult.performanceAnalytics?.researchTime || 0) / 1000)}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Styling Time</span>
                    <span className="font-medium">
                      {Math.round((orchestrationResult.performanceAnalytics?.stylingTime || 0) / 1000)}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Tokens</span>
                    <span className="font-medium">
                      {orchestrationResult.performanceAnalytics?.totalTokens?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Cost</span>
                    <span className="font-medium">
                      ${orchestrationResult.performanceAnalytics?.totalCost || '0.00'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Orchestration Metadata */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Orchestration Metadata</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round((orchestrationResult.orchestrationMetadata?.contextQuality || 0) * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Context Quality</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round((orchestrationResult.orchestrationMetadata?.researchQuality || 0) * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Research Quality</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round((orchestrationResult.orchestrationMetadata?.stylingQuality || 0) * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Styling Quality</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.round((orchestrationResult.orchestrationMetadata?.overallScore || 0) * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Overall Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Analytics will be displayed after orchestration execution
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
