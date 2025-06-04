
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, AlertTriangle } from 'lucide-react';
import { useCreditStatus } from '@/hooks/useCredits';

export function CreditUsageCard() {
  const { data: creditStatus, isLoading, error } = useCreditStatus();

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
          <div className="text-center py-4 text-muted-foreground">
            Loading credit information...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Coins className="w-5 h-5 mr-2" />
            Credit Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-destructive">
            Error loading credit information
          </div>
        </CardContent>
      </Card>
    );
  }

  const usagePercentage = creditStatus ? (creditStatus.used_today / creditStatus.daily_limit) * 100 : 0;
  const isRunningLow = usagePercentage > 80;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Coins className="w-5 h-5 mr-2" />
          Credit Usage
        </CardTitle>
        <CardDescription>Monitor your AI credit consumption</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Total Credits</div>
          <Badge variant="outline">{creditStatus?.plan_name || 'Free'}</Badge>
        </div>
        
        <div className="text-3xl font-bold">
          {creditStatus?.total_credits?.toLocaleString() || 0}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Today's Usage</span>
            <span>{creditStatus?.used_today || 0} / {creditStatus?.daily_limit || 10}</span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {creditStatus?.daily_limit - creditStatus?.used_today} credits remaining today
          </div>
        </div>
        
        {isRunningLow && (
          <div className="flex items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-orange-600 mr-2" />
            <div className="text-sm text-orange-800">
              Running low on credits. Consider upgrading your plan.
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center">
            <div className="text-2xl font-semibold text-primary">
              {creditStatus?.used_today || 0}
            </div>
            <div className="text-xs text-muted-foreground">Used Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-600">
              {creditStatus?.daily_limit || 10}
            </div>
            <div className="text-xs text-muted-foreground">Daily Limit</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
