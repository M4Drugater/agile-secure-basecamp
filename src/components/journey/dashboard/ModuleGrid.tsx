
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight, Lock } from 'lucide-react';

interface ModuleItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  available: boolean;
  completion?: number;
  isNew?: boolean;
  badge?: string;
  highlight?: boolean;
}

interface ModuleGridProps {
  modules: ModuleItem[];
  onModuleClick: (route: string) => void;
}

export function ModuleGrid({ modules, onModuleClick }: ModuleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map((module) => {
        const Icon = module.icon;
        
        return (
          <Card 
            key={module.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              module.available ? 'hover:scale-105' : 'opacity-60'
            } ${module.highlight ? 'ring-2 ring-blue-300 bg-blue-50' : ''} ${
              module.isNew ? 'animate-pulse' : ''
            }`}
            onClick={() => module.available && onModuleClick(module.route)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col gap-1">
                  {module.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {module.badge}
                    </Badge>
                  )}
                  {module.isNew && (
                    <Badge className="bg-green-500 text-xs animate-pulse">
                      New!
                    </Badge>
                  )}
                </div>
              </div>
              <CardTitle className="text-lg">{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {module.completion !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion</span>
                    <span>{module.completion}%</span>
                  </div>
                  <Progress value={module.completion} className="h-2" />
                </div>
              )}
              {module.available && (
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Available
                  </span>
                  <ArrowRight className="h-4 w-4 text-blue-500" />
                </div>
              )}
              {!module.available && (
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Complete previous steps
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
