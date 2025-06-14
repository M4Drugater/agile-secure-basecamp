
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bot, 
  Eye, 
  Target, 
  TrendingUp,
  Plus,
  Zap,
  Shield,
  Brain,
  Activity,
  Users,
  FileText,
  Lightbulb
} from 'lucide-react';
import { AgentInterface } from './AgentInterface';
import { SessionManager } from './SessionManager';
import { InsightsHub } from './InsightsHub';
import { useSupabase } from '@/hooks/useSupabase';

const agents = [
  {
    id: 'cdv',
    name: 'CDV - Competitor Discovery & Validator',
    description: 'Descubre, analiza y valida amenazas competitivas y oportunidades',
    icon: Target,
    color: 'bg-blue-500',
    features: ['Descubrimiento de Competidores', 'Validación Competitiva', 'Análisis de Oportunidades', 'Evaluación de Amenazas']
  },
  {
    id: 'cir',
    name: 'CIR - Competitive Intelligence Retriever',
    description: 'Especialista en datos de inteligencia que proporciona métricas reales del mercado',
    icon: Activity,
    color: 'bg-green-500',
    features: ['Inteligencia de Datos', 'Métricas de Mercado', 'Análisis de Tráfico', 'Benchmarking Competitivo']
  },
  {
    id: 'cia',
    name: 'CIA - Competitive Intelligence Analysis',
    description: 'Proporciona inteligencia estratégica y análisis integral del mercado',
    icon: Brain,
    color: 'bg-purple-500',
    features: ['Análisis Estratégico', 'Evaluación de Riesgos', 'Inteligencia de Mercado', 'Planificación de Escenarios']
  }
];

export function CompetitiveIntelligenceDashboard() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    activeSessions: 0,
    totalReports: 0,
    totalInsights: 0,
    companiesAnalyzed: 0
  });
  const { supabase, user } = useSupabase();

  // Cargar estadísticas reales de la base de datos
  useEffect(() => {
    const loadStats = async () => {
      if (!user || !supabase) return;

      try {
        // Obtener sesiones activas
        const { count: sessionsCount } = await supabase
          .from('competitive_intelligence_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'active');

        // Obtener total de reportes
        const { count: reportsCount } = await supabase
          .from('competitive_intelligence_reports')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Obtener total de insights
        const { count: insightsCount } = await supabase
          .from('competitive_intelligence_insights')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Obtener empresas únicas analizadas
        const { data: companies } = await supabase
          .from('competitive_intelligence_sessions')
          .select('company_name')
          .eq('user_id', user.id)
          .not('company_name', 'is', null);

        const uniqueCompanies = new Set(companies?.map(c => c.company_name) || []).size;

        setStats({
          activeSessions: sessionsCount || 0,
          totalReports: reportsCount || 0,
          totalInsights: insightsCount || 0,
          companiesAnalyzed: uniqueCompanies
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, [user, supabase]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Shield className="h-10 w-10 text-blue-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sistema de Inteligencia Competitiva
          </h1>
          <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <Zap className="h-3 w-3 mr-1" />
            Powered by AI
          </Badge>
        </div>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Inteligencia competitiva avanzada con agentes de IA especializados para análisis estratégico y reportes accionables
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="agents">Agentes IA</TabsTrigger>
          <TabsTrigger value="sessions">Sesiones</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Vista general de agentes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedAgent(agent.id);
                      setActiveTab('agents');
                    }}>
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 ${agent.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <agent.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{agent.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground">{agent.description}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {agent.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full">
                    <Bot className="h-4 w-4 mr-2" />
                    Activar Agente
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Estadísticas en tiempo real */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.activeSessions}</div>
                <div className="text-sm text-muted-foreground">Sesiones Activas</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.totalReports}</div>
                <div className="text-sm text-muted-foreground">Reportes Generados</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Lightbulb className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.totalInsights}</div>
                <div className="text-sm text-muted-foreground">Insights Creados</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.companiesAnalyzed}</div>
                <div className="text-sm text-muted-foreground">Empresas Analizadas</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <AgentInterface selectedAgent={selectedAgent} onAgentSelect={setSelectedAgent} />
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <SessionManager />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <InsightsHub />
        </TabsContent>
      </Tabs>
    </div>
  );
}
