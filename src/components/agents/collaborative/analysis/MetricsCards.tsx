
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Users, 
  BarChart3, 
  Target
} from 'lucide-react';

interface MetricsCardsProps {
  sessionMetrics: any;
  isSessionActive: boolean;
}

export function MetricsCards({ sessionMetrics, isSessionActive }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Estado General</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">
              {isSessionActive ? sessionMetrics.sessionProgress.toFixed(0) : 0}%
            </div>
            <Progress value={sessionMetrics.sessionProgress} className="mt-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Colaboración</span>
          </div>
          <div className="text-2xl font-bold mt-2">
            {sessionMetrics.collaborationScore}%
          </div>
          <div className="text-xs text-muted-foreground">Sinergia entre agentes</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">Interacciones</span>
          </div>
          <div className="text-2xl font-bold mt-2">{sessionMetrics.totalInteractions}</div>
          <div className="text-xs text-muted-foreground">
            {isSessionActive ? 'En tiempo real' : 'Sesión pausada'}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">Consenso</span>
          </div>
          <div className="text-2xl font-bold mt-2">{sessionMetrics.consensusLevel}%</div>
          <div className="text-xs text-muted-foreground">Nivel de acuerdo</div>
        </CardContent>
      </Card>
    </div>
  );
}
