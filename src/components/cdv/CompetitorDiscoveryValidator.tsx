
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Target, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { DiscoveryEngine } from './DiscoveryEngine';
import { ValidationDashboard } from './ValidationDashboard';
import { CompetitorInsights } from './CompetitorInsights';
import { DiscoveryResults } from './DiscoveryResults';

export function CompetitorDiscoveryValidator() {
  const [activeDiscoveries, setActiveDiscoveries] = useState(0);
  const [validatedCompetitors, setValidatedCompetitors] = useState(0);
  const [pendingValidation, setPendingValidation] = useState(0);

  return (
    <div className="space-y-6">
      {/* CDV Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            CDV - Competitor Discovery & Validator
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover, analyze, and validate your competitive landscape with AI-powered intelligence
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Discovery Engine v2.0
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Validation Active
          </Badge>
        </div>
      </div>

      {/* CDV Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Discoveries</p>
                <p className="text-2xl font-bold">{activeDiscoveries}</p>
              </div>
              <Search className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Validated Competitors</p>
                <p className="text-2xl font-bold">{validatedCompetitors}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Validation</p>
                <p className="text-2xl font-bold">{pendingValidation}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Market Coverage</p>
                <p className="text-2xl font-bold">73%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main CDV Interface */}
      <Tabs defaultValue="discovery" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="discovery" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Discovery Engine
          </TabsTrigger>
          <TabsTrigger value="validation" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Validation Dashboard
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Discovery Results
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Competitive Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discovery">
          <DiscoveryEngine 
            onDiscoveryStart={() => setActiveDiscoveries(prev => prev + 1)}
            onDiscoveryComplete={() => setPendingValidation(prev => prev + 1)}
          />
        </TabsContent>

        <TabsContent value="validation">
          <ValidationDashboard 
            pendingValidation={pendingValidation}
            onValidationComplete={() => {
              setPendingValidation(prev => Math.max(0, prev - 1));
              setValidatedCompetitors(prev => prev + 1);
            }}
          />
        </TabsContent>

        <TabsContent value="results">
          <DiscoveryResults validatedCompetitors={validatedCompetitors} />
        </TabsContent>

        <TabsContent value="insights">
          <CompetitorInsights />
        </TabsContent>
      </Tabs>
    </div>
  );
}
