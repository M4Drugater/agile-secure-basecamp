
import React from 'react';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { ModuleResources } from './ModuleResources';
import { CreateLearningModuleData } from '@/hooks/useLearningModules';

interface ModuleContentProps {
  newModule: Partial<CreateLearningModuleData>;
  setNewModule: (module: Partial<CreateLearningModuleData>) => void;
  resources: Array<{ title: string; url: string; type: string }>;
  setResources: (resources: Array<{ title: string; url: string; type: string }>) => void;
}

export function ModuleContent({ newModule, setNewModule, resources, setResources }: ModuleContentProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="content">Module Content</Label>
        <RichTextEditor
          content={newModule.content || ''}
          onChange={(content) => setNewModule({ ...newModule, content })}
          placeholder="Enter the main content for this module. You can use rich formatting, add links, images, and code blocks..."
          className="min-h-[300px]"
        />
      </div>

      <ModuleResources 
        resources={resources}
        setResources={setResources}
      />
    </div>
  );
}
