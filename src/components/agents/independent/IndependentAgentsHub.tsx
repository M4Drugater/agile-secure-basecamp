
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Zap, 
  Search, 
  Eye, 
  Brain, 
  Activity, 
  MessageSquare,
  ArrowRight,
  Crown
} from 'lucide-react';

const useIndependentAgents = () => {
  const { t } = useTranslation();
  
  return [
    {
      id: 'clipogino',
      name: 'CLIPOGINO',
      description: t('agents.clipoginoDesc'),
      icon: MessageSquare,
      color: 'bg-blue-500',
      route: '/agents/clipogino',
      capabilities: [
        t('agents.clipoginoCapabilities.mentoring'),
        t('agents.clipoginoCapabilities.planning'),
        t('agents.clipoginoCapabilities.insights'),
        t('agents.clipoginoCapabilities.recommendations'),
        t('agents.clipoginoCapabilities.development')
      ],
      status: 'elite'
    },
    {
      id: 'enhanced-content-generator',
      name: 'Enhanced Content Generator',
      description: t('agents.contentGeneratorDesc'),
      icon: Zap,
      color: 'bg-purple-500',
      route: '/agents/content-generator',
      capabilities: [
        t('agents.contentCapabilities.executive'),
        t('agents.contentCapabilities.articles'),
        t('agents.contentCapabilities.copywriting'),
        t('agents.contentCapabilities.seo'),
        t('agents.contentCapabilities.adaptation')
      ],
      status: 'elite'
    },
    {
      id: 'research-engine',
      name: 'Elite Research Engine',
      description: t('agents.researchEngineDesc'),
      icon: Search,
      color: 'bg-indigo-500',
      route: '/agents/research-engine',
      capabilities: [
        t('agents.researchCapabilities.tripartite'),
        t('agents.researchCapabilities.competitive'),
        t('agents.researchCapabilities.sources'),
        t('agents.researchCapabilities.insights'),
        t('agents.researchCapabilities.reports')
      ],
      status: 'elite'
    },
    {
      id: 'cdv',
      name: 'CDV - Competitor Discovery & Validator',
      description: t('agents.cdvDesc'),
      icon: Eye,
      color: 'bg-green-500',
      route: '/agents/cdv',
      capabilities: [
        t('agents.cdvCapabilities.discovery'),
        t('agents.cdvCapabilities.validation'),
        t('agents.cdvCapabilities.positioning'),
        t('agents.cdvCapabilities.opportunities'),
        t('agents.cdvCapabilities.gaps')
      ],
      status: 'elite'
    },
    {
      id: 'cia',
      name: 'CIA - Competitive Intelligence Analysis',
      description: t('agents.ciaDesc'),
      icon: Brain,
      color: 'bg-red-500',
      route: '/agents/cia',
      capabilities: [
        t('agents.ciaCapabilities.strategic'),
        t('agents.ciaCapabilities.threats'),
        t('agents.ciaCapabilities.intelligence'),
        t('agents.ciaCapabilities.recommendations'),
        t('agents.ciaCapabilities.profiling')
      ],
      status: 'elite'
    },
    {
      id: 'cir',
      name: 'CIR - Competitive Intelligence Retriever',
      description: t('agents.cirDesc'),
      icon: Activity,
      color: 'bg-orange-500',
      route: '/agents/cir',
      capabilities: [
        t('agents.cirCapabilities.metrics'),
        t('agents.cirCapabilities.domain'),
        t('agents.cirCapabilities.traffic'),
        t('agents.cirCapabilities.teams'),
        t('agents.cirCapabilities.benchmarking')
      ],
      status: 'elite'
    }
  ];
};

export function IndependentAgentsHub() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const independentAgents = useIndependentAgents();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crown className="h-12 w-12 text-yellow-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('agents.title')}
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('agents.subtitle')}
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            ✅ {t('agents.tripartiteSystem')}
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            🚀 {t('agents.autonomy')}
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            👑 {t('agents.fortuneLevel')}
          </Badge>
        </div>
      </div>

      {/* Tripartite System Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            {t('agents.tripartiteSystem')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold">OpenAI GPT-4</h4>
              <p className="text-sm text-muted-foreground">{t('agents.openaiDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold">Perplexity AI</h4>
              <p className="text-sm text-muted-foreground">{t('agents.perplexityDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold">Claude Sonnet</h4>
              <p className="text-sm text-muted-foreground">{t('agents.claudeDesc')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {independentAgents.map((agent) => {
          const Icon = agent.icon;
          return (
            <Card 
              key={agent.id} 
              className="hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-300 cursor-pointer group"
              onClick={() => navigate(agent.route)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 ${agent.color} rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-yellow-300"
                  >
                    {agent.status.toUpperCase()}
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                  {agent.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {agent.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h5 className="font-medium text-sm mb-2 text-gray-700">{t('agents.mainCapabilities')}:</h5>
                  <ul className="space-y-1">
                    {agent.capabilities.slice(0, 3).map((capability, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-start">
                        <span className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        {capability}
                      </li>
                    ))}
                    {agent.capabilities.length > 3 && (
                      <li className="text-xs text-blue-600 font-medium">
                        {t('agents.moreCapabilities', { count: agent.capabilities.length - 3 })}
                      </li>
                    )}
                  </ul>
                </div>
                
                <Button 
                  className="w-full group-hover:bg-blue-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(agent.route);
                  }}
                >
                  {t('agents.accessAgent')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer Info */}
      <Card className="bg-gray-50">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold mb-2">{t('agents.needMultipleAgents')}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('agents.needMultipleDescription')}
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/agents/clipogino')}
          >
            {t('agents.useClipoginoCoordinator')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
