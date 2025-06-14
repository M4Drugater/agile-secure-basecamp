
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Zap, Brain } from 'lucide-react';

interface ResearchTypeSelectorProps {
  researchType: 'quick' | 'comprehensive' | 'industry-specific';
  setResearchType: (type: 'quick' | 'comprehensive' | 'industry-specific') => void;
}

const researchTypeOptions = [
  {
    value: 'quick' as const,
    label: 'Quick Overview',
    description: 'Fast insights and key facts (3-5 credits)',
    icon: Zap,
    credits: 3
  },
  {
    value: 'comprehensive' as const,
    label: 'Comprehensive Analysis',
    description: 'In-depth research with full context (6-8 credits)',
    icon: Brain,
    credits: 6
  },
  {
    value: 'industry-specific' as const,
    label: 'Industry-Specific',
    description: 'Sector-focused deep dive (8-10 credits)',
    icon: Target,
    credits: 8
  }
];

export const ResearchTypeSelector = React.memo(({
  researchType,
  setResearchType
}: ResearchTypeSelectorProps) => {
  return (
    <div className="space-y-3">
      <h4 className="font-medium flex items-center gap-2">
        <Target className="h-4 w-4" />
        Research Type
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {researchTypeOptions.map((option) => (
          <Card 
            key={option.value}
            className={`cursor-pointer transition-colors ${
              researchType === option.value 
                ? 'border-blue-500 bg-blue-50' 
                : 'hover:bg-muted/50'
            }`}
            onClick={() => setResearchType(option.value)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <option.icon className="h-5 w-5 mt-0.5 text-blue-500" />
                <div className="space-y-1">
                  <h5 className="font-medium text-sm">{option.label}</h5>
                  <p className="text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});

ResearchTypeSelector.displayName = 'ResearchTypeSelector';
