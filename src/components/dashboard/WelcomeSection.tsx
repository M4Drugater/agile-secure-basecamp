
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useDashboardMetrics } from '@/hooks/dashboard/useDashboardMetrics';
import { Sparkles, ArrowRight } from 'lucide-react';

export function WelcomeSection() {
  const navigate = useNavigate();
  const { userName, profileCompletionMessage } = useDashboardMetrics();

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                ¡Bienvenido, {userName}!
              </h1>
            </div>
            <p className="text-lg text-gray-600 mb-4">
              Tu plataforma de desarrollo profesional con IA está lista
            </p>
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              {profileCompletionMessage}
            </Badge>
          </div>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => navigate('/chat')}
              className="flex items-center gap-2"
            >
              Chatear con CLIPOGINO
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/competitive-intelligence')}
            >
              Explorar Agentes IA
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
