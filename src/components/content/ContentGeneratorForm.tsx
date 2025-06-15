
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Wand2 } from 'lucide-react';
import { ContentFormData, contentTypes, styles, lengths, models } from './ContentGeneratorTypes';

interface ContentGeneratorFormProps {
  formData: ContentFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContentFormData>>;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function ContentGeneratorForm({ 
  formData, 
  setFormData, 
  onGenerate, 
  isGenerating 
}: ContentGeneratorFormProps) {
  return (
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

        <Button onClick={onGenerate} disabled={isGenerating || !formData.topic.trim()} className="w-full">
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
  );
}
