
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useDashboardMetrics } from '@/hooks/dashboard/useDashboardMetrics';
import { Target, ArrowRight, CheckCircle } from 'lucide-react';

export function ProgressInsights() {
  const navigate = useNavigate();
  const { profileCompleteness, documentsUploaded, chatInteractions } = useDashboardMetrics();

  const recommendations = [
    {
      title: 'Completa tu perfil profesional',
      description: 'Añade más detalles sobre tu experiencia y objetivos',
      progress: profileCompleteness,
      target: 100,
      action: () => navigate('/profile'),
      completed: profileCompleteness >= 80
    },
    {
      title: 'Sube documentos a tu base de conocimiento',
      description: 'Mejora las respuestas de CLIPOGINO con tu información',
      progress: Math.min(documentsUploaded * 20, 100),
      target: 100,
      action: () => navigate('/knowledge'),
      completed: documentsUploaded >= 5
    },
    {
      title: 'Inicia conversaciones con CLIPOGINO',
      description: 'Obtén asesoramiento personalizado para tu desarrollo',
      progress: Math.min(chatInteractions * 10, 100),
      target: 100,
      action: () => navigate('/chat'),
      completed: chatInteractions >= 10
    }
  ];

  const completedRecommendations = recommendations.filter(r => r.completed).length;
  const totalRecommendations = recommendations.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Insights de Progreso
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {completedRecommendations}/{totalRecommendations} completadas
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {recommendations.map((rec, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {rec.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                  )}
                  <h4 className={`text-sm font-medium ${rec.completed ? 'text-green-700' : ''}`}>
                    {rec.title}
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {rec.description}
                </p>
                <Progress value={rec.progress} className="h-2" />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">
                    {rec.progress}% completado
                  </span>
                  {!rec.completed && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={rec.action}
                      className="text-xs"
                    >
                      Continuar
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
