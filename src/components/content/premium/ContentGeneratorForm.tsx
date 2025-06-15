
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wand2, Brain, Crown } from 'lucide-react';
import { ContentFormData, contentTypes, styles, tones, lengths, models, targetAudiences, industries, purposes } from '../ContentGeneratorTypes';

interface ContentGeneratorFormProps {
  formData: ContentFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContentFormData>>;
  onGenerate: () => void;
  isGenerating: boolean;
  contextSummary: any;
}

export function ContentGeneratorForm({ 
  formData, 
  setFormData, 
  onGenerate, 
  isGenerating,
  contextSummary 
}: ContentGeneratorFormProps) {
  
  const getPersonalizationLevel = () => {
    let level = 0;
    if (contextSummary.hasProfile) level += 30;
    if (contextSummary.knowledgeCount > 0) level += 25;
    if (contextSummary.contentCount > 0) level += 20;
    if (contextSummary.conversationCount > 0) level += 25;
    return Math.min(100, level);
  };

  const personalizationLevel = getPersonalizationLevel();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-purple-500" />
          Premium Content Generator
        </CardTitle>
        
        {/* Personalization Status */}
        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <Brain className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-medium">Personalization Level:</span>
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            {personalizationLevel}% Enhanced
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Content Type */}
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

        {/* Topic */}
        <div>
          <Label htmlFor="topic">Topic & Requirements</Label>
          <Textarea
            id="topic"
            value={formData.topic}
            onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
            placeholder="Describe your content requirements in detail... (e.g., 'Q3 strategic review for board presentation focusing on market expansion and competitive positioning in the fintech sector')"
            rows={4}
          />
        </div>

        {/* Target Audience & Industry */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Select value={formData.targetAudience} onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}>
              <SelectTrigger>
                <SelectValue />
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

          <div>
            <Label htmlFor="industry">Industry Context</Label>
            <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
              <SelectTrigger>
                <SelectValue />
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
        </div>

        {/* Style & Tone */}
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
                <SelectValue />
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

        {/* Length & Purpose */}
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
                <SelectValue />
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
          <Label htmlFor="businessContext">Business Context</Label>
          <Textarea
            id="businessContext"
            value={formData.businessContext}
            onChange={(e) => setFormData(prev => ({ ...prev, businessContext: e.target.value }))}
            placeholder="Provide relevant business context, market conditions, strategic priorities, or recent developments..."
            rows={3}
          />
        </div>

        {/* Premium Features */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg bg-purple-50">
            <div className="flex items-center space-x-3">
              <Brain className="h-5 w-5 text-purple-500" />
              <div>
                <Label className="text-sm font-medium">
                  Knowledge Base Integration
                </Label>
                <p className="text-xs text-muted-foreground">
                  Enhance with your personal knowledge ({contextSummary.knowledgeCount} docs)
                </p>
              </div>
            </div>
            <Switch
              checked={formData.useKnowledge || false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, useKnowledge: checked }))}
            />
          </div>
        </div>

        {/* AI Model */}
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
          <Label htmlFor="customPrompt">Additional Instructions</Label>
          <Textarea
            id="customPrompt"
            value={formData.customPrompt}
            onChange={(e) => setFormData(prev => ({ ...prev, customPrompt: e.target.value }))}
            placeholder="Add specific requirements, key points to include, compliance needs, or style preferences..."
            rows={3}
          />
        </div>

        <Button 
          onClick={onGenerate} 
          disabled={isGenerating || !formData.topic.trim()} 
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Premium Content...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Premium Content
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
