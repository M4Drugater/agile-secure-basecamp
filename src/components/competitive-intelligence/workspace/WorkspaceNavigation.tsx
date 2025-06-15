
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  MessageSquare, 
  BarChart3, 
  Eye, 
  Clock, 
  Zap 
} from 'lucide-react';

interface WorkspaceNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function WorkspaceNavigation({ activeTab, onTabChange }: WorkspaceNavigationProps) {
  const tabs = [
    { id: 'config', label: 'Configuración', icon: Settings },
    { id: 'realtime', label: 'Tiempo Real', icon: Zap },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'analysis', label: 'Análisis', icon: BarChart3 },
    { id: 'dashboard', label: 'Dashboard', icon: Eye },
    { id: 'monitoring', label: 'Monitoreo', icon: Clock }
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id} 
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
