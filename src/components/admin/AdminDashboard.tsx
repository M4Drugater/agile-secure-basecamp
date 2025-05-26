
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DashboardMetrics } from './dashboard/DashboardMetrics';
import { SystemHealth } from './dashboard/SystemHealth';
import { RecentActivity } from './dashboard/RecentActivity';
import { QuickActions } from './dashboard/QuickActions';
import { PhaseProgress } from './dashboard/PhaseProgress';

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
      const { count: auditCount } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true });
      
      const { count: configCount } = await supabase
        .from('system_config')
        .select('*', { count: 'exact', head: true });
      
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
      <DashboardMetrics userStats={userStats} systemStats={systemStats} />

      {/* System Health & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemHealth 
          configurations={systemStats?.configurations || 0}
          version={systemStats?.version || '2.0.0'}
        />
        <RecentActivity activities={recentActivity || []} />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Phase Progress */}
      <PhaseProgress />
    </div>
  );
}
