
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wand2, Save, Download, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useContentItems } from '@/hooks/useContentItems';
import { ContentFormData, contentTypes } from './ContentGeneratorTypes';

interface ContentGeneratorPreviewProps {
  generatedContent: string;
  formData: ContentFormData;
}

export function ContentGeneratorPreview({ generatedContent, formData }: ContentGeneratorPreviewProps) {
  const { createContentItem } = useContentItems();

  const handleSaveToLibrary = () => {
    if (!generatedContent) {
      toast.error('No content to save');
      return;
    }

    const selectedType = contentTypes.find(t => t.value === formData.type);
    const title = `${selectedType?.label} - ${formData.topic}`;

    createContentItem.mutate({
      title,
      content: generatedContent,
      content_type: formData.type as any,
      status: 'draft',
      tags: [formData.style, 'ai-generated'],
      metadata: {
        generatedWith: formData.model,
        originalTopic: formData.topic,
        style: formData.style,
        length: formData.length,
      }
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success('Content copied to clipboard!');
  };

  const downloadContent = () => {
    const selectedType = contentTypes.find(t => t.value === formData.type);
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedType?.label}-${formData.topic}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Content</CardTitle>
        <CardDescription>
          Your AI-generated content will appear here
        </CardDescription>
      </CardHeader>
      <CardContent>
        {generatedContent ? (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleSaveToLibrary} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save to Library
              </Button>
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button onClick={downloadContent} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="flex gap-1">
              <Badge variant="secondary">{formData.style}</Badge>
              <Badge variant="secondary">{formData.length}</Badge>
              <Badge variant="outline">{formData.model}</Badge>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Generated content will appear here</p>
            <p className="text-sm">Fill out the form and click "Generate Content" to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
