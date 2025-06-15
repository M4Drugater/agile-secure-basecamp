
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface AgentCardProps {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onSelect: (agentId: string) => void;
  isSelected?: boolean;
}

export function AgentCard({ 
  id, 
  name, 
  description, 
  icon: Icon, 
  color, 
  onSelect, 
  isSelected = false 
}: AgentCardProps) {
  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-shadow ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      }`}
      onClick={() => onSelect(id)}
    >
      <CardContent className="p-6 text-center">
        <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mx-auto mb-3`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h4 className="font-semibold mb-2">{name}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
