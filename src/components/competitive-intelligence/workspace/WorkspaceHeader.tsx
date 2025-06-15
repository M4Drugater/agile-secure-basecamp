
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Target, Globe } from 'lucide-react';

interface WorkspaceHeaderProps {
  sessionConfig: {
    companyName: string;
    industry: string;
    analysisFocus: string;
    geographicScope?: string;
  };
  selectedAgent: string;
}

export function WorkspaceHeader({ sessionConfig, selectedAgent }: WorkspaceHeaderProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Sesión de Análisis: {sessionConfig.companyName}
          </CardTitle>
          <Badge variant="outline">{selectedAgent}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Industria:</span>
            <span>{sessionConfig.industry}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Enfoque:</span>
            <span>{sessionConfig.analysisFocus}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Alcance:</span>
            <span>{sessionConfig.geographicScope || 'Global'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
