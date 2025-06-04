
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { StripeSync } from './StripeSync';
import { SystemConfigTable } from './system-config/SystemConfigTable';
import { AddConfigDialog } from './system-config/AddConfigDialog';
import { QuickSettings } from './system-config/QuickSettings';

export function SystemConfig() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Stripe & Credit System Sync Section */}
      <StripeSync />

      {/* System Configuration */}
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
            <AddConfigDialog 
              isOpen={isAddDialogOpen} 
              onOpenChange={setIsAddDialogOpen} 
            />
          </div>
        </CardHeader>
        <CardContent>
          <SystemConfigTable configs={configs} isLoading={isLoading} />
        </CardContent>
      </Card>

      {/* Quick Settings */}
      <QuickSettings />
    </div>
  );
}
