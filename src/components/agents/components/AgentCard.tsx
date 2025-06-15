
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface AgentCardProps {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  capabilities: string[];
  status: string;
  onSelect: (agentId: string) => void;
  isSelected?: boolean;
}

export function AgentCard({ 
  id, 
  name, 
  description, 
  icon: Icon, 
  color, 
  capabilities,
  status,
  onSelect, 
  isSelected = false 
}: AgentCardProps) {
  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:border-blue-300'
      }`}
      onClick={() => onSelect(id)}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-lg">{name}</h4>
              <span className={`px-2 py-1 text-xs rounded-full ${
                status === 'unified' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {status === 'unified' ? 'TRIPARTITE' : status.toUpperCase()}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {description}
            </p>
            
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">Capabilities:</p>
              <ul className="text-xs text-gray-500 space-y-1">
                {capabilities.slice(0, 3).map((capability, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    {capability}
                  </li>
                ))}
                {capabilities.length > 3 && (
                  <li className="text-blue-600 font-medium">
                    +{capabilities.length - 3} more capabilities
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
