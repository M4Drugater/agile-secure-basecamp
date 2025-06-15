
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  Wand2, 
  FileText, 
  Library,
  Crown,
  Bot,
  Brain,
  Search,
  Zap
} from 'lucide-react';
import { UnifiedContentGeneratorTab } from './unified/UnifiedContentGeneratorTab';
import { ContentStylistTab } from './premium/ContentStylistTab';
import { ContentLibraryTab } from './premium/ContentLibraryTab';
import { useContextBuilder } from '@/hooks/context/useContextBuilder';
import { ContentItem } from '@/hooks/useContentItems';

export function UnifiedContentGenerator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'generator';
  const [activeTab, setActiveTab] = useState(initialTab);
  const { getContextSummary } = useContextBuilder();
  const contextSummary = getContextSummary();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleContentSelect = (content: ContentItem) => {
    console.log('Selected content:', content);
  };

  const unifiedFeatures = [
    'Tripartite AI System (OpenAI + Perplexity + Claude)',
    'Multi-Agent Intelligence',
    'Real-time Web Research',
    'Context-Aware Generation',
    'Executive Content Library',
    'Style Transfer & Optimization'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-500" />
            Unified Content Studio
          </h1>
          <p className="text-muted-foreground mt-2">
            AI-powered content creation with tripartite intelligence and multi-agent collaboration
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="default" className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600">
            <Crown className="h-3 w-3" />
            Premium
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Bot className="h-3 w-3" />
            Tripartite AI
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Search className="h-3 w-3" />
            Web Research
          </Badge>
        </div>
      </div>

      {/* Unified Features Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Unified AI Intelligence</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Combining the best of premium content generation with tripartite AI system capabilities
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {unifiedFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <Badge variant="default" className="ml-auto">Active</Badge>
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
              <Badge variant="default" className="ml-auto">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-500" />
              <div>
                <h4 className="font-medium">Claude Sonnet</h4>
                <p className="text-sm text-muted-foreground">Content Synthesis</p>
              </div>
              <Badge variant="default" className="ml-auto">Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Generator
          </TabsTrigger>
          <TabsTrigger value="stylist" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Stylist
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Library className="h-4 w-4" />
            Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator">
          <UnifiedContentGeneratorTab contextSummary={contextSummary} />
        </TabsContent>

        <TabsContent value="stylist">
          <ContentStylistTab contextSummary={contextSummary} />
        </TabsContent>

        <TabsContent value="library">
          <ContentLibraryTab onContentSelect={handleContentSelect} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
