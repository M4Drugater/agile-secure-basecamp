
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CreateLearningModuleData } from '@/hooks/useLearningModules';

interface ModuleSettingsProps {
  newModule: Partial<CreateLearningModuleData>;
  setNewModule: (module: Partial<CreateLearningModuleData>) => void;
}

export function ModuleSettings({ newModule, setNewModule }: ModuleSettingsProps) {
  return (
    <div className="space-y-4">
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
    </div>
  );
}
