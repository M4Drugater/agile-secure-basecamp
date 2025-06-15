
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Zap, 
  Brain, 
  DollarSign, 
  Globe,
  Crown,
  Sparkles
} from 'lucide-react';

interface ModelOption {
  id: string;
  name: string;
  provider: 'openai' | 'claude';
  cost: 'low' | 'medium' | 'high';
  speed: 'fast' | 'medium' | 'slow';
  capabilities: string[];
}

const eliteModels: ModelOption[] = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    cost: 'low',
    speed: 'fast',
    capabilities: ['Vision', 'Code', 'Analysis']
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    cost: 'high',
    speed: 'medium',
    capabilities: ['Vision', 'Advanced Reasoning', 'Complex Analysis']
  },
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'claude',
    cost: 'medium',
    speed: 'fast',
    capabilities: ['Advanced Reasoning', 'Creative Writing', 'Code Analysis']
  },
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    provider: 'claude',
    cost: 'high',
    speed: 'slow',
    capabilities: ['Supreme Intelligence', 'Complex Reasoning', 'Research']
  }
];

interface EliteModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  webSearchEnabled: boolean;
  onWebSearchToggle: (enabled: boolean) => void;
  disabled?: boolean;
}

export function EliteModelSelector({ 
  selectedModel, 
  onModelChange, 
  webSearchEnabled,
  onWebSearchToggle,
  disabled 
}: EliteModelSelectorProps) {
  const currentModel = eliteModels.find(m => m.id === selectedModel) || eliteModels[0];

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai': return <Zap className="h-3 w-3" />;
      case 'claude': return <Brain className="h-3 w-3" />;
      default: return <Sparkles className="h-3 w-3" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Crown className="h-5 w-5 text-yellow-500" />
          Elite AI Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Model Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">AI Model</label>
          <Select value={selectedModel} onValueChange={onModelChange} disabled={disabled}>
            <SelectTrigger className="w-full">
              <SelectValue>
                <div className="flex items-center space-x-2">
                  {getProviderIcon(currentModel.provider)}
                  <span>{currentModel.name}</span>
                  <Badge variant="outline" className={getCostColor(currentModel.cost)}>
                    <DollarSign className="h-2 w-2 mr-1" />
                    {currentModel.cost}
                  </Badge>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {eliteModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2 mb-1">
                      {getProviderIcon(model.provider)}
                      <span className="font-medium">{model.name}</span>
                      <Badge variant="outline" className={getCostColor(model.cost)}>
                        <DollarSign className="h-2 w-2 mr-1" />
                        {model.cost}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {model.capabilities.map((cap, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Web Search Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Real-Time Web Search</span>
          </div>
          <Button
            variant={webSearchEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => onWebSearchToggle(!webSearchEnabled)}
            disabled={disabled}
            className="h-8"
          >
            {webSearchEnabled ? "Enabled" : "Disabled"}
          </Button>
        </div>

        {/* Model Info */}
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Provider:</span>
              <span className="font-medium capitalize">{currentModel.provider}</span>
            </div>
            <div className="flex justify-between">
              <span>Speed:</span>
              <span className="font-medium capitalize">{currentModel.speed}</span>
            </div>
            <div className="flex justify-between">
              <span>Web Search:</span>
              <span className="font-medium">{webSearchEnabled ? "Active" : "Inactive"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
