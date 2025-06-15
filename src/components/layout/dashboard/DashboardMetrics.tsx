
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DashboardMetricsProps {
  profileCompleteness: number;
  documentsUploaded: number;
  chatInteractions: number;
}

export function DashboardMetrics({ 
  profileCompleteness, 
  documentsUploaded, 
  chatInteractions 
}: DashboardMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Perfil Completado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{profileCompleteness}%</div>
          <Progress value={profileCompleteness} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Documentos Subidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{documentsUploaded}</div>
          <p className="text-xs text-muted-foreground">En tu base de conocimiento</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Interacciones IA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{chatInteractions}</div>
          <p className="text-xs text-muted-foreground">Con CLIPOGINO</p>
        </CardContent>
      </Card>
    </div>
  );
}
