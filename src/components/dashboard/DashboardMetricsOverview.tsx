
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useDashboardMetrics } from '@/hooks/dashboard/useDashboardMetrics';
import { User, FileText, MessageSquare, TrendingUp } from 'lucide-react';

export function DashboardMetricsOverview() {
  const { 
    profileCompleteness, 
    documentsUploaded, 
    chatInteractions,
    profileCompletionColor 
  } = useDashboardMetrics();

  const metrics = [
    {
      title: 'Perfil Completado',
      value: `${profileCompleteness}%`,
      icon: User,
      color: profileCompletionColor,
      progress: profileCompleteness
    },
    {
      title: 'Documentos Subidos',
      value: documentsUploaded.toString(),
      icon: FileText,
      color: 'text-blue-600',
      description: 'en base de conocimiento'
    },
    {
      title: 'Interacciones IA',
      value: chatInteractions.toString(),
      icon: MessageSquare,
      color: 'text-green-600',
      description: 'conversaciones completadas'
    },
    {
      title: 'Progreso General',
      value: `${Math.round((profileCompleteness + (documentsUploaded * 10) + (chatInteractions * 5)) / 3)}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      description: 'del sistema'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
              {metric.description && (
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              )}
              {metric.progress !== undefined && (
                <Progress value={metric.progress} className="mt-2" />
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
