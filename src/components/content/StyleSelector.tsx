
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Palette, Zap, Brain, Target } from 'lucide-react';

interface StyleOption {
  value: string;
  label: string;
  description: string;
  tone: string;
  useCase: string;
  icon: React.ReactNode;
}

const styleOptions: StyleOption[] = [
  {
    value: 'executive',
    label: 'Executive',
    description: 'Formal, strategic, C-suite ready',
    tone: 'Authoritative & Strategic',
    useCase: 'Board presentations, strategic reports',
    icon: <Target className="h-4 w-4" />
  },
  {
    value: 'consultative',
    label: 'Consultative',
    description: 'Advisory, analytical, data-driven',
    tone: 'Professional & Analytical',
    useCase: 'Client reports, recommendations',
    icon: <Brain className="h-4 w-4" />
  },
  {
    value: 'creative',
    label: 'Creative',
    description: 'Innovative, engaging, inspiring',
    tone: 'Dynamic & Innovative',
    useCase: 'Marketing content, ideation',
    icon: <Zap className="h-4 w-4" />
  },
  {
    value: 'technical',
    label: 'Technical',
    description: 'Precise, detailed, methodical',
    tone: 'Clear & Systematic',
    useCase: 'Technical documentation, processes',
    icon: <Palette className="h-4 w-4" />
  },
  {
    value: 'persuasive',
    label: 'Persuasive',
    description: 'Compelling, influential, action-oriented',
    tone: 'Confident & Convincing',
    useCase: 'Sales proposals, negotiations',
    icon: <Target className="h-4 w-4" />
  },
  {
    value: 'collaborative',
    label: 'Collaborative',
    description: 'Inclusive, team-focused, engaging',
    tone: 'Warm & Inclusive',
    useCase: 'Team communications, workshops',
    icon: <Brain className="h-4 w-4" />
  }
];

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  showDetails?: boolean;
}

export function StyleSelector({ selectedStyle, onStyleChange, showDetails = true }: StyleSelectorProps) {
  const selectedOption = styleOptions.find(option => option.value === selectedStyle);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Content Style & Tone</label>
        <Select value={selectedStyle} onValueChange={onStyleChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a writing style" />
          </SelectTrigger>
          <SelectContent>
            {styleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  {option.icon}
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showDetails && selectedOption && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              {selectedOption.icon}
              {selectedOption.label} Style
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Badge variant="secondary">{selectedOption.tone}</Badge>
              <Badge variant="outline">Best for: {selectedOption.useCase}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedOption.description}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
