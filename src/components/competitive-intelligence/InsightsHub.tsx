
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Lightbulb, 
  Search, 
  Filter,
  TrendingUp,
  AlertTriangle,
  Target,
  Clock,
  ArrowRight,
  Eye,
  Brain,
  Activity
} from 'lucide-react';
import { useSupabase } from '@/hooks/useSupabase';

interface Insight {
  id: string;
  insight_title: string;
  insight_description: string;
  insight_category: string;
  impact_level: string | null;
  urgency_level: string | null;
  agent_type: string;
  confidence_score: number | null;
  tags: string[] | null;
  created_at: string;
}

const impactColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

const urgencyColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  immediate: 'bg-red-100 text-red-800'
};

const agentIcons = {
  cdv: Eye,
  cia: Brain,
  cir: Activity
};

export function InsightsHub() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [impactFilter, setImpactFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { supabase, user } = useSupabase();

  useEffect(() => {
    loadInsights();
  }, [user, supabase]);

  const loadInsights = async () => {
    if (!user || !supabase) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('competitive_intelligence_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInsights(data || []);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInsights = insights.filter(insight => {
    const matchesSearch = insight.insight_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insight.insight_description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || insight.insight_category === categoryFilter;
    const matchesImpact = impactFilter === 'all' || insight.impact_level === impactFilter;
    
    return matchesSearch && matchesCategory && matchesImpact;
  });

  const getImpactIcon = (level: string | null) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Target className="h-4 w-4 text-yellow-500" />;
      default: return <Lightbulb className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAgentIcon = (agentType: string) => {
    const Icon = agentIcons[agentType as keyof typeof agentIcons] || Eye;
    return <Icon className="h-4 w-4" />;
  };

  // Obtener categorías únicas para el filtro
  const uniqueCategories = Array.from(new Set(insights.map(i => i.insight_category)));

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-32 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Centro de Insights</h2>
          <p className="text-muted-foreground">Insights accionables de tu análisis competitivo</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-3 py-1">
            {filteredInsights.length} Insights
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar insights..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las Categorías</SelectItem>
            {uniqueCategories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={impactFilter} onValueChange={setImpactFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Nivel de Impacto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Niveles</SelectItem>
            <SelectItem value="critical">Crítico</SelectItem>
            <SelectItem value="high">Alto</SelectItem>
            <SelectItem value="medium">Medio</SelectItem>
            <SelectItem value="low">Bajo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredInsights.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {insights.length === 0 ? 'No hay insights aún' : 'No se encontraron insights'}
              </h3>
              <p className="text-muted-foreground">
                {insights.length === 0 
                  ? 'Comienza a analizar competidores para generar insights' 
                  : 'Intenta ajustar tu búsqueda o filtros'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredInsights.map((insight) => (
            <Card key={insight.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      {getImpactIcon(insight.impact_level)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{insight.insight_title}</h3>
                        <p className="text-muted-foreground mb-3">{insight.insight_description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(insight.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        {getAgentIcon(insight.agent_type)}
                        Agente: {insight.agent_type.toUpperCase()}
                      </span>
                      {insight.confidence_score && (
                        <span>Confianza: {insight.confidence_score}%</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {insight.impact_level && (
                        <Badge className={impactColors[insight.impact_level as keyof typeof impactColors]}>
                          Impacto {insight.impact_level}
                        </Badge>
                      )}
                      {insight.urgency_level && (
                        <Badge className={urgencyColors[insight.urgency_level as keyof typeof urgencyColors]}>
                          Urgencia {insight.urgency_level}
                        </Badge>
                      )}
                      <Badge variant="outline">{insight.insight_category}</Badge>
                    </div>

                    {insight.tags && insight.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {insight.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      Ver Detalles
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
