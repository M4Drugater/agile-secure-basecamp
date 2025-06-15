
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, FileText, Users, Loader2, Copy, Save, Download } from 'lucide-react';
import { ContentGeneratorForm } from './ContentGeneratorForm';
import { ContentOutput } from './ContentOutput';
import { usePremiumContentGeneration } from '@/hooks/content/usePremiumContentGeneration';
import { ContentFormData } from '../ContentGeneratorTypes';

interface ContentGeneratorTabProps {
  contextSummary: any;
}

export function ContentGeneratorTab({ contextSummary }: ContentGeneratorTabProps) {
  const { 
    isGenerating, 
    generatedContent, 
    handleGenerate, 
    setGeneratedContent,
    generationMetrics 
  } = usePremiumContentGeneration();
  
  const [formData, setFormData] = useState<ContentFormData>({
    type: 'executive-memo',
    topic: '',
    style: 'executive',
    length: 'medium',
    model: 'gpt-4o',
    customPrompt: '',
    targetAudience: 'c-suite-executives',
    businessContext: '',
    useKnowledge: true,
    tone: 'authoritative',
    industry: 'technology',
    purpose: 'strategic-communication',
  });

  const handleGenerateContent = () => {
    handleGenerate(formData);
  };

  const agentCapabilities = [
    {
      icon: Brain,
      title: 'Strategic Intelligence',
      description: 'Leverages CLIPOGINO for strategic insights',
      status: 'Active'
    },
    {
      icon: FileText,
      title: 'Content Optimization',
      description: 'Advanced content structuring and enhancement',
      status: 'Active'
    },
    {
      icon: Users,
      title: 'Audience Analysis',
      description: 'Tailored messaging for target demographics',
      status: 'Active'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form Section */}
      <div className="space-y-6">
        <ContentGeneratorForm
          formData={formData}
          setFormData={setFormData}
          onGenerate={handleGenerateContent}
          isGenerating={isGenerating}
          contextSummary={contextSummary}
        />

        {/* AI Capabilities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Intelligence Active</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {agentCapabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Icon className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{capability.title}</div>
                    <div className="text-xs text-muted-foreground">{capability.description}</div>
                  </div>
                  <Badge variant="default" className="text-xs">
                    {capability.status}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Output Section */}
      <div className="space-y-6">
        <ContentOutput
          content={generatedContent}
          isGenerating={isGenerating}
          onContentChange={setGeneratedContent}
          metrics={generationMetrics}
        />
      </div>
    </div>
  );
}
