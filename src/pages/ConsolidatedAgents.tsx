
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, ArrowRight, Sparkles, Brain, Globe } from 'lucide-react';

export default function ConsolidatedAgents() {
  const navigate = useNavigate();

  // Auto-redirect after a brief display
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/chat');
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
          <CardTitle className="text-2xl">Agentes IA Unificados</CardTitle>
          <p className="text-muted-foreground">
            Todos los agentes IA han sido unificados en CLIPOGINO con sistema tripartite completo.
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Sistema Unificado CLIPOGINO</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600" />
                Sistema Tripartite (OpenAI → Perplexity → Claude)
              </li>
              <li className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                Búsqueda web en tiempo real
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-green-600" />
                Contexto personalizado completo
              </li>
              <li className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-yellow-600" />
                Todos los agentes especializados integrados
              </li>
            </ul>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Serás redirigido automáticamente en 3 segundos...
          </div>
          
          <Button 
            onClick={() => navigate('/chat')}
            className="w-full"
            size="lg"
          >
            Ir a CLIPOGINO Unificado
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
