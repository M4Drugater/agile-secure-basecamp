
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { PlatformStats } from '@/hooks/useContentAnalytics';
import { BarChart3 } from 'lucide-react';

interface PlatformPerformanceChartProps {
  data: PlatformStats[];
  isLoading: boolean;
}

const chartConfig = {
  totalViews: {
    label: "Total Views",
    color: "hsl(var(--chart-1))",
  },
  totalEngagements: {
    label: "Total Engagements",
    color: "hsl(var(--chart-2))",
  },
};

export function PlatformPerformanceChart({ data, isLoading }: PlatformPerformanceChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 animate-pulse bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Platform Performance
        </CardTitle>
        <CardDescription>
          Views and engagements by platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <BarChart data={data}>
            <XAxis 
              dataKey="platform" 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="totalViews"
              fill="var(--color-totalViews)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="totalEngagements"
              fill="var(--color-totalEngagements)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
