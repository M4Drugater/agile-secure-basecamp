
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Coins, TrendingUp, Calendar } from 'lucide-react';
import { useCreditStatus } from '@/hooks/useCredits';
import { Badge } from '@/components/ui/badge';

export function CreditUsageCard() {
  const { data: creditStatus, isLoading } = useCreditStatus();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Coins className="w-5 h-5 mr-2" />
            Loading...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!creditStatus) return null;

  const dailyPercentage = (creditStatus.used_today / creditStatus.daily_limit) * 100;
  const remainingCredits = creditStatus.total_credits;
  const remainingToday = Math.max(0, creditStatus.daily_limit - creditStatus.used_today);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Coins className="w-5 h-5 mr-2" />
            Credit Usage
          </div>
          <Badge variant={creditStatus.subscription_status === 'active' ? 'default' : 'secondary'}>
            {creditStatus.plan_name}
          </Badge>
        </CardTitle>
        <CardDescription>
          Monitor your AI credit consumption
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Total Credits */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Credits</span>
            <span className="text-2xl font-bold text-primary">
              {remainingCredits.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Daily Usage */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Today's Usage
            </span>
            <span className="text-sm text-muted-foreground">
              {creditStatus.used_today} / {creditStatus.daily_limit}
            </span>
          </div>
          <Progress value={dailyPercentage} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {remainingToday} credits remaining today
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-semibold">{creditStatus.used_today}</div>
            <div className="text-xs text-muted-foreground">Used Today</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-semibold">{creditStatus.daily_limit}</div>
            <div className="text-xs text-muted-foreground">Daily Limit</div>
          </div>
        </div>

        {/* Warning for low credits */}
        {(remainingCredits < 50 || remainingToday < 5) && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="text-sm text-orange-800">
              {remainingCredits < 50 ? 
                'Running low on credits. Consider upgrading your plan.' :
                'Daily limit almost reached. Resets at midnight.'
              }
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
