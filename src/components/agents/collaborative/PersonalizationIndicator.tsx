
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useContextBuilder } from '@/hooks/context/useContextBuilder';
import { 
  User, 
  FileText, 
  MessageSquare, 
  Brain,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export function PersonalizationIndicator() {
  const { getContextSummary } = useContextBuilder();
  const contextSummary = getContextSummary();

  const getPersonalizationLevel = () => {
    let level = 0;
    if (contextSummary.hasProfile) level += 30;
    if (contextSummary.knowledgeCount > 0) level += 25;
    if (contextSummary.contentCount > 0) level += 20;
    if (contextSummary.conversationCount > 0) level += 25;
    return Math.min(100, level);
  };

  const personalizationLevel = getPersonalizationLevel();
  
  const getPersonalizationStatus = () => {
    if (personalizationLevel >= 80) return { 
      label: 'Elite', 
      color: 'bg-green-500', 
      icon: CheckCircle,
      description: 'Personalización completa activa'
    };
    if (personalizationLevel >= 50) return { 
      label: 'Avanzada', 
      color: 'bg-blue-500', 
      icon: Brain,
      description: 'Buena personalización disponible'
    };
    return { 
      label: 'Básica', 
      color: 'bg-yellow-500', 
      icon: AlertCircle,
      description: 'Personalización limitada'
    };
  };

  const status = getPersonalizationStatus();
  const StatusIcon = status.icon;

  return (
    <Card className="mb-4 border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <StatusIcon className={`h-5 w-5 text-${status.color.replace('bg-', '')}`} />
            <span className="font-medium">Personalización de Agentes</span>
          </div>
          <Badge className={`${status.color} text-white`}>
            {status.label} ({personalizationLevel}%)
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          {status.description}
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Perfil: </span>
            <Badge variant={contextSummary.hasProfile ? 'default' : 'secondary'}>
              {contextSummary.hasProfile ? 'Completo' : 'Básico'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>Conocimiento: </span>
            <Badge variant={contextSummary.knowledgeCount > 0 ? 'default' : 'secondary'}>
              {contextSummary.knowledgeCount} docs
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-muted-foreground" />
            <span>Contenido: </span>
            <Badge variant={contextSummary.contentCount > 0 ? 'default' : 'secondary'}>
              {contextSummary.contentCount} piezas
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span>Historial: </span>
            <Badge variant={contextSummary.conversationCount > 0 ? 'default' : 'secondary'}>
              {contextSummary.conversationCount} chats
            </Badge>
          </div>
        </div>

        {personalizationLevel < 80 && (
          <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
            <p className="text-blue-700">
              💡 <strong>Tip:</strong> Para obtener respuestas más personalizadas, completa tu perfil y sube documentos a tu base de conocimiento.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
