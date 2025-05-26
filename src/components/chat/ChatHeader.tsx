
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot } from 'lucide-react';
import { useCostMonitoring } from '@/hooks/useCostMonitoring';

export function ChatHeader() {
  const { usage } = useCostMonitoring();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <CardTitle>CLIPOGINO - AI Career Mentor</CardTitle>
          </div>
          <Badge variant="outline">
            {usage ? `$${usage.dailyUsage.toFixed(4)} / $${usage.dailyLimit}` : 'Loading...'}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );
}
