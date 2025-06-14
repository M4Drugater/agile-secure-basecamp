
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, AlertTriangle } from 'lucide-react';
import { useOptimizedCreditStatus } from '@/hooks/useOptimizedCredits';

export function CreditUsageCard() {
  const { data: creditStatus, isLoading, error } = useOptimizedCreditStatus();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Coins className="w-5 h-5 mr-2" />
            Credit Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !creditStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Coins className="w-5 h-5 mr-2" />
            Credit Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unable to load credit information</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusVariant = () => {
    if (creditStatus.is_over_limit) return 'destructive';
    if (creditStatus.is_near_limit) return 'secondary';
    return 'default';
  };

  const getStatusLabel = () => {
    if (creditStatus.is_over_limit) return 'Limit Exceeded';
    if (creditStatus.is_near_limit) return 'Near Limit';
    return 'Normal';
  };

  const getProgressColor = () => {
    if (creditStatus.is_over_limit) return 'bg-red-500';
    if (creditStatus.is_near_limit) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Coins className="w-5 h-5 mr-2" />
            Credit Usage
          </div>
          <Badge variant={getStatusVariant()}>
            {getStatusLabel()}
          </Badge>
        </CardTitle>
        <CardDescription>
          Track your daily credit consumption and limits
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Plan */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Current Plan</span>
          <Badge variant="outline">{creditStatus.plan_name}</Badge>
        </div>

        {/* Daily Usage Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Today's Usage</span>
            <span className="text-sm text-muted-foreground">
              {creditStatus.used_today} / {creditStatus.daily_limit} credits
            </span>
          </div>
          <Progress 
            value={creditStatus.usage_percentage} 
            className="h-3"
            indicatorClassName={getProgressColor()}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{creditStatus.usage_percentage.toFixed(1)}% used</span>
            <span>{creditStatus.remaining_today} remaining</span>
          </div>
        </div>

        {/* Status Messages */}
        {creditStatus.is_over_limit && (
          <div className="flex items-center gap-2 p-3 rounded bg-red-50 text-red-800 border border-red-200">
            <AlertTriangle className="w-4 h-4" />
            <p className="text-sm">Daily limit exceeded. Upgrade your plan to continue using AI features.</p>
          </div>
        )}

        {creditStatus.is_near_limit && !creditStatus.is_over_limit && (
          <div className="flex items-center gap-2 p-3 rounded bg-yellow-50 text-yellow-800 border border-yellow-200">
            <AlertTriangle className="w-4 h-4" />
            <p className="text-sm">You're approaching your daily limit. Consider upgrading your plan.</p>
          </div>
        )}

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 mr-1 text-blue-600" />
              <span className="text-sm font-medium">Total Credits</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {creditStatus.total_credits.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Coins className="w-4 h-4 mr-1 text-green-600" />
              <span className="text-sm font-medium">Subscription</span>
            </div>
            <p className="text-lg font-semibold text-green-600 capitalize">
              {creditStatus.subscription_status}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
