
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { UserManagement } from '@/components/admin/UserManagement';
import { SystemConfig } from '@/components/admin/SystemConfig';
import { AuditLogs } from '@/components/admin/AuditLogs';
import { Badge } from '@/components/ui/badge';
import { Settings, Users, BarChart3, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
  const isSuperAdmin = profile?.role === 'super_admin';

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
      {/* Admin Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <Badge variant="outline" className="text-xs">
              Phase 1B - Admin Management
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Welcome, {profile?.full_name || 'Admin'}
            </div>
            <Badge variant={isSuperAdmin ? "default" : "secondary"}>
              {profile?.role?.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Config
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <AdminDashboard />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <SystemConfig />
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <AuditLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
}
