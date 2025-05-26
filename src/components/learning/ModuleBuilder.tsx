
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  X, 
  GripVertical, 
  FileText, 
  Video, 
  BookOpen, 
  HelpCircle,
  CheckSquare,
  MessageSquare
} from 'lucide-react';
import { useLearningModules, CreateLearningModuleData } from '@/hooks/useLearningModules';

interface ModuleBuilderProps {
  learningPathId: string;
  onModuleCreated?: () => void;
}

const moduleTypeIcons = {
  text: FileText,
  video: Video,
  interactive: BookOpen,
  quiz: HelpCircle,
  assignment: CheckSquare,
  discussion: MessageSquare,
};

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

  const addResource = () => {
    setResources([...resources, { title: '', url: '', type: 'link' }]);
  };

  const updateResource = (index: number, field: string, value: string) => {
    const updated = [...resources];
    updated[index] = { ...updated[index], [field]: value };
    setResources(updated);
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
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

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Module Title *</Label>
                <Input
                  id="title"
                  value={newModule.title || ''}
                  onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                  placeholder="Enter module title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="module_type">Module Type</Label>
                <Select 
                  value={newModule.module_type || 'text'} 
                  onValueChange={(value) => setNewModule({ ...newModule, module_type: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(moduleTypeIcons).map(([type, Icon]) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="capitalize">{type}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newModule.description || ''}
                onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                placeholder="Brief description of what this module covers"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newModule.estimated_duration_minutes || ''}
                  onChange={(e) => setNewModule({ ...newModule, estimated_duration_minutes: parseInt(e.target.value) || 0 })}
                  placeholder="15"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="order">Order Position</Label>
                <Input
                  id="order"
                  type="number"
                  value={newModule.order_index || ''}
                  onChange={(e) => setNewModule({ ...newModule, order_index: parseInt(e.target.value) || 1 })}
                  placeholder="1"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Module Content</Label>
              <Textarea
                id="content"
                value={newModule.content || ''}
                onChange={(e) => setNewModule({ ...newModule, content: e.target.value })}
                placeholder="Enter the main content for this module..."
                rows={8}
                className="min-h-[200px]"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Resources</Label>
                <Button type="button" variant="outline" size="sm" onClick={addResource}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Resource
                </Button>
              </div>
              
              {resources.map((resource, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-4">
                    <GripVertical className="h-5 w-5 text-muted-foreground mt-2" />
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Resource title"
                        value={resource.title}
                        onChange={(e) => updateResource(index, 'title', e.target.value)}
                      />
                      <Input
                        placeholder="Resource URL"
                        value={resource.url}
                        onChange={(e) => updateResource(index, 'url', e.target.value)}
                      />
                      <Select 
                        value={resource.type} 
                        onValueChange={(value) => updateResource(index, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="link">Link</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="document">Document</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeResource(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="required">Required Module</Label>
                  <Switch
                    id="required"
                    checked={newModule.is_required || false}
                    onCheckedChange={(checked) => setNewModule({ ...newModule, is_required: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passing_score">Passing Score (%)</Label>
                  <Input
                    id="passing_score"
                    type="number"
                    min="0"
                    max="100"
                    value={newModule.passing_score || ''}
                    onChange={(e) => setNewModule({ ...newModule, passing_score: parseInt(e.target.value) || 70 })}
                    placeholder="70"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Module Preview</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Title:</span>
                      <span className="font-medium">{newModule.title || 'Untitled'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Type:</span>
                      <Badge variant="outline" className="capitalize">
                        {newModule.module_type}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Duration:</span>
                      <span>{newModule.estimated_duration_minutes || 0} min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Required:</span>
                      <Badge variant={newModule.is_required ? 'default' : 'secondary'}>
                        {newModule.is_required ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
