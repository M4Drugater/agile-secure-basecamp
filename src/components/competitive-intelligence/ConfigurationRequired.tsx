
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export function ConfigurationRequired() {
  return (
    <Card className="h-full">
      <CardContent className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="font-semibold mb-2">Configuración Requerida</h3>
            <p className="text-muted-foreground text-sm">
              Completa la configuración de sesión para comenzar a chatear con el agente.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
