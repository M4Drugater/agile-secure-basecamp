
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Copy, 
  Save, 
  Download, 
  Share,
  Clock,
  Target,
  Zap,
  Sparkles
} from 'lucide-react';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { toast } from 'sonner';

interface ContentOutputProps {
  content: string;
  isGenerating: boolean;
  onContentChange: (content: string) => void;
  metrics?: any;
  title?: string;
}

export function ContentOutput({ 
  content, 
  isGenerating, 
  onContentChange, 
  metrics,
  title = "Generated Content"
}: ContentOutputProps) {
  
  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
    toast.success('Content copied to clipboard');
  };

  const handleSaveContent = () => {
    // In a real implementation, this would save to the content library
    toast.success('Content saved to library');
  };

  const handleExportContent = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-content.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Content exported successfully');
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title}
          </CardTitle>
          {content && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyContent}>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleSaveContent}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportContent}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Metrics */}
        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Time:</span>
              <Badge variant="secondary">
                {metrics.generationTime ? `${Math.round(metrics.generationTime / 1000)}s` : 'N/A'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Tokens:</span>
              <Badge variant="secondary">
                {metrics.tokensUsed || 'N/A'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Quality:</span>
              <Badge variant="default">
                {metrics.qualityScore || metrics.styleConfidence || 'N/A'}%
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Personal:</span>
              <Badge variant="default">
                {metrics.personalizedElements || 'N/A'}
              </Badge>
            </div>
          </div>
        )}

        {/* Content Editor */}
        {content ? (
          <RichTextEditor
            content={content}
            onChange={onContentChange}
            placeholder="Generated content will appear here..."
            className="min-h-[400px]"
          />
        ) : (
          <div className="flex items-center justify-center h-[400px] border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <div className="text-center">
              {isGenerating ? (
                <div className="space-y-4">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                  <p className="text-muted-foreground">
                    Generating premium content...
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                  <p className="text-muted-foreground font-medium">
                    Premium content will appear here
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    Configure your settings and generate content
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
