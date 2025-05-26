
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ContentAnalytic } from '@/hooks/useContentAnalytics';
import { format, parseISO } from 'date-fns';
import { TrendingUp } from 'lucide-react';

interface EngagementChartProps {
  data: ContentAnalytic[];
  timeRange: string;
  isLoading: boolean;
}

const chartConfig = {
  engagementRate: {
    label: "Engagement Rate",
    color: "hsl(var(--chart-1))",
  },
  clickThroughRate: {
    label: "Click-Through Rate", 
    color: "hsl(var(--chart-2))",
  },
};

export function EngagementChart({ data, timeRange, isLoading }: EngagementChartProps) {
  // Process data for chart
  const chartData = React.useMemo(() => {
    if (!data.length) return [];

    // Group by date and calculate averages
    const groupedData = data.reduce((acc, item) => {
      const date = format(parseISO(item.recorded_at), 'MMM dd');
      if (!acc[date]) {
        acc[date] = {
          date,
          engagementRates: [],
          clickThroughRates: [],
        };
      }
      acc[date].engagementRates.push(item.engagement_rate || 0);
      acc[date].clickThroughRates.push(item.click_through_rate || 0);
      return acc;
    }, {} as Record<string, any>);

    return Object.values(groupedData).map((group: any) => ({
      date: group.date,
      engagementRate: group.engagementRates.reduce((sum: number, rate: number) => sum + rate, 0) / group.engagementRates.length,
      clickThroughRate: group.clickThroughRates.reduce((sum: number, rate: number) => sum + rate, 0) / group.clickThroughRates.length,
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engagement Trends</CardTitle>
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
          <TrendingUp className="h-5 w-5" />
          Engagement Trends
        </CardTitle>
        <CardDescription>
          Engagement and click-through rates over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="date" 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="engagementRate"
              stroke="var(--color-engagementRate)"
              strokeWidth={2}
              dot={{ fill: "var(--color-engagementRate)" }}
            />
            <Line
              type="monotone"
              dataKey="clickThroughRate"
              stroke="var(--color-clickThroughRate)"
              strokeWidth={2}
              dot={{ fill: "var(--color-clickThroughRate)" }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
