
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Wand2, 
  FileText, 
  Loader2,
  ArrowRight,
  Copy,
  Save
} from 'lucide-react';
import { StyleSelector } from '../StyleSelector';
import { ContentOutput } from './ContentOutput';
import { useContentStylist } from '@/hooks/content/useContentStylist';

interface ContentStylistTabProps {
  contextSummary: any;
}

export function ContentStylistTab({ contextSummary }: ContentStylistTabProps) {
  const [inputContent, setInputContent] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('executive');
  const [targetAudience, setTargetAudience] = useState('c-suite-executives');
  
  const {
    isProcessing,
    styledContent,
    handleStyleTransfer,
    styleMetrics
  } = useContentStylist();

  const handleApplyStyle = () => {
    if (!inputContent.trim()) return;
    
    handleStyleTransfer({
      content: inputContent,
      targetStyle: selectedStyle,
      targetAudience,
      contextSummary
    });
  };

  const styleTemplates = [
    { name: 'Executive Brief', description: 'C-suite ready format' },
    { name: 'Marketing Copy', description: 'Engaging and persuasive' },
    { name: 'Technical Doc', description: 'Clear and systematic' },
    { name: 'Press Release', description: 'Media-ready format' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Content Style Transfer
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Transform any content to match your desired style and audience
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Source Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                placeholder="Paste your content here... (emails, documents, notes, drafts, etc.)"
                rows={12}
                className="resize-none"
              />
              <div className="text-xs text-muted-foreground">
                {inputContent.length} characters • {inputContent.split(/\s+/).filter(word => word.length > 0).length} words
              </div>
            </CardContent>
          </Card>

          {/* Style Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Style Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StyleSelector
                selectedStyle={selectedStyle}
                onStyleChange={setSelectedStyle}
                showDetails={false}
              />

              {/* Quick Templates */}
              <div>
                <label className="text-sm font-medium mb-2 block">Quick Style Templates</label>
                <div className="grid grid-cols-2 gap-2">
                  {styleTemplates.map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="h-auto p-3 text-left"
                      onClick={() => setSelectedStyle(template.name.toLowerCase().replace(' ', '-'))}
                    >
                      <div>
                        <div className="font-medium text-xs">{template.name}</div>
                        <div className="text-xs text-muted-foreground">{template.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleApplyStyle} 
                disabled={isProcessing || !inputContent.trim()}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Applying Style...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Transform Content
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <ContentOutput
            content={styledContent}
            isGenerating={isProcessing}
            onContentChange={() => {}}
            metrics={styleMetrics}
            title="Styled Content"
          />
        </div>
      </div>
    </div>
  );
}
