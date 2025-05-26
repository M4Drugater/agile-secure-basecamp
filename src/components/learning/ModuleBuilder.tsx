
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useLearningModules, CreateLearningModuleData } from '@/hooks/useLearningModules';
import { ModuleBasicInfo, ModuleContent, ModuleSettings } from './module-builder';

interface ModuleBuilderProps {
  learningPathId: string;
  onModuleCreated?: () => void;
}

export function ModuleBuilder({ learningPathId, onModuleCreated }: ModuleBuilderProps) {
  const { modules, createModule, isCreating } = useLearningModules(learningPathId);
  const [newModule, setNewModule] = useState<Partial<CreateLearningModuleData>>({
    learning_path_id: learningPathId,
    title: '',
    description: '',
    content: '',
    module_type: 'text',
    order_index: (modules?.length || 0) + 1,
    estimated_duration_minutes: 15,
    is_required: true,
    passing_score: 70,
    resources: [],
  });

  const [resources, setResources] = useState<Array<{ title: string; url: string; type: string }>>([]);

  const handleCreateModule = () => {
    if (!newModule.title) {
      return;
    }

    createModule({
      ...newModule,
      resources: resources,
    } as CreateLearningModuleData);

    // Reset form
    setNewModule({
      learning_path_id: learningPathId,
      title: '',
      description: '',
      content: '',
      module_type: 'text',
      order_index: (modules?.length || 0) + 2,
      estimated_duration_minutes: 15,
      is_required: true,
      passing_score: 70,
      resources: [],
    });
    setResources([]);
    
    onModuleCreated?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Module
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <ModuleBasicInfo 
              newModule={newModule}
              setNewModule={setNewModule}
            />
          </TabsContent>

          <TabsContent value="content">
            <ModuleContent
              newModule={newModule}
              setNewModule={setNewModule}
              resources={resources}
              setResources={setResources}
            />
          </TabsContent>

          <TabsContent value="settings">
            <ModuleSettings
              newModule={newModule}
              setNewModule={setNewModule}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button 
            onClick={handleCreateModule} 
            disabled={!newModule.title || isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Module'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
