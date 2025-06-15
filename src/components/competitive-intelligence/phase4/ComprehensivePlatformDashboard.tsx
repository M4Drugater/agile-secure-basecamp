
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Brain, 
  BookOpen, 
  Wand2,
  GraduationCap,
  Activity,
  DollarSign,
  Target,
  TrendingUp,
  Shield,
  Crown
} from 'lucide-react';
import { BusinessIntelligenceDashboard } from '../phase2/BusinessIntelligenceDashboard';
import { LearningManagementSystem } from '../phase3/LearningManagementSystem';
import { KnowledgeLibrary } from './KnowledgeLibrary';
import { AdvancedContentCreation } from './AdvancedContentCreation';

export function ComprehensivePlatformDashboard() {
  const [activePhase, setActivePhase] = useState('overview');

  const platformStats = {
    totalUsers: 2847,
    contentGenerated: 12456,
    aiInsights: 8923,
    learningModules: 47,
    knowledgeItems: 156,
    revenueOptimized: 23400000,
    decisionsSupported: 234,
    uptime: 99.97
  };

  const phases = [
    {
      id: 'phase1',
      title: 'Phase 1: Foundation',
      description: 'Real-time intelligence & enhanced prompts',
      status: 'completed',
      icon: Shield,
      features: ['Real-time data integration', 'Elite AI prompts', 'Security-first architecture']
    },
    {
      id: 'phase2',
      title: 'Phase 2: Business Intelligence',
      description: 'Strategic decisions & predictive analytics',
      status: 'completed',
      icon: Brain,
      features: ['Strategic decision engine', 'Predictive analytics', 'Revenue optimization']
    },
    {
      id: 'phase3',
      title: 'Phase 3: Learning System',
      description: 'Comprehensive learning & certification',
      status: 'completed',
      icon: GraduationCap,
      features: ['Learning management', 'Certification paths', 'AI-enhanced training']
    },
    {
      id: 'phase4',
      title: 'Phase 4: Advanced Platform',
      description: 'Knowledge library & content creation',
      status: 'active',
      icon: Crown,
      features: ['AI knowledge library', 'Advanced content creation', 'Enterprise features']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <Crown className="h-10 w-10 text-yellow-500" />
            LAIGENT v2.0 - Elite Platform
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            The world's most advanced AI-first competitive intelligence platform
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="default" className="flex items-center gap-1 bg-yellow-600 text-lg px-3 py-1">
            <Crown className="h-4 w-4" />
            Enterprise Elite
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 text-lg px-3 py-1">
            <Zap className="h-4 w-4" />
            All Phases Complete
          </Badge>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-4 text-center">
            <Brain className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{platformStats.aiInsights.toLocaleString()}</div>
            <div className="text-sm opacity-90">AI Insights Generated</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              ${(platformStats.revenueOptimized / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm opacity-90">Revenue Optimized</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
          <CardContent className="p-4 text-center">
            <GraduationCap className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{platformStats.learningModules}</div>
            <div className="text-sm opacity-90">Learning Modules</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{platformStats.uptime}%</div>
            <div className="text-sm opacity-90">Platform Uptime</div>
          </CardContent>
        </Card>
      </div>

      {/* Phase Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Development Phases Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {phases.map((phase) => {
              const Icon = phase.icon;
              return (
                <div key={phase.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5 text-blue-600" />
                    <Badge 
                      variant={phase.status === 'completed' ? 'default' : 'secondary'}
                      className={phase.status === 'active' ? 'bg-yellow-500' : ''}
                    >
                      {phase.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm">{phase.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{phase.description}</p>
                  <div className="space-y-1">
                    {phase.features.map((feature, index) => (
                      <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Platform Interface */}
      <Tabs value={activePhase} onValueChange={setActivePhase}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="business-intelligence" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Business Intelligence
          </TabsTrigger>
          <TabsTrigger value="learning" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Learning System
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Knowledge Library
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Content Creation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Total Platform Users</span>
                  <span className="font-bold text-blue-600">
                    {platformStats.totalUsers.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Content Generated</span>
                  <span className="font-bold text-green-600">
                    {platformStats.contentGenerated.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Decisions Supported</span>
                  <span className="font-bold text-purple-600">
                    {platformStats.decisionsSupported}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Knowledge Items</span>
                  <span className="font-bold text-orange-600">
                    {platformStats.knowledgeItems}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => setActivePhase('business-intelligence')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Access Business Intelligence
                </Button>
                <Button 
                  onClick={() => setActivePhase('learning')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Continue Learning
                </Button>
                <Button 
                  onClick={() => setActivePhase('knowledge')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Knowledge Library
                </Button>
                <Button 
                  onClick={() => setActivePhase('content')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Create Content
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Platform Success Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">96%</div>
                  <div className="text-sm text-muted-foreground">User Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">2.3s</div>
                  <div className="text-sm text-muted-foreground">Avg Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">94%</div>
                  <div className="text-sm text-muted-foreground">AI Accuracy</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business-intelligence" className="space-y-6">
          <BusinessIntelligenceDashboard />
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <LearningManagementSystem />
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-6">
          <KnowledgeLibrary />
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <AdvancedContentCreation />
        </TabsContent>
      </Tabs>
    </div>
  );
}
