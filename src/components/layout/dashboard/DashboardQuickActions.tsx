
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, FileText, Target, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DashboardQuickActions() {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Hablar con CLIPOGINO',
      description: 'Tu mentor de IA personalizado',
      icon: MessageSquare,
      action: () => navigate('/chat'),
      variant: 'default' as const
    },
    {
      title: 'Crear Contenido',
      description: 'Generar contenido profesional',
      icon: FileText,
      action: () => navigate('/content-generator'),
      variant: 'outline' as const
    },
    {
      title: 'Análisis Competitivo',
      description: 'Explorar inteligencia de mercado',
      icon: Target,
      action: () => navigate('/competitive-intelligence'),
      variant: 'outline' as const
    },
    {
      title: 'Ver Analytics',
      description: 'Revisar tu progreso',
      icon: BarChart3,
      action: () => navigate('/profile'),
      variant: 'outline' as const
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant}
                className="h-auto p-4 flex flex-col items-start gap-2 text-left"
                onClick={action.action}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{action.title}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {action.description}
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
