
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface QuickSettingsForm {
  platform_name: string;
  max_users_per_org: string;
  session_timeout_minutes: string;
  support_email: string;
}

export function QuickSettings() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<QuickSettingsForm>({
    platform_name: 'LAIGENT v2.0',
    max_users_per_org: '100',
    session_timeout_minutes: '30',
    support_email: 'support@laigent.com'
  });

  const saveSettings = useMutation({
    mutationFn: async (settings: QuickSettingsForm) => {
      const configs = [
        { key: 'platform_name', value: settings.platform_name, description: 'Display name for the platform' },
        { key: 'max_users_per_organization', value: parseInt(settings.max_users_per_org), description: 'Maximum users allowed per organization' },
        { key: 'session_timeout_minutes', value: parseInt(settings.session_timeout_minutes), description: 'Auto logout after inactivity (minutes)' },
        { key: 'support_email', value: settings.support_email, description: 'Contact email for user support' }
      ];

      for (const config of configs) {
        const { error } = await supabase
          .from('system_config')
          .upsert({
            key: config.key,
            value: config.value,
            description: config.description,
            is_public: true,
            updated_by: profile?.id
          }, { onConflict: 'key' });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-config'] });
      toast({
        title: "Settings saved",
        description: "Quick settings have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (key: keyof QuickSettingsForm, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveSettings.mutate(formData);
  };

  // Check if user has admin privileges
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quick Settings</CardTitle>
          <CardDescription>
            Admin privileges required to modify system settings.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
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
            <Input 
              value={formData.platform_name}
              onChange={(e) => handleInputChange('platform_name', e.target.value)}
              placeholder="LAIGENT v2.0" 
            />
            <p className="text-xs text-muted-foreground">Display name for the platform</p>
          </div>
          <div className="space-y-2">
            <Label>Max Users Per Organization</Label>
            <Input 
              type="number" 
              value={formData.max_users_per_org}
              onChange={(e) => handleInputChange('max_users_per_org', e.target.value)}
              placeholder="100" 
            />
            <p className="text-xs text-muted-foreground">Maximum users allowed</p>
          </div>
          <div className="space-y-2">
            <Label>Session Timeout (minutes)</Label>
            <Input 
              type="number" 
              value={formData.session_timeout_minutes}
              onChange={(e) => handleInputChange('session_timeout_minutes', e.target.value)}
              placeholder="30" 
            />
            <p className="text-xs text-muted-foreground">Auto logout after inactivity</p>
          </div>
          <div className="space-y-2">
            <Label>Support Email</Label>
            <Input 
              type="email" 
              value={formData.support_email}
              onChange={(e) => handleInputChange('support_email', e.target.value)}
              placeholder="support@laigent.com" 
            />
            <p className="text-xs text-muted-foreground">Contact email for users</p>
          </div>
        </div>
        <Button 
          className="w-full md:w-auto" 
          onClick={handleSave}
          disabled={saveSettings.isPending}
        >
          {saveSettings.isPending ? 'Saving...' : 'Save Quick Settings'}
        </Button>
      </CardContent>
    </Card>
  );
}
