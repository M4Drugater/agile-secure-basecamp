
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Wand2, Brain, Target, Building2 } from 'lucide-react';
import { ContentFormData, contentTypes, styles, tones, lengths, models, targetAudiences, industries, purposes } from './ContentGeneratorTypes';

interface EnhancedContentGeneratorFormProps {
  formData: ContentFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContentFormData>>;
  onGenerate: () => void;
  isGenerating: boolean;
  hasKnowledgeBase: boolean;
}

export function EnhancedContentGeneratorForm({ 
  formData, 
  setFormData, 
  onGenerate, 
  isGenerating,
  hasKnowledgeBase 
}: EnhancedContentGeneratorFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wand2 className="h-5 w-5 mr-2" />
          Enhanced Content Generator
        </CardTitle>
        <CardDescription>
          Generate executive-level content with AI and knowledge base integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Content Type Selection */}
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

        {/* Topic/Description */}
        <div>
          <Label htmlFor="topic">Topic/Subject Matter</Label>
          <Textarea
            id="topic"
            value={formData.topic}
            onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
            placeholder="Describe your content requirements (e.g., 'Q3 strategic review for board presentation focusing on market expansion and competitive positioning')"
            rows={3}
          />
        </div>

        {/* Target Audience */}
        <div>
          <Label htmlFor="targetAudience" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Target Audience
          </Label>
          <Select value={formData.targetAudience} onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select target audience" />
            </SelectTrigger>
            <SelectContent>
              {targetAudiences.map(audience => (
                <SelectItem key={audience.value} value={audience.value}>
                  {audience.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Industry Context */}
        <div>
          <Label htmlFor="industry" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Industry Context
          </Label>
          <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map(industry => (
                <SelectItem key={industry.value} value={industry.value}>
                  {industry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Style and Tone */}
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
            <Label htmlFor="tone">Communication Tone</Label>
            <Select value={formData.tone} onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {tones.map(tone => (
                  <SelectItem key={tone.value} value={tone.value}>
                    {tone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Length and Purpose */}
        <div className="grid grid-cols-2 gap-4">
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

          <div>
            <Label htmlFor="purpose">Primary Purpose</Label>
            <Select value={formData.purpose} onValueChange={(value) => setFormData(prev => ({ ...prev, purpose: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                {purposes.map(purpose => (
                  <SelectItem key={purpose.value} value={purpose.value}>
                    {purpose.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Business Context */}
        <div>
          <Label htmlFor="businessContext">Business Context (Optional)</Label>
          <Textarea
            id="businessContext"
            value={formData.businessContext}
            onChange={(e) => setFormData(prev => ({ ...prev, businessContext: e.target.value }))}
            placeholder="Provide relevant business context, market conditions, or strategic priorities..."
            rows={2}
          />
        </div>

        {/* Knowledge Base Integration */}
        {hasKnowledgeBase && (
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center space-x-3">
              <Brain className="h-5 w-5 text-primary" />
              <div>
                <Label htmlFor="useKnowledge" className="text-sm font-medium">
                  Use Knowledge Base
                </Label>
                <p className="text-xs text-muted-foreground">
                  Enhance content with your personal and system knowledge
                </p>
              </div>
            </div>
            <Switch
              id="useKnowledge"
              checked={formData.useKnowledge || false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, useKnowledge: checked }))}
            />
          </div>
        )}

        {/* AI Model Selection */}
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

        {/* Custom Instructions */}
        <div>
          <Label htmlFor="customPrompt">Additional Instructions (Optional)</Label>
          <Textarea
            id="customPrompt"
            value={formData.customPrompt}
            onChange={(e) => setFormData(prev => ({ ...prev, customPrompt: e.target.value }))}
            placeholder="Add specific requirements, key points to include, or style preferences..."
            rows={2}
          />
        </div>

        <Button onClick={onGenerate} disabled={isGenerating || !formData.topic.trim()} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Enhanced Content...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Executive Content
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
