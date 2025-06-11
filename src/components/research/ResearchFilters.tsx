
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Settings, Zap, Brain } from 'lucide-react';

interface ResearchFiltersProps {
  model: 'llama-3.1-sonar-small-128k-online' | 'llama-3.1-sonar-large-128k-online';
  onModelChange: (model: 'llama-3.1-sonar-small-128k-online' | 'llama-3.1-sonar-large-128k-online') => void;
  isResearching: boolean;
}

export function ResearchFilters({ model, onModelChange, isResearching }: ResearchFiltersProps) {
  const modelOptions = [
    {
      value: 'llama-3.1-sonar-small-128k-online',
      label: 'Fast Research',
      description: 'Quick results, lower cost',
      icon: Zap,
      multiplier: '1x credits'
    },
    {
      value: 'llama-3.1-sonar-large-128k-online',
      label: 'Deep Research',
      description: 'Comprehensive analysis, higher quality',
      icon: Brain,
      multiplier: '1.5x credits'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Research Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium">AI Model</Label>
          <RadioGroup
            value={model}
            onValueChange={(value) => onModelChange(value as typeof model)}
            disabled={isResearching}
          >
            {modelOptions.map((option) => (
              <div key={option.value} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      <span className="font-medium">{option.label}</span>
                      <Badge variant="outline" className="text-xs">
                        {option.multiplier}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="pt-4 border-t">
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>• Fast Research: Quick insights for immediate use</p>
            <p>• Deep Research: Comprehensive analysis with detailed sources</p>
            <p>• All research includes verified sources and citations</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
