import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Settings, Plus, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';
import { StripeSync } from './StripeSync';

type SystemConfig = Database['public']['Tables']['system_config']['Row'];
type SystemConfigInsert = Database['public']['Tables']['system_config']['Insert'];
type SystemConfigUpdate = Database['public']['Tables']['system_config']['Update'];

export function SystemConfig() {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<SystemConfig | null>(null);
  const [newConfig, setNewConfig] = useState({
    key: '',
    value: '',
    description: '',
    is_public: false,
  });

  const { data: configs, isLoading } = useQuery({
    queryKey: ['system-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_config')
        .select('*')
        .order('key');
      
      if (error) throw error;
      return data;
    },
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
      setIsAddDialogOpen(false);
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
      setEditingConfig(null);
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

  const handleUpdateConfig = (config: SystemConfig, updates: Partial<SystemConfig>) => {
    updateConfig.mutate({
      id: config.id,
      updates,
    });
  };

  const formatValue = (value: any) => {
    if (typeof value === 'string') return value;
    return JSON.stringify(value, null, 2);
  };

  return (
    <div className="space-y-6">
      {/* Stripe & Credit System Sync Section */}
      <StripeSync />

      {/* Existing System Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                System Configuration
              </CardTitle>
              <CardDescription>
                Manage application settings and configuration values
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading configurations...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {configs?.map((config) => (
                    <TableRow key={config.id}>
                      <TableCell className="font-medium">{config.key}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate text-sm">
                          {formatValue(config.value)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {config.description || 'No description'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={config.is_public ? 'default' : 'secondary'}>
                          {config.is_public ? 'Public' : 'Private'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingConfig(config)}
                            >
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
                                  onChange={(e) => {
                                    // Update will be handled on save
                                  }}
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Predefined System Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Settings</CardTitle>
          <CardDescription>
            Common system settings that can be configured quickly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Platform Name</Label>
              <Input placeholder="LAIGENT v2.0" />
              <p className="text-xs text-muted-foreground">Display name for the platform</p>
            </div>
            <div className="space-y-2">
              <Label>Max Users Per Organization</Label>
              <Input type="number" placeholder="100" />
              <p className="text-xs text-muted-foreground">Maximum users allowed</p>
            </div>
            <div className="space-y-2">
              <Label>Session Timeout (minutes)</Label>
              <Input type="number" placeholder="30" />
              <p className="text-xs text-muted-foreground">Auto logout after inactivity</p>
            </div>
            <div className="space-y-2">
              <Label>Support Email</Label>
              <Input type="email" placeholder="support@laigent.com" />
              <p className="text-xs text-muted-foreground">Contact email for users</p>
            </div>
          </div>
          <Button className="w-full md:w-auto">Save Quick Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
