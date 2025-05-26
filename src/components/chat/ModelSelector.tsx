
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Zap, Brain, DollarSign } from 'lucide-react';

interface ModelOption {
  value: string;
  label: string;
  description: string;
  cost: 'low' | 'medium' | 'high';
  speed: 'fast' | 'medium' | 'slow';
  intelligence: 'standard' | 'advanced' | 'premium';
}

const models: ModelOption[] = [
  {
    value: 'gpt-4o-mini',
    label: 'GPT-4o Mini',
    description: 'Fast and cost-effective for most conversations',
    cost: 'low',
    speed: 'fast',
    intelligence: 'standard'
  },
  {
    value: 'gpt-4o',
    label: 'GPT-4o',
    description: 'Advanced reasoning and complex problem solving',
    cost: 'high',
    speed: 'medium',
    intelligence: 'premium'
  }
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  disabled?: boolean;
}

export function ModelSelector({ selectedModel, onModelChange, disabled }: ModelSelectorProps) {
  const currentModel = models.find(m => m.value === selectedModel) || models[0];

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSpeedIcon = (speed: string) => {
    switch (speed) {
      case 'fast': return <Zap className="h-3 w-3" />;
      case 'medium': return <Brain className="h-3 w-3" />;
      case 'slow': return <Brain className="h-3 w-3" />;
      default: return <Brain className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-2">
      <Select value={selectedModel} onValueChange={onModelChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue>
            <div className="flex items-center space-x-2">
              {getSpeedIcon(currentModel.speed)}
              <span>{currentModel.label}</span>
              <Badge variant="outline" className={getCostColor(currentModel.cost)}>
                <DollarSign className="h-2 w-2 mr-1" />
                {currentModel.cost}
              </Badge>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.value} value={model.value}>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2 mb-1">
                  {getSpeedIcon(model.speed)}
                  <span className="font-medium">{model.label}</span>
                  <Badge variant="outline" className={getCostColor(model.cost)}>
                    <DollarSign className="h-2 w-2 mr-1" />
                    {model.cost}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">{model.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
