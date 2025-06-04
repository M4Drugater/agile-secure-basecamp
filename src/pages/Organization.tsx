
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UniversalLayout } from '@/components/layout/UniversalLayout';
import { OrganizationSettings } from '@/components/organization/OrganizationSettings';
import { TeamManagement } from '@/components/organization/TeamManagement';
import { Building2, Users, Settings, BarChart } from 'lucide-react';

export default function Organization() {
  return (
    <UniversalLayout className="bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Building2 className="h-8 w-8 mr-3" />
            Organization Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your organization settings, team members, and enterprise features
          </p>
        </div>

        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <OrganizationSettings />
          </TabsContent>

          <TabsContent value="team">
            <TeamManagement />
          </TabsContent>

          <TabsContent value="billing">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Billing Management</h3>
              <p className="text-muted-foreground">
                Billing and subscription management coming soon
              </p>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Organization Analytics</h3>
              <p className="text-muted-foreground">
                Advanced analytics and reporting coming soon
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </UniversalLayout>
  );
}
