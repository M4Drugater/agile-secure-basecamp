
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { X, Settings } from 'lucide-react';

interface TrendsSettingsParams {
  timeframe: string;
  sortBy: string;
  limit: number;
}

interface TrendsSettingsProps {
  params: TrendsSettingsParams;
  onUpdateParams: (params: Partial<TrendsSettingsParams>) => void;
  onClose: () => void;
}

export function TrendsSettings({ params, onUpdateParams, onClose }: TrendsSettingsProps) {
  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración de Tendencias
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Timeframe */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Período de tiempo</Label>
            <RadioGroup
              value={params.timeframe}
              onValueChange={(value) => onUpdateParams({ timeframe: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hour" id="hour" />
                <Label htmlFor="hour" className="text-sm">Última hora</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="day" id="day" />
                <Label htmlFor="day" className="text-sm">Último día</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="week" id="week" />
                <Label htmlFor="week" className="text-sm">Última semana</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="month" id="month" />
                <Label htmlFor="month" className="text-sm">Último mes</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Sort By */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Ordenar por</Label>
            <RadioGroup
              value={params.sortBy}
              onValueChange={(value) => onUpdateParams({ sortBy: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hot" id="hot" />
                <Label htmlFor="hot" className="text-sm">Populares</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="text-sm">Nuevos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="top" id="top" />
                <Label htmlFor="top" className="text-sm">Top</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rising" id="rising" />
                <Label htmlFor="rising" className="text-sm">En ascenso</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Limit */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Límite de resultados: {params.limit}
            </Label>
            <Slider
              value={[params.limit]}
              onValueChange={([value]) => onUpdateParams({ limit: value })}
              max={100}
              min={10}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10</span>
              <span>100</span>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Las tendencias se actualizan automáticamente cada 5 minutos. 
            Usa configuraciones más específicas para obtener resultados más relevantes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
