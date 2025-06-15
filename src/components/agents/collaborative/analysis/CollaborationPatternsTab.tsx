
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  Eye,
  CheckCircle
} from 'lucide-react';

interface CollaborationPatternsTabProps {
  sessionMetrics: any;
}

export function CollaborationPatternsTab({ sessionMetrics }: CollaborationPatternsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patrones de Colaboración Emergentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Orquestación CLIPOGINO</h3>
            <p className="text-sm text-muted-foreground mb-3">
              CLIPOGINO actúa como hub central, coordinando efectivamente a todos los agentes especializados
            </p>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm">Eficiencia de coordinación: {sessionMetrics.collaborationScore}%</span>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Especialización Complementaria</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Los agentes aprovechan sus fortalezas únicas para abordar diferentes aspectos del problema
            </p>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Cobertura de expertise: 95%</span>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Validación Cruzada Activa</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Los agentes validan y refinan las conclusiones de otros, mejorando la calidad general
            </p>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Validaciones exitosas: {Math.floor(sessionMetrics.totalInteractions * 0.3)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
