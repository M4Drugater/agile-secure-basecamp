
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CostMetrics {
  dailyTotal: number;
  monthlyTotal: number;
  dailyLimit: number;
  monthlyLimit: number;
  activeUsers24h: number;
  avgCostPerUser: number;
  topUsageUsers: Array<{
    user_id: string;
    email: string;
    daily_cost: number;
    monthly_cost: number;
  }>;
}

export function CostMonitoringDashboard() {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['cost-metrics'],
    queryFn: async (): Promise<CostMetrics> => {
      // Get current limits
      const { data: config } = await supabase
        .from('cost_monitoring_config')
        .select('daily_limit, monthly_limit')
        .eq('is_active', true)
        .single();

      // Get daily and monthly totals
      const [dailyResult, monthlyResult] = await Promise.all([
        supabase.rpc('get_total_daily_cost'),
        supabase.rpc('get_monthly_cost'),
      ]);

      // Get active users in last 24h
      const { data: activeUsersData } = await supabase
        .from('ai_usage_logs')
        .select('user_id')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .eq('status', 'success');

      const uniqueUsers = new Set(activeUsersData?.map(log => log.user_id) || []);

      // Get top usage users for today
      const { data: topUsageData } = await supabase
        .from('ai_usage_logs')
        .select(`
          user_id,
          total_cost
        `)
        .gte('created_at', new Date().toDateString())
        .eq('status', 'success');

      // Aggregate by user
      const userCosts = new Map<string, number>();
      topUsageData?.forEach(log => {
        const current = userCosts.get(log.user_id) || 0;
        userCosts.set(log.user_id, current + parseFloat(log.total_cost));
      });

      // Get user emails for top users
      const topUserIds = Array.from(userCosts.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([userId]) => userId);

      const { data: usersData } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', topUserIds);

      const topUsageUsers = topUserIds.map(userId => {
        const user = usersData?.find(u => u.id === userId);
        return {
          user_id: userId,
          email: user?.email || 'Unknown',
          daily_cost: userCosts.get(userId) || 0,
          monthly_cost: 0, // Could be calculated similarly
        };
      });

      const dailyTotal = parseFloat(dailyResult.data || '0');
      const monthlyTotal = parseFloat(monthlyResult.data || '0');

      return {
        dailyTotal,
        monthlyTotal,
        dailyLimit: config?.daily_limit || 50,
        monthlyLimit: config?.monthly_limit || 1000,
        activeUsers24h: uniqueUsers.size,
        avgCostPerUser: uniqueUsers.size > 0 ? dailyTotal / uniqueUsers.size : 0,
        topUsageUsers,
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 w-16 bg-muted animate-pulse rounded mb-1"></div>
              <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load cost monitoring data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  const dailyPercentage = (metrics.dailyTotal / metrics.dailyLimit) * 100;
  const monthlyPercentage = (metrics.monthlyTotal / metrics.monthlyLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Alert for high usage */}
      {(dailyPercentage > 80 || monthlyPercentage > 80) && (
        <Alert variant={dailyPercentage > 95 || monthlyPercentage > 95 ? "destructive" : "default"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {dailyPercentage > 95 || monthlyPercentage > 95 
              ? "CRITICAL: AI usage is approaching limits. Consider implementing stricter controls."
              : "WARNING: AI usage is high. Monitor closely to avoid exceeding limits."
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.dailyTotal.toFixed(2)}</div>
            <div className="flex items-center space-x-2">
              <Progress value={dailyPercentage} className="flex-1" />
              <span className="text-xs text-muted-foreground">
                {dailyPercentage.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              of ${metrics.dailyLimit} limit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.monthlyTotal.toFixed(2)}</div>
            <div className="flex items-center space-x-2">
              <Progress value={monthlyPercentage} className="flex-1" />
              <span className="text-xs text-muted-foreground">
                {monthlyPercentage.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              of ${metrics.monthlyLimit} limit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users (24h)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers24h}</div>
            <p className="text-xs text-muted-foreground">
              users made AI requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cost/User</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.avgCostPerUser.toFixed(4)}</div>
            <p className="text-xs text-muted-foreground">
              today's average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Usage Users */}
      <Card>
        <CardHeader>
          <CardTitle>Top Users by Daily Usage</CardTitle>
          <CardDescription>
            Users with highest AI costs today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.topUsageUsers.map((user, index) => (
              <div key={user.user_id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <div>
                    <p className="text-sm font-medium">{user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.user_id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">${user.daily_cost.toFixed(4)}</p>
                  <p className="text-xs text-muted-foreground">today</p>
                </div>
              </div>
            ))}
            {metrics.topUsageUsers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No usage data available for today
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
