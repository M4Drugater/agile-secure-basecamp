
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDashboardData } from '@/hooks/dashboard/useDashboardData';
import { MessageSquare, FileText, User, Clock } from 'lucide-react';

export function RecentActivityFeed() {
  const { chatStats, documents } = useDashboardData();

  const activities = [
    {
      type: 'chat',
      title: 'Conversaciones con CLIPOGINO',
      description: `${chatStats?.conversationCount || 0} conversaciones completadas`,
      icon: MessageSquare,
      color: 'text-blue-600',
      badge: 'IA',
      time: 'Hoy'
    },
    {
      type: 'knowledge',
      title: 'Documentos Subidos',
      description: `${documents?.length || 0} archivos en base de conocimiento`,
      icon: FileText,
      color: 'text-green-600',
      badge: 'DOCS',
      time: 'Esta semana'
    },
    {
      type: 'profile',
      title: 'Perfil Actualizado',
      description: 'Información profesional completada',
      icon: User,
      color: 'text-purple-600',
      badge: 'PERFIL',
      time: 'Hace 3 días'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Icon className={`h-5 w-5 ${activity.color} mt-0.5`} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium">{activity.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {activity.badge}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {activity.description}
                </p>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            </div>
          );
        })}
        
        {activities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2" />
            <p>No hay actividad reciente</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
