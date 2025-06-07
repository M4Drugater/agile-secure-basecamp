
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Library, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EnhancedContentGeneratorForm } from './EnhancedContentGeneratorForm';
import { ContentGeneratorPreview } from './ContentGeneratorPreview';
import { useEnhancedContentGeneration } from '@/hooks/useEnhancedContentGeneration';
import { useKnowledgeContext } from '@/hooks/useKnowledgeContext';
import { ContentFormData } from './ContentGeneratorTypes';

export function ContentGenerator() {
  const navigate = useNavigate();
  const { isGenerating, generatedContent, handleGenerate, profile } = useEnhancedContentGeneration();
  const { getTotalDocumentCount } = useKnowledgeContext();
  const [formData, setFormData] = useState<ContentFormData>({
    type: 'executive-memo',
    topic: '',
    style: 'executive',
    length: 'medium',
    model: 'gpt-4o',
    customPrompt: '',
    targetAudience: 'c-suite',
    businessContext: '',
    useKnowledge: true,
    tone: 'confident',
    industry: '',
    purpose: 'strategic-planning'
  });

  const hasKnowledgeBase = getTotalDocumentCount() > 0;

  const onGenerate = () => {
    handleGenerate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Enhanced AI Content Generator</h1>
          <p className="text-muted-foreground">
            Generate executive-level content with AI intelligence and knowledge base integration
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/content-library')}>
          <Library className="h-4 w-4 mr-2" />
          Content Library
        </Button>
      </div>

      {/* Enhanced Features Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Enhanced Features:</strong> This upgraded content generator creates C-suite quality content with 
          {hasKnowledgeBase ? ' knowledge base integration, ' : ' '}
          advanced personalization, industry context, and executive-level prompts for professional excellence.
        </AlertDescription>
      </Alert>

      {/* Profile Context Display */}
      {profile && (
        <Alert>
          <AlertDescription>
            <strong>Personalization Active:</strong> Content will be tailored for {profile.current_position || 'your role'} 
            {profile.company && ` at ${profile.company}`}
            {profile.industry && ` in ${profile.industry}`}.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnhancedContentGeneratorForm
          formData={formData}
          setFormData={setFormData}
          onGenerate={onGenerate}
          isGenerating={isGenerating}
          hasKnowledgeBase={hasKnowledgeBase}
        />

        <ContentGeneratorPreview
          generatedContent={generatedContent}
          formData={formData}
        />
      </div>

      <Alert>
        <AlertDescription>
          All generated content is automatically saved with comprehensive metadata for future reference. 
          Enhanced content includes strategic insights, business context, and executive-level quality suitable for C-suite consumption.
        </AlertDescription>
      </Alert>
    </div>
  );
}
