
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Brain, FileText, Users, Loader2, Copy, Save, Download, Search, Zap } from 'lucide-react';
import { ContentGeneratorForm } from '../premium/ContentGeneratorForm';
import { ContentOutput } from '../premium/ContentOutput';
import { useUnifiedContentGeneration } from '@/hooks/content/useUnifiedContentGeneration';
import { ContentFormData } from '../ContentGeneratorTypes';

interface UnifiedContentGeneratorTabProps {
  contextSummary: any;
}

export function UnifiedContentGeneratorTab({ contextSummary }: UnifiedContentGeneratorTabProps) {
  const { 
    isGenerating, 
    generatedContent, 
    handleGenerate, 
    setGeneratedContent,
    generationMetrics 
  } = useUnifiedContentGeneration();
  
  const [useTripartite, setUseTripartite] = useState(false);
  const [formData, setFormData] = useState<ContentFormData>({
    type: 'executive-memo',
    topic: '',
    style: 'executive',
    length: 'medium',
    model: 'gpt-4o',
    customPrompt: '',
    targetAudience: 'c-suite-executives',
    businessContext: '',
    useKnowledge: true,
    tone: 'authoritative',
    industry: 'technology',
    purpose: 'strategic-communication',
  });

  const handleGenerateContent = () => {
    handleGenerate(formData, useTripartite);
  };

  const systemCapabilities = [
    {
      icon: Brain,
      title: 'Strategic Intelligence',
      description: useTripartite ? 'Full tripartite analysis with web research' : 'Context-aware content generation',
      status: 'Active',
      enhanced: useTripartite
    },
    {
      icon: Search,
      title: 'Web Research',
      description: useTripartite ? 'Real-time market data and competitive intelligence' : 'Knowledge base integration',
      status: useTripartite ? 'Active' : 'Standard',
      enhanced: useTripartite
    },
    {
      icon: FileText,
      title: 'Content Optimization',
      description: 'Executive-grade content structuring and enhancement',
      status: 'Active',
      enhanced: false
    },
    {
      icon: Users,
      title: 'Audience Analysis',
      description: 'Tailored messaging for target demographics',
      status: 'Active',
      enhanced: false
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form Section */}
      <div className="space-y-6">
        {/* Tripartite Toggle */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-500" />
                  Tripartite AI System
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Enable web research and multi-LLM collaboration for enhanced content
                </p>
              </div>
              <Switch
                checked={useTripartite}
                onCheckedChange={setUseTripartite}
              />
            </div>
          </CardHeader>
          {useTripartite && (
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>OpenAI GPT-4 for context analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Perplexity AI for real-time web research</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span>Claude Sonnet for content synthesis</span>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <ContentGeneratorForm
          formData={formData}
          setFormData={setFormData}
          onGenerate={handleGenerateContent}
          isGenerating={isGenerating}
          contextSummary={contextSummary}
        />

        {/* System Capabilities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {useTripartite ? 'Tripartite AI Active' : 'Enhanced AI Active'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {systemCapabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Icon className={`h-5 w-5 ${capability.enhanced ? 'text-purple-500' : 'text-blue-500'}`} />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{capability.title}</div>
                    <div className="text-xs text-muted-foreground">{capability.description}</div>
                  </div>
                  <Badge 
                    variant={capability.status === 'Active' ? 'default' : 'secondary'} 
                    className={`text-xs ${capability.enhanced ? 'bg-purple-600' : ''}`}
                  >
                    {capability.status}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Output Section */}
      <div className="space-y-6">
        <ContentOutput
          content={generatedContent}
          isGenerating={isGenerating}
          onContentChange={setGeneratedContent}
          metrics={generationMetrics}
        />

        {/* Generation Metrics */}
        {generationMetrics && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generation Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Method:</span>
                  <span className="ml-2">{generationMetrics.tripartiteUsed ? 'Tripartite AI' : 'Enhanced Studio'}</span>
                </div>
                <div>
                  <span className="font-medium">Quality Score:</span>
                  <span className="ml-2">{Math.round(generationMetrics.qualityScore)}%</span>
                </div>
                <div>
                  <span className="font-medium">Processing Time:</span>
                  <span className="ml-2">{Math.round(generationMetrics.generationTime / 1000)}s</span>
                </div>
                <div>
                  <span className="font-medium">Tokens Used:</span>
                  <span className="ml-2">{generationMetrics.tokensUsed.toLocaleString()}</span>
                </div>
                {generationMetrics.sources && generationMetrics.sources.length > 0 && (
                  <div className="col-span-2">
                    <span className="font-medium">Web Sources:</span>
                    <span className="ml-2">{generationMetrics.sources.length} sources researched</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
