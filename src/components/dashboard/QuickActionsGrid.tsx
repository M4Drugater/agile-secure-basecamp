
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Shield, 
  FileText, 
  BookOpen, 
  TrendingUp, 
  Search,
  Brain,
  Sparkles
} from 'lucide-react';

export function QuickActionsGrid() {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Chat con CLIPOGINO',
      description: 'Tu mentor inteligente personalizado',
      icon: MessageSquare,
      badge: 'IA',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      route: '/chat'
    },
    {
      title: 'Inteligencia Competitiva',
      description: 'Agentes CDV, CIA y CIR',
      icon: Shield,
      badge: 'AGENTES',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
      route: '/competitive-intelligence'
    },
    {
      title: 'Generador de Contenido',
      description: 'Creación de contenido con IA',
      icon: FileText,
      badge: 'IA',
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
      route: '/content/generator'
    },
    {
      title: 'Base de Conocimiento',
      description: 'Gestión de documentos y recursos',
      icon: BookOpen,
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600',
      route: '/knowledge'
    },
    {
      title: 'Descubrimiento de Tendencias',
      description: 'Tendencias de Reddit en tiempo real',
      icon: TrendingUp,
      badge: 'LIVE',
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600',
      route: '/trends'
    },
    {
      title: 'Research Workbench',
      description: 'Investigación con Perplexity AI',
      icon: Search,
      color: 'bg-teal-50 border-teal-200',
      iconColor: 'text-teal-600',
      route: '/research'
    },
    {
      title: 'Gestión de Aprendizaje',
      description: 'Rutas y módulos de aprendizaje',
      icon: Sparkles,
      color: 'bg-pink-50 border-pink-200',
      iconColor: 'text-pink-600',
      route: '/learning'
    },
    {
      title: 'Analytics de Contenido',
      description: 'Métricas y rendimiento',
      icon: Brain,
      color: 'bg-indigo-50 border-indigo-200',
      iconColor: 'text-indigo-600',
      route: '/content/analytics'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card 
                key={action.title} 
                className={`${action.color} cursor-pointer hover:shadow-md transition-shadow`}
                onClick={() => navigate(action.route)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Icon className={`h-6 w-6 ${action.iconColor}`} />
                    {action.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {action.description}
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Acceder
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
