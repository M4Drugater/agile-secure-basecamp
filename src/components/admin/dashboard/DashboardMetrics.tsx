
import React from 'react';
import { Users, Activity, BarChart3, Shield } from 'lucide-react';
import { MetricsCard } from './MetricsCard';

interface UserStats {
  total: number;
  active: number;
  admins: number;
  newThisWeek: number;
}

interface SystemStats {
  uptime: string;
}

interface DashboardMetricsProps {
  userStats?: UserStats;
  systemStats?: SystemStats;
}

export function DashboardMetrics({ userStats, systemStats }: DashboardMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricsCard
        title="Total Users"
        value={userStats?.total || 0}
        subtitle={`+${userStats?.newThisWeek || 0} this week`}
        icon={Users}
      />
      
      <MetricsCard
        title="Active Users"
        value={userStats?.active || 0}
        subtitle={`${userStats?.total ? Math.round((userStats.active / userStats.total) * 100) : 0}% of total`}
        icon={Activity}
        valueColor="text-green-600"
      />
      
      <MetricsCard
        title="System Uptime"
        value={systemStats?.uptime || '99.9%'}
        subtitle="Last 30 days"
        icon={BarChart3}
        valueColor="text-blue-600"
      />
      
      <MetricsCard
        title="Admin Users"
        value={userStats?.admins || 0}
        subtitle="Admins & Super Admins"
        icon={Shield}
        valueColor="text-orange-600"
      />
    </div>
  );
}
