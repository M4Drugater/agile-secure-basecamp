
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  BookOpen, 
  MessageSquare, 
  Shield, 
  FileText, 
  Lock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  available: boolean;
  completed: boolean;
  isNew?: boolean;
  completionRate?: number;
}

interface ModuleGridProps {
  modules: Module[];
  onModuleClick: (route: string) => void;
}

const MODULE_ICONS = {
  profile: User,
  knowledge: BookOpen,
  chat: MessageSquare,
  agents: Shield,
  content: FileText,
  intelligence: Shield
};

export function ModuleGrid({ modules, onModuleClick }: ModuleGridProps) {
  const getDataTourAttribute = (moduleId: string) => {
    const tourMap: Record<string, string> = {
      profile: 'profile-module',
      knowledge: 'knowledge-module', 
      chat: 'chat-module',
      agents: 'intelligence-module',
      content: 'content-module',
      intelligence: 'intelligence-module',
      competitive: 'intelligence-module'
    };
    return tourMap[moduleId] || '';
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Módulos Disponibles</h2>
          <p className="text-muted-foreground">
            Explora las herramientas de desarrollo profesional con IA
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          {modules.filter(m => m.available).length} módulos activos
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const Icon = MODULE_ICONS[module.icon as keyof typeof MODULE_ICONS] || FileText;
          const tourAttribute = getDataTourAttribute(module.id);
          
          return (
            <Card 
              key={module.id}
              className={`relative transition-all duration-200 cursor-pointer group ${
                module.available 
                  ? 'hover:shadow-lg hover:scale-[1.02] border-border' 
                  : 'opacity-60 cursor-not-allowed bg-muted/30'
              } ${
                module.completed 
                  ? 'bg-green-50 border-green-200' 
                  : module.isNew 
                  ? 'ring-2 ring-blue-200 bg-blue-50/30' 
                  : ''
              }`}
              onClick={() => module.available && onModuleClick(module.route)}
              {...(tourAttribute && { 'data-tour': tourAttribute })}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${
                    module.completed 
                      ? 'bg-green-100' 
                      : module.available 
                      ? 'bg-blue-100' 
                      : 'bg-gray-100'
                  }`}>
                    {module.available ? (
                      <Icon className={`h-6 w-6 ${
                        module.completed ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    ) : (
                      <Lock className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    {module.isNew && (
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                        Nuevo
                      </Badge>
                    )}
                    {module.completed && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        Completado
                      </Badge>
                    )}
                    {!module.available && (
                      <Badge variant="outline" className="text-xs">
                        Bloqueado
                      </Badge>
                    )}
                  </div>
                </div>
                
                <CardTitle className="text-lg leading-tight">
                  {module.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed">
                  {module.description}
                </CardDescription>
                
                {module.completionRate !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progreso</span>
                      <span>{module.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                        style={{ width: `${module.completionRate}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {module.available && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-between text-xs group-hover:bg-blue-50"
                  >
                    {module.completed ? 'Revisar' : 'Comenzar'}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
