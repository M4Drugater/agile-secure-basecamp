
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Wand2, Save, Download, Copy, Library } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useContentItems } from '@/hooks/useContentItems';
import { useNavigate } from 'react-router-dom';

export function ContentGenerator() {
  const navigate = useNavigate();
  const { createContentItem } = useContentItems();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [formData, setFormData] = useState({
    type: 'resume',
    topic: '',
    style: 'professional',
    length: 'medium',
    model: 'gpt-4o-mini',
    customPrompt: ''
  });

  const contentTypes = [
    { value: 'resume', label: 'Resume', description: 'Professional resume with work experience and skills' },
    { value: 'cover-letter', label: 'Cover Letter', description: 'Personalized cover letter for job applications' },
    { value: 'linkedin-post', label: 'LinkedIn Post', description: 'Professional social media content' },
    { value: 'email', label: 'Professional Email', description: 'Business correspondence and communication' },
    { value: 'presentation', label: 'Presentation Outline', description: 'Structured presentation content' },
    { value: 'article', label: 'Article', description: 'Professional articles and thought leadership' },
  ];

  const styles = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'formal', label: 'Formal' },
    { value: 'creative', label: 'Creative' },
    { value: 'technical', label: 'Technical' },
  ];

  const lengths = [
    { value: 'short', label: 'Short (1-2 paragraphs)' },
    { value: 'medium', label: 'Medium (3-5 paragraphs)' },
    { value: 'long', label: 'Long (6+ paragraphs)' },
  ];

  const models = [
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Fast & Cost-effective)' },
    { value: 'gpt-4o', label: 'GPT-4o (Advanced)' },
  ];

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      toast.error('Please provide a topic or description');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: formData.type,
          topic: formData.topic,
          style: formData.style,
          length: formData.length,
          model: formData.model,
          customPrompt: formData.customPrompt || undefined,
        },
      });

      if (error) throw error;

      setGeneratedContent(data.content);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Content Generator</h1>
          <p className="text-muted-foreground">
            Generate professional content with AI assistance
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/content-library')}>
          <Library className="h-4 w-4 mr-2" />
          Content Library
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wand2 className="h-5 w-5 mr-2" />
              Content Settings
            </CardTitle>
            <CardDescription>
              Configure your content generation preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="type">Content Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="topic">Topic/Description</Label>
              <Textarea
                id="topic"
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="Describe what you want to create (e.g., 'Software Engineer resume with 5 years experience in React and Node.js')"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="style">Writing Style</Label>
                <Select value={formData.style} onValueChange={(value) => setFormData(prev => ({ ...prev, style: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {styles.map(style => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="length">Content Length</Label>
                <Select value={formData.length} onValueChange={(value) => setFormData(prev => ({ ...prev, length: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {lengths.map(length => (
                      <SelectItem key={length.value} value={length.value}>
                        {length.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="model">AI Model</Label>
              <Select value={formData.model} onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {models.map(model => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="customPrompt">Custom Instructions (Optional)</Label>
              <Textarea
                id="customPrompt"
                value={formData.customPrompt}
                onChange={(e) => setFormData(prev => ({ ...prev, customPrompt: e.target.value }))}
                placeholder="Add any specific instructions or requirements..."
                rows={2}
              />
            </div>

            <Button onClick={handleGenerate} disabled={isGenerating || !formData.topic.trim()} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
      </div>

      <Alert>
        <AlertDescription>
          All generated content is automatically saved with metadata for future reference. 
          You can manage and organize your content in the Content Library.
        </AlertDescription>
      </Alert>
    </div>
  );
}
