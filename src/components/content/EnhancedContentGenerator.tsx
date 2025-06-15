
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Brain, 
  Wand2, 
  FileText, 
  Users, 
  Target,
  Sparkles,
  Copy,
  Download,
  Save
} from 'lucide-react';
import { EnhancedContentGeneratorForm } from './EnhancedContentGeneratorForm';
import { useEnhancedContentGeneration } from '@/hooks/useEnhancedContentGeneration';
import { useKnowledgeItems } from '@/hooks/useKnowledgeItems';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { toast } from 'sonner';
import { ContentFormData } from './ContentGeneratorTypes';

export function EnhancedContentGenerator() {
  const { isGenerating, generatedContent, handleGenerate, setGeneratedContent, profile } = useEnhancedContentGeneration();
  const { knowledgeItems } = useKnowledgeItems();
  const [activeTab, setActiveTab] = useState('generator');
  
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
    industry: profile?.industry || 'technology',
    purpose: 'strategic-communication',
  });

  const handleGenerateContent = () => {
    handleGenerate(formData);
    setActiveTab('output');
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success('Content copied to clipboard');
  };

  const hasKnowledgeBase = knowledgeItems && knowledgeItems.length > 0;

  const agentCapabilities = [
    {
      icon: Brain,
      title: 'Strategic Intelligence',
      description: 'Leverages CLIPOGINO for strategic insights and executive perspective',
      color: 'bg-blue-500'
    },
    {
      icon: Target,
      title: 'Competitive Analysis',
      description: 'Integrates CDV, CIA, and CIR agents for market intelligence',
      color: 'bg-purple-500'
    },
    {
      icon: FileText,
      title: 'Executive Content',
      description: 'Generates C-suite ready documents and communications',
      color: 'bg-green-500'
    },
    {
      icon: Users,
      title: 'Multi-Agent Collaboration',
      description: 'Orchestrates multiple AI agents for comprehensive content creation',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-500" />
            Enhanced Content Generator
          </h1>
          <p className="text-muted-foreground mt-2">
            AI-powered content creation with multi-agent intelligence
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="default" className="flex items-center gap-1">
            <Bot className="h-3 w-3" />
            Multi-Agent AI
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            {hasKnowledgeBase ? 'Knowledge Enhanced' : 'Standard Mode'}
          </Badge>
        </div>
      </div>

      {/* Agent Capabilities Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agentCapabilities.map((capability, index) => {
          const Icon = capability.icon;
          return (
            <Card key={index} className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${capability.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{capability.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{capability.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Content Generator
          </TabsTrigger>
          <TabsTrigger value="output" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generated Content
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Agent Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EnhancedContentGeneratorForm
              formData={formData}
              setFormData={setFormData}
              onGenerate={handleGenerateContent}
              isGenerating={isGenerating}
              hasKnowledgeBase={hasKnowledgeBase}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Multi-Agent Intelligence</CardTitle>
                <CardDescription>
                  Your content will be enhanced by multiple AI agents working together
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Brain className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-sm">CLIPOGINO</div>
                      <div className="text-xs text-muted-foreground">Strategic advisor and mentor</div>
                    </div>
                    <Badge variant="default" className="ml-auto">Active</Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Target className="h-5 w-5 text-purple-500" />
                    <div>
                      <div className="font-medium text-sm">Competitive Intelligence</div>
                      <div className="text-xs text-muted-foreground">Market analysis and insights</div>
                    </div>
                    <Badge variant="secondary" className="ml-auto">On-Demand</Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <FileText className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium text-sm">Content Optimizer</div>
                      <div className="text-xs text-muted-foreground">Style and quality enhancement</div>
                    </div>
                    <Badge variant="default" className="ml-auto">Active</Badge>
                  </div>
                </div>
                
                {profile && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-sm mb-2">Your Profile Context</h4>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div>Position: {profile.current_position || 'Executive'}</div>
                      <div>Industry: {profile.industry || 'Technology'}</div>
                      <div>Experience: {profile.experience_level || 'Senior'}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="output" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generated Content</CardTitle>
                  <CardDescription>
                    AI-enhanced content ready for executive use
                  </CardDescription>
                </div>
                {generatedContent && (
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
              {generatedContent ? (
                <RichTextEditor
                  content={generatedContent}
                  onChange={setGeneratedContent}
                  placeholder="Generated content will appear here..."
                  className="min-h-[500px]"
                />
              ) : (
                <div className="flex items-center justify-center h-[500px] border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <div className="text-center">
                    <Sparkles className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg font-medium">
                      Enhanced content will appear here
                    </p>
                    <p className="text-muted-foreground/70 text-sm mt-2">
                      Configure your content settings and generate executive-level content
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Collaboration Status</CardTitle>
              <CardDescription>
                Monitor the AI agents working together to create your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Agent collaboration details will be displayed during content generation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
