
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, FileText, Copy, Download, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCostMonitoring } from '@/hooks/useCostMonitoring';
import { useToast } from '@/hooks/use-toast';

interface ContentRequest {
  type: 'resume' | 'cover-letter' | 'linkedin-post' | 'email' | 'presentation' | 'article';
  topic: string;
  style: 'professional' | 'casual' | 'formal' | 'creative';
  length: 'short' | 'medium' | 'long';
  targetAudience?: string;
  additionalInstructions?: string;
}

interface ContentResponse {
  content: string;
  type: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  metadata: {
    style: string;
    length: string;
    targetAudience?: string;
    generatedAt: string;
  };
}

export function ContentGenerator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { usage, isLoading: costLoading, checkBeforeAction, refreshUsage } = useCostMonitoring();
  const [request, setRequest] = useState<ContentRequest>({
    type: 'linkedin-post',
    topic: '',
    style: 'professional',
    length: 'medium',
  });
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<ContentResponse | null>(null);

  const contentTypes = [
    { value: 'resume', label: 'Resume Section' },
    { value: 'cover-letter', label: 'Cover Letter' },
    { value: 'linkedin-post', label: 'LinkedIn Post' },
    { value: 'email', label: 'Professional Email' },
    { value: 'presentation', label: 'Presentation Content' },
    { value: 'article', label: 'Article' },
  ];

  const styles = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'formal', label: 'Formal' },
    { value: 'creative', label: 'Creative' },
  ];

  const lengths = [
    { value: 'short', label: 'Short (100-300 words)' },
    { value: 'medium', label: 'Medium (300-600 words)' },
    { value: 'long', label: 'Long (600-1200 words)' },
  ];

  const handleGenerate = async () => {
    if (!request.topic.trim() || !user) return;

    // Estimate cost based on content type and length
    const estimatedCost = request.length === 'long' ? 0.05 : request.length === 'medium' ? 0.03 : 0.01;
    
    if (!checkBeforeAction(estimatedCost)) {
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: request.type,
          topic: request.topic,
          style: request.style,
          length: request.length,
          targetAudience: request.targetAudience,
          additionalInstructions: request.additionalInstructions,
          model: 'gpt-4o-mini',
        },
      });

      if (error) {
        throw error;
      }

      const response = data as ContentResponse;
      setGeneratedContent(response.content);
      setLastResponse(response);
      
      // Refresh usage after successful request
      await refreshUsage();

      toast({
        title: 'Content Generated Successfully',
        description: `Generated ${response.type} using ${response.usage.totalTokens} tokens`,
        variant: 'default',
      });

    } catch (error: any) {
      console.error('Content generation error:', error);
      
      let errorMessage = 'Failed to generate content';
      if (error.message?.includes('Usage limit reached')) {
        errorMessage = 'You have reached your daily AI usage limit';
      } else if (error.message?.includes('Cost limit exceeded')) {
        errorMessage = 'Request would exceed your usage limits';
      }

      toast({
        title: 'Generation Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (generatedContent) {
      await navigator.clipboard.writeText(generatedContent);
      toast({
        title: 'Copied to Clipboard',
        description: 'Content has been copied to your clipboard',
        variant: 'default',
      });
    }
  };

  const handleDownload = () => {
    if (generatedContent) {
      const blob = new Blob([generatedContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${request.type}-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <CardTitle>AI Content Generator</CardTitle>
            </div>
            <Badge variant="outline">
              {usage ? `$${usage.dailyUsage.toFixed(4)} / $${usage.dailyLimit}` : 'Loading...'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Usage Warning */}
      {usage && (usage.dailyPercentage > 80 || usage.monthlyPercentage > 80) && (
        <Alert variant={usage.dailyPercentage > 95 ? "destructive" : "default"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {usage.dailyPercentage > 95 
              ? "You're very close to your daily limit. Use AI requests sparingly."
              : "You're approaching your usage limits. Monitor your requests."
            }
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Content Type</label>
              <Select
                value={request.type}
                onValueChange={(value: any) => setRequest(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Topic/Subject</label>
              <Textarea
                value={request.topic}
                onChange={(e) => setRequest(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="Describe what you want to create content about..."
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Style</label>
                <Select
                  value={request.style}
                  onValueChange={(value: any) => setRequest(prev => ({ ...prev, style: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {styles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Length</label>
                <Select
                  value={request.length}
                  onValueChange={(value: any) => setRequest(prev => ({ ...prev, length: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {lengths.map((length) => (
                      <SelectItem key={length.value} value={length.value}>
                        {length.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Target Audience (Optional)</label>
              <Textarea
                value={request.targetAudience || ''}
                onChange={(e) => setRequest(prev => ({ ...prev, targetAudience: e.target.value }))}
                placeholder="Who is this content for? (e.g., hiring managers, LinkedIn connections, etc.)"
                className="min-h-[60px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Additional Instructions (Optional)</label>
              <Textarea
                value={request.additionalInstructions || ''}
                onChange={(e) => setRequest(prev => ({ ...prev, additionalInstructions: e.target.value }))}
                placeholder="Any specific requirements or preferences..."
                className="min-h-[60px]"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!request.topic.trim() || isLoading || costLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Generated Content</CardTitle>
              {generatedContent && (
                <div className="flex space-x-2">
                  <Button onClick={handleCopy} variant="outline" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleDownload} variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {generatedContent ? (
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
                </div>
                {lastResponse && (
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary">
                      {lastResponse.usage.totalTokens} tokens
                    </Badge>
                    <Badge variant="secondary">
                      {lastResponse.model}
                    </Badge>
                    <Badge variant="secondary">
                      {lastResponse.metadata.style}
                    </Badge>
                    <Badge variant="secondary">
                      {lastResponse.metadata.length}
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>Generated content will appear here</p>
                <p className="text-sm mt-1">Configure your content settings and click Generate</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
