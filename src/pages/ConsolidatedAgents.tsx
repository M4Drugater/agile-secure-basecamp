
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, ArrowRight, Users, Zap } from 'lucide-react';

export default function ConsolidatedAgents() {
  const navigate = useNavigate();

  // Auto-redirect after a brief display
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/agents');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Agentes IA Evolucionados</CardTitle>
          <p className="text-muted-foreground">
            Los agentes han evolucionado a un sistema independiente con autonomía completa y poder individual restaurado.
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Nueva Macro Área de Agentes Independientes</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-purple-600" />
                Cada agente mantiene su poder y especialización completa
              </li>
              <li className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                Acceso directo sin intermediarios
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-600" />
                Sistema tripartite individual para cada agente
              </li>
              <li className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-yellow-600" />
                Autonomía total y capacidades especializadas
              </li>
            </ul>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Serás redirigido automáticamente en 3 segundos...
          </div>
          
          <Button 
            onClick={() => navigate('/agents')}
            className="w-full"
            size="lg"
          >
            Ir a Agentes Independientes
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
