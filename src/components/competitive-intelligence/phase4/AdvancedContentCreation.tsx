
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Presentation, 
  BarChart3, 
  PieChart,
  Brain,
  Wand2,
  Download,
  Share,
  Eye,
  Zap
} from 'lucide-react';

interface ContentTemplate {
  id: string;
  title: string;
  description: string;
  type: 'report' | 'presentation' | 'dashboard' | 'brief';
  category: 'strategic' | 'competitive' | 'market' | 'financial';
  complexity: 'simple' | 'detailed' | 'comprehensive';
  estimatedTime: string;
  aiFeatures: string[];
}

interface GeneratedContent {
  id: string;
  title: string;
  type: string;
  status: 'generating' | 'completed' | 'failed';
  progress: number;
  generatedAt: string;
}

export function AdvancedContentCreation() {
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [contentPrompt, setContentPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [templates] = useState<ContentTemplate[]>([
    {
      id: '1',
      title: 'Executive Strategic Report',
      description: 'C-suite ready strategic analysis report with competitive insights',
      type: 'report',
      category: 'strategic',
      complexity: 'comprehensive',
      estimatedTime: '15-20 mins',
      aiFeatures: ['Auto-analysis', 'Executive summary', 'Strategic recommendations', 'Risk assessment']
    },
    {
      id: '2',
      title: 'Competitive Intelligence Brief',
      description: 'Concise competitive landscape overview for decision makers',
      type: 'brief',
      category: 'competitive',
      complexity: 'simple',
      estimatedTime: '5-8 mins',
      aiFeatures: ['Competitor analysis', 'Market positioning', 'Threat assessment']
    },
    {
      id: '3',
      title: 'Market Analysis Presentation',
      description: 'Board-ready presentation with market dynamics and opportunities',
      type: 'presentation',
      category: 'market',
      complexity: 'detailed',
      estimatedTime: '10-15 mins',
      aiFeatures: ['Visual charts', 'Trend analysis', 'Market sizing', 'Growth projections']
    },
    {
      id: '4',
      title: 'Financial Performance Dashboard',
      description: 'Interactive dashboard for financial and competitive metrics',
      type: 'dashboard',
      category: 'financial',
      complexity: 'detailed',
      estimatedTime: '12-18 mins',
      aiFeatures: ['Real-time data', 'KPI tracking', 'Benchmark comparisons', 'Predictive analytics']
    }
  ]);

  const [generatedContent] = useState<GeneratedContent[]>([
    {
      id: '1',
      title: 'Q1 Strategic Analysis Report',
      type: 'Strategic Report',
      status: 'completed',
      progress: 100,
      generatedAt: '2024-02-01T10:30:00Z'
    },
    {
      id: '2',
      title: 'Competitive Landscape Brief',
      type: 'Intelligence Brief',
      status: 'completed',
      progress: 100,
      generatedAt: '2024-02-01T09:15:00Z'
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'report': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'presentation': return <Presentation className="h-5 w-5 text-green-500" />;
      case 'dashboard': return <BarChart3 className="h-5 w-5 text-purple-500" />;
      case 'brief': return <PieChart className="h-5 w-5 text-orange-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strategic': return 'bg-blue-500';
      case 'competitive': return 'bg-red-500';
      case 'market': return 'bg-green-500';
      case 'financial': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'text-green-600';
      case 'detailed': return 'text-yellow-600';
      case 'comprehensive': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleGenerateContent = async () => {
    if (!selectedTemplate || !contentPrompt) return;
    
    setIsGenerating(true);
    // Simulate content generation
    setTimeout(() => {
      setIsGenerating(false);
      // Reset form
      setContentPrompt('');
      setSelectedTemplate(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-purple-500" />
            Advanced Content Creation Engine
          </h2>
          <p className="text-muted-foreground">
            AI-powered content generation for strategic reports, presentations, and analysis
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="default" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            AI-Generated
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Enterprise-Grade
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Content</TabsTrigger>
          <TabsTrigger value="library">Content Library</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Template Selection */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold">Choose Content Template</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedTemplate?.id === template.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(template.type)}
                        <CardTitle className="text-base">{template.title}</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        <Badge 
                          variant="secondary"
                          className={`${getCategoryColor(template.category)} text-white text-xs`}
                        >
                          {template.category}
                        </Badge>
                        <Badge 
                          variant="outline"
                          className={`${getComplexityColor(template.complexity)} text-xs`}
                        >
                          {template.complexity}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        Estimated time: {template.estimatedTime}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-xs font-medium">AI Features:</div>
                        {template.aiFeatures.slice(0, 2).map((feature) => (
                          <div key={feature} className="text-xs text-muted-foreground flex items-center gap-1">
                            <div className="w-1 h-1 bg-purple-500 rounded-full" />
                            {feature}
                          </div>
                        ))}
                        {template.aiFeatures.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{template.aiFeatures.length - 2} more features
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Content Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Content Configuration</h3>
              
              {selectedTemplate ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getTypeIcon(selectedTemplate.type)}
                      {selectedTemplate.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Content Title</label>
                      <Input placeholder="Enter content title..." />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Content Requirements & Context
                      </label>
                      <Textarea
                        placeholder="Describe what you want to include in this content... (e.g., specific competitors, market segments, time periods, key metrics, etc.)"
                        value={contentPrompt}
                        onChange={(e) => setContentPrompt(e.target.value)}
                        rows={6}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">AI Features Included:</div>
                      {selectedTemplate.aiFeatures.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm">
                          <Brain className="h-3 w-3 text-purple-500" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Button 
                      onClick={handleGenerateContent}
                      disabled={!contentPrompt || isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin w-4 h-4 border border-current border-t-transparent rounded-full mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Generate Content
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Wand2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Select a Template</h3>
                    <p className="text-muted-foreground">
                      Choose a content template to start creating AI-powered strategic content.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="library">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Generated Content Library</h3>
              <Badge variant="outline">{generatedContent.length} items</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedContent.map((content) => (
                <Card key={content.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{content.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {content.type}
                      </Badge>
                      <Badge 
                        variant={content.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {content.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Generated: {new Date(content.generatedAt).toLocaleDateString()}
                    </div>
                    
                    {content.status === 'completed' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
