
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export function CoordinationPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Panel de Coordinación Avanzada</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Coordinación Inteligente de Agentes</h3>
          <p className="text-muted-foreground mb-4">
            CLIPOGINO gestiona automáticamente la coordinación entre agentes para máxima eficiencia
          </p>
          <div className="space-y-4 max-w-md mx-auto">
            <div className="text-left space-y-2">
              <h4 className="font-medium">Funcionalidades activas:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Orquestación inteligente por CLIPOGINO</li>
                <li>• Asignación dinámica basada en expertise</li>
                <li>• Resolución automática de conflictos</li>
                <li>• Optimización continua de flujos</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
