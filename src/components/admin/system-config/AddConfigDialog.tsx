
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { SystemConfigInsert, NewConfigState } from './types';

interface AddConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddConfigDialog({ isOpen, onOpenChange }: AddConfigDialogProps) {
  const queryClient = useQueryClient();
  const [newConfig, setNewConfig] = useState<NewConfigState>({
    key: '',
    value: '',
    description: '',
    is_public: false,
  });

  const createConfig = useMutation({
    mutationFn: async (config: SystemConfigInsert) => {
      const { data, error } = await supabase
        .from('system_config')
        .insert(config)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-config'] });
      onOpenChange(false);
      setNewConfig({ key: '', value: '', description: '', is_public: false });
      toast({
        title: "Configuration added",
        description: "System configuration has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create configuration. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateConfig = () => {
    let parsedValue;
    try {
      parsedValue = JSON.parse(newConfig.value);
    } catch {
      parsedValue = newConfig.value;
    }

    createConfig.mutate({
      key: newConfig.key,
      value: parsedValue,
      description: newConfig.description || null,
      is_public: newConfig.is_public,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Config
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Configuration</DialogTitle>
          <DialogDescription>
            Create a new system configuration setting.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="key">Key</Label>
            <Input
              id="key"
              value={newConfig.key}
              onChange={(e) => setNewConfig({ ...newConfig, key: e.target.value })}
              placeholder="e.g., ai_api_key, max_users"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Textarea
              id="value"
              value={newConfig.value}
              onChange={(e) => setNewConfig({ ...newConfig, value: e.target.value })}
              placeholder="Enter value (JSON or plain text)"
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newConfig.description}
              onChange={(e) => setNewConfig({ ...newConfig, description: e.target.value })}
              placeholder="Optional description"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_public"
              checked={newConfig.is_public}
              onCheckedChange={(checked) => setNewConfig({ ...newConfig, is_public: checked })}
            />
            <Label htmlFor="is_public">Public (visible to non-admin users)</Label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateConfig}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
