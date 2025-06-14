
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';
import { useCostMonitoring } from '@/hooks/useCostMonitoring';

export function OptimizedCostMonitoring() {
  const { usage, isLoading, isNearLimit, isOverLimit } = useCostMonitoring();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Cost Monitoring
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

  if (!usage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Cost Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unable to load usage data</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = () => {
    if (isOverLimit) return 'destructive';
    if (isNearLimit) return 'secondary';
    return 'default';
  };

  const getStatusIcon = () => {
    if (isOverLimit) return <AlertTriangle className="w-4 h-4" />;
    if (isNearLimit) return <AlertTriangle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Cost Monitoring
          </div>
          <Badge variant={getStatusColor()} className="flex items-center gap-1">
            {getStatusIcon()}
            {isOverLimit ? 'Over Limit' : isNearLimit ? 'Near Limit' : 'Normal'}
          </Badge>
        </CardTitle>
        <CardDescription>
          Track your AI usage costs and limits
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Daily Usage */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Daily Usage</span>
            <span className="text-sm text-muted-foreground">
              ${usage.dailyUsage.toFixed(4)} / ${usage.dailyLimit.toFixed(2)}
            </span>
          </div>
          <Progress 
            value={usage.dailyPercentage} 
            className="h-2"
            indicatorClassName={isOverLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-green-500'}
          />
          <p className="text-xs text-muted-foreground">
            {usage.dailyPercentage.toFixed(1)}% of daily limit used
          </p>
        </div>

        {/* Monthly Usage */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Monthly Usage</span>
            <span className="text-sm text-muted-foreground">
              ${usage.monthlyUsage.toFixed(2)} / ${usage.monthlyLimit.toFixed(2)}
            </span>
          </div>
          <Progress 
            value={usage.monthlyPercentage} 
            className="h-2"
            indicatorClassName={usage.monthlyPercentage > 90 ? 'bg-red-500' : usage.monthlyPercentage > 70 ? 'bg-yellow-500' : 'bg-blue-500'}
          />
          <p className="text-xs text-muted-foreground">
            {usage.monthlyPercentage.toFixed(1)}% of monthly limit used
          </p>
        </div>

        {/* Status Alerts */}
        {isOverLimit && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You have exceeded your daily limit. Additional requests may be blocked.
            </AlertDescription>
          </Alert>
        )}

        {isNearLimit && !isOverLimit && (
          <Alert variant="default">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You're approaching your daily limit. Consider upgrading your plan.
            </AlertDescription>
          </Alert>
        )}

        {/* Cost Breakdown */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="w-4 h-4 mr-1 text-green-600" />
              <span className="text-sm font-medium">Remaining Today</span>
            </div>
            <p className="text-lg font-bold text-green-600">
              ${Math.max(0, usage.dailyLimit - usage.dailyUsage).toFixed(4)}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="w-4 h-4 mr-1 text-blue-600" />
              <span className="text-sm font-medium">Remaining Monthly</span>
            </div>
            <p className="text-lg font-bold text-blue-600">
              ${Math.max(0, usage.monthlyLimit - usage.monthlyUsage).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
