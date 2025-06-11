
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter, ChevronDown } from 'lucide-react';

interface TrendsFiltersParams {
  timeframe: string;
  sortBy: string;
  limit: number;
}

interface TrendsFiltersProps {
  params: TrendsFiltersParams;
  onUpdateParams: (params: Partial<TrendsFiltersParams>) => void;
}

export function TrendsFilters({ params, onUpdateParams }: TrendsFiltersProps) {
  const timeframes = [
    { value: 'hour', label: 'Última hora' },
    { value: 'day', label: 'Último día' },
    { value: 'week', label: 'Última semana' },
    { value: 'month', label: 'Último mes' },
    { value: 'year', label: 'Último año' }
  ];

  const sortOptions = [
    { value: 'hot', label: 'Populares' },
    { value: 'new', label: 'Nuevos' },
    { value: 'top', label: 'Top' },
    { value: 'rising', label: 'En ascenso' }
  ];

  const limitOptions = [
    { value: 10, label: '10 resultados' },
    { value: 25, label: '25 resultados' },
    { value: 50, label: '50 resultados' },
    { value: 100, label: '100 resultados' }
  ];

  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-muted-foreground" />
      
      {/* Timeframe Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            {timeframes.find(t => t.value === params.timeframe)?.label || 'Período'}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {timeframes.map((timeframe) => (
            <DropdownMenuItem
              key={timeframe.value}
              onClick={() => onUpdateParams({ timeframe: timeframe.value })}
            >
              {timeframe.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            {sortOptions.find(s => s.value === params.sortBy)?.label || 'Ordenar'}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {sortOptions.map((sort) => (
            <DropdownMenuItem
              key={sort.value}
              onClick={() => onUpdateParams({ sortBy: sort.value })}
            >
              {sort.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Limit Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            {limitOptions.find(l => l.value === params.limit)?.label || 'Límite'}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {limitOptions.map((limit) => (
            <DropdownMenuItem
              key={limit.value}
              onClick={() => onUpdateParams({ limit: limit.value })}
            >
              {limit.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
