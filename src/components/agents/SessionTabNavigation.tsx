
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Users, 
  Brain
} from 'lucide-react';

export function SessionTabNavigation() {
  return (
    <TabsList className="grid w-full grid-cols-5">
      <TabsTrigger value="orchestrator" className="flex items-center gap-2">
        <Brain className="h-4 w-4" />
        CLIPOGINO
      </TabsTrigger>
      <TabsTrigger value="chat" className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        Chat
      </TabsTrigger>
      <TabsTrigger value="analysis" className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        Análisis
      </TabsTrigger>
      <TabsTrigger value="coordination" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        Coordinación
      </TabsTrigger>
      <TabsTrigger value="settings" className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Configuración
      </TabsTrigger>
    </TabsList>
  );
}
