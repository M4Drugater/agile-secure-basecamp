
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LearningDashboard } from '@/components/learning/LearningDashboard';
import { LearningPathManagement } from '@/components/learning/LearningPathManagement';
import { UnifiedAppLayout } from '@/components/layout/UnifiedAppLayout';
import { useAuth } from '@/contexts/AuthContext';

export default function LearningManagement() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

  if (!isAdmin) {
    return (
      <UnifiedAppLayout>
        <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
          <LearningDashboard />
        </div>
      </UnifiedAppLayout>
    );
  }

  return (
    <UnifiedAppLayout>
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Learning Dashboard</TabsTrigger>
            <TabsTrigger value="management">Path Management</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <LearningDashboard />
          </TabsContent>

          <TabsContent value="management">
            <LearningPathManagement />
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedAppLayout>
  );
}
