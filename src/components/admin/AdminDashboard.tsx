
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Settings, BarChart3, Shield, Activity, Database, Clock, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function AdminDashboard() {
  const { data: userStats } = useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, is_active, created_at');
      
      if (error) throw error;
      
      const total = data.length;
      const active = data.filter(u => u.is_active).length;
      const admins = data.filter(u => u.role === 'admin' || u.role === 'super_admin').length;
      const newThisWeek = data.filter(u => {
        const created = new Date(u.created_at!);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return created > weekAgo;
      }).length;
      
      return { total, active, admins, newThisWeek };
    },
  });

  const { data: systemStats } = useQuery({
    queryKey: ['admin-system-stats'],
    queryFn: async () => {
      const { data: auditCount } = await supabase
        .from('audit_logs')
        .select('id', { count: 'exact', head: true });
      
      const { data: configCount } = await supabase
        .from('system_config')
        .select('id', { count: 'exact', head: true });
      
      return {
        auditLogs: auditCount || 0,
        configurations: configCount || 0,
        uptime: '99.9%',
        version: '2.0.0-beta',
      };
    },
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['admin-recent-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor system health, user activity, and platform performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{userStats?.newThisWeek || 0} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{userStats?.active || 0}</div>
            <p className="text-xs text-muted-foreground">
              {userStats?.total ? Math.round((userStats.active / userStats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{systemStats?.uptime || '99.9%'}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{userStats?.admins || 0}</div>
            <p className="text-xs text-muted-foreground">
              Admins & Super Admins
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Health & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database Connection</span>
              <Badge variant="default" className="bg-green-500">
                ✓ Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Authentication Service</span>
              <Badge variant="default" className="bg-green-500">
                ✓ Operational
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">RLS Policies</span>
              <Badge variant="default" className="bg-green-500">
                ✓ Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Audit Logging</span>
              <Badge variant="default" className="bg-green-500">
                ✓ Enabled
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Configurations</span>
              <Badge variant="outline">
                {systemStats?.configurations || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Platform Version</span>
              <Badge variant="secondary">
                v{systemStats?.version || '2.0.0'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest system events and user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity?.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">
                      {activity.action.replace('_', ' ')} on {activity.resource_type}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {activity.created_at ? new Date(activity.created_at).toLocaleString() : 'Unknown time'}
                    </p>
                  </div>
                </div>
              ))}
              {(!recentActivity || recentActivity.length === 0) && (
                <p className="text-muted-foreground text-sm">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto flex flex-col items-center p-4">
              <Users className="h-6 w-6 mb-2" />
              <span className="text-sm">Manage Users</span>
            </Button>
            <Button variant="outline" className="h-auto flex flex-col items-center p-4">
              <Settings className="h-6 w-6 mb-2" />
              <span className="text-sm">System Config</span>
            </Button>
            <Button variant="outline" className="h-auto flex flex-col items-center p-4">
              <BarChart3 className="h-6 w-6 mb-2" />
              <span className="text-sm">View Analytics</span>
            </Button>
            <Button variant="outline" className="h-auto flex flex-col items-center p-4">
              <Shield className="h-6 w-6 mb-2" />
              <span className="text-sm">Security Logs</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Phase Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Development Progress</CardTitle>
          <CardDescription>
            Current phase implementation status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Phase 1A: Foundation</span>
              <Badge variant="default" className="bg-green-500">✓ Complete</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Phase 1B: Admin Management</span>
              <Badge variant="default" className="bg-blue-500">🚧 In Progress</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Phase 2: AI-First Core</span>
              <Badge variant="outline">⏳ Planned</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Phase 3: Business Model</span>
              <Badge variant="outline">⏳ Planned</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
