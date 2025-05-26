
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Plus, X, GripVertical } from 'lucide-react';

interface ModuleResourcesProps {
  resources: Array<{ title: string; url: string; type: string }>;
  setResources: (resources: Array<{ title: string; url: string; type: string }>) => void;
}

export function ModuleResources({ resources, setResources }: ModuleResourcesProps) {
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
  );
}
