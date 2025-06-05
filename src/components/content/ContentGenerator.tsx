
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Library } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ContentGeneratorForm } from './ContentGeneratorForm';
import { ContentGeneratorPreview } from './ContentGeneratorPreview';
import { useContentGeneration } from './useContentGeneration';
import { ContentFormData } from './ContentGeneratorTypes';

export function ContentGenerator() {
  const navigate = useNavigate();
  const { isGenerating, generatedContent, handleGenerate } = useContentGeneration();
  const [formData, setFormData] = useState<ContentFormData>({
    type: 'resume',
    topic: '',
    style: 'professional',
    length: 'medium',
    model: 'gpt-4o-mini',
    customPrompt: ''
  });

  const onGenerate = () => {
    handleGenerate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Content Generator</h1>
          <p className="text-muted-foreground">
            Generate professional content with AI assistance
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/content-library')}>
          <Library className="h-4 w-4 mr-2" />
          Content Library
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContentGeneratorForm
          formData={formData}
          setFormData={setFormData}
          onGenerate={onGenerate}
          isGenerating={isGenerating}
        />

        <ContentGeneratorPreview
          generatedContent={generatedContent}
          formData={formData}
        />
      </div>

      <Alert>
        <AlertDescription>
          All generated content is automatically saved with metadata for future reference. 
          You can manage and organize your content in the Content Library.
        </AlertDescription>
      </Alert>
    </div>
  );
}
