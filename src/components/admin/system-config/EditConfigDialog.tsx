
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { SystemConfig, SystemConfigUpdate } from './types';

interface EditConfigDialogProps {
  config: SystemConfig;
}

export function EditConfigDialog({ config }: EditConfigDialogProps) {
  const queryClient = useQueryClient();

  const updateConfig = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: SystemConfigUpdate }) => {
      const { data, error } = await supabase
        .from('system_config')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-config'] });
      toast({
        title: "Configuration updated",
        description: "System configuration has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update configuration. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatValue = (value: any) => {
    if (typeof value === 'string') return value;
    return JSON.stringify(value, null, 2);
  };

  const handleUpdateConfig = (config: SystemConfig, updates: Partial<SystemConfig>) => {
    updateConfig.mutate({
      id: config.id,
      updates,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Configuration</DialogTitle>
          <DialogDescription>
            Update system configuration setting.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Key</Label>
            <Input value={config.key} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-value">Value</Label>
            <Textarea
              id="edit-value"
              defaultValue={formatValue(config.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Input
              id="edit-description"
              defaultValue={config.description || ''}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="edit-is_public"
              defaultChecked={config.is_public || false}
            />
            <Label htmlFor="edit-is_public">Public</Label>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={() => {
              const valueInput = document.getElementById('edit-value') as HTMLTextAreaElement;
              const descInput = document.getElementById('edit-description') as HTMLInputElement;
              const publicSwitch = document.getElementById('edit-is_public') as HTMLInputElement;
              
              let parsedValue;
              try {
                parsedValue = JSON.parse(valueInput.value);
              } catch {
                parsedValue = valueInput.value;
              }
              
              handleUpdateConfig(config, {
                value: parsedValue,
                description: descInput.value || null,
                is_public: publicSwitch.checked,
              });
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
