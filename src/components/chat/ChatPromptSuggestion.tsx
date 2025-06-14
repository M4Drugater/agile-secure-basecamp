
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, BookOpen, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChatPromptSuggestionProps {
  onUseSuggestion: (prompt: string) => void;
  hasKnowledgeFiles: boolean;
}

export function ChatPromptSuggestion({ onUseSuggestion, hasKnowledgeFiles }: ChatPromptSuggestionProps) {
  const knowledgePrompts = [
    "Basándote en mi CV y experiencia profesional, ¿qué habilidades debería desarrollar para avanzar en mi carrera?",
    "Usando mis documentos profesionales, ayúdame a identificar mis fortalezas principales y cómo potenciarlas",
    "Analiza mi perfil profesional y recomiéndame oportunidades de crecimiento específicas para mi industria",
    "¿Cómo puedo mejorar mi perfil profesional basándote en la información que has revisado sobre mí?"
  ];

  const generalPrompts = [
    "¿Cuáles son las tendencias más importantes en desarrollo profesional para 2024?",
    "¿Cómo puedo mejorar mis habilidades de liderazgo y comunicación?",
    "¿Qué estrategias recomiendas para hacer networking efectivo?",
    "Ayúdame a crear un plan de desarrollo profesional a 6 meses"
  ];

  const suggestedPrompts = hasKnowledgeFiles ? knowledgePrompts : generalPrompts;
  const randomPrompt = suggestedPrompts[Math.floor(Math.random() * suggestedPrompts.length)];

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Sparkles className="h-5 w-5" />
          ¡Hola! Soy CLIPOGINO, tu mentor de IA
          {hasKnowledgeFiles && (
            <Badge variant="secondary" className="ml-2">
              <BookOpen className="h-3 w-3 mr-1" />
              Usando tu base de conocimiento
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {hasKnowledgeFiles 
            ? "Genial, veo que ya has subido algunos documentos. Ahora puedo darte consejos mucho más personalizados basados en tu perfil y experiencia."
            : "Para obtener los mejores consejos, te recomiendo subir algunos documentos a tu base de conocimiento primero. Mientras tanto, puedes preguntarme sobre desarrollo profesional en general."
          }
        </p>
        
        <div className="space-y-3">
          <p className="font-medium text-sm">💡 Prueba preguntándome algo como:</p>
          
          <div className="bg-white p-3 rounded-lg border border-blue-200">
            <p className="text-sm italic text-gray-700 mb-3">"{randomPrompt}"</p>
            <Button 
              onClick={() => onUseSuggestion(randomPrompt)}
              size="sm"
              className="w-full"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Usar esta pregunta
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {suggestedPrompts.slice(0, 3).map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onUseSuggestion(prompt)}
                className="text-left justify-start h-auto p-2 text-xs"
              >
                "{prompt.substring(0, 60)}..."
              </Button>
            ))}
          </div>
        </div>
        
        {!hasKnowledgeFiles && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-xs text-orange-800">
              <strong>💡 Consejo:</strong> Sube tu CV, certificados o documentos profesionales a la base de conocimiento para obtener consejos ultra-personalizados.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
