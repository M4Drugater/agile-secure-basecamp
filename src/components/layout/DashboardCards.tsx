
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Bot, 
  Shield,
  TrendingUp,
  FileText,
  Brain,
  Settings,
  Zap,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export function DashboardCards() {
  const navigate = useNavigate();

  const featuredModules = [
    {
      title: 'Sistema de Inteligencia Competitiva',
      description: 'Análisis estratégico avanzado con agentes especializados CDV, CIA y CIR para inteligencia empresarial',
      icon: Shield,
      href: '/competitive-intelligence',
      badge: 'AI Agents',
      color: 'from-blue-600 to-purple-600',
      features: ['Agente CDV - Visualización', 'Agente CIA - Análisis', 'Agente CIR - Reportes']
    },
    {
      title: 'Chat con CLIPOGINO',
      description: 'Asistente de IA personalizado para desarrollo profesional y consultas inteligentes',
      icon: MessageSquare,
      href: '/chat',
      badge: 'AI Assistant',
      color: 'from-green-600 to-blue-600',
      features: ['Contextualización inteligente', 'Recomendaciones personalizadas', 'Análisis de conocimiento']
    },
    {
      title: 'Modelo Asistido',
      description: 'Navegación inteligente que detecta tus intenciones y activa automáticamente los módulos apropiados',
      icon: Bot,
      href: '/modelo-asistido',
      badge: 'Smart Navigation',
      color: 'from-purple-600 to-pink-600',
      features: ['Detección de intenciones', 'Activación automática', 'Redirección inteligente']
    }
  ];

  const quickAccess = [
    {
      title: 'Descubrimiento de Tendencias',
      description: 'Explora las últimas tendencias de Reddit en tiempo real',
      icon: TrendingUp,
      href: '/trends',
      badge: 'Live Data'
    },
    {
      title: 'Generador de Contenido',
      description: 'Crea contenido profesional con IA avanzada',
      icon: FileText,
      href: '/content/generator',
      badge: 'Content AI'
    },
    {
      title: 'Base de Conocimiento',
      description: 'Gestiona tus documentos y recursos de aprendizaje',
      icon: Brain,
      href: '/knowledge',
      badge: 'Knowledge'
    },
    {
      title: 'Administración',
      description: 'Panel de control y configuración del sistema',
      icon: Settings,
      href: '/admin',
      badge: 'Admin'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          LAIGENT v2.0 Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Plataforma de desarrollo profesional impulsada por IA con módulos especializados para análisis competitivo, 
          creación de contenido y gestión del conocimiento
        </p>
      </div>

      {/* Featured Modules */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Módulos Principales</h2>
          <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {featuredModules.map((module, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  onClick={() => navigate(module.href)}>
              <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
              
              <CardHeader className="relative">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center mb-4`}>
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {module.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{module.title}</CardTitle>
                <CardDescription className="text-base">
                  {module.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative space-y-4">
                <div className="space-y-2">
                  {module.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>
                
                <Button className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                  Acceder al Módulo
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Access */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Acceso Rápido</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickAccess.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => navigate(item.href)}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <item.icon className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.badge}
                  </Badge>
                </div>
                <h3 className="font-semibold text-sm mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* System Status */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <div>
              <h3 className="font-semibold text-green-800">Sistema Operativo</h3>
              <p className="text-sm text-green-700">
                Todos los módulos de IA funcionando correctamente. Última actualización: {new Date().toLocaleDateString()}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto border-green-300 text-green-700 hover:bg-green-100"
              onClick={() => navigate('/admin')}
            >
              <Zap className="h-4 w-4 mr-2" />
              Ver Detalles
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
