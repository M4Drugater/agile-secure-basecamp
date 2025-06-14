
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Clock, Zap, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ExtendedThinkingToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  showDescription?: boolean;
}

export function ExtendedThinkingToggle({ 
  enabled, 
  onToggle, 
  showDescription = true 
}: ExtendedThinkingToggleProps) {
  return (
    <div className="space-y-3">
      <Card className={`transition-all ${enabled ? 'border-purple-200 bg-purple-50/30' : 'border-border'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${enabled ? 'bg-purple-100' : 'bg-muted'}`}>
                <Brain className={`h-5 w-5 ${enabled ? 'text-purple-600' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <Label htmlFor="extended-thinking" className="text-base font-medium">
                  Extended Thinking
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enable deeper reasoning and analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {enabled && (
                <div className="flex gap-1">
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    +30s
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    Higher Cost
                  </Badge>
                </div>
              )}
              <Switch
                id="extended-thinking"
                checked={enabled}
                onCheckedChange={onToggle}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {showDescription && enabled && (
        <Alert className="border-purple-200 bg-purple-50/50">
          <AlertCircle className="h-4 w-4 text-purple-600" />
          <AlertDescription>
            <strong>Extended Thinking Mode:</strong> CLIPOGINO will take extra time to analyze your request,
            consider multiple perspectives, and provide more thoughtful, comprehensive responses.
            This uses advanced reasoning chains and may take 20-30 seconds longer.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
