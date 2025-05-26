
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { FileText, Video, BookOpen, HelpCircle, CheckSquare, MessageSquare } from 'lucide-react';
import { CreateLearningModuleData } from '@/hooks/useLearningModules';

interface ModuleBasicInfoProps {
  newModule: Partial<CreateLearningModuleData>;
  setNewModule: (module: Partial<CreateLearningModuleData>) => void;
}

const moduleTypeIcons = {
  text: FileText,
  video: Video,
  interactive: BookOpen,
  quiz: HelpCircle,
  assignment: CheckSquare,
  discussion: MessageSquare,
};

export function ModuleBasicInfo({ newModule, setNewModule }: ModuleBasicInfoProps) {
  return (
    <div className="space-y-4">
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
        <RichTextEditor
          content={newModule.description || ''}
          onChange={(content) => setNewModule({ ...newModule, description: content })}
          placeholder="Brief description of what this module covers"
          className="min-h-[120px]"
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
    </div>
  );
}
