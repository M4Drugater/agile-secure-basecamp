
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Calendar,
  Eye,
  Brain,
  Target,
  MoreVertical,
  Play,
  Archive,
  FileText,
  Activity
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSupabase } from '@/hooks/useSupabase';

interface Session {
  id: string;
  session_name: string;
  agent_type: string;
  company_name: string;
  industry: string;
  analysis_focus: string;
  status: string;
  created_at: string;
  reports_count?: number;
  insights_count?: number;
}

const agentIcons = {
  cdv: Eye,
  cia: Brain,
  cir: Activity
};

const agentColors = {
  cdv: 'bg-blue-500',
  cia: 'bg-purple-500',
  cir: 'bg-green-500'
};

export function SessionManager() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { supabase, user } = useSupabase();

  useEffect(() => {
    loadSessions();
  }, [user, supabase]);

  const loadSessions = async () => {
    if (!user || !supabase) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('competitive_intelligence_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Cargar conteos de reportes e insights para cada sesión
      const sessionsWithCounts = await Promise.all((data || []).map(async (session) => {
        const [reportsCount, insightsCount] = await Promise.all([
          supabase
            .from('competitive_intelligence_reports')
            .select('*', { count: 'exact', head: true })
            .eq('session_id', session.id),
          supabase
            .from('competitive_intelligence_insights')
            .select('*', { count: 'exact', head: true })
            .eq('session_id', session.id)
        ]);

        return {
          ...session,
          reports_count: reportsCount.count || 0,
          insights_count: insightsCount.count || 0
        };
      }));

      setSessions(sessionsWithCounts);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session =>
    session.session_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (session.company_name && session.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
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
          <h2 className="text-2xl font-bold">Sesiones de Inteligencia</h2>
          <p className="text-muted-foreground">Gestiona tus sesiones de análisis competitivo</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Sesión
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar sesiones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Sessions List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? 'No se encontraron sesiones' : 'No hay sesiones aún'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Intenta ajustar tus términos de búsqueda' : 'Crea tu primera sesión de inteligencia competitiva'}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear Sesión
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredSessions.map((session) => {
            const AgentIcon = agentIcons[session.agent_type as keyof typeof agentIcons];
            const agentColor = agentColors[session.agent_type as keyof typeof agentColors];

            return (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 ${agentColor} rounded-lg flex items-center justify-center`}>
                        <AgentIcon className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{session.session_name}</h3>
                          <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                            {session.status === 'active' ? 'Activa' : 'Completada'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(session.created_at).toLocaleDateString()}
                          </span>
                          <span>Agente: {session.agent_type.toUpperCase()}</span>
                          {session.industry && <span>Industria: {session.industry}</span>}
                          {session.analysis_focus && <span>Enfoque: {session.analysis_focus}</span>}
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span>{session.reports_count || 0} Reportes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4 text-green-500" />
                            <span>{session.insights_count || 0} Insights</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        Continuar
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Ver Reportes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Target className="h-4 w-4 mr-2" />
                            Ver Insights
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" />
                            Archivar Sesión
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
